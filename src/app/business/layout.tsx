import type { Metadata, ReactNode } from "react";
import { EMAIL_DISPLAY } from "@/components/contact-config";

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

const professionalServiceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
    addressLocality: "Ocean Shores",
    addressRegion: "WA",
  },
  areaServed: { "@type": "Country", name: "Worldwide · Remote" },
  description,
  email: EMAIL_DISPLAY,
  knowsAbout: [
    "Process design & digitization",
    "Customer & guest communications",
    "Team leadership & training",
    "Finance & administration",
    "AI automation",
    "Multi-agent systems",
  ],
  name: "Pierre Belon Savon — Business consulting",
  provider: {
    "@type": "Person",
    name: "Pierre Belon Savon",
    url: "https://pierrebelonsavon.com/resume",
  },
  serviceType: [
    "Process design & digitization",
    "Customer communications automation",
    "Team leadership & training",
    "Finance data + administration",
  ],
  url: "https://pierrebelonsavon.com/business",
};

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceLd),
        }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
