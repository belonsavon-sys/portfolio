import type { Metadata, ReactNode } from "react";

const title = "AI — what I build";
const description =
  "Multi-agent harnesses and automation, wired into the workflows you already run. Live demos, case studies, and the Atlas portfolio.";

export const metadata: Metadata = {
  alternates: { canonical: "/ai" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/ai",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

export default function AiLayout({ children }: { children: ReactNode }) {
  return children;
}
