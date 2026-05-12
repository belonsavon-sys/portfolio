import type { Metadata, ReactNode } from "react";

const title = "Colophon — how this site was built";
const description =
  "Notes on the stack, the design language, and the iteration process behind pierrebelonsavon.com. Every page shipped through a PR.";

export const metadata: Metadata = {
  alternates: { canonical: "/colophon" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/colophon",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

export default function ColophonLayout({ children }: { children: ReactNode }) {
  return children;
}
