"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── The Dynamic Island ───────────────────────────────────────────────
// One floating, permanently visible pill. It replaces the old full-width
// bar, which hid itself on scroll-down — the exact behaviour this is meant
// to stop. There is no hide state here at all, by design.
//
// Three behaviours make it feel physical rather than animated:
//
//   1. A sliding indicator driven by two independent springs (x, width).
//      Decomposed deliberately: a single spring over a 2D distance desyncs
//      the moment the two axes carry different velocities.
//   2. Dock magnification — a gaussian falloff around the pointer scales
//      each link and pushes its neighbours outward, using the gaussian's
//      own derivative so the spread is continuous rather than stepped.
//   3. Both integrate from the CURRENT on-screen value and carry velocity
//      through a re-target, so the pill can be redirected mid-flight and
//      never jumps. Nothing here is a fixed-duration CSS transition.
//
// The rAF loop parks itself once the springs settle and restarts on the
// next re-target, so an idle nav costs zero frames.

const LMS_URL = "https://lms.bhanumendis.com";

type NavItem = { id: string; hash: string; label: string };

const ITEMS: readonly NavItem[] = [
  { id: "about", hash: "#about", label: "About" },
  { id: "exp", hash: "#exp", label: "Experience" },
  { id: "achieve", hash: "#achieve", label: "Awards" },
  { id: "contact", hash: "#contact", label: "Contact" },
] as const;

// Spring: critically damped, response 0.38s. Apple's two-parameter model —
// `RESPONSE` is time-to-target, not duration; the settle emerges from the
// physics. Damping stays at 1.0 because no gesture momentum precedes this
// motion, and overshoot on a pointer-driven indicator reads as sloppy.
const RESPONSE = 0.38;
const OMEGA = (2 * Math.PI) / RESPONSE;
const DAMPING = 1;

// Magnification. SIGMA is the falloff width in px; SPREAD is the maximum
// sideways push a neighbour receives.
const MAG = 0.22;
const SIGMA = 64;
const SPREAD = 6;
const GAUSS_PEAK = 0.60653066; // max of d·exp(-d²/2σ²) at d = σ, normalised

