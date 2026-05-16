import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  BackToTop,
  CommitStamp,
  ConsoleSignature,
  KeyboardNav,
  LightSwitch,
  LightSwitchProvider,
  PageAtmosphere,
  PageTransition,
  SiteHeader,
} from "@/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face — Bricolage Grotesque has variable axes (wdth + opsz) for true
// editorial display feel. Used for hero + section H2.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Fraunces — Pierre's "specimen" serif. Used in big italic moments on
// /resume (role names rendered as drafting-sheet specimen labels). Opsz +
// SOFT + WONK variable axes give it characterful pulled-soft terminals.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["italic"],
});

const siteUrl = "https://pierrebelonsavon.com";

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
  applicationName: "Pierre Belon Savon",
  authors: [{ name: "Pierre Belon Savon" }],
  category: "Portfolio",
  creator: "Pierre Belon Savon",
  description:
    "I build AI for businesses that have to actually run. Most of it I shipped while running one — currently at ThePrivateHotels and Blackdoor.",
  keywords: [
    "Pierre Belon Savon",
    "AI Engineer",
    "AI automation",
    "agent harness",
    "multi-agent systems",
    "Atlas",
    "Blackdoor",
    "Next.js",
    "TypeScript",
    "Claude",
    "MCP",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    description:
      "I build AI for businesses that have to actually run. Most of it I shipped while running one — currently at ThePrivateHotels and Blackdoor.",
    locale: "en_US",
    siteName: "Pierre Belon Savon",
    title: "Pierre Belon Savon — AI Engineer",
    type: "website",
    url: siteUrl,
  },
  publisher: "Pierre Belon Savon",
  robots: {
    follow: true,
    googleBot: { follow: true, index: true },
    index: true,
  },
  title: {
    default: "Pierre Belon Savon — AI Engineer",
    template: "%s · Pierre Belon Savon",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "I build AI for businesses that have to actually run. Most of it I shipped while running one — currently at ThePrivateHotels and Blackdoor.",
    title: "Pierre Belon Savon — AI Engineer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${fraunces.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="grain relative flex min-h-full flex-col">
        {/* WebSite JSON-LD — sets up the canonical site identity for
            search engines. Single Person reference on /resume; this
            handles the homepage / general site context. */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              author: {
                "@type": "Person",
                name: "Pierre Belon Savon",
                url: `${siteUrl}/resume`,
              },
              description:
                "I build AI for businesses that have to actually run. Most of it I shipped while running one — currently at ThePrivateHotels and Blackdoor.",
              inLanguage: ["en", "es", "it"],
              name: "Pierre Belon Savon",
              publisher: {
                "@type": "Person",
                name: "Pierre Belon Savon",
              },
              url: siteUrl,
            }),
          }}
          type="application/ld+json"
        />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-accent focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.22em] focus:text-accent focus:shadow-lg"
          href="#main-content"
        >
          Skip to content →
        </a>
        <LightSwitchProvider>
          <PageAtmosphere />
          <SiteHeader />
          <LightSwitch />
          <CommitStamp />
          <div id="main-content">
            <PageTransition>{children}</PageTransition>
          </div>
          <BackToTop />
          <ConsoleSignature />
          <KeyboardNav />
        </LightSwitchProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
