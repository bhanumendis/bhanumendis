@AGENTS.md

# bhanumendis.com — project guide

Personal portfolio for Bhanu Mendis. Next.js 16 (App Router) + React 19, TypeScript, plain CSS (no Tailwind runtime classes — a single hand-authored `app/globals.css`). Deployed as a static-friendly Next app on Vercel.

## Architecture

- `app/layout.tsx` — root layout. Self-hosted fonts via `next/font/local` (files in `app/fonts/`): Raleway (display), Poppins (UI/body), Inconsolata (mono), Noto Serif Sinhala (signature). Tab title is just `Bhanu Mendis`. Full SEO metadata, Open Graph/Twitter, and a JSON-LD `@graph` (Person + tutoring `Service`/`EducationalOccupationalProgram` + The Science Brainery + the Swara/Padura concerts). A tiny inline `themeInit` script applies the saved theme before paint (no flash). Renders the global `<Footer/>` and `<EasterEgg/>`.
- `app/page.tsx` — the home page. A **standard vertical-scroll** single page. A fixed `.fx` backdrop (soft ambient orbs + dark-mode scanlines, no grid) parallaxes at different depths via a rAF scroll loop reading `[data-par]` speeds; section content rises in with a subtle 3D "Inception" reveal (`.reveal` → `.reveal.in`). The `#ethos` section is an Apple-style pinned-scroll band: a `position:sticky` background word stays fixed while the foreground lines scroll over it. Custom cursor + hero pointer parallax on desktop. Mobile (< 901px) and `prefers-reduced-motion` get a calm, static layout.
  - Sections, in order: hero, about, **tutoring**, ethos (pinned), skills, press (`FeaturedIn`), exp, linkedin, achieve, certs, contact, findus (map, holds the single "Register for Classes" CTA). The footer is the global one from `layout.tsx` (shown on every page).
- `app/timeline/page.tsx` + `app/Timeline.tsx` — a separate vertical `/timeline` route.
- Components: `Counter` (framer-motion count-up), `MagneticButton` (amplified pull + label lag + cursor sheen), `FeaturedIn` (press cards), `Footer`, `EasterEgg` (hold B+M).
- `app/robots.ts`, `app/sitemap.ts` — generated robots.txt and sitemap.xml. `public/llms.txt` — AI-crawler profile.

## Theme system

- **Light is the default** (clean, professional). **Dark is opt-in** ("classified terminal" — deep near-black + cyan glow + scanlines).
- Tokens live on `:root` (light) with `:root.dark` overrides. The theme class lives on `<html>` (documentElement). Reuse the CSS variables (`--bg`, `--sky`, `--card-bg`, `--glass`, etc.) — never hardcode theme colours.
- The choice is persisted to `localStorage` (`bm-theme`) and re-applied pre-paint by the inline script in `layout.tsx`. `app/page.tsx` toggles the class + storage with a radial ripple.

## Conventions

- One stylesheet: `app/globals.css`.
- Interactive JS lives in client components (`"use client"`).
- Content is visible by default; `.reveal` is a one-shot entrance animation, never a visibility gate. If JS never runs, everything still shows.
- Accessibility: skip link, visible `:focus-visible` rings, and `prefers-reduced-motion` (which disables parallax + reveals) are all honored.

## Security & performance

Threat model: this is a **fully static site** — no backend, no database, no auth, no server-side forms. So SQLi / CSRF / auth-hardening are not applicable, and rate-limiting / DDoS / bot-protection are handled at the edge by Vercel + Cloudflare, not in app code. The real surface is response headers, CSP, and dependency hygiene.

Security headers + CSP live in `next.config.ts` (applied to `/(.*)`):

- **HSTS** — `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. The `preload` token is a deliberate commitment; submit the domain once at https://hstspreload.org to enter the browser preload list.
- **CSP** — `default-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'` (with `X-Frame-Options: DENY`); `worker-src 'self' blob:`; `manifest-src 'self'`. `frame-src` must list every embedded iframe origin (LinkedIn posts + Google Maps). `form-action` allows the Google Forms registration target.
- `script-src` and `style-src` keep `'unsafe-inline'` **on purpose**: a statically-exported Next app ships framework bootstrap/hydration inline scripts (and the pre-paint theme script), and the cursor/parallax/ripple/magnetic effects set inline `style` at runtime. There is no untrusted/user-generated HTML anywhere on the site, so the injection surface is effectively nil. A nonce-based strict CSP would require per-request middleware (dynamic rendering) — not worth trading the static/edge-cached model for.
- `X-XSS-Protection: 0` — the legacy filter is deprecated and can create its own issues (OWASP guidance); the CSP is the real protection.
- Other headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo/browsing-topics denied), `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`. Do **not** add COEP — it would break the cross-origin LinkedIn/Maps iframes.

The `hiroshmendis.com` past-papers link is a plain anchor (no CSP entry needed).

Dependencies: keep `npm audit` at **0 vulnerabilities**. Tailwind/PostCSS were removed (the CSS is hand-authored with no Tailwind directives, so they were dead weight + supply-chain risk); there is no `postcss.config.mjs`. A `package.json` `overrides` pins `postcss` to a patched version inside Next's tree. Prefer patch/minor bumps; avoid major bumps (eslint 10, typescript 6) without a full build+QA pass.

Performance: fonts self-hosted (`font-src 'self'`, preloaded); images AVIF/WebP via `next/image`; long-lived immutable caching for static media in `next.config.ts`; `dns-prefetch` hints in `layout.tsx` warm up the embed origins; `compress: true`, `poweredByHeader: false`. Keep it static and edge-cached.

## Gotchas

- This repo lives on a cloud-synced (OneDrive) path; some editors inject stray NUL bytes / truncate on save. After any write, verify the file decodes as clean UTF-8 and ends correctly.
- Maps are embedded as iframes (not Leaflet). Keep any new embedded origin in the CSP `frame-src`.
- Google Fonts is not required at build time anymore — fonts are vendored in `app/fonts/`. Don't reintroduce a `next/font/google` build dependency.
