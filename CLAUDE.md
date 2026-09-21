@AGENTS.md

# bhanumendis.com — project guide

Personal portfolio for Bhanu Mendis. Next.js 16 (App Router) + React 19, TypeScript, plain hand-authored CSS (no Tailwind — two files, `app/globals.css` and `app/motion.css`, shipped as one bundle). Every route is prerendered static; deployed on Vercel behind Cloudflare.

## Architecture

- `app/layout.tsx` — root layout. Self-hosted fonts via `next/font/local` (files in `app/fonts/`): Raleway (display), Poppins (UI/body), Inconsolata (mono), Anton (impact: footer titles, the social strip, ledger years — not preloaded) and Noto Serif Sinhala (signature). Tab title is just `Bhanu Mendis`. Full SEO metadata, Open Graph/Twitter, and a JSON-LD `@graph` (Person + tutoring `Service`/`EducationalOccupationalProgram` + The Science Brainery + the Swara/Padura concerts). The inline pre-paint `bootInit` script removes the server-sent `dark` class for visitors who chose light, and stamps `data-js`, `data-motion` and `data-smooth` on `<html>`. Renders `<SmoothScroll/>`, the global `<Footer/>`, `<EasterEgg/>`, `<SwaraEgg/>` and Vercel `<SpeedInsights/>`.
- `app/page.tsx` — the home page. A **standard vertical-scroll** single page. The page background is **pure solid** (`#fff` light / `#000` dark) — there is no decorative backdrop layer. (The scroll engine, custom cursor and theme toggle are NOT here — they live in `SiteChrome`, because both routes need them.) Section content rises in with a 3D "Inception" reveal on desktop (`.reveal` → `.reveal.in`); **on mobile the reveal is a single lightweight 2D fade with no stagger** (the 3D version double-painted on mobile GPUs). Two sections use an Apple-style pinned-scroll effect — a `position:sticky` background word that stays fixed while content scrolls over it: `#ethos` ("LEARN") and `#exp` ("WORK", `.exp-pin-bg`). Hero pointer field on desktop. `prefers-reduced-motion` gets a calm, static layout. `<main id="main">` is the skip-link target on both routes.
  - Sections, in order: hero, about, **tutoring**, ethos (pinned), skills, press (`FeaturedIn`), exp (**pinned horizontal rail** — see "The pinned horizontal rail" below), linkedin (facade), photos (the Memories coverflow), achieve (the `.pal` awards ledger, with `#certs` — education & qualifications — inside it), contact, findus (map, holds the single "Register for Classes" CTA). The footer is the global one from `layout.tsx` (shown on every page).
  - Theme toggle: the desktop `.sidebar-left` toggle is hidden on mobile; the `.ni-theme` button inside the nav island takes over below 901px.
- `app/SiteChrome.tsx` — **the one nav, and everything around it.** Skip link,
  custom cursor, scroll progress rail, both sidebars, nav and back-to-top, plus
  the behaviour behind them (theme toggle, scroll engine, cursor context). Both
  routes render it. It exists because `/timeline` used to hand-roll its own
  stripped four-link nav and had none of the rest — no cursor, no progress rail,
  no theme toggle, no back-to-top — which made it read as a different website
  bolted on. The `home` prop is the only per-route difference: it decides
  whether the nav anchors are in-page fragments or have to travel home first.
  **Do not re-add a nav to a route.** Render `<SiteChrome />`. The two side
  rails are real landmarks (`<nav>` social links, `<aside>` theme).
- `app/NavIsland.tsx` — the floating, permanently visible nav pill that
  `SiteChrome` renders: spring-driven sliding indicator, dock magnification,
  the mobile sheet, and the scroll spy (see Conventions — it is a trigger
  LINE, not an intersection ratio). The indicator returns to the current item
  when the pointer leaves the rail.
- `app/timeline/page.tsx` + `app/Timeline.tsx` — a separate vertical `/timeline`
  route, fully scroll-animated (see "The timeline" below).
