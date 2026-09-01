"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────────
   LinkedIn embeds, behind a facade.

   Three LinkedIn iframes were previously mounted on page load. Even
   with loading="lazy" they each pull LinkedIn's full embed runtime
   the moment they approach the viewport — third-party JS, cookies
   and layout work this site has no control over, and the single
   largest contributor to Time-to-Interactive.

   Now nothing third-party loads until the visitor asks for it. The
   facade is a real button (keyboard reachable, correctly labelled)
   and reserves the exact final height, so swapping in the iframe
   causes no layout shift.
   ──────────────────────────────────────────────────────────────── */

const POSTS = [
  { id: "7467136600683073536", title: "Latest post" },
  { id: "7463987225429708800", title: "Recent post" },
  { id: "7399673996285358080", title: "Earlier post" },
] as const;

export default function LinkedInPosts() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="li-grid reveal d1">
      {POSTS.map((post, i) =>
        open[post.id] ? (
          <iframe
            key={post.id}
            src={`https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${post.id}?collapsed=1`}
            height="540"
            frameBorder="0"
            allowFullScreen
            title={`LinkedIn post — Bhanu Mendis ${i + 1}`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <button
            key={post.id}
            type="button"
            className="li-facade"
            onClick={() => setOpen((o) => ({ ...o, [post.id]: true }))}
            aria-label={`Load LinkedIn ${post.title.toLowerCase()} ${i + 1} of ${POSTS.length}`}
          >
            <span className="li-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </span>
            <span className="li-facade-title">{post.title}</span>
            <span className="li-facade-hint">Click to load from LinkedIn</span>
            <span className="li-facade-note">Loads third-party content</span>
          </button>
        )
      )}
    </div>
  );
}
