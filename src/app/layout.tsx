import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medaresha — Boutique Luxury Hotel & Residences | Addis Ababa",
  description:
    "Experience unhurried luxury, bespoke Ethiopian hospitality, and mindful serenity in the heart of Bole, Addis Ababa.",
  keywords: [
    "Medaresha Hotel",
    "Luxury Hotel Addis Ababa",
    "Boutique Hotel Bole",
    "Ethiopian Hospitality",
    "Hotel Booking Ethiopia",
  ],
  authors: [{ name: "Medaresha Hospitality" }],
  openGraph: {
    title: "Medaresha — Boutique Luxury Hotel & Residences",
    description:
      "A sanctuary of calm, warm minimalist luxury, and authentic Ethiopian hospitality in Bole, Addis Ababa.",
    url: "https://medaresha.com",
    siteName: "Medaresha",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#343B2A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory text-meda-text antialiased selection:bg-olive selection:text-ivory">
        {children}
      </body>
    </html>
  );
}
