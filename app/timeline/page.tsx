import type { Metadata } from "next";
import Timeline from "../Timeline";
import SiteChrome from "../SiteChrome";

export const metadata: Metadata = {
  // `absolute` bypasses the "%s | Bhanu Mendis" template in layout.tsx —
  // without it this rendered as "Timeline — Bhanu Mendis | Bhanu Mendis".
  title: { absolute: "Timeline — 14 Years of Awards & Leadership | Bhanu Mendis" },
  description:
    "The 14-year journey of Bhanu Mendis — from Lyceum International School in 2011 to national championships, international recognition and landmark productions.",
  alternates: { canonical: "https://bhanumendis.com/timeline" },
  openGraph: {
    title: "Timeline — Bhanu Mendis",
    description:
      "14 years in the making — the milestones, championships, and achievements of Bhanu Mendis.",
    url: "https://bhanumendis.com/timeline",
    siteName: "Bhanu Mendis",
    type: "website",
  },
};

export default function TimelinePage() {
  return (
    <>
      <SiteChrome />

      <main>
        <Timeline />
      </main>
    </>
  );
}
