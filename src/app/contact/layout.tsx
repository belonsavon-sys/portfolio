import type { Metadata, ReactNode } from "react";

const title = "Contact — open to work";
const description =
  "Send a message · 4 contact methods · pipeline from reply to ship · 4 engagement shapes · availability snapshot. Reply window within 24 hours.";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  description,
  openGraph: {
    description,
    title: `${title} · Pierre Belon Savon`,
    type: "website",
    url: "/contact",
  },
  title,
  twitter: {
    card: "summary_large_image",
    description,
    title: `${title} · Pierre Belon Savon`,
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
