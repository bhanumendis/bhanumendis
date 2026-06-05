"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [showAllExp, setShowAllExp] = useState(false);

  useEffect(() => {
    const cd = document.getElementById("cd");
    const cr = document.getElementById("cr");
    const prog = document.getElementById("prog");
    const nav = document.getElementById("nav");
    const scrollBtn = document.getElementById("scroll-top");
    if (!cd || !cr || !prog || !nav) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let frame: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cd.style.left = mx + "px"; cd.style.top = my + "px";
      // Interactive glow on nav logo
      const logo = document.querySelector(".logo-text.sinhala") as HTMLElement;
      if (logo) {
        const rect = logo.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / 80;
        const dy = (e.clientY - cy) / 80;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist < 300) {
          logo.style.transform = `translateX(${dx}px) translateY(${dy * 0.5}px) rotate(${dx * 0.3}deg)`;
          const glow = Math.max(0.2, 1 - dist / 300);
          logo.style.textShadow = `0 0 ${18 + glow * 20}px rgba(120,192,245,${0.25 + glow * 0.35}), 0 0 ${40 + glow * 30}px rgba(120,192,245,${0.08 + glow * 0.15})`;
        } else {
          logo.style.transform = "";
          logo.style.textShadow = "";
        }
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      cr.style.left = rx + "px"; cr.style.top = ry + "px";
      frame = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      const s = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (s / h * 100) + "%";
      nav.classList.toggle("scrolled", s > 50);
      if (scrollBtn) scrollBtn.classList.toggle("visible", s > 400);
    };

    document.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    loop();

    const hoverEls = document.querySelectorAll(
      "a,button,.hsc,.srow,.acard,.ccard,.ecard,.sp,.soc-btn,.foot-link,.scroll-top,.show-more-btn"
    );
    const onEnter = () => document.body.classList.add("cg");
    const onLeave = () => document.body.classList.remove("cg");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); }
          else { e.target.classList.remove("in"); }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener("mousemove", onMove);
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
      <div id="cd"></div>
      <div id="cr"></div>
      <div id="prog"></div>

      <nav id="nav">
        <a href="#" className="logo">
          <span className="logo-dot"></span>
          <span className="logo-text sinhala">භානු මෙන්ඩිස්</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#exp">Experience</a></li>
          <li><a href="#achieve">Awards</a></li>
          <li><a href="#certs">Credentials</a></li>
          <li><a href="#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      <section id="hero">
        <div className="orb oa"></div>
        <div className="orb ob"></div>
        <div className="orb oc"></div>

        <div className="hero-ayubowan">ආයුබෝවන්</div>
        <h1 className="h1">BHANU<br /><span className="blue">MENDIS</span></h1>
        <p className="h-sub">Public Speaker · Audio Engineer · Artist · Educator · Visharadha</p>
        <p className="h-tagline">Break the Frame</p>

        <div className="h-actions">
          <a href="#contact" className="btn-fill">Contact</a>
          <a href="#about" className="btn-out">
            Explore
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </a>
        </div>

        <div className="h-stats">
          <div className="hsc"><div className="hsc-n">750+</div><div className="hsc-l">Performers led</div></div>
          <div className="hsc"><div className="hsc-n">12+</div><div className="hsc-l">National awards</div></div>
          <div className="hsc"><div className="hsc-n">6+</div><div className="hsc-l">Years leadership</div></div>
          <div className="hsc"><div className="hsc-n">1st</div><div className="hsc-l">World choral rank</div></div>
        </div>
      </section>

      <a href="#" id="scroll-top" className="scroll-top">
        <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </a>

      <div className="rule"></div>

      <section id="about">
        <div className="sw">
          <div className="eyebrow reveal">About me</div>
          <h2 className="sh reveal">A creative, a leader,<br />and a <em>builder.</em></h2>
          <div className="al">
            <div className="atext reveal d1">
              <p>I&apos;m <strong>Bhanu Mendis</strong> — a multi-disciplinary leader, performing artist, and audio engineer from <em>Colombo, Sri Lanka</em>. I operate at the rare intersection where creativity meets operational precision.</p>
              <p>As the <strong>2024/2025 Senior Head Prefect</strong> at Lyceum International School, I directed landmark events including the <em>Elysium &apos;25 graduation</em> at Cinnamon Life — City of Dreams, orchestrating an entirely student-led event for over <strong>26,000 Lyceumers nationwide</strong>. I also overall coordinated <em>Maathra 14</em> at BMICH, managing operations for over <strong>750 performers</strong>.</p>
              <p>I&apos;m a qualified <strong>Sangeetha Visharadha</strong> (First Division) with 6 years of classical music study at Bathkandhe Sangit Vidhyapith, a hands-on audio producer trained at <em>Pearl Bay Institute</em>, and an actively competing musician and dancer with multiple national and international titles. I also serve as a <strong>National Child Protection Ambassador</strong> and spearhead regional relief drives in Kurunegala — because real impact demands both technical excellence and genuine empathy.</p>
            </div>
            <div className="about-right reveal d2">
              <img src="/favicon.png" alt="Bhanu Mendis" className="about-photo" />
              <div className="srow"><div className="sval">26K+</div><div className="sdesc">Lyceumers at Elysium &apos;25</div></div>
              <div className="srow"><div className="sval">750+</div><div className="sdesc">Performers managed across productions</div></div>
              <div className="srow"><div className="sval">14</div><div className="sdesc">Years at Lyceum International</div></div>
              <div className="srow"><div className="sval">1st</div><div className="sdesc">Malaysian World Choral Competition</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="skills">
        <div className="sw">
          <div className="eyebrow reveal">What I bring</div>
          <h2 className="sh reveal">Skills &amp; <em>strengths</em></h2>
          <div className="spills reveal d1">
            <span className="sp">Team Leadership</span><span className="sp">People Management</span>
            <span className="sp">Event Strategy</span><span className="sp">Event Production</span>
            <span className="sp">Public Speaking</span><span className="sp">Compering</span>
            <span className="sp">Vocal Performance</span><span className="sp">Instrumental Music</span>
            <span className="sp">Creative Direction</span><span className="sp">Audio Engineering</span>
            <span className="sp">Cubase 14 Pro</span><span className="sp">Photography</span>
            <span className="sp">Visual Media</span><span className="sp">Programming &amp; Computing</span>
            <span className="sp">Cross-team Coordination</span><span className="sp">Execution Under Deadline</span>
            <span className="sp">Stage &amp; Audience Presence</span><span className="sp">Peer Mentoring</span>
            <span className="sp">Teaching</span><span className="sp">Voice Acting</span>
            <span className="sp">News Reporting</span><span className="sp">MIDI Sequencing</span>
            <span className="sp">Mixing &amp; Mastering</span><span className="sp">DAW Architecture</span>
          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="exp">
        <div className="sw">
          <div className="eyebrow reveal">Experience</div>
          <h2 className="sh reveal">Where I&apos;ve <em>led</em></h2>
          <div className="ecards">

            <div className="ecard reveal d1">
              <div className="etop"><div className="erole">Educator</div><span className="edate">Sep 2025 – Present</span></div>
              <div className="eorg">The Science Brainery · Part-time · Boralesgamuwa</div>
              <div className="ebody">Teaching Pearson International Edexcel Science, Mathematics, and Computer Science for Year 5, 6, 7 &amp; 8. Delivering curriculum-aligned lessons with a focus on conceptual clarity, practical application, and student engagement.</div>
              <div className="etags"><span className="et">Education</span><span className="et">Teaching</span><span className="et">Edexcel</span><span className="et">Science</span><span className="et">Mathematics</span></div>
            </div>

            <div className="ecard reveal d2">
              <div className="etop"><div className="erole">Senior Head Prefect</div><span className="edate">Sep 2023 – Sep 2025</span></div>
              <div className="eorg">Lyceum International School, Nugegoda</div>
              <div className="ebody">Led school-wide student governance as the highest-ranking prefect for two years. Directed the Elysium &apos;25 graduation ceremony at Cinnamon Life — City of Dreams, orchestrating an entirely student-led event for over 26,000 Lyceumers nationwide. Overall coordinated Maathra 14 at BMICH with 750+ performers. Served as National Child Protection Ambassador and primary liaison between the student body and senior administration.</div>
              <div className="etags"><span className="et">Executive Leadership</span><span className="et">Event Direction</span><span className="et">26,000+ Audience</span><span className="et">BMICH · Cinnamon Life</span></div>
            </div>

            <div className="ecard reveal d3">
              <div className="etop"><div className="erole">Audio Engineer</div><span className="edate">Oct 2025 – Mar 2026</span></div>
              <div className="eorg">PEARLBAY® Holdings</div>
              <div className="ebody">Advanced training in music production, DAW architecture, MIDI sequencing, and VST integration. Developed expertise in studio recording, microphone selection, gain staging, dynamic control, mixing, mastering, frequency balancing, stereo imaging, and final master delivery.</div>
              <div className="etags"><span className="et">Audio Engineering</span><span className="et">Mixing &amp; Mastering</span><span className="et">DAW</span><span className="et">Recording</span></div>
            </div>

            <div className="ecard reveal d4">
              <div className="etop"><div className="erole">Founder — Swara Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
              <div className="eorg">Lyceum International School</div>
              <div className="ebody">Conceptualized and launched SWARA, the largest island-wide school-based Eastern music concert, uniting students from all branches of Lyceum International Schools and showcasing the talents of over 700 participants. Led all aspects — coordinating hundreds of performers, managing logistics, marketing, and audience engagement from conception to execution.</div>
              <div className="etags"><span className="et">Concert Production</span><span className="et">700+ Performers</span><span className="et">Island-wide</span><span className="et">Eastern Music</span></div>
            </div>

            <div className="ecard reveal d5">
              <div className="etop"><div className="erole">Founder — Padura Concert</div><span className="edate">Dec 2023 – Sep 2025</span></div>
              <div className="eorg">Lyceum International School</div>
              <div className="ebody">Created and led an original instrumental music concert series showcasing student talent in Western and fusion traditions. Managed end-to-end production from creative direction through performer coordination and live execution.</div>
              <div className="etags"><span className="et">Concert Production</span><span className="et">Instrumental Music</span><span className="et">Creative Direction</span></div>
            </div>

            {showAllExp && (
            <>
            <div className="ecard reveal">
              <div className="etop"><div className="erole">Founding President — Eastern Music Club</div><span className="edate">Sep 2023 – Sep 2025</span></div>
              <div className="eorg">Lyceum International School, Nugegoda</div>
              <div className="ebody">Founded and led the Eastern Music Club, building it from the ground up into an active platform for classical and contemporary Eastern music performance within the school community.</div>
              <div className="etags"><span className="et">Start-up Leadership</span><span className="et">Music</span><span className="et">Club Management</span></div>
            </div>

            <div className="ecard reveal">
              <div className="etop"><div className="erole">Head of Logistics — Model UN</div><span className="edate">Dec 2023 – Dec 2024</span></div>
              <div className="eorg">LISMUN &amp; SLMUN Conferences</div>
              <div className="ebody">Managed end-to-end logistics for Model United Nations conferences, coordinating venue setup, delegate registration, resource allocation, and on-ground operations across multi-day events.</div>
              <div className="etags"><span className="et">Logistics</span><span className="et">Model UN</span><span className="et">Event Operations</span></div>
            </div>

            <div className="ecard reveal">
              <div className="etop"><div className="erole">News Reporter &amp; Voice Actor</div><span className="edate">Sep 2019 – Sep 2024</span></div>
              <div className="eorg">Institute of Media &amp; Performing Arts · Institute of Professional Development</div>
              <div className="ebody">Professional training in news reporting, voice acting, dubbing, and narration. Developed vocal control, character development, microphone techniques, and expressive storytelling across multiple genres.</div>
              <div className="etags"><span className="et">Voice Acting</span><span className="et">News Reporting</span><span className="et">Dubbing</span><span className="et">Narration</span></div>
            </div>

            <div className="ecard reveal">
              <div className="etop"><div className="erole">Aviator — Flight Training</div><span className="edate">Sep 2020 – Mar 2021</span></div>
              <div className="eorg">Sri Lanka Air Force · Ratmalana Air Force Base</div>
              <div className="ebody">Completed a comprehensive aviation program covering beginner, intermediate, and advanced levels — combining theoretical knowledge with hands-on flight training, aircraft operations, flight principles, and aviation protocols.</div>
              <div className="etags"><span className="et">Aviation</span><span className="et">Flight Training</span><span className="et">SLAF</span></div>
            </div>

            <div className="ecard reveal">
              <div className="etop"><div className="erole">Regional Relief Drive Lead</div><span className="edate">Ongoing</span></div>
              <div className="eorg">Kurunegala, Sri Lanka</div>
              <div className="ebody">Spearheads community relief initiatives in the Kurunegala district, coordinating volunteers and resources for on-the-ground impact. Combines logistical planning with grassroots community engagement.</div>
              <div className="etags"><span className="et">Community Service</span><span className="et">Volunteer Coordination</span><span className="et">Social Impact</span></div>
            </div>
            </>
            )}

            <button className="show-more-btn" onClick={() => setShowAllExp(!showAllExp)}>
              {showAllExp ? "Show less ↑" : "Show more ↓"}
            </button>

          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="linkedin">
        <div className="sw">
          <div className="eyebrow reveal">From LinkedIn</div>
          <h2 className="sh reveal">Latest <em>posts</em></h2>
          <div className="li-grid reveal d1">
            <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7467136600683073536?collapsed=1" height="622" frameBorder="0" allowFullScreen title="LinkedIn post 1"></iframe>
            <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7463987225429708800?collapsed=1" height="622" frameBorder="0" allowFullScreen title="LinkedIn post 2"></iframe>
            <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7399673996285358080?collapsed=1" height="622" frameBorder="0" allowFullScreen title="LinkedIn post 3"></iframe>
            <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7434580059035848705?collapsed=1" height="622" frameBorder="0" allowFullScreen title="LinkedIn post 4"></iframe>
          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="achieve">
        <div className="sw">
          <div className="eyebrow reveal">Honours &amp; Awards</div>
          <h2 className="sh reveal">What I&apos;ve <em>won</em></h2>
          <div className="agrid">
            <div className="acard reveal d1"><div className="amed">🏆</div><div className="atitle">All-Island Dancing Champion</div><div className="abadge">Island 1st · 2018, 2019, 2023</div><div className="abody">Three-time national champion in competitive dance at the All-Island level.</div></div>
            <div className="acard reveal d2"><div className="amed">🎵</div><div className="atitle">All-Island Music Champion</div><div className="abadge">Island 1st · 2019, 2023, 2024</div><div className="abody">Three-time national music champion, consistently at the highest competitive level.</div></div>
            <div className="acard reveal d3"><div className="amed">🌏</div><div className="atitle">Malaysian World Choral Competition</div><div className="abadge">1st Place · International</div><div className="abody">Represented Sri Lanka on the world stage, securing first place internationally.</div></div>
            <div className="acard reveal d4"><div className="amed">🎭</div><div className="atitle">British-Lanka Festival of Performing Arts</div><div className="abadge">First Place</div><div className="abody">Top honours at one of Sri Lanka&apos;s most prestigious cross-cultural performing arts competitions.</div></div>
            <div className="acard reveal d5"><div className="amed">🌐</div><div className="atitle">WWF · United Nations Resolution</div><div className="abadge">First Place</div><div className="abody">First place at a WWF-affiliated Model UN conference in international policy debate.</div></div>
            <div className="acard reveal d6"><div className="amed">♟️</div><div className="atitle">National Chess Championship</div><div className="abadge">1st Place · 2016</div><div className="abody">National champion — proof that the strategic thinking extends well beyond the stage.</div></div>
          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="certs">
        <div className="sw">
          <div className="eyebrow reveal">Education &amp; Qualifications</div>
          <h2 className="sh reveal">Certified &amp; <em>trained</em></h2>
          <div className="cgrid">
            <div className="ccard reveal d1"><div className="cico"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Sangeetha Visharadha</div><div className="cfrom">Bathkandhe Sangit Vidhyapith · 6 Years · First Division</div></div></div>
            <div className="ccard reveal d2"><div className="cico"><svg viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></svg></div><div><div className="cname">Audio Engineering</div><div className="cfrom">PEARLBAY® Holdings · Pearl Bay Institute</div></div></div>
            <div className="ccard reveal d3"><div className="cico"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div><div className="cname">Aviation Course</div><div className="cfrom">Sri Lanka Air Force · Ratmalana</div></div></div>
            <div className="ccard reveal d4"><div className="cico"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div><div><div className="cname">Professional Compering</div><div className="cfrom">Institute of Media &amp; Performing Arts</div></div></div>
            <div className="ccard reveal d5"><div className="cico"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><div><div className="cname">Diploma in Information Technology</div><div className="cfrom">ESOFT Metro Campus · 2022</div></div></div>
            <div className="ccard reveal d6"><div className="cico"><svg viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/></svg></div><div><div className="cname">Diploma in Western Music</div><div className="cfrom">Lyceum International School · 2023</div></div></div>
            <div className="ccard reveal d1"><div className="cico"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><div className="cname">Cambridge GCE O/Level</div><div className="cfrom">A* Sinhala · A Physics · A Maths · A Biology</div></div></div>
            <div className="ccard reveal d2"><div className="cico"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Leadership Award</div><div className="cfrom">Institute for Professional Development · 2022</div></div></div>
            <div className="ccard reveal d3"><div className="cico"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Graduated — Lyceum International School</div><div className="cfrom">Nugegoda · 14 Years · Outstanding Student</div></div></div>
            <div className="ccard reveal d4"><div className="cico"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M8 14l-3 7h14l-3-7"/></svg></div><div><div className="cname">Ranwala Balakaya — Outstanding Award</div><div className="cfrom">Ranwala Foundation · 2015, 2016</div></div></div>
          </div>
        </div>
      </section>

      <div className="rule"></div>

      <section id="contact">
        <div className="cc">
          <div className="eyebrow reveal" style={{ justifyContent: "center" }}>Let&apos;s connect</div>
          <h2 className="cth reveal">Ready to<br /><em>talk?</em></h2>
          <p className="ctsub reveal d1">Whether it&apos;s a collaboration, an opportunity, a performance, or simply a great conversation — my inbox is open.</p>
          <div className="cbtns reveal d2">
            <a href="mailto:bhanumendis@gmail.com" className="cb prim">Email</a>
            <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" className="cb">LinkedIn</a>
            <a href="https://instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="cb">Instagram</a>
            <a href="tel:+94777124152" className="cb">Call</a>
          </div>
          <a href="https://forms.gle/N52vwAytUsJCt2df6" target="_blank" rel="noopener noreferrer" className="student-reg reveal d3">Student Registration →</a>
        </div>
      </section>

      <footer>
        <div className="foot-top">
          <div>
            <div className="foot-logo">
              <span className="foot-logo-dot"></span>
              <span className="foot-logo-text">Bhanu Mendis</span>
            </div>
            <p className="foot-tagline">Break the Frame.<br />Colombo, Sri Lanka · 2025</p>
            <div className="socials-row">
              <a href="https://www.instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="Facebook"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="X / Twitter"><svg viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="Telegram"><svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="TikTok"><svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
              <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" className="soc-btn" title="LinkedIn"><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
          </div>

          <div>
            <div className="foot-col-title">Navigate</div>
            <div className="foot-links">
              <a href="#about" className="foot-link"><span className="foot-link-dot"></span>About</a>
              <a href="#skills" className="foot-link"><span className="foot-link-dot"></span>Skills</a>
              <a href="#exp" className="foot-link"><span className="foot-link-dot"></span>Experience</a>
              <a href="#achieve" className="foot-link"><span className="foot-link-dot"></span>Awards</a>
              <a href="#certs" className="foot-link"><span className="foot-link-dot"></span>Credentials</a>
              <a href="#contact" className="foot-link"><span className="foot-link-dot"></span>Contact</a>
            </div>
          </div>

          <div>
            <div className="foot-col-title">Connect</div>
            <div className="foot-links">
              <a href="mailto:bhanumendis@gmail.com" className="foot-link"><span className="foot-link-dot"></span>bhanumendis@gmail.com</a>
              <a href="tel:+94777124152" className="foot-link"><span className="foot-link-dot"></span>+94 77 712 4152</a>
              <a href="https://www.linkedin.com/in/bhanumendis" target="_blank" rel="noopener noreferrer" className="foot-link"><span className="foot-link-dot"></span>LinkedIn</a>
              <a href="https://instagram.com/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="foot-link"><span className="foot-link-dot"></span>Instagram</a>
              <a href="http://bhanumendis.godaddysites.com" target="_blank" rel="noopener noreferrer" className="foot-link"><span className="foot-link-dot"></span>Photography Portfolio</a>
              <a href="https://linktr.ee/bhanu_mendis" target="_blank" rel="noopener noreferrer" className="foot-link"><span className="foot-link-dot"></span>Linktree</a>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span className="foot-copy">© 2025 Bhanu Mendis. All rights reserved.</span>
          <span className="foot-copy">Bhanu Mendis</span>
        </div>
      </footer>
    </>
  );
}