export default function NavIsland({
  home = false,
  isDark,
  onToggleTheme,
}: {
  home?: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const railRef = useRef<HTMLUListElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Spring state lives in a ref, never in React state: it updates every
  // frame and re-rendering on each one would defeat the whole point.
  const spring = useRef({ x: 0, w: 0, vx: 0, vw: 0, tx: 0, tw: 0, ready: false });
  const raf = useRef(0);
  const running = useRef(false);

  const setLinkRef = useCallback((id: string) => (el: HTMLAnchorElement | null) => {
    if (el) linkRefs.current.set(id, el);
    else linkRefs.current.delete(id);
  }, []);

  // ── The spring loop ────────────────────────────────────────────────
  const tick = useCallback(() => {
    const s = spring.current;
    const pill = pillRef.current;
    if (!pill) { running.current = false; return; }

    // Fixed 1/60 step. A real elapsed-time delta makes the spring stiffer
    // on a dropped frame, which is visible as a hitch; a fixed step keeps
    // the motion identical whatever the display does.
    const dt = 1 / 60;
    const ax = -OMEGA * OMEGA * (s.x - s.tx) - 2 * DAMPING * OMEGA * s.vx;
    const aw = -OMEGA * OMEGA * (s.w - s.tw) - 2 * DAMPING * OMEGA * s.vw;
    s.vx += ax * dt; s.x += s.vx * dt;
    s.vw += aw * dt; s.w += s.vw * dt;

    pill.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
    pill.style.width = `${Math.max(0, s.w).toFixed(2)}px`;

    const settled =
      Math.abs(s.x - s.tx) < 0.25 && Math.abs(s.vx) < 0.25 &&
      Math.abs(s.w - s.tw) < 0.25 && Math.abs(s.vw) < 0.25;

    if (settled) {
      s.x = s.tx; s.w = s.tw; s.vx = 0; s.vw = 0;
      pill.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      pill.style.width = `${s.w.toFixed(2)}px`;
      running.current = false;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  // Re-target. Velocity is deliberately NOT reset: carrying it through is
  // what stops a reversal reading as a brick wall.
  const target = useCallback((id: string | null, animate = true) => {
    const rail = railRef.current;
    const pill = pillRef.current;
    if (!rail || !pill) return;
    const el = id ? linkRefs.current.get(id) : null;

    if (!el) { pill.dataset.on = "false"; return; }
    pill.dataset.on = "true";

    const r = el.getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const s = spring.current;
    s.tx = r.left - rr.left;
    s.tw = r.width;

    // First placement, or reduced motion: land instantly. There is nothing
    // to animate from on the first frame, and a spring that starts at 0
    // would fly in from the left edge on load.
    const reduce = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!s.ready || !animate || reduce) {
      s.x = s.tx; s.w = s.tw; s.vx = 0; s.vw = 0; s.ready = true;
      pill.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      pill.style.width = `${s.w.toFixed(2)}px`;
      return;
    }
    start();
  }, [start]);

  // ── Scroll spy. An observer, not a scroll handler: the existing scroll
  //    listener in SiteChrome is already doing per-frame work and this does
  //    not need to join it. ──
  useEffect(() => {
    if (!home) return;
    const ids = ITEMS.map((i) => i.id);
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio);
        let best: string | null = null, bestRatio = 0;
        for (const id of ids) {
          const r = seen.get(id) ?? 0;
          if (r > bestRatio) { bestRatio = r; best = id; }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActive(bestRatio > 0.08 ? best : null);
      },
      { threshold: [0, 0.08, 0.25, 0.5, 0.75, 1], rootMargin: "-18% 0px -45% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [home]);

  // Scroll depth only changes the material weight, so it is a boolean, not
  // a per-frame value — one class flip instead of a style write every frame.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Park the indicator on the active link whenever it changes, and keep it
  // correct across resizes and font-load reflow.
  useEffect(() => { target(active); }, [active, target]);

  useEffect(() => {
    const onResize = () => target(active, false);
    window.addEventListener("resize", onResize);
    const f = (document as Document & { fonts?: FontFaceSet }).fonts;
    f?.ready.then(() => target(active, false)).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [active, target]);

  // ── Dock magnification ─────────────────────────────────────────────
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let px = 0, pending = false;

    const apply = () => {
      pending = false;
      const rr = rail.getBoundingClientRect();
      for (const el of linkRefs.current.values()) {
        const r = el.getBoundingClientRect();
        const c = r.left - rr.left + r.width / 2;
        const d = px - c;
        const g = Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
        const scale = 1 + MAG * g;
        // The gaussian's own derivative: neighbours are pushed away from
        // the pointer, and the push falls to zero smoothly at both ends.
        const off = -(SPREAD / GAUSS_PEAK) * (d / SIGMA) * g;
        el.style.transform = `translate3d(${off.toFixed(2)}px,0,0) scale(${scale.toFixed(4)})`;
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX - rail.getBoundingClientRect().left;
      if (!pending) { pending = true; frame = requestAnimationFrame(apply); }
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      pending = false;
      for (const el of linkRefs.current.values()) el.style.transform = "";
    };

    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerleave", onLeave);
    return () => {
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // ── Mobile sheet ───────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); } };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (sheetRef.current?.contains(t) || toggleRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    sheetRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const to = (hash: string) => (home ? hash : `/${hash}`);
  const activeLabel = ITEMS.find((i) => i.id === active)?.label ?? "Menu";

  return (
    <>
    <nav
      id="nav"
      className={`ni${scrolled ? " ni-deep" : ""}${open ? " ni-open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="ni-shell">
        <a href={home ? "#hero" : "/"} className="ni-logo logo" aria-label="භානු මෙන්ඩිස් — Bhanu Mendis, home">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </a>

        <ul className="ni-rail nav-links" role="list" ref={railRef}>
          {/* The indicator sits behind the links and is purely decorative —
              the active link already carries aria-current. */}
          <span className="ni-pill" ref={pillRef} data-on="false" aria-hidden="true" />
          {ITEMS.map((it) => (
            <li key={it.id}>
              <a
                href={to(it.hash)}
                ref={setLinkRef(it.id)}
                className="ni-link"
                aria-current={active === it.id ? "true" : undefined}
                onPointerEnter={() => target(it.id)}
                onFocus={() => target(it.id)}
              >
                {it.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/timeline" ref={setLinkRef("timeline")} className="ni-link" onPointerEnter={() => target("timeline")} onFocus={() => target("timeline")}>
              Timeline
            </a>
          </li>
        </ul>

        <div className="ni-actions">
          <button
            type="button"
            className="ni-theme"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀" : "☾"}
          </button>
          <a className="ni-cta" href={LMS_URL} target="_blank" rel="noopener noreferrer">
            Student Portal
          </a>
          <button
            type="button"
            className="ni-burger"
            ref={toggleRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="ni-sheet"
            aria-label={open ? "Close menu" : `Open menu — currently ${activeLabel}`}
          >
            <span className="ni-burger-label">{activeLabel}</span>
            <span className="ni-burger-glyph" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>

      {/* The sheet grows out of the island and collapses back into it —
          same path both ways, so the spatial relationship holds. */}
      <div className="ni-sheet" id="ni-sheet" ref={sheetRef}>
        <ul role="list">
          {ITEMS.map((it) => (
            <li key={it.id}>
              <a href={to(it.hash)} onClick={() => setOpen(false)} aria-current={active === it.id ? "true" : undefined}>
                {it.label}
              </a>
            </li>
          ))}
          <li><a href="/timeline" onClick={() => setOpen(false)}>Timeline</a></li>
          <li>
            <a className="ni-sheet-cta" href={LMS_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              Student Portal
            </a>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
}
