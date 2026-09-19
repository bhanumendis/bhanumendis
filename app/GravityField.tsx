"use client";

import { useEffect, useRef } from "react";

// ── The gravity field ────────────────────────────────────────────────
// A disc of particles winding itself into spiral arms as you scroll.
//
// It is not a simulation. Every particle's position is an ANALYTIC
// function of one number: how far through the pinned section you are.
// That choice is what makes it safe here:
//
//   · It is exactly reversible. Scroll up and the arms unwind, because
//     f(t) is evaluated fresh, not integrated. A stepped simulation
//     would accumulate error and could never run backwards.
//   · It cannot drift or explode. There is no velocity state to blow up
//     on a dropped frame or a backgrounded tab.
//   · It costs nothing at rest. The loop parks unless the scroll
//     position or the pointer actually moved.
//
// The physics on show is real. Angular velocity follows Kepler's third
// law, omega proportional to r^-1.5, so inner particles lap outer ones
// and an initially straight spoke winds into an arm. That differential
// rotation IS the reason spiral galaxies have arms, and it is the one
// idea the whole picture is built to teach.

const TAU = Math.PI * 2;
const ARMS = 3;
const TIGHT = 2.05;        // how hard the logarithmic spiral coils
const SWIRL = 9.2;         // total winding across the scroll
const CORE = 0.055;        // core radius as a fraction of the field

// Mulberry32. A seeded generator so the field is identical on every
// load and between server and client; Math.random would reshuffle the
// composition on every visit and make the layout unreviewable.
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = { r: number; phi: number; size: number; hue: number; warm: number; twinkle: number; born: number };

function build(n: number): P[] {
  const rand = rng(20260919);
  const out: P[] = [];
  for (let i = 0; i < n; i++) {
    // sqrt keeps the areal density even instead of crowding the centre.
    const r = CORE + (1 - CORE) * Math.sqrt(rand());
    const arm = Math.floor(rand() * ARMS);
    // Scatter widens with radius: arms are tight near the core and
    // fray at the rim, which is what makes it read as a galaxy rather
    // than as three drawn curves.
    // Gaussian-ish cross-arm scatter: summing two uniforms clusters
    // stars on the arm and thins them out to either side, which is what
    // gives an arm a soft edge instead of a drawn line.
    const g2 = (rand() + rand() - 1);
    const inArm = rand() > 0.24;                    // ~24% halo population
    const spread = inArm ? 0.30 + r * 1.15 : 3.4;
    const scatter = g2 * spread;
    const phi = (arm * TAU) / ARMS + Math.log(r / CORE) * TIGHT + scatter;
    out.push({
      r, phi,
      // Power law: mostly faint, a few genuinely bright. 1.5% of the
      // reference reads as near-white blowout, so a handful must be big.
      size: 0.3 + Math.pow(rand(), 3.4) * 2.2,
      hue: rand(),
      warm: rand(),
      twinkle: rand() * TAU,
      born: rand() * 0.42,
    });
  }
  return out;
}

