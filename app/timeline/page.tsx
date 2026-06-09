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
    <main>
      <nav id="nav" className="scrolled" aria-label="Main navigation">
        <Link href="/" className="logo" aria-label="Bhanu Mendis — home">
          <span className="logo-dot" aria-hidden="true"></span>
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </Link>
        <ul className="nav-links" role="list">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#exp">Experience</Link></li>
          <li><Link href="/#achieve">Awards</Link></li>
          <li><Link href="/timeline" className="nav-cta">Timeline</Link></li>
        </ul>
      </nav>

      <div style={{ paddingTop: "80px" }}>
        <Timeline />
      </div>

      <div className="sw" style={{ paddingTop: 0, textAlign: "center" }}>
        <Link href="/" className="btn-out" style={{ display: "inline-flex" }}>
          ← Back to home
        </Link>
      </div>

      <footer aria-label="Site footer" style={{ marginTop: "40px" }}>
        <div className="foot-bottom" style={{ borderTop: "none", justifyContent: "center" }}>
          <span className="foot-copy">© 2025 Bhanu Mendis · Colombo, Sri Lanka</span>
        </div>
      </footer>
    </main>
  );
}