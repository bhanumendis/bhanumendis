# FINAL WEBSITE AUDIT — bhanumendis.com

Audit date: 2026-09-21 · Auditor: Claude Code · Scope: full repository + live site (`https://bhanumendis.com`)
State of the work: **all fixes are in the working tree, uncommitted and undeployed.** Nothing was pushed.

---

## 1. Executive Summary

The site was already in good technical shape: static, edge-cached, zero-dependency motion, strong CSP, 0 axe violations on the homepage in dark mode, clean TypeScript. The audit still found **one critical dependency advisory, two real layout bugs, one feature silently broken in production, and a 335 KB favicon shipped to every visitor.** All of those are fixed. No content, copy, layout, colour, type, imagery, animation or navigation was changed.

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | `next@16.2.12` — 2 critical RCE advisories; `sharp`, `browserslist`, `js-yaml`, `baseline-browser-mapping` high/moderate | Critical | **Fixed** → `npm audit`: 0 |
| 2 | `app/favicon.ico` was a 625×625 **PNG renamed .ico — 335 KB**, served live on every first visit | High (perf) | **Fixed** → 14.7 KB real ICO |
| 3 | Markdown content negotiation returns HTML in production (works locally) | High (AI/SEO) | **Fixed in repo** — verify after deploy |
| 4 | 320 px: map card forces 27 px horizontal page overflow, dragging the fixed nav with it | High (mobile) | **Fixed** |
| 5 | Footer strip `width:100vw` → on desktop, keyboard focus / `scrollIntoView` shifts the whole page 5 px sideways, unrecoverable | Medium | **Fixed** |
| 6 | CSP blocks the Lyceum press-card favicon 3 times in 4 (Google shards `t0–t3`, only `t2` allowed) + console error | Medium | **Fixed** |
| 7 | Stat counters server-render as **"0+"** — what non-JS crawlers (ChatGPT-User, Claude-User, PerplexityBot…) and no-JS visitors read | Medium (SEO) | **Fixed** |
| 8 | `/timeline` skip link pointed to `/#hero` (left the page); years invisible to screen readers on desktop; Twitter card carried the homepage title | Medium (a11y/SEO) | **Fixed** |
| 9 | Gallery photo preloaded in `<head>` at high priority though it is thousands of px below the fold; 2 unused Poppins weights preloaded | Medium (perf) | **Fixed** |
| 10 | OG card says "Grades 6–8"; everything else says 5–8 | Low | **Superseded** — card redesigned, line removed |
| 11 | HSTS live is `max-age=7776000` (Cloudflare), not the `63072000; includeSubDomains; preload` the repo configures | Medium | **Hosting — needs you** |

Verification after the fixes: `tsc` clean · ESLint clean (was 340 errors) · `next build` OK on Next 16.3.5 · `npm audit` 0 · axe-core 0 violations on `/` (dark + light, 320/390/1440) · no horizontal overflow at any of 15 tested widths on either route.

---

## 2. Project Inventory

**Stack.** Next.js 16.3.5 (App Router, Turbopack) · React 19.2.7 · TypeScript 5.9 (strict) · hand-written CSS, no Tailwind/PostCSS config · no animation library · Node 24. Every route is prerendered static (`○`); the only dynamic piece is `proxy.ts`. Hosting: **Cloudflare (proxy/DNS) → Vercel**.

**Routes (8 prerendered).** `/` · `/timeline` · `/_not-found` · `/opengraph-image.jpg` · `/timeline/opengraph-image.jpg` · `/robots.txt` · `/sitemap.xml` · Proxy on `/` and `/timeline`.

**Source (`app/`, ~5,600 lines).**

| File | Role |
|---|---|
| `layout.tsx` | fonts, metadata, JSON-LD `@graph`, pre-paint boot script, global Footer/eggs/SmoothScroll/SpeedInsights |
| `page.tsx` | homepage (client component), 12 sections, hero pointer field, rail focus handler |
| `timeline/page.tsx` + `Timeline.tsx` | `/timeline` (server component), 13 events |
| `SiteChrome.tsx` + `NavIsland.tsx` | skip link, cursor, progress rail, side rails, floating nav, back-to-top |
| `Coverflow.tsx` | Memories carousel (code-split, SSR on) |
| `Counter`, `MagneticButton`, `FeaturedIn`, `LinkedInPosts` (facade), `Footer`, `SmoothScroll`, `EasterEgg`, `SwaraEgg`, `template.tsx` | components |
| `globals.css` (≈1,420 lines) · `motion.css` (≈860 lines) | the two stylesheets, one bundle |
| `robots.ts`, `sitemap.ts` · `opengraph-image.jpg` ×2 (+ `.alt.txt`, built by `scripts/og.mjs`) | SEO assets |

