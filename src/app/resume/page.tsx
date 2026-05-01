import { RouteStub } from "../_components/RouteStub";

export default function ResumePage() {
  return (
    <RouteStub
      route="/resume"
      title="Resume"
      issue="Issue #12"
      summary="Resume page shell for the full resume view and a clean black-and-white ATS-friendly PDF download."
      nextSteps={[
        "Render source data from context/resume.md.",
        "Keep the civil engineering education entry.",
        "Add the Download Resume action after button primitives land.",
      ]}
    />
  );
}
