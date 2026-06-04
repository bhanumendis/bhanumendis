import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhanu Mendis — Official",
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
  openGraph: {
    title: "Bhanu Mendis — Official",
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
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,700;0,800;0,900;1,300;1,400&family=Poppins:wght@300;400;500;600&family=Inconsolata:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}