**Config.** `next.config.ts` (headers, CSP, image formats, caching) · `proxy.ts` · `tsconfig.json` · `eslint.config.mjs` · `package.json` (`overrides`: postcss, sharp) · `.gitignore` · `.claude/launch.json` (local only). No `.env*`, no manifest, no redirects/rewrites in config, no analytics beyond `@vercel/speed-insights` (+ Cloudflare Insights allowed in CSP).

**Dependencies (5 runtime, 6 dev).** `next`, `react`, `react-dom`, `sharp`, `@vercel/speed-insights` · `typescript`, `eslint`, `eslint-config-next`, `@types/*`.

**Fonts (`app/fonts/`, all woff2, self-hosted).** Raleway variable 47 KB + italic 49 KB · Poppins 400/500/600 (7.7 KB each; 300/700 on disk, no longer loaded) · Inconsolata variable 33 KB · Anton 18 KB · Noto Serif Sinhala 700/900 (34/31 KB; 400 on disk, not loaded).

**Public assets.** `hero-bg.jpg` 1280×853 65 KB · `favicon.png` 180² 9.5 KB · `favicon.ico` 14.7 KB · `apple-touch-icon.png` 5.5 KB · `portrait.jpg` 625² 33 KB (JSON-LD) · `Photos-1-001/*.jpg` ×15 (1023×1280, 207–377 KB each, 4.4 MB total, served via `/_next/image` as ~48 KB AVIF) · `dm-/st-favicon.avif` 5 KB · `swara.mp3` 10.7 MB (`preload="none"`, only on the easter egg) · `llms.txt`, `index.md`, `timeline.md`.
**Unreferenced:** `slides/slide-{1,5,8}.jpg` (437 KB), `bhanumendis.jpg` (66 KB), `og-image.jpg` (60 KB); repo-root `Photos-1-001/` is a byte-identical duplicate of `public/Photos-1-001/` (15/15 hashes match, 4.4 MB).

---

## 3. SEO Audit

### `/`
| Item | Result |
|---|---|
| `<title>` | `Bhanu Mendis` — valid, deliberately minimal (see §15) |
| Description | 157 chars ✓ |
| Canonical | `https://bhanumendis.com` ✓ |
| Robots meta | `index, follow`, `max-image-preview:large` ✓ |
| `lang` / viewport | `en` / `width=device-width, initial-scale=1` (zoom not disabled ✓) |
| Headings | one `<h1>`; `h2` per section; `h3` sub-headings ✓ |
| OG / Twitter | complete; image from file convention ✓ — **redesigned at the owner's request (2026-09-21):** static 1200×630 JPEG, 94 KB, name + roles + profile photo, face kept inside the centre square for WhatsApp's small-thumbnail fallback. `/timeline` has its own matching card (97 KB) |
| JSON-LD | `Person`, `WebSite`, `EducationalOrganization`, `Service`/`EducationalOccupationalProgram`, 2× `MusicGroup`, page-scoped `ProfilePage`; ids cross-linked ✓ |
| Body facts in raw HTML | **was "0+ Performers led / 0+ National awards / 0K+ …"; now 750+, 12+, 6+, 26K+, 14** |

### `/timeline`
| Item | Result |
|---|---|
| `<title>` | `Timeline — 14 Years of Awards & Leadership \| Bhanu Mendis` (absolute, no double brand) ✓ |
| Description | 159 chars ✓ · canonical `/timeline` ✓ · one `<h1>`, `h2` per event ✓ |
| Twitter card | **was the homepage's title + description; now the timeline's own** |
| `og:locale` | **was dropped by the object replace; restored** |

### Site-wide
- `robots.txt` (generated) — retrieval bots allowed, training scrapers disallowed, sitemap listed. Only one robots source exists (the old `public/robots.txt` concern in CLAUDE.md is resolved). `Host:` is a non-standard directive; harmless.
- `sitemap.xml` — 2 URLs ✓. `lastModified` is build time, so it moves on every deploy; acceptable, noted in §14.
- Favicon/touch icon ✓ · no web manifest (not required).
- Internal links: nav ↔ sections ↔ `/timeline` ↔ footer all resolve; all anchors exist (`#about #skills #exp #achieve #certs #contact #tutoring #findus`).
- **`llms.txt` rebuilt to the llms.txt convention** (it opened with two H1s): summary blockquote, link lists to the Markdown mirrors and page sections, press coverage, authorship/citation guidance, five new FAQ entries. No fact was added that is not already on the site. Both pages now advertise their mirror via `<link rel="alternate" type="text/markdown">`.
- **Authorship is now machine-readable:** JSON-LD `WebSite.author` / `creator` / `copyrightNotice`, `<meta name="copyright">`, `humans.txt`, a `LICENSE` (all rights reserved), `package.json` author, and a © header on every source file.
- **Markdown mirrors** brought back in sync: `timeline.md` was missing the 2026 (Maathra 15 / Group IT) and 2026–29 (BSc) entries; `index.md` lacked the BSc, graduation and Ranwala lines and the award years.

