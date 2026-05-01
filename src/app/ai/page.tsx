import { RouteStub } from "../_components/RouteStub";

export default function AiPage() {
  return (
    <RouteStub
      route="/ai"
      title="AI"
      issue="Issue #9"
      summary="AI automation page shell for services, case studies, local WebGPU demo placement, Atlas walkthrough placement, and CTA."
      nextSteps={[
        "Build shared buttons, glass cards, terminal window, and section dividers in Issue #18.",
        "Render the finalized AI copy from context/copy/ai.md.",
        "Plug in Demo 1 and Demo 2 after the AI page structure lands.",
      ]}
    />
  );
}
