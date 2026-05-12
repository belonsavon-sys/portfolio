import {
  AtlasHierarchy,
  BeforeAfter,
  Button,
  CursorHalo,
  IndexedDivider,
  ParallaxBackdrop,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SiteFooter,
  SplitText,
  Testimonial,
} from "@/components";
import type { ReactNode } from "react";

const processOutcomes = [
  "Manual → digital, trackable, auditable",
  "Consistent standards across every property and shift",
  "Accountability built into the workflow, not bolted on afterward",
];

const communicationOutcomes = [
  "Response times measured in minutes, not hours",
  "Voice that stays on-brand even when staff turn over",
  "AI drafts, people decide. Nothing autopilots.",
];

const trainingOutcomes = [
  "Clear SOPs that anyone can follow",
  "Staff trained on the tools, not just told to use them",
  "Accountability that doesn't require you to be in the room",
];

const blackdoorOutcomes = [
  "Architected and shipped agentic systems — not slideware",
  "Multi-agent pipelines running across two live businesses",
  "Co-founded Blackdoor — I ship at owner-pace",
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

const TESTIMONIAL_BODY: string | null = null;
const TESTIMONIAL_AUTHOR = "";
const TESTIMONIAL_ROLE = "";

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <BusinessHero />

      <LightSection className="py-20 sm:py-24">
        <BlackdoorSection />
      </LightSection>

      <IndexedDivider index="01" label="Process design" />

      <LightSection className="py-20 sm:py-24">
        <ProcessSection />
      </LightSection>

      <IndexedDivider index="02" label="Communications" />

      <LightSection className="py-20 sm:py-24">
        <CommunicationsSection />
      </LightSection>

      <IndexedDivider index="03" label="Team & training" />

      <LightSection className="py-20 sm:py-24">
        <TrainingSection />
      </LightSection>

      <LightSection className="pb-20 pt-4 sm:pb-24">
        <Testimonial
          author={TESTIMONIAL_AUTHOR}
          body={TESTIMONIAL_BODY}
          className="mx-auto max-w-3xl"
          role={TESTIMONIAL_ROLE}
        />
      </LightSection>

      <IndexedDivider index="04" label="Finance & admin" />

      <LightSection className="py-20 sm:py-24">
        <FinanceSection />
      </LightSection>

      <SectionDivider direction="light-to-dark" />

      <SiteFooter />
    </main>
  );
}

function BusinessHero() {
  return (
    <section className="relative overflow-hidden">
      <CursorHalo />
      <ParallaxBackdrop>
        <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/25 blur-3xl" />
      </ParallaxBackdrop>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <span className="ghost-text select-none">OPS</span>
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
              /business · for operators
            </p>
          </div>
        </ScrollReveal>
        <h1 className="hero-display-md mt-6 font-semibold">
          <SplitText charDelay={0.04} delay={0.1} duration={0.8}>
            {"I ship "}
          </SplitText>
          <span className="relative inline-block">
            <span className="gradient-shift">AI.</span>
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-sm"
            />
          </span>
        </h1>
        <ScrollReveal delay={0.1} direction="up">
          <div
            aria-hidden="true"
            className="mt-8 h-[3px] w-32 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.15} direction="up">
          <p className="mt-8 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9">
            Not plans. Not decks. Systems running in production — built from
            inside the operations I was hired to run.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.22} direction="up">
          <div className="mt-12">
            <Button arrow className="!px-8 !py-4 !text-base" href="/contact">
              Start a Conversation
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function BlackdoorSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]">
      <div>
        <SectionHeader
          description="Blackdoor is the holding company I co-founded with Ryder in 2025. We develop and operate agentic companies across entertainment, SaaS, robotics, and AI."
          eyebrow="Blackdoor operations"
          size="md"
          title="Building the company that builds companies."
        />

        <ul className="mt-8 grid gap-3">
          {blackdoorOutcomes.map((outcome) => (
            <li
              className="flex items-start gap-3 text-sm leading-7 text-text-light-muted"
              key={outcome}
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <AtlasHierarchy layers={atlasLayers} />

        <div className="mt-10 grid gap-6 text-base leading-7 text-text-light-muted lg:grid-cols-2">
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
      </div>
    </div>
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
      <p className="text-lg leading-8 text-text-light-muted">
        When I arrived at ThePrivateHotels, operations ran on a 100+ page
        manual that no one could practically enforce. I digitized the entire
        manual — room by room, process by process — into a trackable,
        quantifiable inspection system. Every standard became a measurable
        checkpoint.
      </p>
      <p className="mt-5 text-lg leading-8 text-text-light-muted">
        I build these systems for businesses. If you&apos;re running on
        guesswork, I&apos;ll give you a system that knows.
      </p>
    </SectionShell>
  );
}

function CommunicationsSection() {
  return (
    <SectionShell
      eyebrow="Customer & guest communications"
      heading="Replies inside three minutes, in your voice, every time."
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
      <p className="text-lg leading-8 text-text-light-muted">
        I built a chatbot trained on curated company data — brand voice,
        approved templates, every scenario a guest might raise. It drafts
        replies inside our operating system. We review, approve, send.
      </p>
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
      <p className="text-lg leading-8 text-text-light-muted">
        Building a system is half the job. The other half is making sure
        your team can use it. I supervised 6 staff across two teams,
        authored room-by-room SOPs and inspection checklists, and trained
        everyone on the tools — so standards held even when I wasn&apos;t in
        the room.
      </p>
    </SectionShell>
  );
}

function FinanceSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <SectionHeader
          eyebrow="Finance & administration"
          title="Precision behind the scenes."
        />
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
      <dl className="grid content-start gap-4 self-start">
        {[
          { label: "Tool", value: "QuickBooks" },
          { label: "Duration", value: "6 months" },
          { label: "Record", value: "Error-free" },
        ].map((item) => (
          <div className="border-l border-border-light pl-4" key={item.label}>
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted">
              {item.label}
            </dt>
            <dd className="mt-1 text-base font-semibold text-text-light">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
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
    <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <SectionHeader eyebrow={eyebrow} size="md" title={heading} />
        <div className="mt-8">{children}</div>
      </div>

      <aside className="self-start">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          What this looks like
        </p>
        <ul className="mt-4 grid gap-3">
          {outcomes.map((outcome) => (
            <li
              className="border-l border-border-light pl-4 text-sm font-medium leading-6"
              key={outcome}
            >
              {outcome}
            </li>
          ))}
        </ul>
      </aside>
    </div>
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
