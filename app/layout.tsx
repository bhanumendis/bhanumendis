import type { Metadata } from "next";
import { Raleway, Poppins, Inconsolata, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});
const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
const sinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
});

// ── Schema 1: Person (primary entity) ──────────────────────────────────
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://bhanumendis.com/#person",
  name: "Bhanu Mendis",
  alternateName: ["භානු මෙන්ඩිස්", "Bhanu"],
  url: "https://bhanumendis.com",
  image: {
    "@type": "ImageObject",
    url: "https://bhanumendis.com/favicon.png",
    width: 180,
    height: 180,
  },
  description:
    "Bhanu Mendis is a Sri Lankan leader, performing artist, audio engineer, public speaker, and educator based in Colombo, Sri Lanka. Serving as 2024/2025 Senior Head Prefect at Lyceum International School, Bhanu has directed events for 26,000+ people, founded island-wide music concerts, and holds multiple national and international championship titles.",
  jobTitle: [
    "Senior Head Prefect",
    "Public Speaker",
    "Audio Engineer",
    "Educator",
    "Performing Artist",
    "Sangeetha Visharadha",
  ],
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Public Speaker",
      occupationLocation: { "@type": "Country", name: "Sri Lanka" },
    },
    {
      "@type": "Occupation",
      name: "Audio Engineer",
      occupationLocation: { "@type": "Country", name: "Sri Lanka" },
    },
    {
      "@type": "Occupation",
      name: "Educator",
      occupationLocation: { "@type": "Country", name: "Sri Lanka" },
    },
  ],
  nationality: { "@type": "Country", name: "Sri Lanka" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressRegion: "Western Province",
    addressCountry: "LK",
  },
  telephone: "+94777124152",
  email: "bhanumendis@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/bhanumendis",
    "https://www.instagram.com/bhanu_mendis",
    "https://linktr.ee/bhanu_mendis",
    "http://bhanumendis.godaddysites.com",
  ],
  knowsAbout: [
    "Audio Engineering",
    "Public Speaking",
    "Event Production",
    "Classical Indian Music",
    "Western Music",
    "Leadership",
    "Student Governance",
    "Compering",
    "Voice Acting",
    "Photography",
    "Teaching",
    "Cubase DAW",
    "MIDI Production",
  ],
  knowsLanguage: [
    { "@type": "Language", name: "English" },
    { "@type": "Language", name: "Sinhala" },
  ],
  award: [
    "All-Island Dancing Champion 2018",
    "All-Island Dancing Champion 2019",
    "All-Island Dancing Champion 2023",
    "All-Island Music Champion 2019",
    "All-Island Music Champion 2023",
    "All-Island Music Champion 2024",
    "Malaysian World Choral Competition First Place",
    "British-Lanka Festival of Performing Arts First Place",
    "WWF United Nations Resolution First Place",
    "National Chess Championship First Place 2016",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    "@id": "https://www.lyceum.lk/#organization",
    name: "Lyceum International School",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nugegoda",
      addressCountry: "LK",
    },
  },
  worksFor: {
    "@type": "Organization",
    name: "The Science Brainery",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boralesgamuwa",
      addressCountry: "LK",
    },
  },
};

