import {
  Button,
  GlassCard,
  NavPill,
  SectionDivider,
  TerminalWindow,
  type TerminalLine,
} from "@/components";

const terminalLines: TerminalLine[] = [
  { text: "> Initializing CEO agent..." },
  { text: "> Routing to CFO and CMO..." },
  { text: "> Field agents deployed" },
  { kind: "output", text: "Task persisted. Review queue updated." },
];

export default function ComponentDemoPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-12">
        <p className="font-mono text-sm text-accent">/component-demo</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-normal sm:text-6xl">
          Core Components
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted">
          Internal render check for the shared primitives used across the
          portfolio build.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button href="/contact">Primary Link</Button>
        </div>

        <div className="mt-10 w-full max-w-3xl rounded-full border border-border-light bg-white p-2 shadow-sm">
          <div className="flex flex-wrap justify-center gap-2">
            <NavPill active href="/component-demo">
              Active Pill
            </NavPill>
            <NavPill href="/ai">Inactive Pill</NavPill>
          </div>
        </div>
      </section>

      <SectionDivider direction="light-to-dark" />

      <section className="bg-bg-dark px-6 py-20 text-text-dark sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2">
          <GlassCard>
            <p className="font-mono text-sm text-accent">glass-card</p>
            <h2 className="mt-4 text-3xl font-semibold">Dark Section Card</h2>
            <p className="mt-4 leading-7 text-text-dark-muted">
              Frosted card with locked blue glow, border, blur, radius, and
              Framer Motion hover behavior.
            </p>
            <div className="mt-8">
              <Button variant="ghostDark">Ghost Dark</Button>
            </div>
          </GlassCard>

          <TerminalWindow lines={terminalLines} title="atlas" />
        </div>
      </section>

      <SectionDivider direction="dark-to-light" />

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-semibold">Divider Return</h2>
        <p className="mt-4 max-w-2xl leading-7 text-text-light-muted">
          The second divider restores the light page background after dark demo
          sections.
        </p>
      </section>
    </main>
  );
}
