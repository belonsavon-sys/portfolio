import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "The Lab — what I'm building and using";
const description =
  "Behind the scenes. What I'm shipping this week, the local-ML demos I'm playing with, the tools I actually paid for, and how I built this site.";

export const metadata: Metadata = {
  alternates: { canonical: "/lab" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/lab",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return children;
}
