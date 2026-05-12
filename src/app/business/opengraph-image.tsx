import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Business · for operators — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "Not plans. Not decks. Systems running in production — built from inside the operations I was hired to run.",
    eyebrow: "/business · for operators",
    footer: ["Process", "Comms", "Training", "Finance"],
    headline: "I ship AI.",
  });
}
