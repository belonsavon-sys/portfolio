import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Uses · stack with reasons — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "What I actually use to ship AI systems — tools, editors, infra, hardware, with usage notes. Not the sponsored stack page.",
    eyebrow: "/uses · stack with reasons",
    footer: ["AI stack", "Editor / IDE", "Infra", "Hardware"],
    headline: "What I actually use.",
  });
}