- Components: `Counter` (dependency-free rAF count-up — no animation library), `MagneticButton` (amplified pull + label lag + cursor sheen), `Coverflow` (the Memories carousel — see below), `FeaturedIn` (press cards), `Footer`, `EasterEgg` (hold B+M), `SwaraEgg` (type `swara` → the Swara theme song at `public/swara.mp3` plays behind a themed overlay titled ස්වර with a live Web-Audio canvas visualizer; click-away / Esc / track-end closes it).
- `app/opengraph-image.jpg` + `app/timeline/opengraph-image.jpg` (each with an
  `.alt.txt`) — the link-preview cards WhatsApp, Telegram, iMessage, LinkedIn
  and X show. **Committed static JPEGs**, rendered by `node scripts/og.mjs`
  (sharp only, no new dependency): name in two heavy lines, roles, and the
  `public/portrait.jpg` cut-out on the dark stage. They replaced the old
  `next/og` routes because (a) the card now carries a photograph, which as PNG
  — all `ImageResponse` can emit — is ~450 KB, and WhatsApp drops preview
  images much past 300 KB (the JPEGs are ~95 KB); (b) Satori cannot read woff2
  and has no bold without a font file. The face is kept inside the centre 630px
  square so WhatsApp's small square fallback still shows it. The type is Segoe
  UI Black / Bahnschrift — Windows system fonts, because sharp's text renderer
  silently substitutes when asked for the site's woff2 files. **Owner-approved
  design (2026-09-21); re-run the script only on Windows and look at the output
  — the committed JPEGs are the source of truth.** `layout.tsx` deliberately
  sets **no** `openGraph.images` / `twitter.images` — an explicit entry there
  would override the file convention and put the homepage card on `/timeline`.
  (`public/og-image.jpg` is unreferenced.) Chat apps cache previews hard: after
  a deploy, test with a fresh URL such as `https://bhanumendis.com/?v=2`.
