import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  BackToTop,
  ConsoleSignature,
  CustomCursor,
  KeyboardNav,
  PageTransition,
  ScrollProgress,
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
    "AI Engineer building intelligent automation, full-stack applications, and multi-agent systems that ship to production.",
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
      "AI Engineer building intelligent automation, full-stack applications, and multi-agent systems that ship to production.",
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
      "AI Engineer shipping intelligent automation and full-stack systems.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="grain flex min-h-full flex-col">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-accent focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.22em] focus:text-accent focus:shadow-lg"
          href="#main-content"
        >
          Skip to content →
        </a>
        <ScrollProgress />
        <SiteHeader />
        <div id="main-content">
          <PageTransition>{children}</PageTransition>
        </div>
        <CustomCursor />
        <BackToTop />
        <ConsoleSignature />
        <KeyboardNav />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
