@AGENTS.md

# bhanumendis.com — project guide

Personal portfolio for Bhanu Mendis. Next.js 16 (App Router) + React 19, TypeScript, plain CSS (no Tailwind runtime classes — a single hand-authored `app/globals.css`). Deployed as a static-friendly Next app on Vercel.

## Architecture

- `app/layout.tsx` — root layout. Self-hosted fonts via `next/font/local` (files in `app/fonts/`): Raleway (display), Poppins (UI/body), Inconsolata (mono), Noto Serif Sinhala (signature). Tab title is just `Bhanu Mendis`. Full SEO metadata, Open Graph/Twitter, and a JSON-LD `@graph` (Person + tutoring `Service`/`EducationalOccupationalProgram` + The Science Brainery + the Swara/Padura concerts). A tiny inline `themeInit` script applies the saved theme before paint (no flash). Renders the global `<Footer/>` and `<EasterEgg/>`.
- `app/page.tsx` — the home page. A **standard vertical-scroll** single page. The page background is **pure solid** (`#fff` light / `#000` dark) — there is no decorative backdrop layer. A rAF scroll loop drives the progress bar, nav state and back-to-top. Section content rises in with a 3D "Inception" reveal on desktop (`.reveal` → `.reveal.in`); **on mobile the reveal is a single lightweight 2D fade with no stagger** (the 3D version double-painted on mobile GPUs). Two sections use an Apple-style pinned-scroll effect — a `position:sticky` background word that stays fixed while content scrolls over it: `#ethos` ("LEARN") and `#exp` ("WORK", `.exp-pin-bg`). Custom cursor + hero pointer parallax on desktop. `prefers-reduced-motion` gets a calm, static layout.
  - Sections, in order: hero, about, **tutoring**, ethos (pinned), skills, press (`FeaturedIn`), exp (pinned), linkedin, achieve, certs, contact, findus (map, holds the single "Register for Classes" CTA). The footer is the global one from `layout.tsx` (shown on every page).
  - Theme toggle: the desktop `.sidebar-left` toggle is hidden on mobile; a compact `.nav-theme` button in the nav takes over below 901px.
