/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Markdown mirror (content negotiation) ────────────────────────────
// Next.js 16 renamed Middleware → Proxy. Agents/LLMs that send
// `Accept: text/markdown` get a clean Markdown version of the page; humans
// (browsers never send that Accept type) get the normal HTML. The Markdown
// lives as a static file in /public, so it is also directly fetchable at
// /index.md and /timeline.md.
//
// This is a REWRITE, not a fetch. The previous version fetched its own
// public URL from inside the proxy and relayed the body. That worked on
// localhost and silently failed in production — verified live on 2026-09-21:
// `curl -H "Accept: text/markdown" https://bhanumendis.com/` returned
// text/html, while /index.md itself served fine. The self-request has to leave
// Vercel and re-enter through Cloudflare as an anonymous server-side client
// (the same edge answers 403 to several bot user-agents), and any non-200
// made the `upstream.ok` guard fall through to HTML without a trace. A rewrite
// is resolved inside the platform's own router: no second network hop to be
// refused, and no added latency.
const MIRRORS: Record<string, string> = {
  "/": "/index.md",
  "/timeline": "/timeline.md",
};

export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") || "";

  if (/\btext\/markdown\b/i.test(accept)) {
    const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
    const mirror = MIRRORS[path];
    if (mirror) {
      const res = NextResponse.rewrite(new URL(mirror, request.url));
      res.headers.set("Content-Type", "text/markdown; charset=utf-8");
      res.headers.set("Vary", "Accept");
      res.headers.set("X-Content-Negotiation", "markdown");
      res.headers.set("Cache-Control", "public, max-age=3600");
      return res;
    }
  }

  // Normal HTML — mark it Vary: Accept so caches keep the two variants apart.
  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

export const config = {
  matcher: ["/", "/timeline"],
};