### Image SEO (every image)
| Image | Alt | Verdict |
|---|---|---|
| Hero background | `""` + `aria-hidden` | decorative treatment is valid; see §15 if you want it indexed as a portrait |
| About photo | `Bhanu Mendis — profile photo` | ✓ natural, name included once |
| 15 gallery collages | was `Memory N of 15` | **now `Memory N of 15: <three scenes>`** — described as seen (groups, stages, settings), no person identified, no name stuffing |
| 4 press logos | was `DM` / `ST` | **now `""`** — outlet name is the adjacent text and the card's aria-label |
| Map / LinkedIn iframes | `title` present ✓ | |

---

## 4. Performance Audit

**Live network (curl from Colombo, 3 runs, Cloudflare BOM edge):** DNS 9–13 ms · TCP 47–64 ms · TLS 113–136 ms · **TTFB 276–311 ms** · HTML 21.5 KB (zstd) · HTTP/2 · TLS 1.3 · Vercel cache HIT.

**Build output, homepage first load (measured from `.next`, Brotli-11):**

| | Before | After | Δ |
|---|---|---|---|
| JS (12 chunks) | 704.4 KB raw / **182.0 KB br** | 648.9 KB raw / **172.6 KB br** | −9.4 KB br |
| CSS (1 file, render-blocking) | 81.1 KB / 13.3 KB br | 77.2 KB / 13.0 KB br | −3.9 KB raw |
| HTML | 101.1 KB / 16.8 KB br | 100.3 KB / 16.8 KB br | — |
| Fonts **preloaded** (high priority) | 7 files, 134.6 KB | 5 files, 119.3 KB | −2 requests |
| Images preloaded in `<head>` | 2 (hero + a below-fold gallery photo) | 1 (hero) | −1 high-priority request |
| Favicon | **335.3 KB** | 14.7 KB | **−320.6 KB** |
| Own requests / bytes on first load (Lighthouse network log) | 30 / 670 KB | 27 / 594 KB | −76 KB (favicon not counted by Lighthouse; it is on top) |

**Web-font total on first load: ~236 KB** (Raleway ×2, Poppins ×3, Inconsolata, Anton, Sinhala ×2) — the largest remaining byte cost, larger than the JS. Options in §15.

**Core Web Vitals.**
- **CLS: 0.00–0.002.** The only shift recorded is the nav's action group moving ~1 px on a web-font swap.
- **LCP element:** the nav logo text. Chrome excludes the full-viewport hero image as a background and the `<h1>` fades in from `opacity:0`, so LCP ≈ FCP. Favourable, and unchanged.
- **INP:** not lab-measurable. By inspection: every pointer/scroll handler only records values and defers writes to one rAF; scroll listeners are `passive`; the rAF loops park themselves when idle.
- **Lab LCP/FCP/TBT: not reportable from this machine.** Lighthouse (mobile, headless Edge) scored 44 → 41, but **Kaspersky web protection injects 898 KB of render-blocking script + CSS into every page it loads** (`me.kis.v2.scr.kaspersky-labs.com`, 7 requests, larger than the site itself). Those numbers measure the antivirus, not the site. Lighthouse category scores that do not depend on it: **Accessibility 100 · Best Practices 96 · SEO 100.** Use https://pagespeed.web.dev for authoritative field/lab CWV after deploy.

**JavaScript.** No heavy dependency; ~19 KB br is page-specific, the rest is React + Next runtime. Removed: a per-scroll-frame parallax loop over `[data-par]` (no element has the attribute) and 55 redundant FFT buffer copies per frame in the Swara visualizer.
**CSS.** ~7 KB of rules matching nothing removed (retired full-width nav bar + hide-on-scroll state, the award-card grid replaced by the `.pal` ledger, the old slideshow, empty shells left by the rolled-back whiteboard/galaxy experiments). A stale `will-change:transform` on `#nav` that kept a viewport-wide compositor layer alive is gone with it.
**Images.** AVIF/WebP via `next/image` ✓, explicit dimensions or `fill` everywhere ✓ (no image CLS), lazy below the fold ✓, 31-day optimizer TTL ✓, immutable 1-year cache on static media ✓.

