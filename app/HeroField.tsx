"use client";

import { useEffect, useRef } from "react";

// Cursor cloud: a soft cluster of small round dots that gathers around the
// mouse pointer and trails it as it moves across the hero — nothing is drawn
// anywhere else. Blue-forward palette with a few colour pops. Dots ease toward
// their spot in the cloud (springy lag), shimmer gently, and the whole cloud
// fades in/out as the cursor enters/leaves the hero. Touch + reduced-motion
// render nothing (it's a pure pointer effect).
const BLUE_LIGHT = ["#2f8bd4", "#4f9dff", "#1668a8", "#3b93d6", "#2f8bd4"];
const POP_LIGHT = ["#7c5cff", "#18b2a0", "#f0a020", "#ff6b6b"];
const BLUE_DARK = ["#5aa9ff", "#8fbcff", "#3f8fe8", "#6db3ff", "#5aa9ff"];
const POP_DARK = ["#9d86ff", "#3fd6c2", "#ffc04d", "#ff8585"];

type Dot = {
  ang: number; rad: number;          // spot within the cloud
  x: number; y: number;              // current absolute position
  r: number; ci: number; pop: boolean;
  baseAlpha: number;
  jphase: number; jspeed: number; jamp: number;  // shimmer
};

const COUNT = 54;
const CLOUD_R = 115;

export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.parentElement as HTMLElement | null;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return; // pure pointer effect — skip entirely

    let W = 0, H = 0, dpr = 1;
    let raf = 0, onScreen = true;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // Build the cloud shape (denser toward the centre, wispier at the edges).
    const dots: Dot[] = Array.from({ length: COUNT }, () => {
      const rad = CLOUD_R * Math.pow(Math.random(), 0.62);
      return {
        ang: Math.random() * Math.PI * 2,
        rad,
        x: 0, y: 0,
        r: rand(1, 3.4),
        ci: (Math.random() * 5) | 0,
        pop: Math.random() < 0.26,
        baseAlpha: 0.9 * (1 - rad / CLOUD_R) + 0.12,   // brighter near centre
        jphase: Math.random() * Math.PI * 2,
        jspeed: rand(0.4, 1.1),
        jamp: rand(2, 7),
      };
    });

    const size = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    // Pointer state (in canvas-local coords) + whether it's over the hero.
    const target = { x: W / 2, y: H * 0.42 };
    const center = { x: W / 2, y: H * 0.42 };
    let over = false, cloud = 0, seeded = false;

    const isDark = () => document.documentElement.classList.contains("dark");

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      over = inside;
      if (inside) {
        target.x = x; target.y = y;
        if (!seeded) { center.x = x; center.y = y; for (const d of dots) { d.x = x; d.y = y; } seeded = true; }
      }
    };
    const onLeaveWin = () => { over = false; };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      cloud += ((over ? 1 : 0) - cloud) * 0.08;   // ease cloud in/out
      ctx.clearRect(0, 0, W, H);
      if (cloud < 0.01) return;

      center.x += (target.x - center.x) * 0.18;   // soft follow
      center.y += (target.y - center.y) * 0.18;
      const time = t / 1000;
      const blues = isDark() ? BLUE_DARK : BLUE_LIGHT;
      const pops = isDark() ? POP_DARK : POP_LIGHT;

      for (const d of dots) {
        const jx = Math.cos(d.jphase + time * d.jspeed) * d.jamp;
        const jy = Math.sin(d.jphase * 1.4 + time * d.jspeed) * d.jamp;
        const tx = center.x + Math.cos(d.ang) * d.rad + jx;
        const ty = center.y + Math.sin(d.ang) * d.rad + jy;
        d.x += (tx - d.x) * 0.14;                  // springy trailing
        d.y += (ty - d.y) * 0.14;

        ctx.globalAlpha = d.baseAlpha * cloud;
        ctx.fillStyle = d.pop ? pops[d.ci % pops.length] : blues[d.ci % blues.length];
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    let rz = 0;
    const onResize = () => { window.clearTimeout(rz); rz = window.setTimeout(size, 150); };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeaveWin, { passive: true });
    window.addEventListener("blur", onLeaveWin, { passive: true });
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => { onScreen = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    io.observe(hero);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeaveWin);
      window.removeEventListener("blur", onLeaveWin);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rz);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}