- `app/timeline/page.tsx` + `app/Timeline.tsx` — a separate vertical `/timeline` route.
- Components: `Counter` (dependency-free rAF count-up — no animation library), `MagneticButton` (amplified pull + label lag + cursor sheen), `FeaturedIn` (press cards), `Footer`, `EasterEgg` (hold B+M), `SwaraEgg` (type `swara` → the Swara theme song at `public/swara.mp3` plays behind a themed overlay titled ස්වර with a live Web-Audio canvas visualizer; click-away / Esc / track-end closes it).
- `app/robots.ts`, `app/sitemap.ts` — generated robots.txt and sitemap.xml. `public/llms.txt` — AI-crawler profile.
- `proxy.ts` (Next 16's renamed Middleware) — **content negotiation**: requests with `Accept: text/markdown` for `/` or `/timeline` get the clean Markdown mirrors in `public/index.md` / `public/timeline.md`; browsers get HTML. Responses carry `Vary: Accept`. Keep the mirrors in sync when portfolio facts change.

## Theme system

- **Light is the default** (clean, professional — pure `#fff` background). **Dark is opt-in** (pure `#000` background + cyan accents). Backgrounds are intentionally pure/solid; card surfaces carry a faint tint + border so they stay legible against them.
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

Performance: fonts self-hosted (`font-src 'self'`, preloaded); images AVIF/WebP via `next/image`; long-lived immutable caching for static media in `next.config.ts`; `dns-prefetch` hints in `layout.tsx` warm up the embed origins; `compress: true`, `poweredByHeader: false`. **No animation library** — `framer-motion` was removed (it was used only by `Counter`, now a ~40-line rAF loop), which cut a large transitive dependency tree and mobile JS bootup. Local Lighthouse (against `next start`): desktop performance ~98, accessibility 100, best-practices ~96, SEO 100; axe-core reports 0 WCAG A/AA violations. Keep it static and edge-cached.

## Gotchas

- This repo lives on a cloud-synced (OneDrive) path; some editors inject stray NUL bytes / truncate on save. After any write, verify the file decodes as clean UTF-8 and ends correctly.
- Maps are embedded as iframes (not Leaflet). Keep any new embedded origin in the CSP `frame-src`.
- Google Fonts is not required at build time anymore — fonts are vendored in `app/fonts/`. Don't reintroduce a `next/font/google` build dependency.

## Audit log

**2026-07-30 � Security & performance audit (Claude/Cowork):**
- Dependency vulnerabilities fixed and merged (PR #6, `fix/portfolio-dependency-vulnerabilities`) � confirmed live, `npm audit` clean.
- README accuracy fix, Student Portal nav link, magnetic CTA, nav button sizing, mobile theme-toggle position, and the robots.txt policy all merged via PR #4 (`fix/readme-project-accuracy`) � confirmed live on `origin/main` and in production.
- Structural performance check via curl (no live-browser Lighthouse available this session): Brotli compression confirmed active, static asset caching confirmed `Cache-Control: public, max-age=31536000, immutable` (gold standard), `next/image` responsive optimization confirmed, code-splitting confirmed via `_next/static/chunks/*.js`.
- Local clone was several commits behind `origin/main` (both PRs above were merged via the GitHub web UI without a local pull) � fast-forwarded clean, no conflicts. The now-merged `fix/readme-project-accuracy` branch was deleted locally.
- **Worth a 2-minute check next session**: this file documents `app/robots.ts` as the robots.txt mechanism, but PR #4 also added a *static* `public/robots.txt` around the same time. Confirm only one is actually in effect � a static file in `public/` can silently take precedence over a dynamic route at the same path.
- SSL/timing/performance numbers produced *by a cloud sandbox* are not authoritative (proxied egress) � verify via a real browser / pagespeed.web.dev / ssllabs.com if precision matters.

**2026-07-30 (same-day correction):** The "npm audit clean" line above was accurate for PR #6 at merge time � but pushing the audit-log commit itself triggered a fresh GitHub Dependabot alert minutes later: 3 new high-severity advisories (2x brace-expansion DoS, 1x js-yaml quadratic-CPU), all disclosed *after* PR #6 merged, not missed by it. All three confirmed via GitHub's own dependency graph as Development-scoped -- zero risk to the deployed static site. `npm audit fix` (non-force) resolved 2 of 3, verified via a clean `eslint` + `next build` run before committing. The 3rd (brace-expansion GHSA-mh99-v99m-4gvg) is nested under minimatch -> ESLint's whole plugin chain and can only be closed by jumping ESLint 9->10 -- exactly the major bump this file already flags as needing a full QA pass first (see Security & performance above). Deliberately deferred, not missed; revisit alongside a dedicated ESLint 10 upgrade. Lesson: npm audit needs periodic rechecking, not a one-time box to check.

**2026-07-30 (ESLint 10 attempted and reverted):** Tried the deferred ESLint 9->10 bump on a branch. npm install succeeded, but npm run lint crashed immediately: eslint-config-next's own bundled eslint-plugin-react calls context.getFilename(), an API ESLint 10 removed (replaced by context.filename). Confirmed upstream incompatibility in eslint-config-next itself, not a local issue -- verified via a real lint run, not inferred. npm audit fix --force offered to fix the remaining brace-expansion finding by installing eslint-config-next@12.0.4, a major downgrade from the ^16.2.12 this project needs for Next 16 -- declined. Branch abandoned, package.json/package-lock.json restored, main unaffected. Do not retry until eslint-config-next publishes an ESLint-10-compatible release for Next 16 -- check https://www.npmjs.com/package/eslint-config-next before attempting again.
