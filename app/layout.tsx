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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bhanu Mendis",
  url: "https://bhanumendis.com",
  image: "https://bhanumendis.com/favicon.png",
  jobTitle: "Public Speaker, Audio Engineer & Educator",
  description:
    "Senior Head Prefect, Public Speaker, Audio Engineer, Artist, Educator and Sangeetha Visharadha based in Colombo, Sri Lanka.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  sameAs: [
    "https://www.linkedin.com/in/bhanumendis",
    "https://www.instagram.com/bhanu_mendis",
    "https://linktr.ee/bhanu_mendis",
  ],
  knowsAbout: [
    "Audio Engineering",
    "Public Speaking",
    "Event Production",
    "Classical Music",
    "Leadership",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Lyceum International School",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nugegoda",
      addressCountry: "LK",
    },
  },
};

export const metadata: Metadata = {
  title: "Bhanu Mendis | Public Speaker & Audio Engineer",
  description:
    "Senior Head Prefect, Public Speaker, Audio Engineer, and Sangeetha Visharadha from Colombo, Sri Lanka. Leading events, music, and creative direction.",
  keywords: [
    "Bhanu Mendis", "Colombo", "Sri Lanka", "Public Speaker",
    "Audio Engineer", "Visharadha", "Lyceum International School",
    "Event Production", "Senior Head Prefect", "Educator",
  ],
  authors: [{ name: "Bhanu Mendis", url: "https://bhanumendis.com" }],
  creator: "Bhanu Mendis",
  metadataBase: new URL("https://bhanumendis.com"),
  alternates: {
    canonical: "https://bhanumendis.com",
  },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "Bhanu Mendis | Public Speaker & Audio Engineer",
    description:
      "Senior Head Prefect, Public Speaker, Audio Engineer, and Sangeetha Visharadha from Colombo, Sri Lanka.",
    url: "https://bhanumendis.com",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "profile",
    images: [{ url: "/favicon.png", width: 180, height: 180, alt: "Bhanu Mendis" }],
  },
  twitter: {
    card: "summary",
    title: "Bhanu Mendis | Public Speaker & Audio Engineer",
    description: "Public Speaker · Audio Engineer · Artist · Educator · Visharadha — Colombo, Sri Lanka.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      </head>
      <body>{children}</body>
    </html>
  );
}