import type { Metadata, Viewport } from "next";
import { Raleway, Poppins, Inconsolata, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";
import Footer from "./Footer";
import EasterEgg from "./EasterEgg";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://bhanumendis.com"),
  title: {
    default: "Bhanu Mendis",
    template: "%s | Bhanu Mendis",
  },
  description:
    "Bhanu Mendis — Senior Head Prefect, Public Speaker, Audio Engineer, Performing Artist, Educator and Sangeetha Visharadha from Colombo, Sri Lanka. Founder of Swara Concert. Three-time All-Island champion.",
  keywords: [
    "Bhanu Mendis", "Colombo", "Sri Lanka", "Public Speaker", "Audio Engineer",
    "Visharadha", "Sangeetha Visharadha", "Lyceum International School",
    "Senior Head Prefect", "Educator", "Performing Artist", "Swara Concert",
    "Padura Concert", "All-Island Champion", "Event Production", "bhanumendis.com",
    "භානු මෙන්ඩිස්",
  ],
  authors: [{ name: "Bhanu Mendis", url: "https://bhanumendis.com" }],
  creator: "Bhanu Mendis",
  publisher: "Bhanu Mendis",
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
    images: [{ url: "/favicon.png", width: 180, height: 180, alt: "Bhanu Mendis" }],
  },
  twitter: {
    card: "summary",
    title: "Bhanu Mendis — Public Speaker, Audio Engineer & Artist",
    description:
      "Public Speaker · Audio Engineer · Artist · Educator · Visharadha — Colombo, Sri Lanka.",
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
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06090e" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6fa" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bhanumendis.com/#person",
      name: "Bhanu Mendis",
      alternateName: ["භානු මෙන්ඩිස්", "Bhanu"],
      url: "https://bhanumendis.com",
      image: "https://bhanumendis.com/favicon.png",
      jobTitle: "Public Speaker, Audio Engineer, Educator & Founder",
      description:
        "Bhanu Mendis — Senior Head Prefect, Public Speaker, Audio Engineer, performing Artist, Educator and Sangeetha Visharadha from Colombo, Sri Lanka. Founder of the Swara and Padura concerts.",
      nationality: { "@type": "Country", name: "Sri Lanka" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressRegion: "Western Province",
        addressCountry: "LK",
      },
      sameAs: [
        "https://www.linkedin.com/in/bhanumendis",
        "https://www.instagram.com/bhanu_mendis",
        "https://linktr.ee/bhanu_mendis",
      ],
      alumniOf: { "@type": "EducationalOrganization", name: "Lyceum International School" },
      worksFor: { "@type": "Organization", name: "The Science Brainery" },
      knowsAbout: [
        "Public Speaking", "Audio Engineering", "Event Production", "Music Production",
        "Eastern Music", "Choral Music", "Leadership", "Education", "Compering", "DAW Architecture",
      ],
      award: [
        "All-Island Dancing Champion (2018, 2019, 2023)",
        "All-Island Music Champion (2019, 2023, 2024)",
        "Malaysian World Choral Competition - First Place",
        "British-Lanka Festival of Performing Arts - First Place",
        "National Chess Championship - First Place (2016)",
      ],
      founder: [{ "@id": "https://bhanumendis.com/#swara" }, { "@id": "https://bhanumendis.com/#padura" }],
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
          // Static, developer-controlled JSON-LD. `<` is escaped per Next.js guidance to prevent XSS.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
        <link rel="me" href="https://www.linkedin.com/in/bhanumendis" />
        <link rel="me" href="https://www.instagram.com/bhanu_mendis" />
      </head>
      <body>
        {children}
        <Footer />
        <EasterEgg />
      </body>
    </html>
  );
}