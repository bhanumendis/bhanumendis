import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all standard crawlers
        userAgent: "*",
        allow: "/",
      },
      {
        // Explicitly allow ChatGPT / OpenAI crawler
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        // Allow ChatGPT search crawler
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        // Allow Perplexity crawler
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        // Allow Google AI / Gemini
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        // Allow Anthropic / Claude crawler
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        // Allow Claude web crawler
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        // Allow Meta AI crawler
        userAgent: "FacebookBot",
        allow: "/",
      },
      {
        // Allow Cohere AI
        userAgent: "cohere-ai",
        allow: "/",
      },
      {
        // Allow YouBot
        userAgent: "YouBot",
        allow: "/",
      },
    ],
    sitemap: "https://bhanumendis.com/sitemap.xml",
    host: "https://bhanumendis.com",
  };
}