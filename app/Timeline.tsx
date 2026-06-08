"use client";
import { useState } from "react";

const ALL_EVENTS = [
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

const VISIBLE_DEFAULT = 5;

export default function Timeline() {
  const [showAll, setShowAll] = useState(false);
  const visible = ALL_EVENTS.slice(0, VISIBLE_DEFAULT);
  const hidden = ALL_EVENTS.slice(VISIBLE_DEFAULT);

  return (
    <section id="timeline" aria-labelledby="timeline-heading">
      <div className="sw">
        <div className="eyebrow reveal">The Journey</div>
        <h2 className="sh reveal" id="timeline-heading">14 Years in the <em>Making</em></h2>

        <div className="tl-wrap">
          <div className="tl-line" aria-hidden="true"></div>

          {visible.map((ev, i) => (
            <div
              key={i}
              className={`tl-item tl-${ev.side} reveal ${i % 2 === 0 ? "d1" : "d2"} ${ev.highlight ? "tl-highlight" : ""} ${ev.active ? "tl-active" : ""}`}
            >
              <div className="tl-dot" aria-hidden="true">
                {ev.active && <span className="tl-pulse" />}
              </div>
              <div className="tl-card">
                <div className="tl-year">{ev.year}</div>
                <div className="tl-title">{ev.title}</div>
                <div className="tl-desc">{ev.desc}</div>
                <div className="tl-tags">
                  {ev.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}

          {showAll && hidden.map((ev, i) => (
            <div
              key={i + VISIBLE_DEFAULT}
              className={`tl-item tl-${ev.side} tl-fadeIn ${ev.highlight ? "tl-highlight" : ""} ${ev.active ? "tl-active" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="tl-dot" aria-hidden="true">
                {ev.active && <span className="tl-pulse" />}
              </div>
              <div className="tl-card">
                <div className="tl-year">{ev.year}</div>
                <div className="tl-title">{ev.title}</div>
                <div className="tl-desc">{ev.desc}</div>
                <div className="tl-tags">
                  {ev.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="show-more-btn"
          onClick={() => setShowAll(s => !s)}
          aria-expanded={showAll}
          style={{ marginTop: "40px" }}
        >
          {showAll
            ? "Show less ↑"
            : `Show full journey ↓  (${hidden.length} more milestones)`}
        </button>
      </div>
    </section>
  );
}