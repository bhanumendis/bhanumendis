<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Site profile (for AI assistants & search)

**bhanumendis.com** is the official website of **Bhanu Mendis** (Sinhala: භානු මෙන්ඩිස්) — a Sri Lankan multi-disciplinary leader, performing artist, audio engineer, public speaker, and educator based in Colombo (Boralesgamuwa), Sri Lanka.

Primary entity: `Person` — Bhanu Mendis. Key facts: 2024/2025 Senior Head Prefect of Lyceum International School Nugegoda; Sangeetha Visharadha (First Division); certified Audio Engineer; founder of the Swara and Padura concerts; three-time All-Island Dancing and Music champion; first place at the Malaysian World Choral Competition; currently an Educator at The Science Brainery.

## SEO / discoverability assets (where on-page indexing actually lives)

- `app/layout.tsx` — canonical metadata, Open Graph, Twitter card, and JSON-LD `Person` structured data (jobTitle, alumniOf, worksFor, knowsAbout, award, sameAs).
- `public/llms.txt` — plain-language profile and FAQ for LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).
- `app/robots.ts` — allows all user agents; points to the sitemap.
- `app/sitemap.ts` — lists `/` and `/timeline`.

When updating facts about Bhanu, keep `layout.tsx` (metadata + JSON-LD), `public/llms.txt`, and `CLAUDE.md` in sync.

## House rules

- Reuse CSS variables in `app/globals.css`; never hardcode theme colors.
- Keep the CSP in `next.config.ts` in step with any new embedded origin (iframes, fonts, scripts).
- Preserve accessibility: skip link, focus-visible rings, keyboard navigation, reduced-motion.
