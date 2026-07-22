"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import FeaturedIn from "./FeaturedIn";
import MagneticButton from "./MagneticButton";
import Counter from "./Counter";

// Open the tuition location directly in Google Maps.
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("The Science Brainery, Malani Bulathsinghala Mawatha, Boralesgamuwa, Sri Lanka");

const REGISTER_FORM = "https://forms.gle/N52vwAytUsJCt2df6";
const PAST_PAPERS = "https://hiroshmendis.com";
// Student Portal (bhanu-lms) — separate app/repo/domain, opens in its own tab.
const LMS_URL = "https://lms.bhanumendis.com";

const SKILLS: readonly string[] = [
  "Teaching", "Team Leadership", "People Management", "Event Strategy", "Event Production",
  "Public Speaking", "Compering", "Vocal Performance", "Instrumental Music",
  "Creative Direction", "Audio Engineering", "Cubase 14 Pro", "Photography",
  "Visual Media", "Programming & Computing", "Cross-team Coordination",
  "Execution Under Deadline", "Stage & Audience Presence", "Peer Mentoring",
  "Voice Acting", "News Reporting", "MIDI Sequencing", "Mixing & Mastering", "DAW Architecture",
];

const SUBJECTS = [
  { name: "Science", tag: "Physics · Chemistry · Biology", body: "Concept-first science that connects the syllabus to how the world actually works." },
  { name: "Mathematics", tag: "Number · Algebra · Geometry", body: "Step-by-step problem solving that builds real fluency and exam confidence." },
  { name: "Computing", tag: "Computational thinking · Code", body: "From logic and algorithms to hands-on coding and digital literacy." },
] as const;

