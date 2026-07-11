"use client";

import { useEffect, useRef } from "react";

// Antigravity-inspired hero field: small dash particles scattered in a radial
// burst behind the name — sparse in the centre (so the text stays clean),
// denser toward the edges. They drift gently, ease away from the cursor, and
// parallax upward on scroll. Blue-forward palette with a few colour pops.
// Canvas-based for performance; mobile gets fewer particles; reduced-motion
// renders a single static frame.
const BLUE_LIGHT = ["#2f8bd4", "#4f9dff", "#1668a8", "#3b93d6", "#2f8bd4"];
const POP_LIGHT = ["#7c5cff", "#18b2a0", "#f0a020", "#ff6b6b"];
const BLUE_DARK = ["#5aa9ff", "#8fbcff", "#3f8fe8", "#6db3ff", "#5aa9ff"];
const POP_DARK = ["#9d86ff", "#3fd6c2", "#ffc04d", "#ff8585"];

type P = {
  bx: number; by: number; x: number; y: number;
  ang: number; len: number; w: number;
  ci: number; pop: boolean;
  phase: number; speed: number; amp: number; depth: number; alpha: number;
};

export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement as HTMLElement | null;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    let ps: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0, running = true, scrollY = window.scrollY;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      W = hero.clientWidth;
      H = hero.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = W < 760 ? 66 : 150;
      const cx = W / 2, cy = H * 0.42;
      const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
      ps = [];
      let guard = 0;
      while (ps.length < count && guard < count * 10) {
        guard++;
        const x = Math.random() * W;
        const y = Math.random() * H;
        const dx = x - cx, dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const norm = dist / maxR;                 // 0 centre → 1 edge
        // Reject more near the centre to keep a clean zone behind the text.
        if (Math.random() > Math.pow(norm, 1.5) * 0.92 + 0.05) continue;
        ps.push({
          bx: x, by: y, x, y,
          ang: Math.atan2(dy, dx) + rand(-0.4, 0.4),  // roughly radial
          len: rand(6, 16),
          w: rand(2, 3.4),
          ci: (Math.random() * 5) | 0,
          pop: Math.random() < 0.24,               // ~1 in 4 is a colour pop
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.18, 0.5),
          amp: rand(2.5, 7),
          depth: 0.3 + norm,                        // outer particles parallax more
          alpha: rand(0.5, 0.95),
        });
      }
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const paint = (time: number) => {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();
      const blues = dark ? BLUE_DARK : BLUE_LIGHT;
      const pops = dark ? POP_DARK : POP_LIGHT;
      const rect = canvas.getBoundingClientRect();
      const mgx = mouse.x - rect.left;
      const mgy = mouse.y - rect.top;
      const near = mouse.x > -9000;

      for (const p of ps) {
        const fx = Math.cos(p.phase + time * p.speed) * p.amp;
        const fy = Math.sin(p.phase * 1.3 + time * p.speed) * p.amp;
        const par = scrollY * 0.12 * p.depth;      // scroll → drift upward

        let rx = 0, ry = 0;
        if (near) {
          const ddx = p.bx - mgx, ddy = p.by - mgy;
          const d = Math.hypot(ddx, ddy);
          const R = 150;
          if (d < R && d > 0.01) {
            const f = (1 - d / R);
            rx = (ddx / d) * f * f * 46;
            ry = (ddy / d) * f * f * 46;
          }
        }

        const tx = p.bx + fx + rx;
        const ty = p.by + fy + ry - par;
        // ease toward target for a smooth, springy feel
        p.x += (tx - p.x) * 0.16;
        p.y += (ty - p.y) * 0.16;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.ang);
        ctx.strokeStyle = p.pop ? pops[p.ci % pops.length] : blues[p.ci % blues.length];
        ctx.lineWidth = p.w;
        ctx.lineCap = "round";
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(-p.len / 2, 0);
        ctx.lineTo(p.len / 2, 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (running) paint(t / 1000);
      raf = requestAnimationFrame(loop);
    };

    // ── Wire up ──
    build();
    if (reduce) {
      paint(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onScroll = () => { scrollY = window.scrollY; };
    let rz = 0;
    const onResize = () => {
      window.clearTimeout(rz);
      rz = window.setTimeout(() => { build(); if (reduce) paint(0); }, 150);
    };

    if (!reduce) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);

    // Pause the loop when the hero is off-screen (saves CPU/battery).
    const io = new IntersectionObserver(
      (entries) => { running = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    io.observe(hero);

    // Redraw on theme flip (matters for the reduced-motion static frame; the
    // animated loop already repaints every frame).
    const mo = new MutationObserver(() => { if (reduce) paint(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rz);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}
