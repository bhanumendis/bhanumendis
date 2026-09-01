import type { MetadataRoute } from "next";

// ── Crawler policy ───────────────────────────────────────────────────
// Two families of AI crawler exist and they are NOT the same thing:
//
//   1. RETRIEVAL / ANSWER bots — fetch this page live (or keep a search
//      index) so an assistant can answer "who is Bhanu Mendis?" with
//      real, current, attributed information and a link back here.
//      These are pure upside for discoverability. ALLOWED.
//
//   2. BULK TRAINING scrapers — vacuum content into model training
//      corpora. No attribution, no link, no takeback. BLOCKED.
//
// Note: `Google-Extended` governs Gemini grounding/training only. It has
// no effect whatsoever on Google Search ranking, so allowing it costs
// nothing in Search and is the only lever that lets Gemini cite this site.
const AI_RETRIEVAL_BOTS = [
  "OAI-SearchBot",        // OpenAI — ChatGPT search index
  "ChatGPT-User",         // OpenAI — user-initiated live fetch
  "Claude-User",          // Anthropic — user-initiated live fetch
  "Claude-SearchBot",     // Anthropic — search index
  "PerplexityBot",        // Perplexity — search index
  "Perplexity-User",      // Perplexity — user-initiated live fetch
  "Google-Extended",      // Google — Gemini grounding
  "DuckAssistBot",        // DuckDuckGo — assistant retrieval
  "Meta-ExternalFetcher", // Meta AI — user-initiated live fetch
];

const AI_TRAINING_SCRAPERS = [
  "GPTBot",               // OpenAI — training corpus
  "ClaudeBot",            // Anthropic — training corpus
  "CCBot",                // Common Crawl — feeds most open training sets
  "Bytespider",           // ByteDance — training corpus
  "Meta-ExternalAgent",   // Meta — training corpus
  "Applebot-Extended",    // Apple Intelligence — training corpus
  "Omgilibot",            // Webz.io — resold training data
  "Diffbot",              // Diffbot — resold training data
  "ImagesiftBot",         // Hive — image training corpus
  "cohere-ai",            // Cohere — training corpus
  "AI2Bot",               // Allen Institute — training corpus
  "PanguBot",             // Huawei — training corpus
  "Timpibot",             // Timpi — training corpus
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_TRAINING_SCRAPERS, disallow: "/" },
      { userAgent: AI_RETRIEVAL_BOTS, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://bhanumendis.com/sitemap.xml",
    host: "https://bhanumendis.com",
  };
}
