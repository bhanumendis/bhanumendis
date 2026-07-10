"use client";

import { useEffect, useRef, useState } from "react";

// Type "swara" anywhere (like the B+M egg) to reveal the Swara theme song with
// a live, theme-matched audio visualizer. Click away / press Escape to stop;
// otherwise the track plays through and the overlay closes itself at the end.
const TARGET = "swara";

export default function SwaraEgg() {
  const [active, setActive] = useState(false);
  const seq = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  const stop = () => {
    setActive(false);
    cancelAnimationFrame(rafRef.current);
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    document.body.style.overflow = "";
  };

  // ── Keyboard: capture the "swara" sequence ──
  useEffect(() => {
    const isTyping = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const t = el.tagName;
      return t === "INPUT" || t === "TEXTAREA" || el.isContentEditable;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return stop();
      if (e.repeat || isTyping()) return;
      const k = e.key.toLowerCase();
      if (k.length !== 1 || k < "a" || k > "z") return;
      seq.current.push(k);
      if (seq.current.length > TARGET.length) seq.current.shift();
      if (seq.current.join("") === TARGET) {
        seq.current = [];
        setActive(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── When it opens: start audio + visualizer ──
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const a = audioRef.current;
    const canvas = canvasRef.current;
    if (!a || !canvas) return;

    let cancelled = false;

    const startViz = () => {
      try {
        const AC: typeof AudioContext =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ac = acRef.current ?? new AC();
        acRef.current = ac;
        if (ac.state === "suspended") ac.resume();

        // A MediaElementSource can only be created once per <audio> element.
        const tagged = a as HTMLAudioElement & { _wired?: boolean };
        if (!tagged._wired) {
          const src = ac.createMediaElementSource(a);
          const analyser = ac.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.82;
          src.connect(analyser);
          analyser.connect(ac.destination);
          analyserRef.current = analyser;
          tagged._wired = true;
        }
      } catch {
        /* Web Audio unavailable — audio still plays, just no bars. */
      }
      draw();
    };

    const draw = () => {
      const cv = canvasRef.current;
      const analyser = analyserRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sizeCanvas = () => {
        cv.width = Math.round(cv.clientWidth * dpr);
        cv.height = Math.round(cv.clientHeight * dpr);
      };
      sizeCanvas();

      const bars = 56;
      const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

      const frame = () => {
        if (cancelled) return;
        const dark = document.documentElement.classList.contains("dark");
        const w = cv.width, h = cv.height;
        ctx.clearRect(0, 0, w, h);
        const gap = w / bars;
        const bw = gap * 0.5;
        for (let i = 0; i < bars; i++) {
          let v: number;
          if (data && analyser) {
            analyser.getByteFrequencyData(data);
            const idx = Math.floor((i / bars) * data.length * 0.7);
            v = data[idx] / 255;
          } else {
            v = 0.25 + 0.25 * Math.abs(Math.sin(i * 0.4 + performance.now() / 300));
          }
          const bh = Math.max(bw * 0.6, v * h * 0.92);
          const x = i * gap + (gap - bw) / 2;
          const y = h - bh;
          const g = ctx.createLinearGradient(0, h, 0, y);
          g.addColorStop(0, dark ? "rgba(56,201,230,0.15)" : "rgba(31,116,184,0.16)");
          g.addColorStop(1, dark ? "#8ceffb" : "#2f8bd4");
          ctx.fillStyle = g;
          const r = Math.min(bw / 2, bh / 2);
          ctx.beginPath();
          ctx.moveTo(x, y + r);
          ctx.arcTo(x, y, x + r, y, r);
          ctx.arcTo(x + bw, y, x + bw, y + r, r);
          ctx.lineTo(x + bw, h);
          ctx.lineTo(x, h);
          ctx.closePath();
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(frame);
      };
      frame();
    };

    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.then === "function") p.then(startViz).catch(startViz);
    else startViz();

    const onEnd = () => stop();
    a.addEventListener("ended", onEnd);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      a.removeEventListener("ended", onEnd);
    };
  }, [active]);

  return (
    <>
      <audio ref={audioRef} src="/swara.mp3" preload="none" aria-hidden="true" />
      <div
        className={`swara-egg${active ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Swara theme song"
        aria-hidden={!active}
        onClick={stop}
      >
        <div className="swara-card" onClick={(e) => e.stopPropagation()}>
          <div className="swara-eyebrow">Now Playing</div>
          <div className="swara-title sinhala" lang="si">ස්වර</div>
          <div className="swara-name">Swara — Theme</div>
          <canvas ref={canvasRef} className="swara-canvas" aria-hidden="true" />
          <button type="button" className="swara-close" onClick={stop} aria-label="Close and stop the music">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Click anywhere to close
          </button>
        </div>
      </div>
    </>
  );
}
