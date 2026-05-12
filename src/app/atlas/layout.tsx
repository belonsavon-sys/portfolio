import type { Metadata, ReactNode } from "react";

const title = "Atlas — the multi-agent harness";
const description =
  "A five-layer autonomous agent harness shipping real products at Blackdoor. Architecture · capabilities · live products · how it ships.";

export const metadata: Metadata = {
  alternates: { canonical: "/atlas" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/atlas",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

const atlasSoftwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Multi-agent harness",
  author: {
    "@type": "Person",
    name: "Pierre Belon Savon",
    url: "https://pierrebelonsavon.com/resume",
  },
  creator: {
    "@type": "Organization",
    name: "Blackdoor",
  },
  description,
  featureList: [
    "Multi-level autonomous agent harness",
    "MCP / OAuth tool integration",
    "GitHub PR-driven workflow",
    "C-suite agent routing",
    "Manager + field agent execution",
    "Self-monitoring + audit trail",
  ],
  name: "Atlas",
  operatingSystem: "Cross-platform",
  url: "https://pierrebelonsavon.com/atlas",
};

export default function AtlasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(atlasSoftwareLd) }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
