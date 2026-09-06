"use client";

import { useEffect, useState } from "react";

// ── Shared site chrome ───────────────────────────────────────────────
// Everything that must be identical on every route: the skip link, the
// custom cursor, the scroll progress rail, both sidebars, the nav and
// back-to-top — plus the behaviour behind them (theme, scroll engine,
// cursor context).
//
// This exists because /timeline previously hand-rolled its own stripped
// four-link nav and had NONE of the rest: no cursor, no progress rail, no
// theme toggle, no back-to-top. The result read as a different website
// bolted onto this one. There is now one nav, and it lives here.
//
// The only thing that legitimately differs per route is where the anchors
// point: on the homepage they are in-page fragments, everywhere else they
// have to travel home first.

const LMS_URL = "https://thesciencebrainery.mrdemo.link/";

export default function SiteChrome({ home = false }: { home?: boolean }) {
  const [isDark, setIsDark] = useState(true);
  const [showTop, setShowTop] = useState(false);

  // A plain class flip. The gradual crossfade comes from the CSS colour
  // transitions on <body> and every surface — no expanding-circle overlay
  // (that caused the "oval flash" mid-swap).
  const applyTheme = (toDark: boolean) => {
    document.documentElement.classList.toggle("dark", toDark);
    try { localStorage.setItem("bm-theme", toDark ? "dark" : "light"); } catch {}
    setIsDark(toDark);
  };

  // Sync React state with the class the pre-paint script may have set.
  // Intentional one-time sync: SSR renders the served default, then we adopt
  // the real (persisted) theme on mount. Doing this in an effect is what keeps
  // hydration stable, so the set-state-in-effect guard is deliberately waived.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // ── Scroll engine: progress rail, nav state, parallax layers, entrance
  //    reveals, back-to-top. All transform/opacity. ──
  useEffect(() => {
    const prog = document.getElementById("prog");
    const nav = document.getElementById("nav");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 901px)");

    const parLayers = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));
    let raf = 0, ticking = false;
    let lastY = window.scrollY;
    const NAV_GRACE = 6;

    const render = () => {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      // When data-motion="native" is set, motion.css drives #prog off a
      // scroll() timeline on the compositor — writing width here would
      // fight it and re-introduce the per-frame layout cost.
      if (prog && document.documentElement.getAttribute("data-motion") !== "native")
        prog.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (nav) {
        nav.classList.toggle("scrolled", y > 40);
        // Down past the hero hides the bar; any upward movement brings it
        // straight back. Near the top it is always shown, and CSS keeps it
        // pinned open whenever focus is inside it.
        const delta = y - lastY;
        if (y < 140) nav.classList.remove("nav-hide");
        else if (delta > NAV_GRACE) nav.classList.add("nav-hide");
        else if (delta < -NAV_GRACE) nav.classList.remove("nav-hide");
      }
      lastY = y;
      setShowTop(y > window.innerHeight * 0.9);
      if (!reduce && wide.matches) {
        for (const el of parLayers) {
          const speed = parseFloat(el.dataset.par || "0");
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        }
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(render); } };
    const clearParallax = () => { for (const el of parLayers) el.style.transform = ""; };
    const onResize = () => { if (reduce || !wide.matches) clearParallax(); onScroll(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    render();

    // Entrance reveals — one-shot, never a visibility gate. When the browser
    // supports scroll-driven animations, motion.css owns every reveal off a
    // native view() timeline, so the observer is skipped entirely rather than
    // doing the same work twice.
    const nativeMotion =
      document.documentElement.getAttribute("data-motion") === "native";
    const io = nativeMotion
      ? null
      : new IntersectionObserver(
          (entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("in"); io?.unobserve(entry.target); }
          }),
          { threshold: 0.01, rootMargin: "0px 0px -2% 0px" }
        );
    if (io) document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Custom cursor + context. The hero's repulsion field is separate and
  //    stays in page.tsx, because it is the only part that is homepage-only. ──
  useEffect(() => {
    const cd = document.getElementById("cd");
    const cr = document.getElementById("cr");
    if (!cd || !cr) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let frame = 0, running = false, moved = true;
    let usingMouse = false;

    const enableMouse = () => {
      if (!usingMouse) { usingMouse = true; document.body.classList.add("using-mouse"); }
    };
    if (!window.matchMedia("(pointer: coarse)").matches) enableMouse();

    const loop = () => {
      const dxr = mx - rx, dyr = my - ry;
      rx += dxr * 0.22; ry += dyr * 0.22;
      // Transform rather than left/top: these are position:fixed, and
      // animating their box offsets costs a layout pass every frame.
      cd.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      cr.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
      // An idle pointer costs nothing: the loop parks itself once the ring
      // has landed, and the next move restarts it.
      if (Math.abs(dxr) < 0.15 && Math.abs(dyr) < 0.15 && !moved) { running = false; return; }
      moved = false;
      frame = requestAnimationFrame(loop);
    };
    const start = () => { if (!running) { running = true; frame = requestAnimationFrame(loop); } };

    const onMouseMove = (e: MouseEvent) => {
      enableMouse();
      mx = e.clientX; my = e.clientY;
      moved = true;
      start();
    };
    const onTouchStart = () => { usingMouse = false; document.body.classList.remove("using-mouse"); };

    // Cursor context. Delegated from the document rather than bound per
    // element, because the coverflow mounts and unmounts its slides as you
    // drag — per-element listeners would go stale on every index change.
    // `data-cursor` is declared in markup; the rest is inferred from what the
    // element already is, so no attribute has to be added to every link.
    const GENERIC =
      "a,button,.hsc,.srow,.acard,.ccard,.ecard,.sp,.soc-btn,.foot-link,.show-more-btn,.theme-btn,.sidebar-right a,.subj-card,.paper-link,.tut-fact,.tl-card,.cf-nav,.cf-dot";
    const EXTERNAL = 'a[target="_blank"]';
    const onPointerOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== "function") return;
      const ctx =
        t.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ??
        (t.closest(".cf-stage") ? "drag" : null) ??
        (t.closest(".li-facade") ? "play" : null) ??
        (t.closest(EXTERNAL) ? "external" : null);
      // Written to data-cursor-CTX, deliberately not data-cursor. `closest`
      // walks up to <body>, so if the state lived under the same attribute
      // name the targets use, body would match its own marker and every
      // element on the page would inherit the last context forever.
      if (ctx) document.body.dataset.cursorCtx = ctx;
      else delete document.body.dataset.cursorCtx;
      document.body.classList.toggle("cg", !!t.closest(GENERIC) || !!ctx);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    start();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("pointerover", onPointerOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  // On the homepage the nav anchors are in-page fragments; everywhere else
  // they have to travel home first.
  const to = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <>
      <a href={to("#hero")} className="skip-link">Skip to content</a>
      <div id="cd" aria-hidden="true" />
      <div id="cr" aria-hidden="true" />
      <div id="prog" aria-hidden="true" role="progressbar" aria-label="Page scroll progress" />

      <div className="sidebar-right" aria-label="Social links">
        <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">Ig.</a>
        <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Facebook via Linktree">Fb.</a>
        <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">In.</a>
      </div>

      <div className="sidebar-left" aria-label="Theme controls">
        <div className="theme-toggle" role="group" aria-label="Theme toggle">
          <button type="button" className={`theme-btn ${!isDark ? "active" : ""}`} onClick={() => { if (isDark) applyTheme(false); }} aria-pressed={!isDark} aria-label="Switch to light mode">☀</button>
          <button type="button" className={`theme-btn ${isDark ? "active" : ""}`} onClick={() => { if (!isDark) applyTheme(true); }} aria-pressed={isDark} aria-label="Switch to dark mode">☾</button>
        </div>
      </div>

      <nav id="nav" aria-label="Main navigation">
        <a href={home ? "#hero" : "/"} className="logo" aria-label="භානු මෙන්ඩිස් — Bhanu Mendis, home">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </a>
        <ul className="nav-links" role="list">
          <li><a href={to("#about")}>About</a></li>
          <li><a href={to("#exp")}>Experience</a></li>
          <li><a href={to("#achieve")}>Awards</a></li>
          <li><a href="/timeline" className={home ? undefined : "nav-cta"}>Timeline</a></li>
          <li><a href={LMS_URL} target="_blank" rel="noopener noreferrer" className="nav-cta-fill">Student Portal</a></li>
          <li><a href={to("#contact")} className="nav-cta">Contact</a></li>
        </ul>
        {/* Compact theme toggle — shown on mobile where the sidebar toggle is hidden. */}
        <button
          type="button"
          className="nav-theme"
          onClick={() => applyTheme(!isDark)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀" : "☾"}
        </button>
      </nav>

      <button type="button" className={`to-top ${showTop ? "visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </>
  );
}
