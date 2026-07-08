import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "./Footer";
import EasterEgg from "./EasterEgg";
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
const sans = localFont({
  src: [
    { path: "./fonts/Poppins-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});
const mono = localFont({
  src: [{ path: "./fonts/Inconsolata-Variable.woff2", weight: "200 900", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});
const sinhala = localFont({
  src: [
    { path: "./fonts/NotoSerifSinhala-400.woff2", weight: "400", style: "normal" },
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
  description:
    "Bhanu Mendis — Educator and tutor of Science, Mathematics & Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery, Boralesgamuwa. Also a public speaker, audio engineer, Sangeetha Visharadha and three-time All-Island champion from Colombo, Sri Lanka.",
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
  alternates: { canonical: "https://bhanumendis.com" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "Bhanu Mendis — Educator, Public Speaker & Audio Engineer",
    description:
      "Tutoring Science, Maths & Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery. Public speaker, audio engineer, Sangeetha Visharadha and three-time All-Island champion from Colombo, Sri Lanka.",
    url: "https://bhanumendis.com",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "profile",
    images: [{ url: "/favicon.png", width: 180, height: 180, alt: "Bhanu Mendis" }],
  },
  twitter: {
    card: "summary",
    title: "Bhanu Mendis — Educator, Public Speaker & Audio Engineer",
    description:
      "Educator · Tutor (Science · Maths · Computing) · Public Speaker · Audio Engineer · Visharadha — Colombo, Sri Lanka.",
    images: ["/favicon.png"],
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
    "geo.region": "LK-1",
    "geo.placename": "Colombo, Sri Lanka",
    "geo.position": "6.9271;79.8612",
    ICBM: "6.9271, 79.8612",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
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
      image: "https://bhanumendis.com/favicon.png",
      jobTitle: "Educator, Public Speaker, Audio Engineer & Founder",
      description:
        "Bhanu Mendis — Educator and private tutor of Science, Mathematics and Computing (Pearson Edexcel, Grades 5–8) at The Science Brainery in Boralesgamuwa. Also a public speaker, audio engineer, performing artist and Sangeetha Visharadha from Colombo, Sri Lanka; founder of the Swara and Padura concerts.",
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
        "https://linktr.ee/bhanu_mendis",
      ],
      alumniOf: { "@type": "EducationalOrganization", name: "Lyceum International School" },
      worksFor: { "@id": "https://bhanumendis.com/#brainery" },
      hasOccupation: {
        "@type": "Occupation",
        name: "Tutor / Educator",
        occupationLocation: { "@type": "City", name: "Colombo, Sri Lanka" },
        skills: "Science, Mathematics, Computing, Pearson Edexcel curriculum, Grades 5–8",
      },
      knowsAbout: [
        "Teaching", "Science Education", "Mathematics", "Computing", "Pearson Edexcel",
        "Public Speaking", "Audio Engineering", "Event Production", "Music Production",
        "Eastern Music", "Choral Music", "Leadership", "Compering", "DAW Architecture",
      ],
      award: [
        "All-Island Dancing Champion (2018, 2019, 2023)",
        "All-Island Music Champion (2019, 2023, 2024)",
        "Malaysian World Choral Competition - First Place",
        "British-Lanka Festival of Performing Arts - First Place",
        "National Chess Championship - First Place (2016)",
      ],
      makesOffer: { "@id": "https://bhanumendis.com/#tutoring" },
      founder: [{ "@id": "https://bhanumendis.com/#swara" }, { "@id": "https://bhanumendis.com/#padura" }],
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

// Runs before paint: applies the saved theme so there is no flash.
// Default is the light theme; only an explicit prior choice of "dark" opts in.
const themeInit = `(function(){try{var t=localStorage.getItem('bm-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${sinhala.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
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
        {children}
        <Footer />
        <EasterEgg />
        <SpeedInsights />
      </body>
    </html>
  );
}
