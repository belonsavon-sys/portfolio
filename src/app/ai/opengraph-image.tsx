import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "AI · what I build — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "Multi-agent harnesses and automation, wired into the workflows you already run. Live demos, case studies, and the Atlas portfolio.",
    eyebrow: "/ai · what I build",
    footer: ["Atlas · Blackdoor", "Live demos", "Case studies"],
    headline: "I build AI that ships.",
  });
}
