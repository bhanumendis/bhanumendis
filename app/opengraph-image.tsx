import { ImageResponse } from "next/og";

// ── Generated Open Graph card ────────────────────────────────────────
// Rendered at build time, so it costs nothing at request time and the
// site stays statically cacheable. It is deliberately typeset in the
// runtime's default face rather than the site's: Satori cannot parse
// woff2, and every font in app/fonts is woff2. Weight here comes from
// scale, colour and rule-work instead — all pulled from the dark theme
// tokens in globals.css so the card and the site read as one thing.
export const alt =
  "Bhanu Mendis — Educator, Public Speaker & Audio Engineer, Colombo, Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#e9f2fb";
const SKY = "#4f9dff";
const MUTED = "rgba(200,220,240,0.60)";

export default function OpengraphImage() {
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
          // The same atmospheric wash the hero carries.
          backgroundImage:
            "radial-gradient(1100px 620px at 50% -12%, rgba(79,157,255,0.20), transparent 68%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 2, background: SKY }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: SKY,
              textTransform: "uppercase",
            }}
          >
            bhanumendis.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 116, lineHeight: 1.02, letterSpacing: -3 }}>
            <span style={{ color: INK }}>BHANU&nbsp;</span>
            <span style={{ color: SKY }}>MENDIS</span>
          </div>
          <div style={{ display: "flex", width: 180, height: 3, background: SKY, marginTop: 30 }} />
          <div style={{ display: "flex", fontSize: 33, color: INK, marginTop: 30 }}>
            Educator · Public Speaker · Audio Engineer · Visharadha
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: MUTED }}>
          <div style={{ display: "flex" }}>
            Science · Mathematics · Computing — Pearson Edexcel, Grades 6–8
          </div>
          <div style={{ display: "flex" }}>Colombo, Sri Lanka</div>
        </div>
      </div>
    ),
    size,
  );
}