---

## 5. Security Audit

**Critical — fixed**
- `next` 16.2.12 → **16.3.5**: GHSA-p293-qw3h-jr36 (unauthenticated RCE on Windows-hosted servers) and GHSA-2xp9-vwfh-vxw4 (RCE in the Image Optimization API with AVIF — this site enables AVIF). Production runs on Vercel/Linux with Vercel's own optimizer, so exposure was limited, but the Windows advisory applied directly to `next start` on this dev machine.

**High — fixed**
- `sharp` 0.35.3 → 0.35.4 (libheif), `browserslist`, `js-yaml` (dev-only), `baseline-browser-mapping` (moderate). `npm audit fix` without `--force`; `package.json` floors raised so a fresh install cannot resolve back. `eslint-config-next` aligned to 16.3.5.

**Medium**
- **HSTS is weaker live than in the repo.** Live: `max-age=7776000`, no `includeSubDomains`, no `preload`. Cloudflare's HSTS setting overrides the origin header. The `preload` commitment documented in CLAUDE.md is not in effect. → §11.
- CSP keeps `'unsafe-inline'` for script and style. Documented, deliberate trade-off for a static export with no user-generated HTML; a nonce CSP would cost the static/edge model. Accepted.
- CSP `img-src` was mis-scoped (fixed): now `t0–t3.gstatic.com`. No other origin was added.

**Low**
- No CAA record; no null-MX / `v=spf1 -all` / DMARC `p=reject` on a domain that sends no mail (spoofable). → §11.
- `access-control-allow-origin: *` on HTML is Vercel's static default; there is no credentialed or private resource, so no impact.

**Informational**
- Repository + full git history scanned for keys, tokens, passwords, private keys, `.env*`, `.pem`: **none found.** No `NEXT_PUBLIC_*` or any env usage. No source maps in the build; `*.map` probes return 403 live.
- Headers verified live: CSP, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP, CORP, `X-XSS-Protection: 0`, no `X-Powered-By`. All external links carry `rel="noopener noreferrer"`. `dangerouslySetInnerHTML` is used only for static JSON-LD (with `<` escaped) and the boot script. No forms, no auth, no API routes, no redirects driven by input.
- One `http://` link (`bhanumendis.godaddysites.com`, Footer + `llms.txt`) → now `https://` (the host already 301s there).

---

## 6. Accessibility Audit (WCAG 2.2 AA-oriented, axe-core 4.12 + manual)

| Finding | WCAG | Status |
|---|---|---|
| `/timeline` skip link targeted `/#hero` — navigated away instead of skipping | 2.4.1 | **Fixed** — `#main` on both routes |
| Timeline years unavailable to AT on desktop (`.tl-year` `display:none`, ghost numeral `aria-hidden`) | 1.3.1 | **Fixed** — visually hidden, not removed |
| Awards `<table>` restyled `display:block/grid` ≤760 px, which strips table semantics | 1.3.1 | **Fixed** — explicit table/row/cell roles |
| Side rails outside any landmark; `aria-label` on role-less `<div>`s (×4) | 1.3.1 / 4.1.2 | **Fixed** — `<nav>`, `<aside>`, `role="group"` |
| `<span>` as a direct child of `<ul>` (nav indicator) — invalid HTML | 4.1.1 | **Fixed** — `<li aria-hidden>` |
| Carousel counter is `aria-live="polite"` while autoplaying (announces every 5 s) | 4.1.3 | **Fixed** — `off` during autoplay, `polite` when the user drives |
| Ledger header labels 3.80:1 in light theme (10 px text) | 1.4.3 | **Fixed** — 5.62:1 (opacity only, light theme only) |
| Swara dialog is `aria-modal` but never received focus, never returned it | 2.4.3 | **Fixed** |
| Logo link 13 px tall; gallery dots 7×7 px | 2.5.8 | Passed via spacing/equivalent-control exceptions; hit areas enlarged invisibly anyway |
| Press logos `alt="DM"` | 1.1.1 | **Fixed** → decorative |
| Decorative ghost years on `/timeline` fail axe contrast (3 nodes) | 1.4.3 | Exempt (pure decoration, `aria-hidden`); left as designed |
| Autoplaying carousel has no visible pause control (pauses on hover/focus only) | 2.2.2 | **Open — needs a UI decision**, §15 |
| Global right-click / drag suppression (`template.tsx`) | usability | **Open — behaviour decision**, §15 |

