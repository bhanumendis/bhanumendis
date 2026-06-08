"use client";

// Add your real newspaper names, links and dates here
const FEATURES = [
  {
    outlet: "Daily Mirror — Education",
    country: "Sri Lanka",
    desc: "Covered Elysium '25 — the A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://edu.dailymirror.lk/home/schoolnews/1796/Elysium-25-The-AL-Graduation-Ceremony-of-2025-Lyceum-Nugegoda",
    initials: "DM",
  },
  {
    outlet: "Sunday Times — Education",
    country: "Sri Lanka",
    desc: "Featured Elysium '25 — the historic A/L Graduation Ceremony of 2025 at Lyceum International School Nugegoda.",
    url: "https://www.sundaytimes.lk/250914/education/elysium-25-the-al-graduation-ceremony-of-2025-lyceum-nugegoda-611593.html",
    initials: "ST",
  },
  {
    outlet: "Sunday Times — Education",
    country: "Sri Lanka",
    desc: "Announced Lyceum Nugegoda's Advanced Level Graduation Ceremony at Cinnamon Life — City of Dreams.",
    url: "https://www.sundaytimes.lk/250824/education/lyceum-nugegoda-to-host-advanced-level-graduation-ceremony-at-cinnamon-life-609469.html",
    initials: "ST",
  },
];

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
              target={f.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="press-card"
              aria-label={`${f.outlet} feature`}
            >
              <div className="press-logo">{f.initials}</div>
              <div>
                <div className="press-name">{f.outlet}</div>
                <div className="press-country">{f.country}</div>
                <div className="press-desc">{f.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}