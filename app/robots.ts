import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "Googlebot", "Google-Extended", "Bingbot", "Applebot", "Applebot-Extended",
          "GPTBot", "ChatGPT-User", "OAI-SearchBot",
          "ClaudeBot", "anthropic-ai", "Claude-Web", "Claude-SearchBot",
          "PerplexityBot", "Perplexity-User", "DeepSeekBot", "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://bhanumendis.com/sitemap.xml",
    host: "https://bhanumendis.com",
  };
}