Confirmed good: visible `:focus-visible` rings, reduced-motion is a hard stop across both stylesheets and every rAF loop, `prefers-reduced-transparency` and `prefers-contrast` handled on the nav, mobile sheet closes on Esc and returns focus, hidden sheet links are `visibility:hidden` (not tabbable), no zoom lock, `lang="si"` on Sinhala text, iframes titled, LinkedIn facades are real labelled buttons.

**Result:** axe violations — `/` 1 → **0**; `/timeline` 3 → **1** (the exempt decorative one).

---

## 7. Responsive Audit

Method: Chromium device emulation (touch + mobile UA below 768 px), full-page scroll at each width, automated check for document overflow and any unclipped element leaving the viewport. Both routes.

| Viewport | `/` before | `/` after | `/timeline` |
|---|---|---|---|
| 320 | **FAIL** — document 347 px wide; map card + nav island overflow | PASS | PASS |
| 360 · 375 · 390 · 414 · 430 | PASS | PASS | PASS |
| 768 · 820 · 834 · 1024 | latent 5 px (strip) | PASS | PASS |
| 1280 · 1366 · 1440 · 1536 · 1920 | latent 5 px (strip) | PASS | PASS |

- **320 px root cause:** a grid item cannot shrink below min-content; `.map-info` = a `nowrap` button + 96 px side padding = 325 px. Fix is scoped to `≤340px` only, so 360/375/390 render exactly as before (verified: padding still `52px 48px` at 390).
- **Strip root cause:** `100vw` includes the scrollbar. Confirmed by reproducing `scrollX = 5.26` after `scrollIntoView` on the last cell; now `0`. The strip bleeds by cancelling the footer's own padding instead.
- Nav island height unchanged (50 px mobile / 55 px desktop) after the logo hit-area change. Rail, coverflow, pinned sections, sticky elements, the mobile sheet and the ≤760 px stacked ledger all behave as designed.
- Not covered: real Safari/iOS and Firefox. Both take the non-native-motion fallback path; that path was read, not executed, in this audit.

---

## 8. Interaction Audit

Every link target was requested; every control was exercised or read through.

| Interaction | Result |
|---|---|
| All 14 external destinations | 200 (LinkedIn answers 999 to any non-browser client — normal) |
| Photography link | was `http://` with a redirect hop → now direct `https://` |
| Nav, hero CTAs, footer nav, in-page anchors, back-to-top, theme toggles, show-more (mobile), carousel (buttons, dots, arrows/Home/End, drag), LinkedIn facades, `tel:`/`mailto:` | work; keyboard reachable; focus visible |
| Rail keyboard parity (focus → page scroll) | works |
| Footer icons for Facebook, YouTube, X, Telegram, TikTok (and the side-rail "Fb.") all opened **Linktree** | **Resolved 2026-09-21** — owner supplied the real profile URLs; each icon now opens its own network. Also added to JSON-LD `sameAs`, `llms.txt` and `index.md` |
| Right-click and drag are blocked site-wide | **Owner decision 2026-09-21: keep.** Trade-off noted (blocks "open in new tab", copy, translate, some assistive tools); not a defect |
| **Bug, fixed (reported by owner):** the nav did not follow the page — "Experience" never lit up on desktop and the mobile label sat on "Menu" through 8 of 12 sections | root cause: the scroll spy compared `intersectionRatio` to 0.08, but `#exp` is 6.2 viewports tall and tops out at 0.06. Replaced with a trigger-line observer over every section; each belongs to the nav item at or before it. Verified 12/12 sections on desktop and on mobile, in both scroll directions; `/timeline` now marks Timeline as current |
| **Bug, fixed:** wheel scrolling moved the page behind the open Swara dialog on desktop (`window.scrollTo` ignores `overflow:hidden`) | fixed |
| **Bug, fixed:** B+M egg could fire from a single key after alt-tabbing with a key held | fixed |
| **Bug, fixed:** Esc anywhere reset `body` overflow even when the Swara dialog was never opened | fixed |

Console: the only production-relevant error was the CSP-blocked favicon (fixed). `/_vercel/speed-insights/script.js` 404s locally by design; it exists only on Vercel.

---

## 9. Asset Audit

