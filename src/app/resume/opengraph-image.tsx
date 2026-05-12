import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Résumé · curriculum — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "AI engineer who learned to ship by automating the hotel he was hired to supervise. Co-founder of Blackdoor, co-architect of Atlas.",
    eyebrow: "/resume · curriculum",
    footer: ["AI Engineer", "Co-founder · Blackdoor", "EN · ES · IT"],
    headline: "Pierre Belon Savon.",
  });
}
