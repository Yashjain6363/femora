import type { Metadata, Viewport } from "next";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { SITE_CONFIG } from "@/lib/constants";
import { SakhiChatbot } from "@/components/chat/SakhiChatbot";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "women wellness",
    "menstrual cycle tracking",
    "period health",
    "craving control",
    "period-aware planning",
    "wellness journal",
    "FERMORA",
    "hormonal health",
    "cycle syncing",
  ],
  authors: [{ name: "FERMORA Health" }],
  creator: "FERMORA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 564,
        height: 692,
        alt: `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: "@fermora_health",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/femora.logo.png",
    apple: "/images/femora.logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F3E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#F8F3E9] text-[#101F3B] antialiased selection:bg-[#B66ACB]/20 selection:text-[#101F3B] min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#B66ACB] focus:text-white focus:text-sm focus:font-medium border border-[#9C4EB3]"
        >
          Skip to main content
        </a>
        {children}
        <SakhiChatbot />
      </body>
    </html>
  );
}