| Asset | Finding | Action |
|---|---|---|
| `app/favicon.ico` | PNG 625×625, 335 KB, wrong format for its extension; conflicted with `public/favicon.ico` (local served one, Vercel the other) | **Removed.** `public/favicon.ico` (16/32/48, same artwork — compared visually) is now the single source; 30-day cache header added |
| `public/{file,globe,next,vercel,window}.svg` | create-next-app scaffolding, never referenced | **Removed** (recoverable from git) |
| Poppins 300 / 700, Sinhala 400 | listed in `localFont`, never rendered — verified with `document.fonts` status after a full pass of both routes and overlays | **Dropped from `src`** (files kept). Stops two wasted high-priority preloads |
| `hero-bg.jpg` | source is only 1280 px wide; upscaled 1.3× at 1440, ~3× on a 1920 retina display | Needs a larger original → §15 |
| `favicon.png` as About photo | 180 px source shown at 110 px CSS — slightly soft at DPR ≥ 2 | §15 |
| Gallery JPEGs | 1023×1280, delivered as ~48 KB AVIF; `quality={82}` is silently coerced to 75 (Next 16 default `qualities:[75]`) | noted §14 |
| `swara.mp3` 10.7 MB | `preload="none"`, fetched only by the easter egg | OK |
| `slides/*`, `bhanumendis.jpg`, `og-image.jpg`, root `Photos-1-001/` | unreferenced / duplicate (≈5 MB in the repo, 0 bytes at runtime) | left in place — yours to delete, §14 |

---

## 10. Dependency Audit

| Package | Before | After | Note |
|---|---|---|---|
| next | 16.2.12 | **16.3.5** | 2 critical advisories; minor bump; build + runtime re-verified |
| sharp | 0.35.3 | **0.35.4** | high (libheif); override floor raised too |
| eslint-config-next | 16.2.10 | **16.3.5** | kept in step with Next |
| browserslist / js-yaml / baseline-browser-mapping | vulnerable | patched (transitive) | dev/build only |
| react, react-dom | 19.2.7 | 19.2.7 | 19.3.0 available; no security reason; not bumped |
| eslint 9 → 10, typescript 5 → 7, @types/node 20 → 26 | — | not bumped | majors; ESLint 10 previously broke `eslint-config-next` (see CLAUDE.md) |

No unused, duplicate or client-heavy dependencies. `npm audit`: **5 (1 critical, 3 high, 1 moderate) → 0.**
Tooling fixed: ESLint was linting `.claude/worktrees/**` (two full repo copies with their own `.next`), `_conflict_backups/` and `design-src/` — **340 errors / 8,366 warnings, of which exactly 1 error was real.** Those trees are now ignored by ESLint and excluded from `tsconfig`. The real error (`NavIsland.tsx`, `react-hooks/immutability`: a `useCallback` re-queuing itself before its own declaration) is fixed.

---

## 11. Hosting / Domain Audit

| Check | Result |
|---|---|
| HTTPS / cert | Google Trust Services WE1 via Cloudflare, SAN `bhanumendis.com` + `*.bhanumendis.com`, valid 2026-08-03 → **2026-11-01** (auto-renewing), chain verifies |
| Protocols | TLS 1.3, HTTP/2 (ALPN `h2`); minimum TLS version not verifiable from here — confirm ≥ 1.2 in Cloudflare |
| Redirects | `http://` → `https://` 301 (1 hop) · `www` → apex 308 (1 hop) · `http://www` → 2 hops (acceptable) |
| DNS | Cloudflare NS; A + AAAA (IPv4 + IPv6) ✓; **no CAA, no MX, no SPF, no DMARC** |
| Compression / caching | zstd/brotli ✓ · HTML `max-age=0, must-revalidate` + Vercel edge HIT ✓ · static media immutable 1 y ✓ |
| Search + social crawlers | Googlebot, Bingbot, facebookexternalhit, Twitterbot, LinkedInBot, WhatsApp → 200 |
| AI retrieval bots | OAI-SearchBot, ChatGPT-User, Claude-User, PerplexityBot → 200 ✓ |
| AI training scrapers | GPTBot, ClaudeBot → **403 at the edge** — consistent with the robots.txt policy; no legitimate crawler is blocked |
| `Accept: text/markdown` on `/` and `/timeline` | **returns HTML live** (expected Markdown). `/index.md` itself serves fine, so the proxy's self-fetch is what fails — it has to re-enter through Cloudflare. Replaced with an internal rewrite; verified locally on both routes |

**Cannot be fixed from the repository — do these in the dashboards:**
1. **Cloudflare → SSL/TLS → Edge Certificates → HSTS:** raise to `max-age` 12–24 months. Add `includeSubDomains` + `preload` only once every subdomain (`lms.` included) is HTTPS-only, then submit at hstspreload.org. Until then CLAUDE.md's claim is inaccurate.
2. DNS: add a CAA record for your issuers; add null MX (`0 .`), `TXT "v=spf1 -all"`, and `_dmarc TXT "v=DMARC1; p=reject"`.
3. After deploying: `curl -sI -H "Accept: text/markdown" https://bhanumendis.com/` must show `content-type: text/markdown`.