export default function Home() {
  const [showAllExp, setShowAllExp] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // ── Theme toggle: a plain class flip. The gradual crossfade comes from the
  //    CSS colour transitions on <body> and every surface — no expanding-circle
  //    overlay (that caused the "oval flash" mid-swap). ──
  const applyTheme = (toDark: boolean) => {
    document.documentElement.classList.toggle("dark", toDark);
    try { localStorage.setItem("bm-theme", toDark ? "dark" : "light"); } catch {}
    setIsDark(toDark);
  };

  // Sync React state with the class the pre-paint script may have set.
  // Intentional one-time sync: SSR renders the light default, then we adopt
  // the real (persisted) theme on mount. Doing this in an effect is what keeps
  // hydration stable, so the set-state-in-effect guard is deliberately waived.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
    document.body.classList.add("home");
    return () => document.body.classList.remove("home");
  }, []);

  // ── Custom cursor + hero pointer parallax (desktop, guarded). ──
  useEffect(() => {
    const cd = document.getElementById("cd");
    const cr = document.getElementById("cr");
    if (!cd || !cr) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, frame = 0;
    let usingMouse = false;

    const enableMouse = () => {
      if (!usingMouse) { usingMouse = true; document.body.classList.add("using-mouse"); }
    };
    if (!window.matchMedia("(pointer: coarse)").matches) enableMouse();

    const heroContent = document.getElementById("hero-content");
    const heroH1 = heroContent?.querySelector<HTMLElement>(".h1") ?? null;

    const onMouseMove = (e: MouseEvent) => {
      enableMouse();
      mx = e.clientX; my = e.clientY;
      cd.style.left = `${mx}px`; cd.style.top = `${my}px`;
      if (heroContent && window.scrollY < window.innerHeight) {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
        heroContent.style.transform = `translate3d(${-dx * 18}px, ${-dy * 12}px, 0)`;
        if (heroH1) {
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const glow = Math.max(0, 1 - dist / Math.hypot(cx, cy));
          heroH1.style.textShadow =
            `0 0 ${20 + glow * 40}px rgba(120,192,245,${0.08 + glow * 0.22})`;
        }
      }
    };
    const onTouchStart = () => { usingMouse = false; document.body.classList.remove("using-mouse"); };

    const loop = () => {
      rx += (mx - rx) * 0.22; ry += (my - ry) * 0.22;
      cr.style.left = `${rx}px`; cr.style.top = `${ry}px`;
      frame = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    loop();

    const hoverEls = document.querySelectorAll<HTMLElement>(
      "a,button,.hsc,.srow,.acard,.ccard,.ecard,.sp,.soc-btn,.foot-link,.show-more-btn,.theme-btn,.sidebar-right a,.subj-card,.paper-link,.tut-fact"
    );
    const onEnter = () => document.body.classList.add("cg");
    const onLeave = () => document.body.classList.remove("cg");
    hoverEls.forEach((el) => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      hoverEls.forEach((el) => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
      cancelAnimationFrame(frame);
    };
  }, []);

  // ── Vertical scroll engine: progress bar, nav state, 3D parallax layers,
  //    entrance reveals, back-to-top. All transform/opacity; reduced-motion
  //    and small screens get a calm, static experience. ──
  useEffect(() => {
    const prog = document.getElementById("prog");
    const nav = document.getElementById("nav");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 901px)");

    const parLayers = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));
    let raf = 0, ticking = false;

    const render = () => {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (nav) nav.classList.toggle("scrolled", y > 40);
      setShowTop(y > window.innerHeight * 0.9);
      if (!reduce && wide.matches) {
        for (const el of parLayers) {
          const speed = parseFloat(el.dataset.par || "0");
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        }
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(render); } };

    const clearParallax = () => { for (const el of parLayers) el.style.transform = ""; };
    const onResize = () => { if (reduce || !wide.matches) clearParallax(); onScroll(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    render();

    // Entrance reveals — one-shot, never a visibility gate.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      }),
      { threshold: 0.01, rootMargin: "0px 0px -2% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <a href="#hero" className="skip-link">Skip to content</a>
      <div id="cd" aria-hidden="true" />
      <div id="cr" aria-hidden="true" />
      <div id="prog" aria-hidden="true" role="progressbar" aria-label="Page scroll progress" />

      <div className="sidebar-right" aria-label="Social links">
        <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">Ig.</a>
        <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Facebook via Linktree">Fb.</a>
        <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">In.</a>
      </div>

      <div className="sidebar-left" aria-label="Theme controls">
        <div className="theme-toggle" role="group" aria-label="Theme toggle">
          <button type="button" className={`theme-btn ${!isDark ? "active" : ""}`} onClick={() => { if (isDark) applyTheme(false); }} aria-pressed={!isDark} aria-label="Switch to light mode">☀</button>
          <button type="button" className={`theme-btn ${isDark ? "active" : ""}`} onClick={() => { if (!isDark) applyTheme(true); }} aria-pressed={isDark} aria-label="Switch to dark mode">☾</button>
        </div>
      </div>

      <nav id="nav" aria-label="Main navigation">
        <a href="#hero" className="logo" aria-label="Bhanu Mendis — home">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </a>
        <ul className="nav-links" role="list">
          <li><a href="#about">About</a></li>
          <li><a href="#exp">Experience</a></li>
          <li><a href="#achieve">Awards</a></li>
          <li><a href="/timeline">Timeline</a></li>
          <li><a href={LMS_URL} target="_blank" rel="noopener noreferrer" className="nav-cta-fill">Student Portal</a></li>
          <li><a href="#contact" className="nav-cta">Contact</a></li>
        </ul>
        {/* Compact theme toggle — shown on mobile where the sidebar toggle is hidden. */}
        <button
          type="button"
          className="nav-theme"
          onClick={() => applyTheme(!isDark)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀" : "☾"}
        </button>
      </nav>

      <button type="button" className={`to-top ${showTop ? "visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>

      <main>
        {/* ── HERO ── */}
        <section id="hero" aria-labelledby="hero-name">
          <Image src="/hero-bg.jpg" alt="" className="hero-bg-img" aria-hidden="true" fill sizes="100vw" priority />
          <div className="hero-bg-overlay" aria-hidden="true" />
          <div id="hero-content" className="hero-content">
            <h1 className="h1" id="hero-name">BHANU<br /><span className="blue">MENDIS</span></h1>
            <p className="h-sub">Educator · Public Speaker · Audio Engineer · Artist · Visharadha</p>
            <p className="h-tagline">Break the Frame</p>
            <div className="h-actions">
              <MagneticButton href="#tutoring" className="btn-fill" ariaLabel="See tutoring classes">Tutoring Classes</MagneticButton>
              <MagneticButton href="#about" className="btn-out" ariaLabel="Explore the site">
                Explore
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 13l7 7 7-7" /></svg>
              </MagneticButton>
              <MagneticButton href="/timeline" className="btn-out" ariaLabel="View the timeline">
                Timeline
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </MagneticButton>
            </div>
            <div className="h-stats" role="list" aria-label="Key statistics">
              <div className="hsc" role="listitem"><div className="hsc-n"><Counter value={750} suffix="+" /></div><div className="hsc-l">Performers led</div></div>
              <div className="hsc" role="listitem"><div className="hsc-n"><Counter value={12} suffix="+" /></div><div className="hsc-l">National awards</div></div>
              <div className="hsc" role="listitem"><div className="hsc-n"><Counter value={6} suffix="+" /></div><div className="hsc-l">Years leadership</div></div>
              <div className="hsc" role="listitem"><div className="hsc-n">1st</div><div className="hsc-l">World choral rank</div></div>
            </div>
          </div>
          <a href="#about" className="scroll-cue" aria-hidden="true" tabIndex={-1}><span /></a>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" aria-labelledby="about-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">About</div>
            <div className="al">
              <div className="al-text reveal d1">
                <h2 className="sh" id="about-heading">A teacher, a leader,<br />and a <em>builder.</em></h2>
                <div className="ayubowan-about" lang="si">ආයුබෝවන්</div>
                <div className="atext">
                  <p><strong>Bhanu Mendis</strong> is an educator, performing artist and audio engineer from <em>Colombo, Sri Lanka</em> — someone who lives where creativity meets careful execution.</p>
                  <p>Today he teaches <strong>Science, Maths and Computing</strong> at The Science Brainery. Before that, as <strong>2024/2025 Senior Head Prefect</strong> of Lyceum International School, he directed <em>Elysium&nbsp;&apos;25</em> at Cinnamon Life — a student-led graduation for <strong>26,000+ Lyceumers</strong> — and coordinated <em>Maathra&nbsp;14</em> at the BMICH for <strong>750+ performers</strong>.</p>
                  <p>He is a qualified <strong>Sangeetha Visharadha</strong> (First Division), a certified audio engineer, a multiple national and international champion, and a <strong>National Child Protection Ambassador</strong>.</p>
                </div>
              </div>
              <div className="about-right reveal d2">
                <Image src="/favicon.png" alt="Bhanu Mendis — profile photo" className="about-photo" width={120} height={120} />
                <div className="srow"><div className="sval"><Counter value={26} suffix="K+" /></div><div className="sdesc">Lyceumers at Elysium &apos;25</div></div>
                <div className="srow"><div className="sval"><Counter value={750} suffix="+" /></div><div className="sdesc">Performers managed</div></div>
                <div className="srow"><div className="sval"><Counter value={14} /></div><div className="sdesc">Years at Lyceum</div></div>
                <div className="srow"><div className="sval">1st</div><div className="sdesc">World Choral, Malaysia</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TUTORING (feature) ── */}
        <section id="tutoring" aria-labelledby="tutoring-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">Tutoring &amp; Teaching</div>
            <h2 className="sh reveal d1" id="tutoring-heading">Learn <em>Science, Maths<br />&amp; Computing</em></h2>
            <p className="lead reveal d2">
              Clear, concept-first classes on the <strong>Pearson Edexcel</strong> curriculum for
              <strong> Grades 5–8</strong>, at The Science Brainery in Boralesgamuwa. Group and
              individual — built around understanding, not memorising.
            </p>

            <div className="subj-grid">
              {SUBJECTS.map((s, i) => (
                <article key={s.name} className={`subj-card reveal d${i + 1}`}>
                  <div className="subj-name">{s.name}</div>
                  <div className="subj-tag">{s.tag}</div>
                  <p className="subj-body">{s.body}</p>
                </article>
              ))}
            </div>

            <div className="tut-facts reveal d2" role="list" aria-label="Class details">
              <div className="tut-fact" role="listitem"><span className="tf-k">Syllabus</span><span className="tf-v">Pearson Edexcel</span></div>
              <div className="tut-fact" role="listitem"><span className="tf-k">Grades</span><span className="tf-v">5 · 6 · 7 · 8</span></div>
              <div className="tut-fact" role="listitem"><span className="tf-k">Classes</span><span className="tf-v">Group &amp; Individual</span></div>
              <div className="tut-fact" role="listitem"><span className="tf-k">Location</span><span className="tf-v">The Science Brainery</span></div>
            </div>

            <div className="tut-cta reveal d3">
              <a href="tel:+94777124152" className="btn-out">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call 0777 124 152
              </a>
              {/* Existing students go straight into the LMS from here, right next to the
                  enrollment call-to-action — now a MagneticButton, same interactive
                  cursor-tracking/sheen treatment as "Tutoring Classes" in the hero,
                  instead of a static link that just happens to share its color. */}
              <MagneticButton href={LMS_URL} external className="btn-fill" ariaLabel="Open the Student Portal">
                Student Portal
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </MagneticButton>
            </div>

            {/* Highly visible past-papers link → hiroshmendis.com */}
            <a className="paper-link reveal d3" href={PAST_PAPERS} target="_blank" rel="noopener noreferrer">
              <span className="paper-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></svg>
              </span>
              <span className="paper-text">
                <span className="paper-title">O/L &amp; A/L Past Papers</span>
                <span className="paper-sub">Free question papers, mark schemes &amp; resources — visit hiroshmendis.com</span>
              </span>
              <span className="paper-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </span>
            </a>
          </div>
        </section>

        {/* ── ETHOS — Apple-style pinned scroll: background stays, content scrolls ── */}
        <section id="ethos" aria-label="Teaching philosophy">
          <div className="pin-bg" aria-hidden="true">
            <div className="pin-word">LEARN</div>
          </div>
          <div className="pin-fg">
            <article className="pin-line">
              <span className="pin-num">01</span>
              <h3 className="pin-h">Concept first, always.</h3>
              <p className="pin-p">We start from <em>why</em> something works — not what to memorise. Understanding is the shortcut.</p>
            </article>
            <article className="pin-line">
              <span className="pin-num">02</span>
              <h3 className="pin-h">Built to stick.</h3>
              <p className="pin-p">Knowledge that survives the exam <em>and</em> the years after it. Fundamentals over tricks.</p>
            </article>
            <article className="pin-line">
              <span className="pin-num">03</span>
              <h3 className="pin-h">Further than they thought.</h3>
              <p className="pin-p">Every student, gently pushed past their own expectations — at their own pace.</p>
            </article>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" aria-labelledby="skills-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">Core Skills</div>
            <h2 className="sh reveal" id="skills-heading">Skills &amp; <em>Strengths</em></h2>
            <div className="spills reveal d1" role="list" aria-label="Skills list">
              {SKILLS.map((skill) => (
                <span key={skill} className="sp" role="listitem">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <FeaturedIn />

        {/* ── EXPERIENCE ── (pinned background word, like the LEARN section) */}
        <section id="exp" aria-labelledby="exp-heading">
          <div className="exp-pin-bg" aria-hidden="true"><span className="pin-word">WORK</span></div>
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">Experience</div>
            <h2 className="sh reveal" id="exp-heading">Projects <em>Led</em></h2>
            <div className="ecards">
              <article className="ecard reveal d1">
                <div className="etop"><div className="erole">Educator</div><span className="edate">Sep 2025 – Present</span></div>
                <div className="eorg">The Science Brainery · Boralesgamuwa</div>
                <p className="ebody">Teaching Pearson Edexcel Science, Mathematics and Computing for Grades 5–8. Lessons built for conceptual clarity, real application and genuine engagement.</p>
                <div className="etags"><span className="et">Teaching</span><span className="et">Edexcel</span><span className="et">Science</span><span className="et">Maths</span><span className="et">Computing</span></div>
              </article>
              <article className="ecard reveal d2">
                <div className="etop"><div className="erole">Senior Head Prefect</div><span className="edate">Sep 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School, Nugegoda</div>
                <p className="ebody">The school&apos;s highest-ranking prefect for two years. Directed Elysium &apos;25 at Cinnamon Life for 26,000+ Lyceumers, coordinated Maathra 14 at the BMICH with 750+ performers, and served as National Child Protection Ambassador.</p>
                <div className="etags"><span className="et">Leadership</span><span className="et">Event Direction</span><span className="et">26,000+ Audience</span></div>
              </article>
              <article className="ecard reveal d3">
                <div className="etop"><div className="erole">Audio Engineer</div><span className="edate">Oct 2025 – Mar 2026</span></div>
                <div className="eorg">PEARLBAY® Holdings</div>
                <p className="ebody">Advanced music production — DAW architecture, MIDI sequencing and VST work, plus studio recording, mixing and mastering through to final delivery.</p>
                <div className="etags"><span className="et">Audio Engineering</span><span className="et">Mixing &amp; Mastering</span><span className="et">DAW</span></div>
              </article>
              <article className="ecard reveal d4">
                <div className="etop"><div className="erole">Founder — Swara Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School</div>
                <p className="ebody">Created Sri Lanka&apos;s largest island-wide school Eastern music concert, uniting 700+ performers from every Lyceum branch. Led end-to-end: coordination, logistics, marketing and the show itself.</p>
                <div className="etags"><span className="et">Concert Production</span><span className="et">700+ Performers</span><span className="et">Island-wide</span></div>
              </article>
              <article className="ecard reveal d5">
                <div className="etop"><div className="erole">Founder — Padura Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School</div>
                <p className="ebody">An original instrumental concert series spotlighting student talent in Western and fusion traditions — from creative direction through to live execution.</p>
                <div className="etags"><span className="et">Concert Production</span><span className="et">Instrumental</span><span className="et">Creative Direction</span></div>
              </article>
              {showAllExp && (
                <>
                  <article className="ecard">
                    <div className="etop"><div className="erole">Founding President — Eastern Music Club</div><span className="edate">Sep 2023 – Sep 2025</span></div>
                    <div className="eorg">Lyceum International School, Nugegoda</div>
                    <p className="ebody">Built the Eastern Music Club from scratch into an active platform for classical and contemporary Eastern performance.</p>
                    <div className="etags"><span className="et">Start-up Leadership</span><span className="et">Music</span><span className="et">Club Management</span></div>
                  </article>
                  <article className="ecard">
                    <div className="etop"><div className="erole">Head of Logistics — Model UN</div><span className="edate">Dec 2023 – Dec 2024</span></div>
                    <div className="eorg">LISMUN &amp; SLMUN Conferences</div>
                    <p className="ebody">Ran end-to-end logistics for Model UN conferences — venue, delegate registration, resources and on-ground operations across multi-day events.</p>
                    <div className="etags"><span className="et">Logistics</span><span className="et">Model UN</span><span className="et">Operations</span></div>
                  </article>
                  <article className="ecard">
                    <div className="etop"><div className="erole">News Reporter &amp; Voice Actor</div><span className="edate">Sep 2019 – Sep 2024</span></div>
                    <div className="eorg">Institute of Media &amp; Performing Arts</div>
                    <p className="ebody">Trained in news reporting, voice acting, dubbing and narration — building vocal control and expressive storytelling across genres.</p>
                    <div className="etags"><span className="et">Voice Acting</span><span className="et">News Reporting</span><span className="et">Dubbing</span></div>
                  </article>
                  <article className="ecard">
                    <div className="etop"><div className="erole">Aviator — Flight Training</div><span className="edate">Sep 2020 – Mar 2021</span></div>
                    <div className="eorg">Sri Lanka Air Force · Ratmalana</div>
                    <p className="ebody">Completed a full aviation programme across beginner, intermediate and advanced levels — theory plus hands-on flight training and aircraft operations.</p>
                    <div className="etags"><span className="et">Aviation</span><span className="et">Flight Training</span><span className="et">SLAF</span></div>
                  </article>
                  <article className="ecard">
                    <div className="etop"><div className="erole">Regional Relief Drive Lead</div><span className="edate">Ongoing</span></div>
                    <div className="eorg">Kurunegala, Sri Lanka</div>
                    <p className="ebody">Leads community relief efforts in Kurunegala — coordinating volunteers and resources for real, on-the-ground impact.</p>
                    <div className="etags"><span className="et">Community Service</span><span className="et">Volunteering</span><span className="et">Social Impact</span></div>
                  </article>
                </>
              )}
              <button type="button" className="show-more-btn" onClick={() => setShowAllExp((s) => !s)} aria-expanded={showAllExp} aria-controls="exp">
                {showAllExp ? "Show less" : "Show more →"}
              </button>
            </div>
          </div>
        </section>

        {/* ── LINKEDIN ── */}
        <section id="linkedin" aria-labelledby="li-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">From LinkedIn</div>
            <h2 className="sh reveal" id="li-heading">Latest <em>Posts</em></h2>
            <div className="li-grid reveal d1">
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7467136600683073536?collapsed=1" height="540" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 1" referrerPolicy="no-referrer-when-downgrade" />
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7463987225429708800?collapsed=1" height="540" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 2" referrerPolicy="no-referrer-when-downgrade" />
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7399673996285358080?collapsed=1" height="540" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 3" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section id="achieve" aria-labelledby="achieve-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">Honours &amp; Awards</div>
            <h2 className="sh reveal" id="achieve-heading">Achievements <em>Earned</em></h2>
            <div className="agrid">
              <article className="acard reveal d1"><div className="amed" aria-hidden="true">🏆</div><div className="atitle">All-Island Dancing Champion</div><div className="abadge">Island 1st · 2018, 2019, 2023</div><p className="abody">Three-time national champion in competitive dance at the All-Island level.</p></article>
              <article className="acard reveal d2"><div className="amed" aria-hidden="true">🎵</div><div className="atitle">All-Island Music Champion</div><div className="abadge">Island 1st · 2019, 2023, 2024</div><p className="abody">Three-time national music champion at the highest competitive level.</p></article>
              <article className="acard reveal d3"><div className="amed" aria-hidden="true">🌏</div><div className="atitle">Malaysian World Choral Competition</div><div className="abadge">1st Place · International</div><p className="abody">Represented Sri Lanka on the world stage — and took first place.</p></article>
              <article className="acard reveal d4"><div className="amed" aria-hidden="true">🎭</div><div className="atitle">British-Lanka Festival of Performing Arts</div><div className="abadge">First Place</div><p className="abody">Top honours at one of Sri Lanka&apos;s most prestigious performing-arts competitions.</p></article>
              <article className="acard reveal d5"><div className="amed" aria-hidden="true">🌐</div><div className="atitle">WWF · United Nations Resolution</div><div className="abadge">First Place</div><p className="abody">First place at a WWF-affiliated Model UN in international policy debate.</p></article>
              <article className="acard reveal d6"><div className="amed" aria-hidden="true">♟️</div><div className="atitle">National Chess Championship</div><div className="abadge">1st Place · 2016</div><p className="abody">National champion — strategy that reaches well beyond the stage.</p></article>
            </div>
          </div>
        </section>

        {/* ── CREDENTIALS ── */}
        <section id="certs" aria-labelledby="certs-heading">
          <div className="sw" data-tilt>
            <div className="eyebrow reveal">Education &amp; Qualifications</div>
            <h2 className="sh reveal" id="certs-heading">Credentials <em>Earned</em></h2>
            <div className="cgrid">
              <div className="ccard reveal d1"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Sangeetha Visharadha</div><div className="cfrom">Bathkandhe Sangit Vidhyapith · 6 Years · First Division</div></div></div>
              <div className="ccard reveal d2"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div><div className="cname">Aviation Course</div><div className="cfrom">Sri Lanka Air Force · Ratmalana</div></div></div>
              <div className="ccard reveal d3"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div><div><div className="cname">Professional Compering</div><div className="cfrom">Institute of Media &amp; Performing Arts</div></div></div>
              <div className="ccard reveal d4"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><div><div className="cname">Diploma in Information Technology</div><div className="cfrom">ESOFT Metro Campus · 2022</div></div></div>
              <div className="ccard reveal d5"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></svg></div><div><div className="cname">Diploma in Western Music</div><div className="cfrom">Lyceum International School · 2023</div></div></div>
              <div className="ccard reveal d6"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><div className="cname">Cambridge GCE O/Level</div><div className="cfrom">A* Sinhala · A Physics · A Maths · A Biology</div></div></div>
              <div className="ccard reveal d1"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Leadership Award</div><div className="cfrom">Institute for Professional Development · 2022</div></div></div>
              <div className="ccard reveal d2"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Graduated — Lyceum International School</div><div className="cfrom">Nugegoda · 14 Years · Outstanding Student</div></div></div>
              <div className="ccard reveal d3"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Ranwala Balakaya — Outstanding Award</div><div className="cfrom">Ranwala Foundation · 2015, 2016</div></div></div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" aria-labelledby="contact-heading">
          <div className="cc" data-tilt>
            <div className="eyebrow reveal" style={{ justifyContent: "center" }}>Get in Touch</div>
            <h2 className="cth reveal" id="contact-heading">Ready to<br /><em>talk?</em></h2>
            <p className="ctsub reveal d1">A class, a collaboration, a performance, or a good conversation — the inbox is always open.</p>
            <div className="cbtns reveal d2">
              <a href="mailto:bhanumendis@gmail.com" className="cb prim">Email</a>
              <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" className="cb">LinkedIn</a>
              <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="cb">Instagram</a>
              <a href="tel:+94777124152" className="cb">Call</a>
            </div>
          </div>
        </section>

        {/* ── FIND US ── */}
        <section id="findus" aria-labelledby="findus-heading">
          <div className="map-panel">
            <div className="map-info" data-tilt>
              <div className="eyebrow reveal">Find Us</div>
              <h2 className="sh reveal" id="findus-heading">The Science<br /><em>Brainery</em></h2>
              <p className="map-addr reveal d1">
                No. 2, Malani Bulathsinghala Mawatha,<br />
                Boralesgamuwa, Sri Lanka
              </p>
              <div className="map-actions reveal d2">
                <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="cb prim">Open in Google Maps</a>
                <a href="tel:+94777124152" className="cb">Call</a>
              </div>
              <MagneticButton href={REGISTER_FORM} external className="btn-fill map-register reveal d3" ariaLabel="Register for classes">
                Register for Classes →
              </MagneticButton>
            </div>
            <div className="map-embed reveal d2">
              <iframe
                title="Map to The Science Brainery, Boralesgamuwa"
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=The%20Science%20Brainery%2C%20Boralesgamuwa&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