// ── Schema 2: WebSite ───────────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://bhanumendis.com/#website",
  url: "https://bhanumendis.com",
  name: "Bhanu Mendis",
  description:
    "Official personal website of Bhanu Mendis — public speaker, audio engineer, educator, performing artist, and Sangeetha Visharadha from Colombo, Sri Lanka.",
  author: { "@id": "https://bhanumendis.com/#person" },
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bhanumendis.com/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// ── Schema 3: FAQPage (highest AI citation potential) ───────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Bhanu Mendis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis is a Sri Lankan multi-disciplinary leader, performing artist, audio engineer, public speaker, and educator based in Colombo, Sri Lanka. He served as the 2024/2025 Senior Head Prefect at Lyceum International School Nugegoda and is a qualified Sangeetha Visharadha (First Division). He is also the founder of the Swara and Padura concert series.",
      },
    },
    {
      "@type": "Question",
      name: "What is Bhanu Mendis known for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis is known for his leadership as Senior Head Prefect at Lyceum International School, directing events for over 26,000 people including the Elysium '25 graduation at Cinnamon Life. He is a three-time All-Island dancing champion, three-time All-Island music champion, and won first place at the Malaysian World Choral Competition representing Sri Lanka internationally.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Bhanu Mendis from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis is from Colombo, Sri Lanka, specifically from Boralesgamuwa in the Western Province. He studied at Lyceum International School, Nugegoda for 14 years.",
      },
    },
    {
      "@type": "Question",
      name: "What awards has Bhanu Mendis won?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis has won numerous awards including All-Island Dancing Champion three times (2018, 2019, 2023), All-Island Music Champion three times (2019, 2023, 2024), First Place at the Malaysian World Choral Competition internationally, First Place at the British-Lanka Festival of Performing Arts, First Place at the WWF United Nations Resolution, and the National Chess Championship in 2016.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Bhanu Mendis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis can be contacted via email at bhanumendis@gmail.com, by phone at +94 77 712 4152, on LinkedIn at linkedin.com/in/bhanumendis, or on Instagram at @bhanu_mendis.",
      },
    },
    {
      "@type": "Question",
      name: "What does Bhanu Mendis do professionally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhanu Mendis works as an Educator at The Science Brainery teaching Pearson Edexcel Science, Mathematics and Computer Science. He is also a certified Audio Engineer trained at Pearl Bay Institute, a professional public speaker and compere, and a performing artist. He founded the Swara Concert, the largest island-wide school-based Eastern music concert in Sri Lanka.",
      },
    },
    {
      "@type": "Question",
      name: "Is Bhanu Mendis a musician?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bhanu Mendis is a qualified Sangeetha Visharadha in Indian classical music with a First Division from Bathkandhe Sangit Vidhyapith, having studied for 6 years. He holds a Diploma in Western Music from Lyceum International School, is a Senior Chorister, and is the Founding President of the Eastern Music Club. He has won the All-Island Music Championship three times and the Malaysian World Choral Competition.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Swara Concert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Swara Concert is the largest island-wide school-based Eastern music concert in Sri Lanka, founded and led by Bhanu Mendis. It unites students from all branches of Lyceum International Schools and showcases over 700 participants across musical traditions.",
      },
    },
  ],
};

// ── Schema 4: ProfilePage ───────────────────────────────────────────────
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://bhanumendis.com/#profilepage",
  url: "https://bhanumendis.com",
  name: "Bhanu Mendis — Official Website",
  isPartOf: { "@id": "https://bhanumendis.com/#website" },
  about: { "@id": "https://bhanumendis.com/#person" },
  mainEntity: { "@id": "https://bhanumendis.com/#person" },
  dateModified: new Date().toISOString(),
  inLanguage: "en",
};

export const metadata: Metadata = {
  title: "Bhanu Mendis",
  description:
    "Bhanu Mendis — Senior Head Prefect, Public Speaker, Audio Engineer, Performing Artist, Educator and Sangeetha Visharadha from Colombo, Sri Lanka. Founder of Swara Concert. Three-time All-Island champion.",
  keywords: [
    "Bhanu Mendis",
    "Colombo",
    "Sri Lanka",
    "Public Speaker",
    "Audio Engineer",
    "Visharadha",
    "Sangeetha Visharadha",
    "Lyceum International School",
    "Senior Head Prefect",
    "Educator",
    "Performing Artist",
    "Swara Concert",
    "Padura Concert",
    "All-Island Champion",
    "Event Production",
    "bhanumendis.com",
    "භානු මෙන්ඩිස්",
  ],
  authors: [{ name: "Bhanu Mendis", url: "https://bhanumendis.com" }],
  creator: "Bhanu Mendis",
  publisher: "Bhanu Mendis",
  metadataBase: new URL("https://bhanumendis.com"),
  alternates: { canonical: "https://bhanumendis.com" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "Bhanu Mendis — Public Speaker, Audio Engineer & Artist",
    description:
      "Senior Head Prefect, Public Speaker, Audio Engineer, and Sangeetha Visharadha from Colombo, Sri Lanka. Three-time All-Island champion and founder of the Swara Concert.",
    url: "https://bhanumendis.com",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/favicon.png",
        width: 180,
        height: 180,
        alt: "Bhanu Mendis",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Bhanu Mendis — Public Speaker, Audio Engineer & Artist",
    description:
      "Public Speaker · Audio Engineer · Artist · Educator · Visharadha — Colombo, Sri Lanka. Three-time All-Island champion.",
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${poppins.variable} ${inconsolata.variable} ${sinhala.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
        <meta name="author" content="Bhanu Mendis" />
        <meta name="geo.region" content="LK-1" />
        <meta name="geo.placename" content="Colombo, Sri Lanka" />
        <meta name="geo.position" content="6.9271;79.8612" />
        <meta name="ICBM" content="6.9271, 79.8612" />
        <link rel="me" href="https://www.linkedin.com/in/bhanumendis" />
        <link rel="me" href="https://www.instagram.com/bhanu_mendis" />
      </head>
      <body>{children}</body>
    </html>
  );
}