@AGENTS.md

# bhanumendis.com — project guide

Personal portfolio for Bhanu Mendis. Next.js 16 (App Router) + React 19, TypeScript, plain CSS (no Tailwind runtime classes — a single hand-authored `app/globals.css`). Deployed as a static-friendly Next app.

## Architecture

- `app/layout.tsx` — root layout, fonts (next/font), full SEO metadata, Open Graph/Twitter, JSON-LD `Person` schema, security `viewport`. Renders the global `<Footer/>` (hidden on the home page — see below) and `<EasterEgg/>`.
- `app/page.tsx` — the home page. A **horizontal, single-page experience**: the page scrolls vertically with the browser's native scroll, and a `position: sticky` pinned stage (`#hsticky`) translates a flex track (`#htrack`) sideways. This means mouse wheel, trackpad, scrollbar, Page-Down and arrow keys all drive horizontal motion natively. Movement is eased with a rAF lerp for an inertial glide, plus a subtle per-panel parallax on single-screen panels. Mobile (< 901px) falls back to a normal vertical layout.
  - Panels, in order: hero, about, skills, press (`FeaturedIn`), exp, linkedin, achieve, certs, contact, findus (map), endcap (footer).
  - The footer is rendered as the final in-track panel; the global layout footer is hidden on the home page via `body.home`.
- `app/timeline/page.tsx` + `app/Timeline.tsx` — a separate vertical `/timeline` route.
- Components: `Counter` (framer-motion count-up), `MagneticButton`, `FeaturedIn` (press cards), `Footer`, `EasterEgg` (hold B+M).
- `app/robots.ts`, `app/sitemap.ts` — generated robots.txt and sitemap.xml. `public/llms.txt` — AI-crawler profile.

## Conventions

- One stylesheet: `app/globals.css`. Theme tokens live in `:root` (and `body.light`). Reuse the CSS variables (`--bg`, `--sky`, `--card-bg`, `--glass`, etc.) — do not hardcode colors.
- Interactive JS lives in client components (`"use client"`). The home page uses three effects: (1) `body.home` flag, (2) custom cursor + hero parallax, (3) the horizontal scroll engine.
- Content is visible by default; `.reveal` is a one-shot entrance animation, never a visibility gate.
- Accessibility: skip link, visible `:focus-visible` rings, keyboard panel navigation (Arrow/Home/End + focus-into-view), and `prefers-reduced-motion` are all honored.

## Security & performance

Security headers and a strict Content-Security-Policy are defined in `next.config.ts`. The CSP `frame-src` must list every embedded iframe origin (LinkedIn posts and Google Maps). Long-lived immutable caching is set for static media; images use AVIF/WebP via `next/image`.

## Gotchas

- This repo lives on a cloud-synced (OneDrive) path; some editors inject stray NUL bytes / truncate on save. After any write, verify the file decodes as clean UTF-8 and ends correctly.
- The horizontal track uses CSS `transform`, which breaks map libraries like Leaflet (transformed ancestor) — embed maps as iframes instead, and remember to allow their origin in the CSP `frame-src`.
