/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
import type { Metadata } from "next";
import Timeline from "../Timeline";
import SiteChrome from "../SiteChrome";

export const metadata: Metadata = {
  // `absolute` bypasses the "%s | Bhanu Mendis" template in layout.tsx —
  // without it this rendered as "Timeline — Bhanu Mendis | Bhanu Mendis".
  title: { absolute: "Timeline — 14 Years of Awards & Leadership | Bhanu Mendis" },
  description:
    "The 14-year journey of Bhanu Mendis — from Lyceum International School in 2011 to national championships, international recognition and landmark productions.",
  // Replaces layout's `alternates` whole, so the Markdown mirror is restated.
  alternates: {
    canonical: "https://bhanumendis.com/timeline",
    types: { "text/markdown": "https://bhanumendis.com/timeline.md" },
  },
  openGraph: {
    title: "Timeline — Bhanu Mendis",
    description:
      "14 years in the making — the milestones, championships, and achievements of Bhanu Mendis.",
    url: "https://bhanumendis.com/timeline",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "website",
  },
  // Metadata objects are replaced, not deep-merged. Without this the route
  // inherited layout.tsx's `twitter` block whole, so a shared /timeline link
  // unfurled on X with the HOMEPAGE title and description under the timeline
  // card. The image still comes from ./opengraph-image via the file convention.
  twitter: {
    card: "summary_large_image",
    title: "Timeline — Bhanu Mendis",
    description:
      "14 years in the making — the milestones, championships, and achievements of Bhanu Mendis.",
  },
};

export default function TimelinePage() {
  return (
    <>
      <SiteChrome />

      <main id="main">
        <Timeline />
      </main>
    </>
  );
}
