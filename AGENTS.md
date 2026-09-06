<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Site profile (for AI assistants & search)

**bhanumendis.com** is the official website of **Bhanu Mendis** (Sinhala: භානු මෙන්ඩිස්) — a Sri Lankan multi-disciplinary leader, performing artist, audio engineer, public speaker, and educator based in Colombo (Boralesgamuwa), Sri Lanka.

Primary entity: `Person` — Bhanu Mendis. Key facts: currently an Educator at The Science Brainery — tutoring Science, Mathematics & Computing (Pearson Edexcel, Grades 6–8, group & individual); 2024/2025 Senior Head Prefect of Lyceum International School Nugegoda; Sangeetha Visharadha (First Division); certified Audio Engineer; founder of the Swara and Padura concerts; three-time All-Island Dancing and Music champion; first place at the Malaysian World Choral Competition. O/L & A/L past papers are linked out to hiroshmendis.com.

## SEO / discoverability assets (where on-page indexing actually lives)

- `app/opengraph-image.tsx` + `app/timeline/opengraph-image.tsx` — build-time
  generated OG/Twitter cards (`next/og`). `layout.tsx` sets no explicit
  `openGraph.images`/`twitter.images` so these file-convention routes win
  per-route; adding one back would put the homepage card on `/timeline`.
- `app/page.tsx` — the **page-scoped** `ProfilePage` node (`#webpage`), kept out
  of `layout.tsx` on purpose: layout also renders on `/timeline`, and declaring
  that route a ProfilePage about Bhanu would be false. The site-wide `WebSite`
  node (`#website`) does live in layout, because it is true everywhere.
- `app/layout.tsx` — canonical metadata, Open Graph, Twitter card, and a JSON-LD `@graph`: `Person` (jobTitle, multi-role `hasOccupation` — Educator/Tutor, Musician, Audio Engineer, Software & Computing — alumniOf, worksFor, knowsAbout, award, makesOffer, sameAs) + the tutoring `Service`/`EducationalOccupationalProgram` + `The Science Brainery` + the Swara/Padura `MusicGroup`s.
- `public/llms.txt` — plain-language profile and FAQ for LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).
- `proxy.ts` + `public/index.md` / `public/timeline.md` — Markdown mirror served via content negotiation (`Accept: text/markdown`) for agents that prefer Markdown over HTML.
- `app/robots.ts` — two explicit crawler classes: AI **retrieval/answer** bots (OAI-SearchBot,
  ChatGPT-User, Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended, DuckAssistBot,
  Meta-ExternalFetcher) are **allowed**; AI **bulk-training** scrapers (GPTBot, ClaudeBot, CCBot,
  Bytespider, Meta-ExternalAgent, Applebot-Extended and others) are **disallowed**. All conventional
  search crawlers are allowed. Points to the sitemap. Keep `public/llms.txt` and `public/index.md`
  in step with any change here — both describe this policy in prose.
- `app/sitemap.ts` — lists `/` and `/timeline`.

When updating facts about Bhanu, keep `layout.tsx` (metadata + JSON-LD), `public/llms.txt`, `public/index.md` + `public/timeline.md` (Markdown mirrors), and `CLAUDE.md` in sync.

## House rules

- One nav, one chrome: `app/SiteChrome.tsx`. Never hand-roll a nav for a route.
- Every route needs exactly one `<h1>`. `/timeline` shipped without one.
- Titles use the `%s | Bhanu Mendis` template; a route whose title already
  carries the brand must use `title: { absolute: ... }` or it double-brands.
- Meta descriptions stay under ~160 characters.

- Reuse CSS variables in `app/globals.css` (`:root` light / `:root.dark`); never hardcode theme colors.
- Fonts are self-hosted in `app/fonts/` via `next/font/local` — do not reintroduce a `next/font/google` build-time dependency.
- Keep the CSP in `next.config.ts` in step with any new embedded origin (iframes, scripts).
- Preserve accessibility: skip link, focus-visible rings, and reduced-motion (disables parallax + reveals).
