import type { Metadata } from "next";
import Link from "next/link";
import Timeline from "../Timeline";

export const metadata: Metadata = {
  title: "Timeline — Bhanu Mendis",
  description:
    "The 14-year journey of Bhanu Mendis — from joining Lyceum International School in 2011 to national championships, international recognition, and landmark event productions.",
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
      <nav id="nav" className="scrolled" aria-label="Main navigation">
        <Link href="/" className="logo" aria-label="Bhanu Mendis — home">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </Link>
        <ul className="nav-links" role="list">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#exp">Experience</Link></li>
          <li><Link href="/#achieve">Awards</Link></li>
          <li><Link href="/timeline" className="nav-cta">Timeline</Link></li>
        </ul>
      </nav>

      <main>
        <div className="tl-topbar">
          <Link href="/" className="btn-out btn-back" aria-label="Back to home">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to home
          </Link>
        </div>

        <Timeline />
      </main>
    </>
  );
}
