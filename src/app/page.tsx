import { RouteStub } from "./_components/RouteStub";

export default function Home() {
  return (
    <RouteStub
      route="/"
      title="Welcome"
      issue="Issue #8"
      summary="Homepage shell for the hero, sticky sidebar, about section, stack grid, metrics strip, CTA, and footer."
      nextSteps={[
        "Wait for the core component primitives from Issue #18.",
        "Swap in the selected photo assets when Pierre saves them to public/.",
        "Render the finalized home copy from context/copy/home.md.",
      ]}
    />
  );
}
