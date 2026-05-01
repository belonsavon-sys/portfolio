import {
  BeforeAfter,
  Button,
  GlassCard,
  ScrollReveal,
  SectionDivider,
} from "@/components";
import type { ReactNode } from "react";

const processOutcomes = [
  "Manual → digital, trackable, auditable",
  "Consistent standards across locations and teams",
  "Accountability built into the workflow, not bolted on afterward",
];

const communicationOutcomes = [
  "Response times measured in minutes, not hours",
  "Brand-consistent communication at scale",
  "Human oversight maintained — AI drafts, people decide",
];

const trainingOutcomes = [
  "Clear SOPs that anyone can follow",
  "Staff trained on the tools, not just told to use them",
  "Accountability that doesn't require you to be in the room",
];

const blackdoorOutcomes = [
  "Proven ability to architect and ship agentic systems",
  "Experience running multi-agent pipelines in real business contexts",
  "A co-founder mindset: I take ownership and see things through",
];

const atlasLayers = [
  { badge: "01", items: ["Pierre + Ryder — co-founders"], title: "Founders" },
  { badge: "02", items: ["Atlas — multi-agent harness"], title: "Engine" },
  {
    badge: "03",
    items: ["CEO Agent", "CFO Agent", "CMO Agent"],
    title: "C-suite agents",
  },
  {
    badge: "04",
    items: ["Manager agents", "Field agents"],
    title: "Execution layer",
  },
  {
    badge: "05",
    items: ["Game app", "Budget app", "Project management"],
    title: "Shipped products",
  },
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <BusinessHero />

      <LightSection className="py-20 sm:py-24">
        <ProcessSection />
      </LightSection>

      <LightSection className="pb-20 pt-4 sm:pb-24">
        <CommunicationsSection />
      </LightSection>

      <LightSection className="pb-20 pt-4 sm:pb-24">
        <TrainingSection />
      </LightSection>

      <SectionDivider direction="light-to-dark" />
      <BlackdoorBand />
      <SectionDivider direction="dark-to-light" />

      <LightSection className="py-20 sm:py-24">
        <FinanceSection />
      </LightSection>

      <LightSection className="pb-24 pt-4 sm:pb-32">
        <Cta />
      </LightSection>
    </main>
  );
}

function BusinessHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-[-10%] h-[440px] w-[440px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
            /business
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="up">
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-[7rem]">
            I ship AI.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.12} direction="up">
          <p className="mt-8 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9">
            Not plans. Not decks. Systems running in production, solving real
            problems, delivering measurable results — built from inside the
            operations I was hired to run.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2} direction="up">
          <div className="mt-10">
            <Button href="/contact">Get in Touch →</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <SectionShell
      eyebrow="Process design & digitization"
      heading="I turn chaos into auditable systems."
      outcomes={processOutcomes}
    >
      <BeforeAfter
        after={{
          caption: "Trackable, measurable, enforceable",
          metric: "Top 10% Airbnb",
          points: [
            "Digital QA system — every standard is a checkpoint",
            "Top 10% Airbnb · Travelers' Choice · VRBO Premier",
            "5-star average across the board",
          ],
        }}
        before={{
          caption: "Static documentation, no accountability",
          metric: "100+ pages",
          points: [
            "Operations manual no one could practically enforce",
            "Inconsistent inspections",
            "Accountability was guesswork",
          ],
        }}
        className="mb-10"
      />
      <ScrollReveal direction="up">
        <p className="text-lg leading-8 text-text-light-muted">
          When I arrived at ThePrivateHotels, operations ran on a 100+ page
          manual that no one could practically enforce. I digitized the entire
          manual — room by room, process by process — into a trackable,
          quantifiable inspection system. Every standard became a measurable
          checkpoint.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.05} direction="up">
        <p className="mt-5 text-lg leading-8 text-text-light-muted">
          I build these systems for businesses. If you&apos;re running on
          guesswork, I&apos;ll give you a system that knows.
        </p>
      </ScrollReveal>
    </SectionShell>
  );
}

function CommunicationsSection() {
  return (
    <SectionShell
      eyebrow="Customer & guest communications"
      heading="Faster answers. Consistent voice. Zero missed messages."
      outcomes={communicationOutcomes}
    >
      <BeforeAfter
        after={{
          caption: "AI drafts, humans approve, brand is preserved",
          metric: "< 3 min",
          points: [
            "Chatbot drafts replies inside the operating system",
            "Brand voice + every approved scenario",
            "Human-reviewed before every send",
          ],
        }}
        before={{
          caption: "Slow, inconsistent, missed notifications",
          metric: "48 hrs",
          points: [
            "Guests waited up to 48 hours for a response",
            "Missed notifications meant guests waited days",
            "Per message, 15-20 min of manual drafting",
          ],
        }}
        className="mb-10"
      />
      <ScrollReveal direction="up">
        <p className="text-lg leading-8 text-text-light-muted">
          I built a chatbot trained on curated company data — brand voice,
          approved templates, every scenario a guest might raise. It drafts
          replies inside our operating system. We review, approve, send.
        </p>
      </ScrollReveal>
    </SectionShell>
  );
}

