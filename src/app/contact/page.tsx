import { RouteStub } from "../_components/RouteStub";

export default function ContactPage() {
  return (
    <RouteStub
      route="/contact"
      title="Get in Touch"
      issue="Issue #12"
      summary="Contact page shell for GitHub, phone, and email icon links. LinkedIn stays omitted until a real profile URL exists."
      nextSteps={[
        "Use icon links only; no contact form.",
        "Render finalized contact copy from context/copy/contact.md.",
        "Omit LinkedIn until Issue #5 is resolved.",
      ]}
    />
  );
}
