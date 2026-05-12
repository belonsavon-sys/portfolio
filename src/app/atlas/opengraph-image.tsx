import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Atlas · the multi-agent harness — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "A five-layer autonomous harness shipping real products at Blackdoor. CEO agent → C-suite → manager → field → product.",
    eyebrow: "/atlas · the harness",
    footer: ["5 layers", "3 products live", "Claude · MCP · Codex"],
    headline: "Atlas.",
  });
}
