import { ImageResponse } from "next/og";

// The timeline route previously shared the homepage card. It now gets its
// own — the one place on this site where a generated image genuinely beats
// a static one, because the two routes are different content.
export const alt = "Timeline — the career of Bhanu Mendis, year by year";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#e9f2fb";
const SKY = "#4f9dff";
const MUTED = "rgba(200,220,240,0.60)";

const MILESTONES: [string, string][] = [
  ["2025", "Educator — The Science Brainery"],
  ["2024", "Senior Head Prefect, Lyceum International"],
  ["2023", "Founded the Swara & Padura concerts"],
];

export default function TimelineOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          backgroundImage:
            "radial-gradient(1100px 620px at 50% -12%, rgba(79,157,255,0.20), transparent 68%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 2, background: SKY }} />
          <div style={{ fontSize: 22, letterSpacing: 6, color: SKY, textTransform: "uppercase" }}>
            bhanumendis.com / timeline
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1.02, letterSpacing: -3, color: INK }}>
            Timeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 34 }}>
            {MILESTONES.map(([year, label]) => (
              <div key={year} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 14 }}>
                <div style={{ display: "flex", fontSize: 30, color: SKY, width: 96 }}>{year}</div>
                <div style={{ display: "flex", width: 2, height: 30, background: "rgba(79,157,255,0.34)" }} />
                <div style={{ display: "flex", fontSize: 30, color: INK }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
          Bhanu Mendis — Educator, Public Speaker & Audio Engineer · Colombo, Sri Lanka
        </div>
      </div>
    ),
    size,
  );
}
