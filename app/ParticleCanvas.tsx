"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  baseX: number; baseY: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mx = W / 2, my = H / 2;
    let frame: number;

    const COUNT = 70;
    const CONNECT_DIST = 120;
    const REPEL_DIST = 140;
    const REPEL_STRENGTH = 2.2;
    const SPEED = 0.35;

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const x = Math.random() * W;
      const y = Math.random() * H;
      return {
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.4 + 0.15,
      };
    });

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Mouse repel
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = (REPEL_DIST - dist) / REPEL_DIST;
          p.vx += (dx / dist) * force * REPEL_STRENGTH * 0.08;
          p.vy += (dy / dist) * force * REPEL_STRENGTH * 0.08;
        }

        // Gentle drift back toward base
        p.vx += (p.baseX - p.x) * 0.0008;
        p.vy += (p.baseY - p.y) * 0.0008;

        // Friction
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary
        if (p.x < 0) p.vx += 0.05;
        if (p.x > W) p.vx -= 0.05;
        if (p.y < 0) p.vy += 0.05;
        if (p.y > H) p.vy -= 0.05;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,192,245,${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(120,192,245,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0, opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}