---

## 12. Bugs Fixed (file · issue · fix)

| File | Issue | Fix |
|---|---|---|
| `package.json`, `package-lock.json` | 5 advisories incl. 2 critical in `next` | `npm audit fix`; floors pinned |
| `app/favicon.ico` (deleted) | 335 KB PNG posing as ICO, route/public conflict | removed; `public/favicon.ico` serves |
| `next.config.ts` | CSP `img-src` allowed only `t2.gstatic.com` | `t0–t3`; `/favicon.ico` gets the 30-day cache rule |
| `proxy.ts` | Markdown negotiation dead in production | `NextResponse.rewrite` to the static mirror; no self-fetch |
| `app/Counter.tsx`, `app/layout.tsx`, `globals.css` | numbers server-rendered as `0` | final value in HTML; hidden pre-hydration via `data-js` (4 s failsafe); width locked during the count so neighbours no longer reflow |
| `app/globals.css` | 320 px overflow (map card) | `min-width:0` + tighter padding at `≤340px` only |
| `app/globals.css` | `100vw` strip → sideways page shift | negative-margin bleed |
| `app/globals.css` | ledger header contrast 3.80:1 (light) | `opacity:1` in light theme |
| `app/globals.css` | timeline years hidden from AT | visually-hidden at ≥901 px |
| `app/globals.css`, `app/motion.css` | ~7 KB dead rules, stale `will-change` layer | pruned |
| `app/SiteChrome.tsx`, `app/page.tsx`, `app/timeline/page.tsx` | skip link left `/timeline`; rails outside landmarks; dead parallax loop | `#main`; `<nav>`/`<aside>`; loop removed |
| `app/timeline/page.tsx` | Twitter card = homepage's; `og:locale` lost | own `twitter` block; locale restored |
| `app/page.tsx` | deprecated `priority`; table semantics lost on mobile; generic gallery alts | `preload`; explicit roles; descriptive alts |
| `app/Coverflow.tsx` | below-fold image preloaded; live region chatter | `priority` removed; `aria-live` off during autoplay |
| `app/NavIsland.tsx` | lint error (self-reference before declaration); `<span>` inside `<ul>`; stale eslint-disable | named function expression; `<li>`; removed |
| `app/Footer.tsx` | `aria-label` on role-less divs; `http://` link | `role="group"`; `https://` |
| `app/FeaturedIn.tsx` | logo alt = initials | `alt=""` |
| `app/SwaraEgg.tsx` | FFT copied 56×/frame; modal without focus handling; Esc side effect | hoisted; focus in/out; guarded |
| `app/SmoothScroll.tsx` | page scrolls behind the open dialog | respects the scroll lock |
| `app/EasterEgg.tsx` | stuck key after window blur | clear on `blur` |
| `app/opengraph-image.tsx` ×2 → `opengraph-image.jpg` ×2, `scripts/og.mjs` | thin default-face text card, no photo; cropped to "ANU MENDIS" in WhatsApp's square fallback | owner-approved redesign: static 94/97 KB JPEGs with the profile photo; old generators removed |
| `public/timeline.md`, `index.md`, `llms.txt` | mirrors out of date; `http://` | synced to the pages; `https://` |
| `eslint.config.mjs`, `tsconfig.json` | tooling crawled worktrees/backups | ignored/excluded |

---

## 13. Performance Improvements (measured)

| Metric | Before | After |
|---|---|---|
| Favicon transfer | 335.3 KB | 14.7 KB |
| High-priority `<head>` preloads | 9 (7 fonts + 2 images) | 6 (5 fonts + 1 image) |
| First-load JS (br) | 182.0 KB | 172.6 KB |
| CSS raw / br | 81.1 / 13.3 KB | 77.2 / 13.0 KB |
| Own first-load requests / bytes | 30 / 670 KB | 27 / 594 KB (+ favicon saving) |
| Font faces loaded but never used | 3 | 0 |
| Per-frame work removed | parallax loop on every scroll frame; 55 extra FFT copies/frame; one permanent compositor layer | — |
| CLS | 0 | 0–0.002 (font-swap, pre-existing) |
| Static routes | 9 | 8 |

Nothing measured got worse; no optimization was reverted.

---

## 14. Remaining Issues (not safely fixable here)

