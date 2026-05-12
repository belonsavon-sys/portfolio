import type { Metadata, ReactNode } from "react";

const title = "Business — for operators";
const description =
  "Not plans. Not decks. Systems running in production — built from inside the operations I was hired to run. Process · Communications · Training · Finance.";

export const metadata: Metadata = {
  alternates: { canonical: "/business" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/business",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return children;
}
