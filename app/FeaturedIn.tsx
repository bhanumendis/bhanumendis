"use client";
import { useState } from "react";

const FEATURES = [
  {
    outlet: "Daily Mirror",
    section: "Education",
    desc: "Covered Elysium '25 — the A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://edu.dailymirror.lk/home/schoolnews/1796/Elysium-25-The-AL-Graduation-Ceremony-of-2025-Lyceum-Nugegoda",
    domain: "dailymirror.lk",
    initials: "DM",
  },
  {
    outlet: "Sunday Times",
    section: "Education",
    desc: "Featured Elysium '25 — the historic A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://www.sundaytimes.lk/250914/education/elysium-25-the-al-graduation-ceremony-of-2025-lyceum-nugegoda-611593.html",
    domain: "sundaytimes.lk",
    initials: "ST",
  },
  {
    outlet: "Sunday Times",
    section: "Education",
    desc: "Announced Lyceum Nugegoda's Advanced Level Graduation Ceremony at Cinnamon Life — City of Dreams.",
    url: "https://www.sundaytimes.lk/250824/education/lyceum-nugegoda-to-host-advanced-level-graduation-ceremony-at-cinnamon-life-609469.html",
    domain: "sundaytimes.lk",
    initials: "ST",
  },
  {
    outlet: "Lyceum International",
    section: "Official",
    desc: "Official coverage of Elysium '25 — a grand celebration of the A/L graduation at Cinnamon Life City of Dreams.",
    url: "https://www.lyceum.lk/news/events/celebrations/elysium-25-a-grand-celebration-of-the-lyceum-international-school-al-graduation-at-cinnamon-life-city-of-dreams/",
    domain: "lyceum.lk",
    initials: "LK",
  },
];

function FaviconLogo({ domain, initials }: { domain: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (failed) {
    return <div className="press-logo">{initials}</div>;
  }

  return (
    <div className="press-logo press-logo-img">
      <img
        src={src}
        alt={domain}
        width={28}
        height={28}
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
          {FEATURES.map((f, i) => (
            <a
              key={i}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-card"
              aria-label={`${f.outlet} — ${f.desc}`}
            >
              <FaviconLogo domain={f.domain} initials={f.initials} />
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