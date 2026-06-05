import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhanu Mendis",
  description:
    "Senior Head Prefect, Public Speaker, Audio Engineer, Artist, Educator, and Visharadha based in Colombo, Sri Lanka.",
  keywords: [
    "Bhanu Mendis",
    "Colombo",
    "Sri Lanka",
    "Public Speaker",
    "Audio Engineer",
    "Visharadha",
    "Lyceum International School",
  ],
  authors: [{ name: "Bhanu Mendis" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Bhanu Mendis",
    description:
      "Public Speaker · Audio Engineer · Artist · Educator · Visharadha",
    url: "https://bhanumendis.com",
    siteName: "Bhanu Mendis",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,700;0,800;0,900;1,300;1,400&family=Poppins:wght@300;400;500;600&family=Inconsolata:wght@300;400;500&family=Noto+Serif+Sinhala:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}