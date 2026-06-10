"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import FeaturedIn from "./FeaturedIn";
import MagneticButton from "./MagneticButton";
import Counter from "./Counter";

const SLIDES = ["/slides/slide-5.jpg", "/slides/slide-8.jpg"] as const;

const SKILLS: readonly string[] = [
  "Team Leadership", "People Management", "Event Strategy", "Event Production",
  "Public Speaking", "Compering", "Vocal Performance", "Instrumental Music",
  "Creative Direction", "Audio Engineering", "Cubase 14 Pro", "Photography",
  "Visual Media", "Programming & Computing", "Cross-team Coordination",
  "Execution Under Deadline", "Stage & Audience Presence", "Peer Mentoring",
  "Teaching", "Voice Acting", "News Reporting", "MIDI Sequencing",
  "Mixing & Mastering", "DAW Architecture",
];

export default function Home() {
  const [showAllExp, setShowAllExp] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxDist = Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y)
    );
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    const size = maxDist * 2.2;
    ripple.style.cssText = `position:fixed;z-index:9999;pointer-events:none;border-radius:50%;width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px;background:${isDark ? "#f4f6fa" : "#06090e"};transform:scale(0);`;
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transition = "transform .7s cubic-bezier(.2,.9,.3,1.05)";
      ripple.style.transform = "scale(1)";
    });
    window.setTimeout(() => {
      setIsDark((prev) => !prev);
      document.body.classList.toggle("light");
      ripple.style.transition = "opacity .3s ease";
      ripple.style.opacity = "0";
      window.setTimeout(() => ripple.remove(), 350);
    }, 650);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((p) => (p + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = window.setInterval(nextSlide, 4500);
    return () => window.clearInterval(t);
  }, [nextSlide]);

  useEffect(() => {
    const cd = document.getElementById("cd");
    const cr = document.getElementById("cr");
    const prog = document.getElementById("prog");
    const nav = document.getElementById("nav");
    const scrollBtn = document.getElementById("scroll-top");
    if (!cd || !cr || !prog || !nav) return;

    let mx = 0, my = 0, rx = 0, ry = 0, frame = 0;
    let usingMouse = false;

    if (window.matchMedia("(pointer: coarse)").matches) {
      document.body.classList.remove("using-mouse");
    } else {
      usingMouse = true;
      document.body.classList.add("using-mouse");
    }

    // Hoisted out of the mousemove handler — DOM lookups per event were
    // wasted main-thread work (these nodes never change while mounted).
    const heroContent = document.getElementById("hero-content");
    const heroH1 = heroContent?.querySelector<HTMLElement>(".h1") ?? null;

    const onMouseMove = (e: MouseEvent) => {
      if (!usingMouse) {
        usingMouse = true;
        document.body.classList.add("using-mouse");
      }
      mx = e.clientX; my = e.clientY;
      cd.style.left = `${mx}px`; cd.style.top = `${my}px`;
      if (heroContent) {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
        heroContent.style.transform = `translate(${-dx * 18}px, ${-dy * 12}px)`;
        if (heroH1) {
          const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const glow = Math.max(0, 1 - dist / maxDist);
          heroH1.style.textShadow = `0 0 ${20 + glow * 35}px rgba(120,192,245,${0.1 + glow * 0.25}), 0 0 ${50 + glow * 50}px rgba(120,192,245,${0.03 + glow * 0.1})`;
        }
      }
    };

    const onTouchStart = () => {
      usingMouse = false;
      document.body.classList.remove("using-mouse");
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        usingMouse = false;
        document.body.classList.remove("using-mouse");
      } else if (e.pointerType === "mouse" || e.pointerType === "pen") {
        usingMouse = true;
        document.body.classList.add("using-mouse");
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.22; ry += (my - ry) * 0.22;
      cr.style.left = `${rx}px`; cr.style.top = `${ry}px`;
      frame = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const s = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;
      prog.style.width = `${h > 0 ? (s / h) * 100 : 0}%`;
      nav.classList.toggle("scrolled", s > 50);
      if (scrollBtn) scrollBtn.classList.toggle("visible", s > 400);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    loop();

    const hoverEls = document.querySelectorAll<HTMLElement>(
      "a,button,.hsc,.srow,.acard,.ccard,.ecard,.sp,.soc-btn,.foot-link,.scroll-top,.show-more-btn,.theme-btn,.sidebar-right a,.slide-dot"
    );
    const onEnter = () => document.body.classList.add("cg");
    const onLeave = () => document.body.classList.remove("cg");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        entry.target.classList.toggle("in", entry.isIntersecting);
      }),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div id="cd" aria-hidden="true" />
      <div id="cr" aria-hidden="true" />
      <div id="prog" aria-hidden="true" role="progressbar" aria-label="Page scroll progress" />

      <div className="sidebar-right" aria-label="Social links">
        <div className="sidebar-line" aria-hidden="true" />
        <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">Ig.</a>
        <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" aria-label="Facebook via Linktree">Fb.</a>
        <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">In.</a>
        <div className="sidebar-line" aria-hidden="true" />
      </div>

      <div className="sidebar-left" aria-label="Theme and navigation controls">
        <div className="theme-toggle" role="group" aria-label="Theme toggle">
          <button type="button" className={`theme-btn ${!isDark ? "active" : ""}`} onClick={(e) => { if (isDark) toggleTheme(e); }} aria-pressed={!isDark} aria-label="Switch to light mode">☀</button>
          <button type="button" className={`theme-btn ${isDark ? "active" : ""}`} onClick={(e) => { if (!isDark) toggleTheme(e); }} aria-pressed={isDark} aria-label="Switch to dark mode">☾</button>
        </div>
        <a href="#" className="scroll-label" aria-label="Scroll to top of page">Scroll to top</a>
        <div className="s-line" aria-hidden="true" />
      </div>

      <nav id="nav" aria-label="Main navigation">
        <a href="#" className="logo" aria-label="Bhanu Mendis — home">
          <span className="logo-dot" aria-hidden="true" />
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </a>
        <ul className="nav-links" role="list">
          <li><a href="#about">About</a></li>
          <li><a href="#exp">Experience</a></li>
          <li><a href="#achieve">Awards</a></li>
          <li><a href="/timeline">Timeline</a></li>
          <li><a href="#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      <main>
        <section id="hero" aria-labelledby="hero-name">
          <Image src="/hero-bg.jpg" alt="" className="hero-bg-img" aria-hidden="true" fill sizes="100vw" preload />
          <div className="hero-bg-overlay" aria-hidden="true" />
          <div className="orb oa" aria-hidden="true" />
          <div className="orb ob" aria-hidden="true" />
          <div className="orb oc" aria-hidden="true" />
          <div id="hero-content" className="hero-content">
            <h1 className="h1" id="hero-name">BHANU<br /><span className="blue">MENDIS</span></h1>
            <p className="h-sub">Public Speaker · Audio Engineer · Artist · Educator · Visharadha</p>
            <p className="h-tagline">Break the Frame</p>
            <div className="h-actions">
              <MagneticButton href="#contact" className="btn-fill" ariaLabel="Go to contact section">Contact</MagneticButton>
              <MagneticButton href="#about" className="btn-out" ariaLabel="Explore the site">
                Explore
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
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
        </section>

        <a href="#" id="scroll-top" className="scroll-top" aria-label="Scroll back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </a>

        <div className="rule" aria-hidden="true" />

        <section id="about" aria-labelledby="about-heading">
          <div className="sw">
            <div className="eyebrow reveal">About</div>
            <h2 className="sh reveal" id="about-heading">A creative, a leader,<br />and a <em>builder.</em></h2>
            <div className="al">
              <div className="reveal d1">
                <div className="ayubowan-about" lang="si">ආයුබෝවන්</div>
                <div className="atext">
                  <p><strong>Bhanu Mendis</strong> is a multi-disciplinary leader, performing artist, and audio engineer based in <em>Colombo, Sri Lanka</em> — operating at the intersection of creativity and operational precision.</p>
                  <p>As <strong>2024/2025 Senior Head Prefect</strong> at Lyceum International School, landmark events were directed including the <em>Elysium &apos;25 graduation</em> at Cinnamon Life — City of Dreams, an entirely student-led ceremony for over <strong>26,000 Lyceumers nationwide</strong>. <em>Maathra 14</em> at BMICH was overall coordinated, managing operations for <strong>750+ performers</strong>.</p>
                  <p>A qualified <strong>Sangeetha Visharadha</strong> (First Division) with 6 years of classical training at Bathkandhe Sangit Vidhyapith, and a certified audio engineer trained at <em>Pearl Bay Institute</em>. Multiple national and international titles in music and dance complement an active role as <strong>National Child Protection Ambassador</strong> and leader of regional relief drives in Kurunegala.</p>
                </div>
              </div>
              <div className="about-right reveal d2">
                <Image src="/favicon.png" alt="Bhanu Mendis — profile photo" className="about-photo" width={120} height={120} />
                <div className="srow"><div className="sval"><Counter value={26} suffix="K+" /></div><div className="sdesc">Lyceumers at Elysium &apos;25</div></div>
                <div className="srow"><div className="sval"><Counter value={750} suffix="+" /></div><div className="sdesc">Performers managed across productions</div></div>
                <div className="srow"><div className="sval"><Counter value={14} /></div><div className="sdesc">Years at Lyceum International</div></div>
                <div className="srow"><div className="sval">1st</div><div className="sdesc">Malaysian World Choral Competition</div></div>
              </div>
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="skills" aria-labelledby="skills-heading">
          <div className="sw">
            <div className="eyebrow reveal">Core Skills</div>
            <h2 className="sh reveal" id="skills-heading">Skills &amp; <em>Strengths</em></h2>
            <div className="spills reveal d1" role="list" aria-label="Skills list">
              {SKILLS.map((skill) => (
                <span key={skill} className="sp" role="listitem">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="gallery" aria-label="Photo gallery" onContextMenu={(e) => e.preventDefault()}>
          <div className="slideshow" role="region" aria-label="Automatic photo slideshow" aria-live="polite">
            <div className="slide-overlay" aria-hidden="true" />
            {SLIDES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`Gallery photo ${i + 1} — Bhanu Mendis`}
                className={i === currentSlide ? "active" : ""}
                draggable={false}
                fill
                sizes="100vw"
              />
            ))}
            <div className="slide-dots" role="tablist" aria-label="Slideshow navigation">
              {SLIDES.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`slide-dot ${i === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(i)}
                  role="tab"
                  aria-selected={i === currentSlide ? "true" : "false"}
                  aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <FeaturedIn />

        <div className="rule" aria-hidden="true" />

        <section id="exp" aria-labelledby="exp-heading">
          <div className="sw">
            <div className="eyebrow reveal">Experience</div>
            <h2 className="sh reveal" id="exp-heading">Projects <em>Led</em></h2>
            <div className="ecards">
              <div className="ecard reveal d1">
                <div className="etop"><div className="erole">Educator</div><span className="edate">Sep 2025 – Present</span></div>
                <div className="eorg">The Science Brainery · Part-time · Boralesgamuwa</div>
                <div className="ebody">Teaching Pearson International Edexcel Science, Mathematics, and Computer Science for Year 5, 6, 7 &amp; 8. Curriculum-aligned lessons focused on conceptual clarity, practical application, and student engagement.</div>
                <div className="etags"><span className="et">Education</span><span className="et">Teaching</span><span className="et">Edexcel</span><span className="et">Science</span><span className="et">Mathematics</span></div>
              </div>
              <div className="ecard reveal d2">
                <div className="etop"><div className="erole">Senior Head Prefect</div><span className="edate">Sep 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School, Nugegoda</div>
                <div className="ebody">School-wide student governance as the highest-ranking prefect for two years. Directed Elysium &apos;25 at Cinnamon Life for 26,000+ Lyceumers nationwide. Overall coordinated Maathra 14 at BMICH with 750+ performers. Appointed National Child Protection Ambassador.</div>
                <div className="etags"><span className="et">Executive Leadership</span><span className="et">Event Direction</span><span className="et">26,000+ Audience</span><span className="et">BMICH · Cinnamon Life</span></div>
              </div>
              <div className="ecard reveal d3">
                <div className="etop"><div className="erole">Audio Engineer</div><span className="edate">Oct 2025 – Mar 2026</span></div>
                <div className="eorg">PEARLBAY® Holdings</div>
                <div className="ebody">Advanced training in music production, DAW architecture, MIDI sequencing, and VST integration. Expertise in studio recording, gain staging, mixing, mastering, frequency balancing, and final master delivery.</div>
                <div className="etags"><span className="et">Audio Engineering</span><span className="et">Mixing &amp; Mastering</span><span className="et">DAW</span><span className="et">Recording</span></div>
              </div>
              <div className="ecard reveal d4">
                <div className="etop"><div className="erole">Founder — Swara Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School</div>
                <div className="ebody">Conceptualized and launched SWARA — the largest island-wide school-based Eastern music concert — uniting students from all Lyceum branches, showcasing 700+ participants. All aspects led end-to-end: coordination, logistics, marketing, and audience engagement.</div>
                <div className="etags"><span className="et">Concert Production</span><span className="et">700+ Performers</span><span className="et">Island-wide</span><span className="et">Eastern Music</span></div>
              </div>
              <div className="ecard reveal d5">
                <div className="etop"><div className="erole">Founder — Padura Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
                <div className="eorg">Lyceum International School</div>
                <div className="ebody">Created and led an original instrumental music concert series showcasing student talent in Western and fusion traditions. Full production managed from creative direction through performer coordination and live execution.</div>
                <div className="etags"><span className="et">Concert Production</span><span className="et">Instrumental Music</span><span className="et">Creative Direction</span></div>
              </div>
              {showAllExp && (
                <>
                  <div className="ecard">
                    <div className="etop"><div className="erole">Founding President — Eastern Music Club</div><span className="edate">Sep 2023 – Sep 2025</span></div>
                    <div className="eorg">Lyceum International School, Nugegoda</div>
                    <div className="ebody">Founded and built the Eastern Music Club from the ground up into an active platform for classical and contemporary Eastern music performance within the school community.</div>
                    <div className="etags"><span className="et">Start-up Leadership</span><span className="et">Music</span><span className="et">Club Management</span></div>
                  </div>
                  <div className="ecard">
                    <div className="etop"><div className="erole">Head of Logistics — Model UN</div><span className="edate">Dec 2023 – Dec 2024</span></div>
                    <div className="eorg">LISMUN &amp; SLMUN Conferences</div>
                    <div className="ebody">End-to-end logistics managed for Model United Nations conferences — venue setup, delegate registration, resource allocation, and on-ground operations across multi-day events.</div>
                    <div className="etags"><span className="et">Logistics</span><span className="et">Model UN</span><span className="et">Event Operations</span></div>
                  </div>
                  <div className="ecard">
                    <div className="etop"><div className="erole">News Reporter &amp; Voice Actor</div><span className="edate">Sep 2019 – Sep 2024</span></div>
                    <div className="eorg">Institute of Media &amp; Performing Arts · Institute of Professional Development</div>
                    <div className="ebody">Professional training in news reporting, voice acting, dubbing, and narration. Vocal control, character development, and expressive storytelling developed across multiple genres.</div>
                    <div className="etags"><span className="et">Voice Acting</span><span className="et">News Reporting</span><span className="et">Dubbing</span></div>
                  </div>
                  <div className="ecard">
                    <div className="etop"><div className="erole">Aviator — Flight Training</div><span className="edate">Sep 2020 – Mar 2021</span></div>
                    <div className="eorg">Sri Lanka Air Force · Ratmalana Air Force Base</div>
                    <div className="ebody">Comprehensive aviation program completed across beginner, intermediate, and advanced levels — combining theoretical knowledge with hands-on flight training, aircraft operations, and aviation protocols.</div>
                    <div className="etags"><span className="et">Aviation</span><span className="et">Flight Training</span><span className="et">SLAF</span></div>
                  </div>
                  <div className="ecard">
                    <div className="etop"><div className="erole">Regional Relief Drive Lead</div><span className="edate">Ongoing</span></div>
                    <div className="eorg">Kurunegala, Sri Lanka</div>
                    <div className="ebody">Community relief initiatives spearheaded in the Kurunegala district — coordinating volunteers and resources for on-the-ground impact. Logistical planning combined with grassroots community engagement.</div>
                    <div className="etags"><span className="et">Community Service</span><span className="et">Volunteer Coordination</span><span className="et">Social Impact</span></div>
                  </div>
                </>
              )}
              <button type="button" className="show-more-btn" onClick={() => setShowAllExp((s) => !s)} aria-expanded={showAllExp} aria-controls="exp">
                {showAllExp ? "Show less ↑" : "Show more ↓"}
              </button>
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="linkedin" aria-labelledby="li-heading">
          <div className="sw">
            <div className="eyebrow reveal">From LinkedIn</div>
            <h2 className="sh reveal" id="li-heading">Latest <em>Posts</em></h2>
            <div className="li-grid reveal d1">
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7467136600683073536?collapsed=1" height="622" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 1" referrerPolicy="no-referrer-when-downgrade" />
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7463987225429708800?collapsed=1" height="622" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 2" referrerPolicy="no-referrer-when-downgrade" />
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7399673996285358080?collapsed=1" height="622" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 3" referrerPolicy="no-referrer-when-downgrade" />
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7434580059035848705?collapsed=1" height="622" frameBorder="0" allowFullScreen loading="lazy" title="LinkedIn post — Bhanu Mendis 4" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="achieve" aria-labelledby="achieve-heading">
          <div className="sw">
            <div className="eyebrow reveal">Honours &amp; Awards</div>
            <h2 className="sh reveal" id="achieve-heading">Achievements <em>Earned</em></h2>
            <div className="agrid">
              <div className="acard reveal d1"><div className="amed" aria-hidden="true">🏆</div><div className="atitle">All-Island Dancing Champion</div><div className="abadge">Island 1st · 2018, 2019, 2023</div><div className="abody">Three-time national champion in competitive dance at the All-Island level.</div></div>
              <div className="acard reveal d2"><div className="amed" aria-hidden="true">🎵</div><div className="atitle">All-Island Music Champion</div><div className="abadge">Island 1st · 2019, 2023, 2024</div><div className="abody">Three-time national music champion at the highest competitive level.</div></div>
              <div className="acard reveal d3"><div className="amed" aria-hidden="true">🌏</div><div className="atitle">Malaysian World Choral Competition</div><div className="abadge">1st Place · International</div><div className="abody">Sri Lanka represented on the world stage — first place secured internationally.</div></div>
              <div className="acard reveal d4"><div className="amed" aria-hidden="true">🎭</div><div className="atitle">British-Lanka Festival of Performing Arts</div><div className="abadge">First Place</div><div className="abody">Top honours at one of Sri Lanka&apos;s most prestigious cross-cultural performing arts competitions.</div></div>
              <div className="acard reveal d5"><div className="amed" aria-hidden="true">🌐</div><div className="atitle">WWF · United Nations Resolution</div><div className="abadge">First Place</div><div className="abody">First place at a WWF-affiliated Model UN conference in international policy debate.</div></div>
              <div className="acard reveal d6"><div className="amed" aria-hidden="true">♟️</div><div className="atitle">National Chess Championship</div><div className="abadge">1st Place · 2016</div><div className="abody">National champion — strategic thinking that extends well beyond the stage.</div></div>
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="certs" aria-labelledby="certs-heading">
          <div className="sw">
            <div className="eyebrow reveal">Education &amp; Qualifications</div>
            <h2 className="sh reveal" id="certs-heading">Credentials <em>Earned</em></h2>
            <div className="cgrid">
              <div className="ccard reveal d1"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Sangeetha Visharadha</div><div className="cfrom">Bathkandhe Sangit Vidhyapith · 6 Years · First Division</div></div></div>
              <div className="ccard reveal d2"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></svg></div><div><div className="cname">Audio Engineering</div><div className="cfrom">PEARLBAY® Holdings · Pearl Bay Institute</div></div></div>
              <div className="ccard reveal d3"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div><div className="cname">Aviation Course</div><div className="cfrom">Sri Lanka Air Force · Ratmalana</div></div></div>
              <div className="ccard reveal d4"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div><div><div className="cname">Professional Compering</div><div className="cfrom">Institute of Media &amp; Performing Arts</div></div></div>
              <div className="ccard reveal d5"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><div><div className="cname">Diploma in Information Technology</div><div className="cfrom">ESOFT Metro Campus · 2022</div></div></div>
              <div className="ccard reveal d6"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></svg></div><div><div className="cname">Diploma in Western Music</div><div className="cfrom">Lyceum International School · 2023</div></div></div>
              <div className="ccard reveal d1"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><div className="cname">Cambridge GCE O/Level</div><div className="cfrom">A* Sinhala · A Physics · A Maths · A Biology</div></div></div>
              <div className="ccard reveal d2"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Leadership Award</div><div className="cfrom">Institute for Professional Development · 2022</div></div></div>
              <div className="ccard reveal d3"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Graduated — Lyceum International School</div><div className="cfrom">Nugegoda · 14 Years · Outstanding Student</div></div></div>
              <div className="ccard reveal d4"><div className="cico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Ranwala Balakaya — Outstanding Award</div><div className="cfrom">Ranwala Foundation · 2015, 2016</div></div></div>
            </div>
          </div>
        </section>

        <div className="rule" aria-hidden="true" />

        <section id="contact" aria-labelledby="contact-heading">
          <div className="cc">
            <div className="eyebrow reveal" style={{ justifyContent: "center" }}>Get in Touch</div>
            <h2 className="cth reveal" id="contact-heading">Ready to<br /><em>talk?</em></h2>
            <p className="ctsub reveal d1">Whether a collaboration, an opportunity, a performance, or a great conversation — the inbox is always open.</p>
            <div className="cbtns reveal d2">
              <a href="mailto:bhanumendis@gmail.com" className="cb prim">Email</a>
              <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" className="cb">LinkedIn</a>
              <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="cb">Instagram</a>
              <a href="tel:+94777124152" className="cb">Call</a>
            </div>
            <MagneticButton href="https://forms.gle/N52vwAytUsJCt2df6" external className="student-reg reveal d3" ariaLabel="Student registration form">
              Student Registration →
            </MagneticButton>
          </div>
        </section>
      </main>
    </>
  );
}