- `app/robots.ts`, `app/sitemap.ts` — generated robots.txt and sitemap.xml. `public/llms.txt` — AI-crawler profile.
- `proxy.ts` (Next 16's renamed Middleware) — **content negotiation**: requests with `Accept: text/markdown` for `/` or `/timeline` get the clean Markdown mirrors in `public/index.md` / `public/timeline.md`; browsers get HTML. Responses carry `Vary: Accept`. Keep the mirrors in sync when portfolio facts change. **It is a `NextResponse.rewrite`, not a fetch, and must stay one:** the earlier self-`fetch()` of the public URL worked on localhost and silently returned HTML in production, because the request had to leave Vercel and re-enter through Cloudflare. Check after any deploy: `curl -sI -H "Accept: text/markdown" https://bhanumendis.com/` must answer `text/markdown`.
- **Favicon:** `public/favicon.ico` (real 16/32/48 ICO, 15 KB) is the only one. Do not add `app/favicon.ico` back — the old one was a 335 KB PNG with an .ico extension that Vercel served to every visitor, and it collided with the public file.
- **`Counter` server-renders the FINAL number**, never "0". `bootInit` stamps `data-js` on `<html>` and `globals.css` hides `.ctr` until the component resets it and sets `data-live` (4 s CSS failsafe). Crawlers without JS, no-JS visitors and screen readers therefore read 750+, not 0+.
- **Fonts listed in `localFont({src})` are ALL preloaded** when `preload: true`. Only list weights a rule actually uses (Poppins 400/500/600; Sinhala 700/900). Verify with `[...document.fonts].map(f => f.status)` after scrolling the page — `unloaded` means dead weight.

## Motion system (`app/motion.css`) — "Signal"

Scroll is treated as a **playhead** (the audio-engineering motif), not a one-shot trigger.

- **Native scroll-linked.** Every reveal, stagger, parallax drift and the top progress rail runs off
  the CSS `animation-timeline` property (`view()` for elements, `scroll(root)` for the rail). That
  executes on the compositor — **0 KB of JS and no main-thread work.**
- **The feature flag.** The pre-paint `bootInit` script in `layout.tsx` stamps `data-motion="native"`
  on `<html>` when `CSS.supports('animation-timeline','view()')`. Every scroll-driven rule in
  `motion.css` is keyed off that attribute **and** wrapped in `@supports` + `prefers-reduced-motion:
  no-preference`.
- **The fallback.** When the flag is absent, `SiteChrome.tsx` runs the original IntersectionObserver and
  `.reveal.in` behaves exactly as before. The observer is **skipped entirely** when the flag is
  present — never run both, that was the point.
- **If JS never runs at all**, `data-motion` is never set, no scroll animation applies, and
  `.reveal{opacity:1}` from `globals.css` keeps everything visible. Content is never gated on motion.
- **Utility classes:** `.m-display` (headings, rise + focus-pull unblur), `.stagger > *` (siblings
  enter across offset scroll ranges — the scroll-timeline equivalent of a time-based stagger; time
  delays are meaningless on a scroll timeline), `.m-drift` / `.m-drift-slow` (parallax),
  `.m-settle`, `.m-draw`, `.m-lift`, `.m-wipe`, `.m-shimmer`.
- **Reduced motion is a hard stop** — a dedicated block nulls every animation, hides the progress
  rail and disables `scroll-behavior: smooth`.
- House easing stays `cubic-bezier(.16,1,.3,1)`. **No animation library** — that rule still holds;
  anime.js / Motion were consulted for motion vocabulary only, never added as dependencies. Lenis
  was likewise declined: `app/SmoothScroll.tsx` does the same job in ~1.5 KB (see "Scroll motion
  v3"), and crucially eases the real scroll offset so the native timelines keep driving.

### Scroll motion v3 (appended block in `app/motion.css`)

Appended after the "Signal" system for the same reason the visual-system block is
appended to `globals.css`: it layers over the base rules without editing them, so
every fallback path stays intact. Still **zero dependencies** — the brief that
produced it asked for Tailwind + Framer Motion + Lenis and all three were declined
in favour of what the platform already does natively.

- **Smooth scroll without Lenis** (`app/SmoothScroll.tsx`, ~1.5 KB, mounted in
  `layout.tsx`). A rAF loop that eases `window.scrollY` itself. It must ease the
  **real** scroll offset, never a transformed wrapper — `scroll()` and `view()`
  timelines read the document's own offset, so a transform-based smoother would
  silently freeze the entire motion system. The loop stops itself when it lands
  (an idle page costs nothing) and stands down on `pointerdown`/`keydown` so
  anchor jumps, the back-to-top button and keyboard scrolling all stay native.
  It runs only when the pre-paint script stamps `data-smooth="on"`: fine pointer,
  ≥901px, no reduced-motion preference. Touch devices keep their own momentum —
  hijacking it there reads as lag.
- **`html[data-smooth="on"]{scroll-behavior:auto}`** is the handshake. Native
  smooth scrolling and the rAF loop would otherwise ease the same value twice.
  Scripted scrolls that pass `behavior:"smooth"` explicitly are unaffected.
- **Hide-on-scroll nav — RETIRED.** The nav is now the permanently visible
  island (`NavIsland.tsx`); nothing sets `.nav-hide`, and its CSS (including a
  stale `will-change:transform` that kept a viewport-wide layer alive) was
  removed on 2026-09-21. Do not bring it back.
- **Clip-path reveals.** `.m-clip` / `.m-clip-rev` wipe from the leading edge,
  `.m-curtain` lifts a panel open from its bottom edge. Wired to the `#ethos`
  philosophy lines (which had no motion of their own) and `.map-embed`.
- **The hero cascade** is the one time-based animation in the system, and
  deliberately so: the hero is already on screen at load, so there is no scroll
  range to scrub. Everything else on the page uses scroll ranges, because time
  delays are meaningless on a scroll timeline.
- **`sectionRelease`** dims and lifts a section's `.sw` as it exits (to .38 /
  −34px). Shallow on purpose — enough to layer neighbouring sections, never
  enough to make a half-scrolled section hard to read.
- **Backdrop words are capped.** `wordScrub` resolves to **.34**, not 1. The
  `#ethos` copy sits directly on a 460px letterform and at full opacity the two
  competed. `#exp` caps harder still (`wordScrubRail`, **.26**) because the rail
  holds the word on screen for thousands of pixels rather than an instant.

### The pinned horizontal rail (`#exp`)

"Projects Led" is a **pinned horizontal scroll** on desktop and the same vertical
stack as before everywhere else.

- Structure: `.hscroll` (tall, publishes the `--exphs` view timeline) → sticky
  `.hscroll-sticky` (one viewport) → `.hscroll-head` + `.hscroll-rail` →
  `.hscroll-track` (the flex row that translates).
- **Why `contain` is the right range:** for a subject taller than the scrollport,
  `contain 0% → 100%` runs from "subject top at scrollport top" to "subject bottom
  at scrollport bottom" — exactly the interval the sticky child stays pinned. So
  the horizontal travel is scrubbed one-to-one with the pin, on the compositor,
  with **no JavaScript and no measuring**.
- **No measuring, either:** `railTravel` ends at `translate3d(calc(100vw - 100%),0,0)`.
  `100%` is the track's own width, so the last card lands flush at the viewport's
  right edge whatever the card count is.
- **The scroll budget** is `calc(100vh + (var(--hs-count, 11) - 1) * 52vh)`.
  `--hs-count` is now a **constant in CSS**, not an inline style tracking React
  state: the show-more button is gone from the rail and all **twelve** cards
  are always present. The default is still `11`, so the pin is one slice
  (52vh) shorter than "a slice per card" — pacing only: `railTravel` lands the
  last card flush whatever the count. The slice dropped 62vh → 52vh because
  the old pacing overstayed.
- **Show more is a mobile-only affordance now.** Desktop (≥901px) hides the
  button and shows all twelve cards on the rail. Below 901px the vertical stack
  keeps its collapse — `.hscroll[data-collapsed="true"] .ecard:nth-of-type(n+6)`
  — so mobile does not become a twelve-card wall. All twelve are always in the DOM
  either way, which is also what keeps them indexable.
- **The `focusin` handler filters to `.ecard`.** The button is still a track
  child on mobile, and counting it would skew the index-to-offset maths.
- **Keyboard parity is handled in JS, and has to be.** The rail is `overflow:clip`
  (chosen over `hidden` precisely because clip cannot become a scroll container),
  so the browser has nothing to scroll a focused card into view *with*. A
  `focusin` handler in `page.tsx` converts the card's index back into the page
  offset that parks it on screen and scrolls the document there — the same input
  the CSS timeline is reading. It no-ops unless `.hscroll-sticky` is actually
  `position:sticky`, so every fallback keeps native focus scrolling.
- Rail cards get a near-opaque ground (`color-mix` over `--bg`). The base
  `.ecard` glass is a 6% wash, which over a giant letterform reads as
  text-on-text.
- Fallback: below 901px, without `animation-timeline` support, or under
  reduced motion, none of the above applies and the section is the plain
  vertical stack it always was.

### The hero pointer field (repel)

The hero lines are pushed **away** from the cursor — a like-pole magnet, not
the attract that `MagneticButton` does.

- **Nothing is written from the pointer event.** `onMouseMove` records
  coordinates and nothing else; every style write happens once per frame in
  the rAF loop. The previous version wrote a transform and a text-shadow
  inline on each move event, which on a high-polling mouse is several style
  recalcs per frame — that was the source of the unsteadiness, not the maths.
- **It writes `--hx` / `--hy`, never `transform`, and it has to.** The hero
  cascade is `animation:heroEnter .95s ... both`, and a filled animation
  permanently outranks an inline style — an inline transform would be
  silently dead on every browser with native motion. `heroEnter`'s `to`
  keyframe consumes those two custom properties instead, so the entrance and
  the field compose. `globals.css` applies the same two properties directly
  for the no-native-motion fallback.
- **Falloff is quadratic** over a 460px radius, and each line has its own
  ceiling (h1 10px, stats 26px). Equal ceilings read as one wobbling block;
  unequal ones read as depth.
- **Centres are measured by walking `offsetParent`, not `getBoundingClientRect`.**
  Offsets are layout positions, so they are immune both to the field's own
  displacement (a rect would feed the offset back into the centre it is
  measuring) and to the entrance cascade, which at mount still has every line
  translated 26px down. Measured on mount and resize only — never per frame.
- **The loop parks itself** once everything has landed, like `SmoothScroll`.
- `.hero-glow` is the ambient light: a composited layer moved by `transform`,
  deliberately not a repainting radial-gradient on a full-bleed element.
- Reduced motion or a coarse pointer builds an empty field and skips it all.

### Memories is a coverflow (`app/Coverflow.tsx`)

Replaced the old flat `PhotoSlideshow`. Three slides read as visible; a
further pair is mounted at `opacity:0` purely so a drag never has to mount a
card mid-gesture, which pops.

- **Drag is Pointer Events, not a physics library.** The finger drives exactly
  one custom property (`--dragx`), written imperatively on the stage, so a
  gesture causes **no React re-render at all**. Scale/rotate/opacity stay keyed
  to the discrete `data-depth`, so releasing the pointer is just an index
  change — and the snap is a plain CSS transition on the house easing, running
  on the compositor with no spring loop in JS.
- **`is-dragging` is toggled with `classList`, not React state.** Via state it
  landed a frame after the first `--dragx` write, so the opening pixels of
  every drag eased instead of tracking. The JSX `className` is a constant, so
  React never reconciles the class away.
- `touch-action:pan-y` keeps vertical page scroll native on mobile; `.cf` is
  `overflow-x:clip` so the overhanging flanks never create a page scrollbar.
- Autoplay (5s) yields to hover, focus-within and drag. Keyboard: arrows plus
  Home/End. Only the centre slide is exposed to assistive tech (`aria-hidden`
  + `inert` on the rest). The indicator is `aria-live="polite"` only while the
  visitor is driving (hover, focus, drag, reduced motion) and `off` during
  autoplay — otherwise it reads "2 / 15… 3 / 15…" over everything every 5s.
- Each file is a three-photo collage; its alt text (in `page.tsx`) lists the
  three scenes as seen, never who is in them. No `preload` on any slide: the
  section is thousands of pixels below the fold.
- Loaded through `next/dynamic` with **SSR left on** — it is below the fold so
  it earns its own chunk, but the markup must still exist without JavaScript.
  `.cf-skeleton` mirrors the stage height exactly, so the swap costs no CLS.

### The context-aware cursor

The ring becomes an affordance over specific surfaces: drag over the coverflow,
a play triangle over the LinkedIn facades, a pin over the map, an arrow over
anything leaving the site.

- **One delegated `pointerover` on the document**, not per-element listeners —
  the coverflow mounts and unmounts its slides as you drag, so anything bound
  per element would go stale on every index change.
- **Targets declare `data-cursor`; state is written to `data-cursor-ctx`.**
  These two names must stay different. `closest()` walks up to `<body>`, so if
  the state lived under the same attribute name the targets use, body would
  match its own marker and every element on the page would inherit the last
  context forever. That bug was real, not theoretical.
- Icons are drawn with **borders on the ring's pseudo-elements** — no image and
  no `data:` URI, so none of it touches the CSP.
- **A cross-origin iframe swallows pointer events**, so the map pin shows on
  approach and around the frame; inside it the OS cursor takes over. This is a
  platform limit, not something to "fix".

### The timeline (`/timeline`)

Was the least animated page on the site: `tlFadeIn` is a TIME ladder, so all
thirteen items finished animating within a second of load and everything below
the fold had already played before you reached it. It now runs five
scroll-driven layers, all in the appended block at the end of `motion.css`.

- **Pads float** — `tlDrift` on `.tl-item`, `--drift` set per card so they move
  at different rates rather than as one slab. The entrance (`tlPadEnter`) lives
  on `.tl-card`, one level down, because **an element cannot run two transform
  animations off two different timelines**.
- **The spine draws itself** — `.tl-wrap` publishes `--tlspine`; `.tl-line-fill`
  scrubs over the static gradient, which stays as the fallback.
- **Dots ignite** on `scale`, the INDEPENDENT transform property. Not
  `transform`: the dots already carry a side-specific `translateX(±50%)` that
  centres them on the spine, and animating `transform` would overwrite it and
  knock every dot out of alignment.
- **Ghost years** fill the empty half of each row (the layout is 50/50, so one
  half is always free) and hand off as you scroll. Because the ghost carries the
  year on desktop, `.tl-year` inside the card is **visually hidden** there — two
  copies of "2011" per row was the bug. It must not be `display:none`: the
  ghost is `aria-hidden`, so that left screen readers with no dates at all. Below 900px it inverts: single column,
  no empty half, ghost hidden, `.tl-year` shown.
- **`--d` carries the fallback stagger, not an inline `animationDelay`.** An
  inline delay outranks the stylesheet and would leak a time offset onto a
  scroll-driven animation, where it is meaningless.

## LinkedIn embeds are behind a facade

`app/LinkedInPosts.tsx` renders keyboard-accessible placeholder buttons that reserve the exact
iframe height (540px, so no CLS). The three LinkedIn iframes — and all their third-party JS and
cookies — load **only on click**. Do not revert to mounting them eagerly; `loading="lazy"` is not
sufficient, it only defers until the viewport approaches.

## Visual system v2 (appended block in `app/globals.css`)

Appended at the end of the stylesheet **on purpose** so it wins the cascade without editing the
base rules in place. Everything is expressed through `:root` tokens — no hardcoded theme colours.

- **One accent: the house blue.** An amber second accent for `#achieve` was trialled and
  **rejected by the owner** — there is no `--amber` token, and nothing should reintroduce one.
- **Awards are a ledger, not cards.** `#achieve` holds the `.pal` table (year · competition ·
  result · field), most recent first. The old `.acard` / `.agrid` / `.amed` card grid and its CSS
  are deleted. The table carries explicit ARIA table roles because it becomes `display:grid` below
  760px, which would otherwise drop its table semantics. In the light theme its 10px header labels
  run at full opacity: at the dark theme's .8 they measured 3.80:1 on `--surface-alt` (need 4.5:1).
- **Depth.** `body::before` is a fixed film-grain layer at `z-index:0` (behind `main`, which is
  `z-index:1`) so it textures the ground and never blends over text. `#hero::before` carries one
  soft `--atmos` radial wash. Measured cost: **0 long tasks and no wall-time difference** with the
  layer on vs off, verified over a full scroll pass.
- **Section rhythm.** `#tutoring` and `#achieve` sit on `--surface-alt` — deliberately
  near-imperceptible. `#certs` is a `div` inside `#achieve`, not a sibling section, so there is no
  banding seam.
- **Card hierarchy.** `.subj-card` gets a hairline gradient rule that wipes in on hover
  (`scaleX` on a pseudo-element — no layout, no extra border).

## One progress bar, not two

`#prog` (in `SiteChrome.tsx`; `aria-hidden`, purely visual) is the **only** scroll indicator. When
`data-motion="native"` is set, `motion.css` drives it via `scaleX` off a `scroll(root block)`
timeline and `SiteChrome.tsx` **skips the JS width write** — otherwise the two fight and re-introduce a
per-frame layout cost. A second standalone rail was briefly added during the redesign and removed.

## Theme system

- **Dark is the default** (pure `#000` background + cyan accents). **Light is opt-out** (clean, professional — pure `#fff`). Backgrounds are intentionally pure/solid; card surfaces carry a faint tint + border so they stay legible against them.
- The tokens did NOT move: `:root` still holds the light values and `:root.dark` still overrides them. What changed is who applies the class. `<html>` now ships `class="dark"` **from the server**, and the pre-paint `bootInit` script REMOVES it when `localStorage['bm-theme'] === 'light'`. Adding-on-load would flash white for every first-time visitor; removing-on-load flashes for nobody. `SiteChrome.tsx` seeds `useState(true)` to match the server render.
- Tokens live on `:root` (light) with `:root.dark` overrides. The theme class lives on `<html>` (documentElement). Reuse the CSS variables (`--bg`, `--sky`, `--card-bg`, `--glass`, etc.) — never hardcode theme colours.
- The choice is persisted to `localStorage` (`bm-theme`) and re-applied pre-paint by the inline script in `layout.tsx`. `app/SiteChrome.tsx` toggles the class + storage.
- `viewport.themeColor` leads with the dark ground for the same reason; the bare entry is what browsers that ignore the media variants use.

## Conventions

- Two stylesheets, one bundle: `app/globals.css` (tokens, layout, components) and `app/motion.css` (scroll-driven motion). Fixes are **appended** as a labelled block rather than edited into the base rules, so every fallback path stays intact — the latest is "AUDIT FIXES · 2026-09" at the end of `globals.css`.
- **Never size a full-bleed element with `100vw`** — it includes the scrollbar. Cancel the parent's padding with negative margins instead (see `.foot-strip`).
- Interactive JS lives in client components (`"use client"`).
- Content is visible by default; `.reveal` is a one-shot entrance animation, never a visibility gate. If JS never runs, everything still shows.
- Accessibility: skip link, visible `:focus-visible` rings, and `prefers-reduced-motion` (which disables parallax + reveals) are all honored.
- **Every source file opens with the `© 2025–2026 Bhanu Mendis` header** (above `"use client"` where there is one — comments may precede a directive). New files get it too. Ownership is also stated in `LICENSE` (all rights reserved; third-party code and the OFL fonts excluded), `package.json` (`author`, `license: UNLICENSED`), the JSON-LD `WebSite` node (`author`/`creator`/`copyrightNotice`), `<meta name="copyright">`, `public/humans.txt` and `public/llms.txt`. Minifiers strip the headers, so none of this ships in a bundle.
- **The nav's scroll spy (`NavIsland.tsx`) is a LINE, not a ratio.** The observer's root is collapsed to a line 35% down the viewport and a section is current while it spans it. Do not go back to `intersectionRatio`: it is measured against the target's height, and the 6.2-viewport `#exp` rail could never reach the old 0.08 threshold, so "Experience" never lit up. Every `main > section[id]` is observed and belongs to the nav item at or before it (Tutoring→About, Memories→Experience, Find Us→Contact); on `/timeline` the current item is Timeline.

## Security & performance

Threat model: this is a **fully static site** — no backend, no database, no auth, no server-side forms. So SQLi / CSRF / auth-hardening are not applicable, and rate-limiting / DDoS / bot-protection are handled at the edge by Vercel + Cloudflare, not in app code. The real surface is response headers, CSP, and dependency hygiene.

Security headers + CSP live in `next.config.ts` (applied to `/(.*)`):

- **HSTS** — the repo sends `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, **but that is not what visitors receive.** Cloudflare's own HSTS setting overrides it: live on 2026-09-21 was `max-age=7776000` with no `includeSubDomains` and no `preload`. Fixing it is a Cloudflare dashboard change (pending — see the audit log). Do not submit to hstspreload.org until the live header really carries `preload`.
- **CSP** — `default-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'` (with `X-Frame-Options: DENY`); `worker-src 'self' blob:`; `manifest-src 'self'`. `frame-src` must list every embedded iframe origin (LinkedIn posts + Google Maps). `img-src` lists `t0`–`t3.gstatic.com`, all four: the press-card favicon fallback (`google.com/s2/favicons`) redirects to a load-balanced shard, so listing one blocked it three times in four. `form-action` allows the Google Forms registration target.
- `script-src` and `style-src` keep `'unsafe-inline'` **on purpose**: a statically-exported Next app ships framework bootstrap/hydration inline scripts (and the pre-paint theme script), and the cursor/parallax/ripple/magnetic effects set inline `style` at runtime. There is no untrusted/user-generated HTML anywhere on the site, so the injection surface is effectively nil. A nonce-based strict CSP would require per-request middleware (dynamic rendering) — not worth trading the static/edge-cached model for.
- `X-XSS-Protection: 0` — the legacy filter is deprecated and can create its own issues (OWASP guidance); the CSP is the real protection.
- Other headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo/browsing-topics denied), `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`. Do **not** add COEP — it would break the cross-origin LinkedIn/Maps iframes.