function TrainingSection() {
  return (
    <SectionShell
      eyebrow="Team leadership & training"
      heading="I build teams that can run systems I build."
      outcomes={trainingOutcomes}
    >
      <ScrollReveal direction="up">
        <p className="text-lg leading-8 text-text-light-muted">
          Building a system is half the job. The other half is making sure
          your team can use it — and maintain the standard when you&apos;re
          not watching.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.05} direction="up">
        <p className="mt-5 text-lg leading-8 text-text-light-muted">
          At ThePrivateHotels I supervised 6 people across two teams and
          managed contractor relationships for ongoing construction. I
          authored room-by-room SOPs, laundry procedures, inspection
          checklists — documentation clear enough that a new hire could
          onboard without confusion.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.1} direction="up">
        <p className="mt-5 text-lg leading-8 text-text-light-muted">
          I also trained staff on all tools and systems I deployed: the
          inspection platform, communication tools, and pet protocols.
          Standards didn&apos;t slip because the team understood why they
          existed.
        </p>
      </ScrollReveal>
    </SectionShell>
  );
}

function BlackdoorBand() {
  return (
    <section className="relative overflow-hidden bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]">
          <ScrollReveal direction="left">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent-light">
              Blackdoor operations
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-dark sm:text-4xl lg:text-5xl">
              Building the company that builds companies.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-text-dark-muted">
              Blackdoor is the holding company I co-founded with Ryder in 2025.
              We develop and operate agentic companies across entertainment,
              SaaS, robotics, and AI.
            </p>

            <div className="mt-8 grid gap-3">
              {blackdoorOutcomes.map((outcome) => (
                <ScrollReveal direction="left" key={outcome}>
                  <div className="flex items-start gap-3 text-sm leading-7 text-text-dark-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{outcome}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} direction="right">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-dark-muted">
              Atlas — the engine
            </p>
            <div className="mt-4 grid gap-3">
              {atlasLayers.map((layer, index) => (
                <ScrollReveal
                  delay={0.1 + index * 0.06}
                  direction="up"
                  key={layer.title}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                        {layer.badge}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
                        {layer.title}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span
                          className="inline-flex items-center rounded-md border border-[rgba(41,110,214,0.35)] bg-[rgba(41,110,214,0.10)] px-2.5 py-1 text-sm font-medium text-text-dark"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.15} direction="up">
          <div className="mt-12 grid gap-6 text-lg leading-8 text-text-dark-muted lg:grid-cols-2">
            <p>
              At Blackdoor, I lead AI R&amp;D and implementation. Atlas is a
              multi-level autonomous agent harness — a CEO agent routes work to
              C-suite agents (CFO, CMO), who delegate to manager and field
              agents. Designed to build, operate, and improve software products
              autonomously.
            </p>
            <p>
              Atlas has already shipped a game app, a budget web app, and an
              agent-augmented project management system. The same underlying
              technology is deployed at ThePrivateHotels. We run everything
              through GitHub PRs. Every decision is governed.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FinanceSection() {
  return (
    <ScrollReveal direction="up">
      <article className="grid gap-8 rounded-3xl border border-border-light bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Finance & administration
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Precision behind the scenes.
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-light-muted">
            Before I was building AI systems, I was keeping the books. As a
            Finance Data Entry Assistant at ThePrivateHotels, I processed
            customer invoices, bills, and expenses in QuickBooks for six
            months — error-free record, first time doing it.
          </p>
          <p className="mt-5 text-lg leading-8 text-text-light-muted">
            I research until I have mastery. Then I execute without errors.
            That habit runs through everything I do — whether it&apos;s
            accounting or agent architecture.
          </p>
        </div>
        <div className="grid content-start gap-3 self-start rounded-2xl bg-bg-light-2 p-5">
          {[
            { label: "Tool", value: "QuickBooks" },
            { label: "Duration", value: "6 months" },
            { label: "Record", value: "Error-free" },
          ].map((item) => (
            <div
              className="rounded-lg border border-border-light bg-white px-4 py-3"
              key={item.label}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted">
                {item.label}
              </p>
              <p className="mt-1 text-base font-semibold text-text-light">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </article>
    </ScrollReveal>
  );
}

function Cta() {
  return (
    <ScrollReveal direction="up">
      <section className="rounded-3xl border border-border-light bg-white p-8 text-center shadow-sm sm:p-14">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Ready when you are
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          If you have a business problem, I probably know how to automate it.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-text-light-muted">
          Remote. Open to the right opportunity. I reply within 24 hours.
        </p>
        <div className="mt-8">
          <Button href="/contact">Get in Touch →</Button>
        </div>
      </section>
    </ScrollReveal>
  );
}

function SectionShell({
  children,
  eyebrow,
  heading,
  outcomes,
}: {
  children: ReactNode;
  eyebrow: string;
  heading: string;
  outcomes: string[];
}) {
  return (
    <article className="grid gap-10 rounded-3xl border border-border-light bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_320px]">
      <div>
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
        </ScrollReveal>
        <div className="mt-8">{children}</div>
      </div>

      <aside className="self-start rounded-2xl bg-bg-light-2 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          What this looks like
        </p>
        <div className="mt-4 grid gap-3">
          {outcomes.map((outcome) => (
            <div
              className="rounded-lg border border-border-light bg-white px-4 py-3 text-sm font-medium leading-6"
              key={outcome}
            >
              {outcome}
            </div>
          ))}
        </div>
      </aside>
    </article>
  );
}

function LightSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
