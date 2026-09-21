/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
// Renders the two link-preview cards (the image WhatsApp, Telegram, iMessage,
// LinkedIn, X… show when the URL is shared) and writes them where Next's file
// convention picks them up:
//
//   app/opengraph-image.jpg            → og:image / twitter:image for "/"
//   app/timeline/opengraph-image.jpg   → the same for "/timeline"
//
// Run from the repo root after changing any text below:   node scripts/og.mjs
//
// Why a committed JPEG instead of the old next/og (Satori) route:
//   · The card now carries the profile photograph. As PNG — the only format
//     ImageResponse can emit — that is ~450 KB, and WhatsApp quietly drops
//     preview images much past 300 KB. As JPEG it is under 100 KB.
//   · Satori cannot read woff2 and has no bold without a font file, so the old
//     card was stuck in one thin default face. sharp is already a dependency.
//
// FONTS: set in Segoe UI Black / Semibold and Bahnschrift — Windows system
// faces, named explicitly so the render is deterministic on the machine that
// owns the design. sharp's text renderer cannot load the site's woff2 files
// (asking it for "Raleway" silently substitutes), so they are not pretended to
// here. On another OS these names will substitute too: THE COMMITTED JPEGs ARE
// THE SOURCE OF TRUTH — re-run this only on Windows, and look at the result.
import sharp from "sharp";
import { statSync, writeFileSync } from "node:fs";

const W = 1200, H = 630;

// Dark-theme / hero-stage tokens from app/globals.css.
const INK = "#e9f2fb";     // --white (dark)
const ACCENT = "#9cc3ff";  // --sky2 — the hero's "MENDIS"
const SKY = "#4f9dff";     // --sky
const MUTED = "#8fa3b8";

const DISPLAY = "Segoe UI Black";
const LABEL = "Segoe UI Semibold";
const MONO = "Bahnschrift Medium";

// One text layer = one RGBA image trimmed to its ink, so every y below is the
// top of the actual letterforms rather than of an invisible line box.
async function text(str, color, font, size, tracking = 0) {
  const markup = `<span foreground="${color}" letter_spacing="${Math.round(tracking * 1024)}">${str}</span>`;
  const raw = await sharp({ text: { text: markup, font: `${font} ${size}`, rgba: true, dpi: 72 } }).png().toBuffer();
  const { data, info } = await sharp(raw).trim({ threshold: 0 }).png().toBuffer({ resolveWithObject: true });
  return { input: data, w: info.width, h: info.height };
}

const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);

// The stage: pure black with the same sky wash the hero carries, pulled to the
// upper left so it lights the type and leaves the figure's side of the card dark.
const ground = svg(`
  <defs><radialGradient id="wash" cx="22%" cy="-8%" r="78%">
    <stop offset="0" stop-color="${SKY}" stop-opacity=".26"/>
    <stop offset=".55" stop-color="${SKY}" stop-opacity=".05"/>
    <stop offset="1" stop-color="${SKY}" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="100%" height="100%" fill="#000"/>
  <rect width="100%" height="100%" fill="url(#wash)"/>`);

// Lets the figure sink into the floor instead of being sliced by the card edge.
const floor = svg(`
  <defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
    <stop offset=".70" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".82"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#f)"/>`);

// The site's own cut-out (public/portrait.jpg, already on black). Scaled so its
// circular bottom edge falls below the card, and placed so the face stays inside
// the centre 630px square — the region WhatsApp keeps when it falls back to a
// small square thumbnail.
async function figure() {
  const SIZE = 760, left = W - SIZE + 40, top = -8;
  const scaled = await sharp("public/portrait.jpg").resize(SIZE, SIZE, { kernel: "lanczos3" }).sharpen({ sigma: 0.6 }).toBuffer();
  const input = await sharp(scaled).extract({ left: 0, top: -top, width: W - left, height: H }).toBuffer();
  // `lighten`: the photo's black ground yields to the wash behind it instead of boxing it out.
  return { input, left, top: 0, blend: "lighten" };
}

async function card({ out, eyebrow, line1, line2, size2 = 142, notes, footer }) {
  const X = 84;
  const eb = await text(eyebrow, SKY, LABEL, 23, 4.2);
  const l1 = await text(line1, INK, DISPLAY, 142, -4);
  const l2 = await text(line2, ACCENT, DISPLAY, size2, size2 === 142 ? -4 : -2);
  const n = await Promise.all(notes.map((s) => text(s, INK, MONO, 22, 3.1)));
  const ft = await text(footer, MUTED, MONO, 18, 3.4);

  const yEb = 82;
  const y1 = 164;
  const y2 = y1 + l1.h + 22;
  const yRule = y2 + l2.h + 34;
  let y = yRule + 32;
  const noteLayers = n.map((t) => { const layer = { input: t.input, left: X, top: y }; y += t.h + 14; return layer; });

  const rules = svg(`
    <rect x="${X}" y="${yEb + Math.round(eb.h / 2) - 1}" width="54" height="2" fill="${SKY}"/>
    <rect x="${X}" y="${yRule}" width="132" height="3" fill="${SKY}"/>`);

  const jpeg = await sharp(ground)
    .composite([
      await figure(),
      { input: floor, left: 0, top: 0 },
      { input: rules, left: 0, top: 0 },
      { input: eb.input, left: X + 54 + 18, top: yEb },
      // Heavy display caps carry side-bearing; -6 puts their stems on the same
      // left edge as the small labels.
      { input: l1.input, left: X - 6, top: y1 },
      { input: l2.input, left: X - 6, top: y2 },
      ...noteLayers,
      { input: ft.input, left: X, top: H - 58 - ft.h },
    ])
    // 4:4:4 keeps the coloured type edges clean; default 4:2:0 smears them.
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();

  writeFileSync(out, jpeg);
  console.log(`${out}  ${W}x${H}  ${(statSync(out).size / 1024).toFixed(0)} KB`);
}

await card({
  out: "app/opengraph-image.jpg",
  eyebrow: "BHANUMENDIS.COM",
  line1: "BHANU",
  line2: "MENDIS",
  notes: ["EDUCATOR  ·  PUBLIC SPEAKER", "AUDIO ENGINEER  ·  VISHARADHA"],
  footer: "COLOMBO, SRI LANKA",
});

await card({
  out: "app/timeline/opengraph-image.jpg",
  eyebrow: "BHANUMENDIS.COM / TIMELINE",
  line1: "14 YEARS",
  line2: "IN THE MAKING",
  size2: 72,
  // Two short lines: a third term ran into the figure's sleeve.
  notes: ["BHANU MENDIS", "MILESTONES  ·  CHAMPIONSHIPS"],
  footer: "COLOMBO, SRI LANKA",
});