export default function GravityField() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cvsRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cvs = cvsRef.current;
    if (!wrap || !cvs) return;
    const ctx = cvs.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const N = window.innerWidth < 900 ? 550 : 1400;
    const parts = build(N);

    // Three sprites: plain, soft, and haloed. Drawn once, reused forever.
    const sprite = (rgb: string, halo: number) => {
      const S = 64, c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d")!;
      const m = S / 2;
      if (halo > 0) {
        const hg = g.createRadialGradient(m, m, 0, m, m, m);
        hg.addColorStop(0, `rgba(${rgb},${0.5 * halo})`);
        hg.addColorStop(0.16, `rgba(${rgb},${0.18 * halo})`);
        hg.addColorStop(0.45, `rgba(120,175,255,${0.06 * halo})`);
        hg.addColorStop(1, "rgba(79,157,255,0)");
        g.fillStyle = hg;
        g.fillRect(0, 0, S, S);
      }
      const cg = g.createRadialGradient(m, m, 0, m, m, S * 0.11);
      cg.addColorStop(0, `rgba(${rgb},1)`);
      cg.addColorStop(0.55, `rgba(${rgb},0.85)`);
      cg.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = cg;
      g.beginPath(); g.arc(m, m, S * 0.11, 0, TAU); g.fill();
      return c;
    };
    // Five temperatures, warm through hot, matching the sampled mix.
    const SPR = [
      sprite("255,196,140", 1),   // 0  cool giant, orange
      sprite("255,226,190", 0),   // 1  warm
      sprite("255,252,246", 0),   // 2  white, the bulk
      sprite("252,254,255", 1),   // 3  white with halo
      sprite("176,212,255", 0),   // 4  hot blue
      sprite("206,230,255", 1),   // 5  hot blue with halo
    ];

    let w = 0, h = 0, dpr = 1;
    let t = reduce ? 1 : 0;          // scroll progress, 0 to 1
    let px = 0, py = 0, pOn = 0;     // pointer, and how present it is
    let tx = 0, ty = 0, tOn = 0;     // its eased target
    let raf = 0, running = false, dirty = true;
    let onScreen = false;
    const t0Spin = performance.now();
    let lastT = -1;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      // Guard against a feedback loop: this box is square by design, so a
      // height far off its width means something upstream is growing it.
      if (h > w * 3) h = w;
      cvs.width = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
      start();
    };

    // Progress through the pinned range. The sticky stage is held for
    // exactly as long as its tall parent covers the viewport, so that
    // span is the timeline.
    const readProgress = () => {
      if (reduce) return 1;
      const host = wrap.closest(".wb-scroll") as HTMLElement | null;
      if (!host) return 1;
      const r = host.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return 1;
      return Math.min(1, Math.max(0, -r.top / span));
    };

    const ink = () => {
      const cs = getComputedStyle(document.documentElement);
      const sky = cs.getPropertyValue("--sky").trim() || "#4f9dff";
      return sky;
    };
    let SKY = ink();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const spin = onScreen && !reduce ? (performance.now() - t0Spin) * 0.0000145 : 0;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.46;
      const ease = t < 0.5 ? 2 * t * t : t * (2 - t) * 1.0;

      // The core. It brightens as the disc assembles, so the centre
      // reads as the thing everything is falling toward.
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.62);
      const gA = ease;
      glow.addColorStop(0,    `rgba(255,255,255,${0.95 * gA})`);
      glow.addColorStop(0.05, `rgba(222,238,255,${0.55 * gA})`);
      glow.addColorStop(0.14, `rgba(140,190,255,${0.26 * gA})`);
      glow.addColorStop(0.42, `rgba(79,157,255,${0.09 * gA})`);
      glow.addColorStop(1,    "rgba(79,157,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.62, 0, TAU); ctx.fill();

      // Additive blending. Overlapping particles accumulate light the way
      // real ones do, which is what gives the core its density instead of
      // leaving it a flat crowd of separate dots.
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // Staggered arrival, so the field assembles instead of fading
        // in as one block.
        const a = Math.min(1, Math.max(0, (ease - p.born) / (1 - p.born)));
        if (a <= 0) continue;

        // Kepler: omega proportional to r^-1.5. This single line is why
        // the spokes wind into arms.
        const omega = Math.pow(CORE / p.r, 1.5);
        const theta = p.phi + omega * ease * SWIRL + spin * (0.4 + omega * 0.6);
        // Particles drift inward as they wind, so the disc tightens.
        // Stars pile up toward the centre as the disc settles, which is
        // what builds the bulge rather than faking it with one gradient.
        const rr = p.r * (1.26 - 0.3 * ease) * (1 - 0.22 * Math.pow(1 - p.r, 2.2) * ease);

        let x = cx + Math.cos(theta) * rr * R;
        let y = cy + Math.sin(theta) * rr * R * 0.94;

        // The pointer bends the field around itself, like mass warping
        // the paths near it. Falls off fast so it stays local.
        if (tOn > 0.001) {
          // A magnetic pole, not a lens. Pure radial repulsion: every
          // star moves directly away from the pointer along the line
          // joining them, by a distance that falls off with range.
          //
          // The two earlier versions were wrong in the same way. Scaling
          // by dx and dy made the displacement grow with distance, so
          // distant stars flew further than near ones and the disc
          // sheared. Normalising by the distance first is what makes it
          // a field: strength depends on range, direction does not.
          const dx = x - tx, dy = y - ty;
          const d2 = dx * dx + dy * dy;
          const d = Math.sqrt(d2) || 1;
          const push = Math.min(74, 260000 / (d2 + 3000)) * tOn;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }

        const tw = 0.72 + 0.28 * Math.sin(p.twinkle + ease * 5.2);
        const sz = p.size * (0.55 + 0.45 * a) * tw;
        // 6% warm, 25% blue, 69% white, per the sampled reference. The
        // brightest of each get the haloed sprite.
        const big = sz > 2.5;
        const kind =
          p.warm < 0.06 ? 0
          : p.warm < 0.12 ? 1
          : p.warm > 0.75 ? (big ? 5 : 4)
          : big ? 3 : 2;
        const haloed = kind === 0 || kind === 3 || kind === 5;
        const d = sz * (haloed ? 6.5 : 3.4);
        // Only a gentle radial falloff, so the arms stay legible all the
        // way to the rim. A few run hot white, the rest carry the brand
        // blue. Deliberately no amber: this palette is blue by decision.
        const alpha = (0.2 + 0.8 * a) * tw * (0.72 + 0.28 * (1 - p.r));

        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(SPR[kind], x - d / 2, y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = () => {
      const nt = readProgress();
      const moved = Math.abs(nt - lastT) > 0.0004;
      if (moved) { t = nt; lastT = nt; dirty = true; }

      // Pointer influence eases in and out rather than snapping, and
      // the loop is allowed to rest once it has settled.
      const dOn = pOn - tOn, dX = px - tx, dY = py - ty;
      if (Math.abs(dOn) > 0.002 || Math.abs(dX) > 0.4 || Math.abs(dY) > 0.4) {
        tOn += dOn * 0.14; tx += dX * 0.16; ty += dY * 0.16;
        dirty = true;
      } else if (tOn !== pOn) { tOn = pOn; tx = px; ty = py; dirty = true; }

      // While the section is on screen the slow spin means every frame
      // is a new frame; off screen the loop parks as before.
      if (dirty || (onScreen && !reduce)) {
        draw(); dirty = false; raf = requestAnimationFrame(frame); return;
      }
      running = false;
    };
    function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }

    const onScroll = () => start();
    const onMove = (e: PointerEvent) => {
      if (reduce || coarse) return;
      const r = wrap.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top; pOn = 1; start();
    };
    const onLeave = () => { pOn = 0; start(); };
    const onTheme = () => { SKY = ink(); dirty = true; start(); };

    const io = new IntersectionObserver(
      (es) => { onScreen = es.some((e) => e.isIntersecting); if (onScreen) start(); },
      { rootMargin: "120px" }
    );
    io.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      ro.disconnect(); mo.disconnect(); io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="gf">
      <div className="gf-disc" ref={wrapRef}>
        <div className="gf-neb" aria-hidden="true" />
        <canvas
          className="gf-cvs"
          ref={cvsRef}
        role="img"
          aria-label="A disc of particles winding into spiral arms. Particles closer to the centre orbit faster, which is what curves an initially straight line of them into a spiral."
        />
      </div>
      <div className="gf-law" aria-hidden="true">
        <span className="gf-eq">&#969; &#8733; r<sup>&#8722;3/2</sup></span>
        <span className="gf-cap">Inner orbits are faster. That is what makes the arms.</span>
      </div>
    </div>
  );
}
