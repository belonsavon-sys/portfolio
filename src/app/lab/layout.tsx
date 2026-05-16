import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "The Lab — local ML, in your browser";
const description =
  "Five interactive on-device ML demos. All inference runs in your tab via onnxruntime-web — nothing is uploaded.";

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
