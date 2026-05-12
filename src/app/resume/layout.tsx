import type { Metadata, ReactNode } from "react";

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

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return children;
}
