"use client";
import { useState } from "react";

interface Feature {
  outlet: string;
  section: string;
  desc: string;
  url: string;
  favicon: string | null;
  domain?: string;
  initials: string;
}

const FEATURES: readonly Feature[] = [
  {
    outlet: "Daily Mirror",
    section: "Education",
    desc: "Covered Elysium '25 — the A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://edu.dailymirror.lk/home/schoolnews/1796/Elysium-25-The-AL-Graduation-Ceremony-of-2025-Lyceum-Nugegoda",
    favicon: "/dm-favicon.avif",
    initials: "DM",
  },
  {
    outlet: "Sunday Times",
    section: "Education",
    desc: "Featured Elysium '25 — the historic A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://www.sundaytimes.lk/250914/education/elysium-25-the-al-graduation-ceremony-of-2025-lyceum-nugegoda-611593.html",
    favicon: "/st-favicon.avif",
    initials: "ST",
  },
  {
    outlet: "Sunday Times",
    section: "Education",
    desc: "Announced Lyceum Nugegoda's Advanced Level Graduation Ceremony at Cinnamon Life — City of Dreams.",
    url: "https://www.sundaytimes.lk/250824/education/lyceum-nugegoda-to-host-advanced-level-graduation-ceremony-at-cinnamon-life-609469.html",
    favicon: "/st-favicon.avif",
    initials: "ST",
  },
  {
    outlet: "Lyceum International",
    section: "Official",
    desc: "Official coverage of Elysium '25 — a grand celebration of the A/L graduation at Cinnamon Life City of Dreams.",
    url: "https://www.lyceum.lk/news/events/celebrations/elysium-25-a-grand-celebration-of-the-lyceum-international-school-al-graduation-at-cinnamon-life-city-of-dreams/",
    favicon: null,
    domain: "lyceum.lk",
    initials: "LK",
  },
];

function FaviconLogo({ favicon, domain, initials }: { favicon: string | null; domain?: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  const src = favicon || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null);

  if (!src || failed) {
    return <div className="press-logo">{initials}</div>;
  }

  return (
    <div className="press-logo press-logo-img">
      {/* Plain <img> on purpose: these are 28px ~8KB AVIFs (already optimal) and the
          remote Google-favicon fallback would otherwise need remotePatterns config. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={initials}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4 }}
      />
    </div>
  );
}

export default function FeaturedIn() {
  return (
    <section id="press" aria-labelledby="press-heading" style={{ background: "var(--bg)" }}>
      <div className="sw">
        <div className="eyebrow reveal">Press &amp; Media</div>
        <h2 className="sh reveal" id="press-heading">Featured <em>In</em></h2>
        <p className="reveal d1" style={{ fontSize: "16px", color: "var(--soft)", marginBottom: "48px", maxWidth: "560px" }}>
          Recognised by leading Sri Lankan media for leadership, cultural achievements, and landmark event productions.
        </p>
        <div className="press-grid reveal d2">
          {FEATURES.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-card"
              aria-label={`${f.outlet} — ${f.desc}`}
            >
              <FaviconLogo favicon={f.favicon} domain={f.domain} initials={f.initials} />
              <div>
                <div className="press-name">{f.outlet}</div>
                <div className="press-country">{f.section}</div>
                <div className="press-desc">{f.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}