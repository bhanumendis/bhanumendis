/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./motion.css";
import Footer from "./Footer";
import EasterEgg from "./EasterEgg";
import SwaraEgg from "./SwaraEgg";
import SmoothScroll from "./SmoothScroll";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ── Self-hosted fonts (next/font/local) ──────────────────────────────
// Vendored in app/fonts to remove the build-time Google Fonts dependency:
// faster first paint, no third-party fetch, and a clean font-src 'self' CSP.
// The original type system: Raleway (display) + Poppins (body/UI) +
// Inconsolata (mono) + Noto Serif Sinhala (signature).
const display = localFont({
  src: [
    { path: "./fonts/Raleway-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Raleway-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});
// Only the weights the stylesheet actually asks for. `preload: true` preloads
// EVERY file listed here at high priority, used or not — and 300 and 700 never
// were (verified in the browser: both FontFaces stayed "unloaded" after a full
// pass of both routes and both overlays). Listing them cost two wasted
// high-priority requests competing with the hero on every first visit. The
// files stay in app/fonts; re-add a line here if a rule ever needs them.
const sans = localFont({
  src: [
    { path: "./fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});
// Anton: the impact face. Used only where the design wants a poster voice —
// footer column titles, the full-bleed social strip, section eyebrows and the
// pinned backdrop words. It is a single 400 weight by design: Anton has no
// other cut, and faking one with synthetic bold would wreck its even colour.
// Not preloaded — nothing above the fold uses it, so preloading would spend
// LCP budget on a face the first viewport never paints.
const impact = localFont({
  src: [{ path: "./fonts/Anton-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-impact",
  display: "swap",
  preload: false,
  fallback: ["Impact", "Haettenschweiler", "Arial Narrow Bold", "sans-serif"],
});
const mono = localFont({
  src: [{ path: "./fonts/Inconsolata-Variable.woff2", weight: "200 900", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});
const sinhala = localFont({
  // 400 is not listed: no rule sets Sinhala text at regular weight.
  src: [
    { path: "./fonts/NotoSerifSinhala-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/NotoSerifSinhala-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bhanumendis.com"),
  title: {
    default: "Bhanu Mendis",
    template: "%s | Bhanu Mendis",
  },
  // Kept under ~160 characters: everything past that is truncated in the SERP,
  // and the old 263-character version spent a third of itself invisibly.
  description:
    "Bhanu Mendis — tutor of Science, Maths & Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery, Boralesgamuwa. Educator, speaker, audio engineer.",
  keywords: [
    "Bhanu Mendis", "Bhanu Mendis tutor", "Science Maths Computing tutor Sri Lanka",
    "Pearson Edexcel tutor Colombo", "The Science Brainery", "Boralesgamuwa tutor",
    "Colombo", "Sri Lanka", "Educator", "Public Speaker", "Audio Engineer",
    "Sangeetha Visharadha", "Lyceum International School", "Senior Head Prefect",
    "Performing Artist", "Swara Concert", "Padura Concert", "All-Island Champion",
    "Grade 5 6 7 8 tuition", "bhanumendis.com", "භානු මෙන්ඩිස්",
  ],
  authors: [{ name: "Bhanu Mendis", url: "https://bhanumendis.com" }],
  creator: "Bhanu Mendis",
  publisher: "Bhanu Mendis",
  // `types` advertises the Markdown mirror (<link rel="alternate"
  // type="text/markdown">), so an agent reading the HTML can find the clean
  // version without knowing about llms.txt or content negotiation.
  alternates: {
    canonical: "https://bhanumendis.com",
    types: { "text/markdown": "https://bhanumendis.com/index.md" },
  },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png", shortcut: "/favicon.ico" },
  openGraph: {
    title: "Bhanu Mendis — Educator, Public Speaker & Audio Engineer",
    description:
      "Tutoring Science, Maths & Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery. Public speaker, audio engineer, Sangeetha Visharadha and three-time All-Island champion from Colombo, Sri Lanka.",
    url: "https://bhanumendis.com",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "profile",
    // No `images` here on purpose: app/opengraph-image.tsx and
    // app/timeline/opengraph-image.tsx supply them per-route via the file
    // convention. An explicit entry here would override both and put the
    // homepage card on the timeline.
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhanu Mendis — Educator, Public Speaker & Audio Engineer",
    description:
      "Educator · Tutor (Science · Maths · Computing) · Public Speaker · Audio Engineer · Visharadha — Colombo, Sri Lanka.",
    // Falls through to the per-route opengraph-image, same as above.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Personal Portfolio",
  formatDetection: { email: false, address: false, telephone: false },
  other: {
    copyright: "© 2025–2026 Bhanu Mendis. All rights reserved.",
    "geo.region": "LK-1",
    "geo.placename": "Colombo, Sri Lanka",
    "geo.position": "6.9271;79.8612",
    ICBM: "6.9271, 79.8612",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  // Dark is the default now, so the bare themeColor (used by browsers that
  // ignore the media variants) must be the dark ground, not the light one.
  themeColor: [
    { color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// ── Structured data (JSON-LD) ────────────────────────────────────────
// Person + the tutoring service (EducationalOccupationalProgram / Service)
// + the two founded concerts, all cross-linked so LLMs and search agents
// can resolve the entity graph cleanly.
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bhanumendis.com/#person",
      name: "Bhanu Mendis",
      alternateName: ["භානු මෙන්ඩිස්", "Bhanu"],
      url: "https://bhanumendis.com",
      image: {
        "@type": "ImageObject",
        "@id": "https://bhanumendis.com/#portrait",
        url: "https://bhanumendis.com/portrait.jpg",
        caption: "Bhanu Mendis",
      },
      mainEntityOfPage: { "@id": "https://bhanumendis.com/#webpage" },
      knowsLanguage: [
        { "@type": "Language", name: "English", alternateName: "en" },
        { "@type": "Language", name: "Sinhala", alternateName: "si" },
      ],
      jobTitle: "Educator, AI & Computing Undergraduate, Group IT Intern, Audio Engineer & Founder",
      description:
        "Bhanu Mendis — Educator and private tutor of Science, Mathematics and Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery in Boralesgamuwa. Reading for a BSc (Hons) in Artificial Intelligence and Computing at NSBM Green University, awarded by the University of Plymouth, UK, and an intern in Group IT at Lyceum Global Holdings. Also a public speaker, audio engineer, performing artist and Sangeetha Visharadha from Colombo, Sri Lanka; founder of the Swara and Padura concerts.",
      // Explicit negative disambiguation. "Mendis" collides with several
      // far better-indexed Sri Lankan cricketers, and the site currently
      // loses every one of those queries.
      disambiguatingDescription:
        "Educator and technologist in Boralesgamuwa, Colombo, Sri Lanka. Not the cricketers Ajantha Mendis, Kusal Mendis, Kamindu Mendis or Jeevan Mendis, and unconnected to professional cricket.",
      nationality: { "@type": "Country", name: "Sri Lanka" },
      telephone: "+94-77-712-4152",
      email: "bhanumendis@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No. 2, Malani Bulathsinghala Mawatha",
        addressLocality: "Boralesgamuwa",
        addressRegion: "Western Province",
        addressCountry: "LK",
      },
      sameAs: [
        "https://www.linkedin.com/in/bhanumendis",
        "https://www.instagram.com/bhanu_mendis",
        "https://www.facebook.com/profile.php?id=61575861587304",
        "https://www.youtube.com/@Bhanu_Mendis",
        "https://x.com/bhanu_mendis",
        "https://www.tiktok.com/@bhanu_mendis",
        "https://t.me/bhanu_mendis",
        "https://linktr.ee/bhanu_mendis",
      ],
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "NSBM Green University",
          url: "https://www.nsbm.ac.lk",
          description:
            "BSc (Hons) Artificial Intelligence and Computing, Sep 2026 – Oct 2029. Degree awarded by the University of Plymouth, United Kingdom.",
          address: { "@type": "PostalAddress", addressCountry: "LK" },
        },
        { "@type": "EducationalOrganization", name: "Lyceum International School" },
      ],
      worksFor: [
        {
          "@type": "Organization",
          name: "Lyceum Global Holdings",
          description:
            "Group IT sector — technology strategy, governance and digital transformation across 50+ group companies, 5,000+ employees and 100+ systems.",
          address: { "@type": "PostalAddress", addressCountry: "LK" },
        },
        { "@id": "https://bhanumendis.com/#brainery" },
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Educator & Private Tutor",
          occupationLocation: { "@type": "City", name: "Colombo, Sri Lanka" },
          skills: "Science, Mathematics, Computing, Pearson Edexcel curriculum, Grades 5–8",
        },
        {
          "@type": "Occupation",
          name: "Musician",
          occupationalCategory: "27-2042",
          skills: "Sangeetha Visharadha (Eastern classical vocal & instrumental), choral music, live performance",
        },
        {
          "@type": "Occupation",
          name: "Audio Engineer",
          occupationalCategory: "27-4014",
          skills: "Music production, mixing & mastering, DAW architecture, MIDI sequencing",
        },
        {
          "@type": "Occupation",
          name: "Software & Computing",
          occupationalCategory: "15-1252",
          skills: "Programming, computing, information technology",
        },
      ],
      knowsAbout: [
        "Teaching", "Science Education", "Mathematics", "Computing", "Pearson Edexcel",
        "Public Speaking", "Audio Engineering", "Event Production", "Music Production",
        "Eastern Music", "Choral Music", "Leadership", "Compering", "DAW Architecture",
        "Cubase", "Music Composition", "Mixing & Mastering", "Community Service",
        "Artificial Intelligence", "Enterprise AI Use Cases", "Machine Learning",
        "Information Technology Governance", "IT Audit Support", "IT Infrastructure",
        "Business Process Mapping", "Technical Documentation",
        "Management Information Dashboards", "Web Development",
        "Mobile Application Development", "Digital Transformation",
      ],
      award: [
        "All-Island Dancing Champion (2018, 2019, 2023)",
        "All-Island Music Champion (2019, 2023, 2024)",
        "Malaysian World Choral Competition - First Place",
        "British-Lanka Festival of Performing Arts - First Place",
        "National Chess Championship - First Place (2016)",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Sangeetha Visharadha (First Division)",
          credentialCategory: "degree",
          educationalLevel: "Visharadha",
          about: "Eastern classical music — vocal and instrumental",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Certified Audio Engineer",
          credentialCategory: "certificate",
          about: "Music production, mixing and mastering",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "BSc (Hons) Artificial Intelligence and Computing",
          credentialCategory: "degree",
          educationalLevel: "Bachelor's Degree (in progress, 2026–2029)",
          about: "Artificial intelligence and computing",
          recognizedBy: { "@type": "CollegeOrUniversity", name: "University of Plymouth" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Diploma in Information Technology",
          credentialCategory: "diploma",
          recognizedBy: { "@type": "EducationalOrganization", name: "ESOFT Metro Campus" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Cambridge GCE Ordinary Level",
          credentialCategory: "secondary school qualification",
          about: "A* Sinhala, A Physics, A Mathematics, A Biology",
        },
      ],
      makesOffer: { "@id": "https://bhanumendis.com/#tutoring" },
      founder: [{ "@id": "https://bhanumendis.com/#swara" }, { "@id": "https://bhanumendis.com/#padura" }],
    },
    {
      "@type": "WebSite",
      "@id": "https://bhanumendis.com/#website",
      url: "https://bhanumendis.com",
      name: "Bhanu Mendis",
      description:
        "The official portfolio of Bhanu Mendis — educator, public speaker, audio engineer and performing artist from Colombo, Sri Lanka.",
      inLanguage: "en",
      // Authorship, stated for machines: the person this site is about is also
      // the person who designed, built and maintains it.
      author: { "@id": "https://bhanumendis.com/#person" },
      creator: { "@id": "https://bhanumendis.com/#person" },
      publisher: { "@id": "https://bhanumendis.com/#person" },
      copyrightHolder: { "@id": "https://bhanumendis.com/#person" },
      copyrightYear: 2025,
      copyrightNotice: "© 2025–2026 Bhanu Mendis. All rights reserved.",
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://bhanumendis.com/#brainery",
      name: "The Science Brainery",
      url: "https://bhanumendis.com/#tutoring",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No. 2, Malani Bulathsinghala Mawatha",
        addressLocality: "Boralesgamuwa",
        addressCountry: "LK",
      },
      telephone: "+94-77-712-4152",
    },
    {
      "@type": ["Service", "EducationalOccupationalProgram"],
      "@id": "https://bhanumendis.com/#tutoring",
      name: "Private Tutoring — Science, Mathematics & Computing",
      serviceType: "Private tuition (Group & Individual)",
      description:
        "Pearson Edexcel Science, Mathematics and Computing tuition for Grades 5, 6, 7 and 8, delivered as group and individual classes at The Science Brainery, Boralesgamuwa.",
      educationalProgramMode: ["onsite", "In-person group classes", "Individual classes"],
      occupationalCategory: "Tutoring",
      provider: { "@id": "https://bhanumendis.com/#person" },
      areaServed: { "@type": "Place", name: "Colombo, Sri Lanka" },
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      teaches: ["Science", "Mathematics", "Computing / ICT"],
      offers: {
        "@type": "Offer",
        category: "Pearson Edexcel · Grades 5–8",
        availability: "https://schema.org/InStock",
        areaServed: "Boralesgamuwa, Sri Lanka",
      },
    },
    {
      "@type": ["Organization", "MusicGroup"],
      "@id": "https://bhanumendis.com/#swara",
      name: "Swara Concert",
      description:
        "The largest island-wide school-based Eastern music concert in Sri Lanka, founded by Bhanu Mendis, uniting 700+ student performers from all Lyceum International School branches.",
      foundingDate: "2023",
      founder: { "@id": "https://bhanumendis.com/#person" },
    },
    {
      "@type": ["Organization", "MusicGroup"],
      "@id": "https://bhanumendis.com/#padura",
      name: "Padura Concert",
      description:
        "An original instrumental music concert series founded by Bhanu Mendis at Lyceum International School, showcasing student talent in Western and fusion traditions.",
      foundingDate: "2023",
      founder: { "@id": "https://bhanumendis.com/#person" },
    },
  ],
} as const;

// Pre-paint boot script. Two jobs, both must land BEFORE first paint:
//  1. adopt the persisted theme (avoids a light-to-dark flash)
//  2. stamp data-motion="native" when the browser supports scroll-driven
//     animations. motion.css keys every scroll-linked rule off that flag,
//     and page.tsx skips its IntersectionObserver entirely when it is set —
//     so modern browsers run the whole motion system on the compositor
//     with zero main-thread work, and older ones keep the JS fallback.
//  3. DARK IS THE DEFAULT. <html> ships with class="dark" from the server, so
//     the pre-paint job is the inverse of what it used to be: REMOVE the class
//     when the visitor previously chose light. Doing it this way (rather than
//     adding the class) is what keeps the first paint black for everyone who
//     has never touched the toggle, with no flash for those who chose light.
//  4. stamp data-js. The count-up numbers are server-rendered at their FINAL
//     value (so crawlers, no-JS visitors and screen readers never read "0+"),
//     and globals.css uses this flag to hold them invisible until Counter
//     takes over — otherwise the real number would flash before counting up.
const bootInit = `(function(){var d=document.documentElement;d.setAttribute('data-js','1');try{if(localStorage.getItem('bm-theme')==='light'){d.classList.remove('dark');}}catch(e){}try{if(window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view()')){d.setAttribute('data-motion','native');}}catch(e){}try{if(window.matchMedia&&matchMedia('(pointer:fine)').matches&&matchMedia('(min-width:901px)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){d.setAttribute('data-smooth','on');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${impact.variable} ${mono.variable} ${sinhala.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootInit }} />
        <script
          type="application/ld+json"
          // Static, developer-controlled JSON-LD. `<` is escaped per Next.js guidance to prevent XSS.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
        />
        <link rel="me" href="https://www.linkedin.com/in/bhanumendis" />
        <link rel="me" href="https://www.instagram.com/bhanu_mendis" />
        {/* Warm up DNS for the below-the-fold embeds (LinkedIn posts + Google Maps). */}
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <Footer />
        <EasterEgg />
        <SwaraEgg />
        <SpeedInsights />
      </body>
    </html>
  );
}
