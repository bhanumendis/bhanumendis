import type { CSSProperties } from "react";

type TimelineEvent = {
  year: string;
  title: string;
  desc: string;
  tags: readonly string[];
  side: "left" | "right";
  highlight?: boolean;
  active?: boolean;
};

const ALL_EVENTS: readonly TimelineEvent[] = [
  {
    year: "2011",
    title: "Joined Lyceum International School",
    desc: "Enrolled at Lyceum International School Nugegoda — the beginning of a 14-year journey of academic excellence, leadership, and performing arts.",
    tags: ["Education", "Lyceum"],
    side: "right",
  },
  {
    year: "2015 – 16",
    title: "Ranwala Balakaya Outstanding Award",
    desc: "Recognised with the Outstanding Award at Ranwala Balakaya — one of Sri Lanka's foremost platforms for youth and cultural excellence — for distinguished achievements in singing, dance, and cultural performance.",
    tags: ["Award", "Performing Arts"],
    side: "left",
  },
  {
    year: "2016",
    title: "National Chess Champion",
    desc: "Claimed First Place at the National Chess Championship — proof that strategic thinking extends far beyond the stage.",
    tags: ["Award", "Chess"],
    side: "right",
  },
  {
    year: "2017",
    title: "Began Sangeetha Visharadha Studies",
    desc: "Commenced six years of intensive classical Indian music study at Bathkandhe Sangit Vidhyapith, working toward the Visharadha qualification.",
    tags: ["Music", "Education"],
    side: "left",
  },
  {
    year: "2018",
    title: "All-Island Dancing Champion",
    desc: "First Island Place at the All-Island Dancing Competition — the first of three national dance titles.",
    tags: ["Award", "Dance"],
    side: "right",
  },
  {
    year: "2019",
    title: "Double All-Island Champion",
    desc: "First Island Place in both the All-Island Dancing Competition and All-Island Music Competition in the same year. Also won the Inter-House Choir Competition and Third Place at the National Literary Festival in English and Sinhala.",
    tags: ["Award", "Dance", "Music"],
    side: "left",
  },
  {
    year: "2020",
    title: "Aviation, Audio & Voice Training",
    desc: "Completed a comprehensive aviation programme at Sri Lanka Air Force, Ratmalana. Trained as an Audio Engineer at Pearl Bay Institute and began Voice Acting and News Reporting training at the Institute of Professional Development.",
    tags: ["Aviation", "Audio", "Voice Acting"],
    side: "right",
  },
  {
    year: "2022",
    title: "Diploma in IT & Leadership Award",
    desc: "Completed a Diploma in Information Technology at ESOFT Metro Campus. Received the Leadership Award from the Institute for Professional Development.",
    tags: ["Education", "Award"],
    side: "left",
  },
  {
    year: "2023",
    title: "Visharadha · Western Music · Head Prefect",
    desc: "Achieved Sangeetha Visharadha First Division after six years of classical study. Completed a Diploma in Western Music at Lyceum. Appointed Head Prefect. Founded the Swara Concert — Sri Lanka's largest island-wide school Eastern music concert — and the Padura Concert series. Founded the Eastern Music Club as Founding President.",
    tags: ["Music", "Leadership", "Swara Concert"],
    side: "right",
    highlight: true,
  },
  {
    year: "2024",
    title: "Senior Head Prefect · International Champion",
    desc: "Appointed Senior Head Prefect of Lyceum International School. Won First Place at the Malaysian World Choral Competition representing Sri Lanka internationally. Claimed All-Island Dancing and Music Championships. Won First Place at the British-Lanka Festival of Performing Arts and the WWF United Nations Resolution. Appointed National Child Protection Ambassador.",
    tags: ["Leadership", "Award", "International"],
    side: "left",
    highlight: true,
  },
  {
    year: "2025",
    title: "Elysium '25 · Maathra 14 · Graduated",
    desc: "Directed the Elysium '25 graduation ceremony at Cinnamon Life — City of Dreams for 26,000+ Lyceumers nationwide. Overall coordinated Maathra 14 at BMICH managing 750+ performers. Graduated from Lyceum International School as an Outstanding Student. Joined The Science Brainery as Educator and PEARLBAY® Holdings as Audio Engineer.",
    tags: ["Event", "Graduation", "Educator"],
    side: "right",
    highlight: true,
  },
  {
    year: "2026",
    title: "Present · Break the Frame",
    desc: "Currently teaching Pearson Edexcel Science, Mathematics and Computer Science at The Science Brainery. Building on a foundation of national championships, international recognition, and landmark event production — with more ahead.",
    tags: ["Present", "Educator"],
    side: "left",
    active: true,
  },
];

export default function Timeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-heading">
      {/* Ambient pads. Purely decorative depth behind the spine — they drift
          at three different rates off a scroll(root) timeline, which is what
          keeps the page from reading as a static list between cards. */}
      <div className="tl-ambient" aria-hidden="true">
        <span className="tl-blob tl-blob-1" />
        <span className="tl-blob tl-blob-2" />
        <span className="tl-blob tl-blob-3" />
      </div>
      <div className="sw">
        <div className="eyebrow">The Journey</div>
        {/* This is the page's only top-level heading, so it must be the h1.
            It was an h2, which left /timeline with no h1 whatsoever. */}
        <h1 className="sh" id="timeline-heading">14 Years in the <em>Making</em></h1>

        <div className="tl-wrap">
          {/* The spine draws itself as the wrapper scrolls through. The outer
              element is the track, the fill is what scrubs. */}
          <div className="tl-line" aria-hidden="true"><span className="tl-line-fill" /></div>

          {ALL_EVENTS.map((ev, i) => (
            <div
              key={ev.year}
              className={`tl-item tl-${ev.side} tl-fadeIn ${ev.highlight ? "tl-highlight" : ""} ${ev.active ? "tl-active" : ""}`}
              // --d is the FALLBACK stagger only (a time ladder for browsers
              // without scroll timelines); the native block zeroes it. It is a
              // custom property rather than an inline `animationDelay` because
              // an inline delay would outrank the stylesheet and leak a time
              // offset onto a scroll-driven animation, where it is meaningless.
              // --drift varies the parallax rate per card so the pads sit at
              // different depths instead of moving as one slab.
              style={{ "--d": `${i * 0.06}s`, "--drift": `${7 + (i % 3) * 6}px` } as CSSProperties}
            >
              {/* The layout is 50/50 and one half of every row is empty; the
                  ghost year fills it and hands off to the next as you scroll. */}
              <span className="tl-ghost" aria-hidden="true">{ev.year}</span>
              <div className="tl-dot" aria-hidden="true">
                {ev.active && <span className="tl-pulse" />}
              </div>
              <div className="tl-card">
                <div className="tl-year">{ev.year}</div>
                <h2 className="tl-title">{ev.title}</h2>
                <div className="tl-desc">{ev.desc}</div>
                <div className="tl-tags">
                  {ev.tags.map((t) => <span key={t} className="tl-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
