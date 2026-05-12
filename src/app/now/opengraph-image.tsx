import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Now · what I'm doing — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "Building · Reading · Learning · Recent ships · What's next. A live snapshot, not a feed. Inspired by nownownow.com.",
    eyebrow: "/now · what I'm doing",
    footer: ["3 projects · live", "Recent ships · weekly", "EN · ES · IT"],
    headline: "What I'm doing now.",
  });
}
