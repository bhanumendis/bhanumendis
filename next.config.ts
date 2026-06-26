import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Long-lived caching for static media in /public (Lighthouse: efficient cache policy).
      // These photos never change in place — new images get new filenames.
      {
        source: "/slides/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:asset(hero-bg\\.jpg|bhanumendis\\.jpg|dm-favicon\\.avif|st-favicon\\.avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Favicon may be replaced in place — cache for 30 days, not immutable.
        source: "/favicon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.google.com https://t2.gstatic.com",
              "font-src 'self'",
              "frame-src https://www.linkedin.com https://maps.google.com https://www.google.com https://maps.gstatic.com",
              "connect-src 'self' https://static.cloudflareinsights.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://forms.gle https://docs.google.com",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    // AVIF first — smaller than WebP for photos; encode cost is paid once, then cached.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimized variants of these static photos can be cached long (31 days).
    minimumCacheTTL: 2678400,
  },
  compress: true,
  poweredByHeader: false,
  // Pin the workspace root to this project — a stray parent lockfile was causing
  // Next.js to infer the wrong root directory.
  turbopack: { root: __dirname },
};

export default nextConfig;