The `hiroshmendis.com` past-papers link is a plain anchor (no CSP entry needed).

Dependencies: keep `npm audit` at **0 vulnerabilities**. Tailwind/PostCSS were removed (the CSS is hand-authored with no Tailwind directives, so they were dead weight + supply-chain risk); there is no `postcss.config.mjs`. A `package.json` `overrides` pins `postcss` to a patched version inside Next's tree. Prefer patch/minor bumps; avoid major bumps (eslint 10, typescript 6) without a full build+QA pass.

Performance: fonts self-hosted (`font-src 'self'`, preloaded); images AVIF/WebP via `next/image`; long-lived immutable caching for static media in `next.config.ts`; `dns-prefetch` hints in `layout.tsx` warm up the embed origins; `compress: true`, `poweredByHeader: false`. **No animation library** — `framer-motion` was removed (it was used only by `Counter`, now a ~40-line rAF loop), which cut a large transitive dependency tree and mobile JS bootup. Measured 2026-09-21: first-load JS 172.6 KB br, CSS 13.0 KB br, fonts ~236 KB (the heaviest cost), CLS ≈ 0; Lighthouse accessibility 100, best-practices 96, SEO 100; axe-core 0 violations on `/` in both themes. **Lighthouse PERFORMANCE numbers from this machine are invalid** (Kaspersky injects ~900 KB into every page headless Edge loads) — use pagespeed.web.dev. Keep it static and edge-cached.

