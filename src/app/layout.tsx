import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rgb-radio.vercel.app"
  ),
  title: {
    default: "RGB RADIO — Every Color Has a Sound.",
    template: "%s | RGB RADIO",
  },
  description:
    "A living archive of every RGB color — each one paired with a song. 16,777,216 colors. One at a time.",
  keywords: [
    "RGB",
    "color",
    "music",
    "archive",
    "YouTube",
    "generative",
    "art",
  ],
  authors: [{ name: "RGB RADIO" }],
  openGraph: {
    type: "website",
    siteName: "RGB RADIO",
    title: "RGB RADIO — Every Color Has a Sound.",
    description:
      "A living archive of every RGB color — each one paired with a song. 16,777,216 colors. One at a time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RGB RADIO — Every Color Has a Sound.",
    description:
      "A living archive of every RGB color — each one paired with a song.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-black text-white antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
