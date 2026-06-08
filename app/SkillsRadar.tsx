"use client";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { label: "Leadership", value: 95 },
  { label: "Audio Engineering", value: 85 },
  { label: "Performance", value: 92 },
  { label: "Teaching", value: 80 },
  { label: "Event Production", value: 90 },
  { label: "Creative Direction", value: 88 },
];

export default function SkillsRadar() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const cx = 200, cy = 200, R = 140;
  const n = SKILLS.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, pct: number) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * R * (pct / 100),
      y: cy + Math.sin(angle) * R * (pct / 100),
    };
  };

  const rings = [25, 50, 75, 100];
  const dataPath = SKILLS.map((s, i) => {
    const p = getPoint(i, animated ? s.value : 0);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + " Z";

  return (
    <div ref={ref} className="radar-wrap reveal">
      <svg viewBox="0 0 400 400" className="radar-svg" aria-label="Skills radar chart">
        {/* Grid rings */}
        {rings.map(r => (
          <polygon
            key={r}
            points={Array.from({ length: n }, (_, i) => {
              const p = getPoint(i, r);
              return `${p.x},${p.y}`;
            }).join(" ")}
            className="radar-ring"
          />
        ))}
        {/* Axis lines */}
        {SKILLS.map((_, i) => {
          const p = getPoint(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className="radar-axis" />;
        })}
        {/* Data polygon */}
        <polygon points={dataPath.replace(/[MLZ]/g, (m) => m === "Z" ? "" : "").trim().replace(/L/g, " ")} className={`radar-data ${animated ? "radar-animated" : ""}`} />
        {/* Data dots + labels */}
        {SKILLS.map((s, i) => {
          const p = getPoint(i, animated ? s.value : 0);
          const lp = getPoint(i, 115);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" className={`radar-dot ${animated ? "radar-animated" : ""}`} />
              <text x={lp.x} y={lp.y} className="radar-label" textAnchor="middle" dominantBaseline="middle">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}