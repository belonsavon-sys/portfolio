import type { Metadata, ReactNode } from "react";
import {
  EMAIL_DISPLAY,
  GITHUB_URL,
  LINKEDIN_URL,
} from "@/components/contact-config";

const title = "Résumé — curriculum";
const description =
  "AI engineer who learned to ship by automating the hotel he was hired to supervise. Co-founder of Blackdoor, co-architect of Atlas. Trilingual EN · ES · IT.";

export const metadata: Metadata = {
  alternates: { canonical: "/resume" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "profile",
    url: "/resume",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

// schema.org Person structured data — lets recruiter ATS systems
// and search engines parse Pierre's profile programmatically.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
    addressLocality: "Ocean Shores",
    addressRegion: "WA",
  },
  description:
    "AI Engineer building production systems for operations-heavy businesses. Co-founder of Blackdoor, co-architect of the Atlas multi-agent harness.",
  email: EMAIL_DISPLAY,
  jobTitle: "AI Engineer · Co-founder",
  knowsAbout: [
    "Artificial Intelligence",
    "Multi-agent systems",
    "MCP (Model Context Protocol)",
    "Claude",
    "Anthropic API",
    "Next.js",
    "TypeScript",
    "React",
    "Supabase",
    "PostgreSQL",
    "Process automation",
    "Hotel operations",
    "AI Agents",
    "Atlas harness",
  ],
  knowsLanguage: ["English", "Spanish", "Italian"],
  name: "Pierre Belon Savon",
  nationality: "United States",
  sameAs: [
    GITHUB_URL,
    ...(LINKEDIN_URL ? [LINKEDIN_URL] : []),
  ],
  url: "https://pierrebelonsavon.com",
  worksFor: [
    {
      "@type": "Organization",
      description: "Holding company shipping products end-to-end via Atlas.",
      name: "Blackdoor",
    },
    {
      "@type": "Organization",
      description:
        "Hospitality operator. Pierre's AI systems power guest comms + QA.",
      name: "ThePrivateHotels",
    },
  ],
};

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