1. **HSTS at the edge, CAA, SPF/DMARC** — dashboard work (§11).
2. **Markdown negotiation** — fixed in code; must be confirmed on the live domain after deploy.
3. **Authoritative CWV numbers** — this machine's antivirus invalidates local Lighthouse. Run PageSpeed Insights post-deploy.
4. **Safari/iOS + Firefox** — not executed in this audit. They run the IntersectionObserver fallback; worth ten minutes on real devices before submission.
5. **Web fonts ≈ 236 KB on first load.** The two Sinhala files (65 KB) render three short strings; subsetting them to those glyphs would save ~60 KB, but needs visual QA of Sinhala conjunct shaping, and any new Sinhala text would silently fall back. Raleway Italic (49 KB) is preloaded yet first used below the fold; `next/font` cannot preload part of a family without splitting it, which risks synthesized italics.
6. `images.qualities` — gallery `quality={82}` is currently coerced to 75. Honouring it changes image bytes.
7. `page.tsx` is one client component; a server-component split would trim a few KB of JS for moderate risk. `/timeline` links are plain `<a>` (full reload) rather than `next/link`.
8. `sitemap.xml` `lastModified` = build time.
9. `#exp` rail: `--hs-count` defaults to 11 but there are 12 cards (pacing only; the last card still lands flush). CLAUDE.md says ten.
10. Unreferenced assets and the duplicate root `Photos-1-001/` (§9).
11. `.gitignore` still whitelists `public/galaxy.mp4`, which no longer exists.

---

## 15. REQUIRES APPROVAL (not implemented)

**Content / copy**
- Homepage `<title>` is just "Bhanu Mendis". A descriptive title is the single biggest on-page SEO lever left. Your documented choice — untouched.
- Footer reads "© 2025".
- **Facts that disagree across the site** (I did not pick a side): Malaysian World Choral — 2023 (ledger, `llms.txt`) vs 2024 (timeline) · British-Lanka Festival — 2022 vs 2024 (timeline) · voice/news training — "Institute of Media & Performing Arts" (experience card) vs "Institute of Professional Development" (timeline) · hero says "12+ National awards", the ledger lists 10 · Senior Head Prefect dated Sep 2023–Sep 2025 on the card vs "2024/2025" elsewhere (with Head Prefect 2023–24 in `llms.txt`).
- ~~Footer/side-rail social icons all open Linktree~~ — **resolved**: real URLs supplied and wired in.
- Hero image alt is empty (decorative). If you want it indexed as a portrait, supply the wording.

**Design / behaviour**
- A visible pause control for the autoplaying gallery (WCAG 2.2.2).
- ~~Removing the global right-click / drag block~~ — **decided: it stays.**
- `--hs-count: 12` (lengthens the pinned rail by 52vh).

**Imagery**
- A hero original ≥ 2560 px wide.
- Using `portrait.jpg` (625 px, same artwork) for the About photo for retina sharpness.

---

## 16. Final Award Readiness Checklist

- [x] **PASS** — Build, type-check, lint (0 errors, 0 warnings)
- [x] **PASS** — Dependencies & supply chain (`npm audit` 0)
- [x] **PASS WITH NOTES** — Security (repo is clean; HSTS/CAA/DMARC are dashboard items)
- [x] **PASS** — SEO technical (metadata, canonicals, structured data, robots, sitemap, mirrors)
- [ ] **REQUIRES APPROVAL** — SEO content (homepage title; conflicting dates)
- [x] **PASS WITH NOTES** — Performance (bytes and requests down, CLS ≈ 0; lab LCP/TBT unverifiable on this machine; fonts remain the heaviest cost)
- [x] **PASS WITH NOTES** — Accessibility (axe 0 on `/`; carousel pause control is the one open decision; the context-menu block stays by owner decision)
- [x] **PASS** — Responsive, 320 → 1920, both routes (Chromium)
- [ ] **PASS WITH NOTES** — Cross-browser (Safari/Firefox fallback path not executed)
- [x] **PASS** — Interactions (all functional; every social icon opens its own network)
- [x] **PASS** — Console (no production errors after the CSP fix)
- [x] **PASS WITH NOTES** — Crawler / AI access (correct policy; Markdown negotiation to be confirmed after deploy)
- [x] **PASS** — Hosting fundamentals (TLS 1.3, HTTP/2, IPv6, single-hop redirects, edge cache)
- [x] **PASS** — Identity preserved (no content, layout, colour, type, imagery or animation changed)

---

© 2025–2026 Bhanu Mendis · https://bhanumendis.com — All rights reserved. Designed, built and maintained by Bhanu Mendis.
