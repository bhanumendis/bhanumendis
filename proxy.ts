import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Markdown mirror (content negotiation) ────────────────────────────
// Next.js 16 renamed Middleware → Proxy. Agents/LLMs that send
// `Accept: text/markdown` get a clean Markdown version of the page; humans
// (browsers never send that Accept type) get the normal HTML. The Markdown
// lives as a static file in /public, so it is also directly fetchable at
// /index.md and /timeline.md.
export async function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const wantsMarkdown = /\btext\/markdown\b/i.test(accept);

  if (wantsMarkdown) {
    const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
    const mdPath = path === "/" ? "/index.md" : `${path}.md`;
    try {
      const upstream = await fetch(new URL(mdPath, request.url));
      if (upstream.ok) {
        const body = await upstream.text();
        return new NextResponse(body, {
          status: 200,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Vary": "Accept",
            "X-Content-Negotiation": "markdown",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch {
      /* fall through to HTML */
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
