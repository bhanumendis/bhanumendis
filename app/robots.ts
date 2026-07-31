import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "Google-Extended",
          "Bytespider",
          "ClaudeBot",
        ],
        disallow: "/",
      },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://bhanumendis.com/sitemap.xml",
    host: "https://bhanumendis.com",
  };
}