## Gotchas

- This repo lives on a cloud-synced (OneDrive) path; some editors inject stray NUL bytes / truncate on save. After any write, verify the file decodes as clean UTF-8 and ends correctly.
- Maps are embedded as iframes (not Leaflet). Keep any new embedded origin in the CSP `frame-src`.
- Google Fonts is not required at build time anymore — fonts are vendored in `app/fonts/`. Don't reintroduce a `next/font/google` build dependency.

## Audit log

**2026-07-30 — Security & performance audit (Claude/Cowork):**
- Dependency vulnerabilities fixed and merged (PR #6, `fix/portfolio-dependency-vulnerabilities`) — confirmed live, `npm audit` clean.
- README accuracy fix, Student Portal nav link, magnetic CTA, nav button sizing, mobile theme-toggle position, and the robots.txt policy all merged via PR #4 (`fix/readme-project-accuracy`) — confirmed live on `origin/main` and in production.
- Structural performance check via curl (no live-browser Lighthouse available this session): Brotli compression confirmed active, static asset caching confirmed `Cache-Control: public, max-age=31536000, immutable` (gold standard), `next/image` responsive optimization confirmed, code-splitting confirmed via `_next/static/chunks/*.js`.
- Local clone was several commits behind `origin/main` (both PRs above were merged via the GitHub web UI without a local pull) — fast-forwarded clean, no conflicts. The now-merged `fix/readme-project-accuracy` branch was deleted locally.
- **Worth a 2-minute check next session**: this file documents `app/robots.ts` as the robots.txt mechanism, but PR #4 also added a *static* `public/robots.txt` around the same time. Confirm only one is actually in effect — a static file in `public/` can silently take precedence over a dynamic route at the same path.
- SSL/timing/performance numbers produced *by a cloud sandbox* are not authoritative (proxied egress) — verify via a real browser / pagespeed.web.dev / ssllabs.com if precision matters.

**2026-07-30 (same-day correction):** The "npm audit clean" line above was accurate for PR #6 at merge time — but pushing the audit-log commit itself triggered a fresh GitHub Dependabot alert minutes later: 3 new high-severity advisories (2x brace-expansion DoS, 1x js-yaml quadratic-CPU), all disclosed *after* PR #6 merged, not missed by it. All three confirmed via GitHub's own dependency graph as Development-scoped -- zero risk to the deployed static site. `npm audit fix` (non-force) resolved 2 of 3, verified via a clean `eslint` + `next build` run before committing. The 3rd (brace-expansion GHSA-mh99-v99m-4gvg) is nested under minimatch -> ESLint's whole plugin chain and can only be closed by jumping ESLint 9->10 -- exactly the major bump this file already flags as needing a full QA pass first (see Security & performance above). Deliberately deferred, not missed; revisit alongside a dedicated ESLint 10 upgrade. Lesson: npm audit needs periodic rechecking, not a one-time box to check.

**2026-07-30 (ESLint 10 attempted and reverted):** Tried the deferred ESLint 9->10 bump on a branch. npm install succeeded, but npm run lint crashed immediately: eslint-config-next's own bundled eslint-plugin-react calls context.getFilename(), an API ESLint 10 removed (replaced by context.filename). Confirmed upstream incompatibility in eslint-config-next itself, not a local issue -- verified via a real lint run, not inferred. npm audit fix --force offered to fix the remaining brace-expansion finding by installing eslint-config-next@12.0.4, a major downgrade from the ^16.2.12 this project needs for Next 16 -- declined. Branch abandoned, package.json/package-lock.json restored, main unaffected. Do not retry until eslint-config-next publishes an ESLint-10-compatible release for Next 16 -- check https://www.npmjs.com/package/eslint-config-next before attempting again.

**2026-09-21 — Full forensic audit (Claude Code).** Report: `FINAL_WEBSITE_AUDIT.md` at the repo root. Read it before the next audit; do not repeat the work.
- `next` 16.2.12 → 16.3.5 (two critical RCE advisories), `sharp` 0.35.4, `eslint-config-next` 16.3.5. `npm audit`: 0. Floors are pinned in `package.json`.
- Fixed: 335 KB fake favicon; Markdown negotiation dead in production (now a rewrite); 320px map-card overflow; footer strip `100vw` (it let `scrollIntoView` shove the page 5px sideways — **never size a full-bleed element with `100vw`, cancel the parent's padding instead**); CSP `img-src` now lists `t0–t3.gstatic.com` because Google's favicon service load-balances across them; counters SSR their final value; `/timeline` skip link, Twitter card and screen-reader years; landmarks; table roles on `.pal` (it becomes `display:grid` ≤760px, which drops table semantics); carousel live region silent during autoplay.
- ESLint and `tsconfig` now ignore `.claude/` (agent worktrees), `_conflict_backups/` and `design-src/`. Before that, lint reported 340 errors of which one was real.
- **This file had drifted from the code and was corrected IN PLACE the same day:** the amber accent and `.acard` award cards (not in the code — awards are the blue `.pal` ledger), card and event counts (12 rail cards, 13 timeline events), the retired hide-on-scroll nav, and which file owns the scroll engine, cursor and theme (`SiteChrome.tsx`, not `page.tsx`). Also learned: `priority` on `next/image` is deprecated in Next 16 — use `preload`, and only above the fold.
- **Local Lighthouse on this machine is not trustworthy:** Kaspersky web protection injects ~900 KB of render-blocking script/CSS into every page headless Edge loads. Use pagespeed.web.dev for Core Web Vitals. Byte and request counts from the build are reliable.
- **Still open, all outside the repo or needing the owner:** Cloudflare overrides HSTS to `max-age=7776000` with no `includeSubDomains`/`preload` (the header in `next.config.ts` never reaches visitors); no CAA/SPF/DMARC records; conflicting dates between the awards ledger and the timeline; no pause control on the gallery; hero source image is only 1280px wide.
- **Later the same day:** nav scroll spy rewritten (see Conventions); copyright headers, `LICENSE`, `humans.txt` added; `llms.txt` restructured to the llms.txt convention (single H1, summary blockquote, link lists to `/index.md` and `/timeline.md`, press, authorship and citation sections) and both pages now advertise their Markdown mirror with `<link rel="alternate" type="text/markdown">`. The prompt for the deferred Cloudflare session is in `.claude/next-session-prompt.md` (local, gitignored).
- **Owner decisions, same day:** the right-click / drag block in `app/template.tsx` **stays** — do not raise it again as a defect. Footer and side-rail social icons now point at the real profiles (Facebook, YouTube, X, TikTok, Telegram); the same URLs are in the JSON-LD `sameAs`, `llms.txt` and `index.md`, and all four must change together.

---

© 2025–2026 Bhanu Mendis · https://bhanumendis.com — All rights reserved. Designed, built and maintained by Bhanu Mendis.
