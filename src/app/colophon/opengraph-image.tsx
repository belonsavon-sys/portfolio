import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/components/og-card";

export const alt = "Colophon · how this site was built — Pierre Belon Savon";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "edge";

export default function OpenGraphImage() {
  return renderOgCard({
    description:
      "Notes on the stack, the design language, and the iteration process behind pierrebelonsavon.com. Every page shipped through a PR.",
    eyebrow: "/colophon · how this is built",
    footer: ["Next.js 16", "Tailwind v4", "200+ PRs"],
    headline: "Built in the open.",
  });
}
