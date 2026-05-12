import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Contact · open to work — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "Send a message · 4 contact methods · pipeline from reply to ship · 4 engagement shapes · availability snapshot. Reply window within 24 hrs.",
    eyebrow: "/contact · open to work",
    footer: ["Available now", "Replies in 24 hrs", "EN · ES · IT"],
    headline: "Ready when you are.",
  });
}
