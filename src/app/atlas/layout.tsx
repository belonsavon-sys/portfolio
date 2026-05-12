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

export default function AtlasLayout({ children }: { children: ReactNode }) {
  return children;
}
