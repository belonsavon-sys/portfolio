import { Button, NavPill } from "@/components";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

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

const atlasNodes = [
  "Pierre + Ryder Co-founders",
  "ATLAS Multi-agent harness",
  "CEO Agent",
  "CFO Agent",
  "CMO Agent",
  "Manager Agents",
  "Field Agents",
  "Game App",
  "Budget App",
  "Agent-augmented Project Mgmt",
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LightSection className="pb-20 pt-6 sm:pb-24">
        <SiteNav />

        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-20 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold text-accent">/business</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-normal sm:text-7xl">
              I ship AI.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Not plans. Not decks. Systems running in production, solving real
              problems, delivering measurable results — built from inside the
              operations I was hired to run.
            </p>
            <div className="mt-10">
              <Button href="/contact">Get in Touch →</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border-light bg-bg-light-2 p-5">
            <div className="grid gap-3">
              {[
                "Process Design & Digitization",
                "Customer & Guest Communications",
                "Team Leadership & Training",
                "Blackdoor Operations",
                "Finance & Administration",
              ].map((item) => (
                <div
                  className="rounded-lg border border-border-light bg-white px-4 py-3 font-medium"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <BusinessSection
          heading="I turn chaos into auditable systems."
          outcomes={processOutcomes}
        >
          <BeforeAfterProcess />
          <CopyBlock>
            When I arrived at ThePrivateHotels, operations ran on a 100+ page
            manual that no one could practically enforce. Inspections were
            inconsistent. Accountability was guesswork.
          </CopyBlock>
          <CopyBlock>
            I digitized the entire manual — room by room, process by process —
            into a trackable, quantifiable inspection system. Every standard
            became a measurable checkpoint. Every housekeeper, every contractor,
            every property is now held to the same defined criteria.
          </CopyBlock>
          <CopyBlock>
            The result: top-10% Airbnb rating, Booking.com Travelers&apos; Choice
            Award, VRBO Premier Partner status, and a 5-star average across the
            board.
          </CopyBlock>
          <CopyBlock>
            I build these systems for businesses. If you&apos;re running on
            guesswork, I&apos;ll give you a system that knows.
          </CopyBlock>
        </BusinessSection>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <BusinessSection
          heading="Faster answers. Consistent voice. Zero missed messages."
          outcomes={communicationOutcomes}
        >
          <CopyBlock>
            Guest response time at ThePrivateHotels used to run up to 48 hours.
            A missed notification could mean a guest waited days.
          </CopyBlock>
          <CopyBlock>
            I built a chatbot trained on curated company data — brand voice,
            approved templates, every scenario a guest might raise. It drafts
            replies inside our operating system. We review, approve, send.
            Response time: under 3 minutes. Per message, it saves 15–20 minutes
            of manual composition.
          </CopyBlock>
          <CopyBlock>
            Every response reflects the brand. Every action is human-approved
            before it goes out.
          </CopyBlock>
        </BusinessSection>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <BusinessSection
          heading="I build teams that can run systems I build."
          outcomes={trainingOutcomes}
        >
          <CopyBlock>
            Building a system is half the job. The other half is making sure
            your team can use it — and maintain the standard when you&apos;re not
            watching.
          </CopyBlock>
          <CopyBlock>
            At ThePrivateHotels I supervised 6 people across two teams and
            managed contractor relationships for ongoing construction. I
            authored room-by-room SOPs, laundry procedures, inspection
            checklists — documentation clear enough that a new hire could
            onboard without confusion.
          </CopyBlock>
          <CopyBlock>
            I also trained staff on all tools and systems I deployed: the
            inspection platform, communication tools, and pet protocols.
            Standards didn&apos;t slip because the team understood why they
            existed.
          </CopyBlock>
        </BusinessSection>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <BusinessSection
          heading="Building the company that builds companies."
          outcomeLabel="What this means"
          outcomes={blackdoorOutcomes}
        >
          <AtlasDiagram />
          <CopyBlock>
            Blackdoor is the holding company I co-founded with Ryder in 2025. We
            develop and operate agentic companies across entertainment, SaaS,
            robotics, and AI.
          </CopyBlock>
          <CopyBlock>
            At Blackdoor, I lead AI R&amp;D and implementation. Our core product
            is Atlas — a multi-level autonomous agent harness where a CEO agent
            routes work to C-suite agents (CFO, CMO), who delegate to manager
            and field agents. The system is designed to build, operate, and
            improve software products autonomously over time.
          </CopyBlock>
          <CopyBlock>
            Atlas has already shipped a game app, a budget web app, and an
            agent-augmented project management system. The same underlying
            technology is deployed at ThePrivateHotels.
          </CopyBlock>
          <CopyBlock>
            We run everything through GitHub PRs. Full research and
            documentation before any implementation sprint. Every decision is
            governed.
          </CopyBlock>
        </BusinessSection>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <div className="grid gap-8 rounded-lg border border-border-light bg-white p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="text-4xl font-semibold tracking-normal">
              Precision behind the scenes.
            </h2>
            <CopyBlock>
              Before I was building AI systems, I was keeping the books. As a
              Finance Data Entry Assistant at ThePrivateHotels, I processed
              customer invoices, bills, and expenses in QuickBooks for six
              months — error-free record, first time doing it.
            </CopyBlock>
            <CopyBlock>
              I research until I have mastery. Then I execute without errors.
              That habit runs through everything I do — whether it&apos;s
              accounting or agent architecture.
            </CopyBlock>
          </div>
          <div className="rounded-lg border border-border-light bg-bg-light-2 p-5">
            {["QuickBooks", "six months", "error-free record"].map((item) => (
              <div
                className="mb-3 rounded-lg border border-border-light bg-white px-4 py-3 font-medium last:mb-0"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <div className="rounded-lg border border-border-light bg-white p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-normal">
            If you have a business problem, I probably know how to automate it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-text-light-muted">
            Remote. Open to the right opportunity. I reply within 24 hours.
          </p>
          <div className="mt-8">
            <Button href="/contact">Get in Touch →</Button>
          </div>
        </div>
      </LightSection>
    </main>
  );
}

function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-border-light bg-white p-2 shadow-sm"
    >
      {navItems.map((item) => (
        <NavPill
          active={item.href === "/business"}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </NavPill>
      ))}
    </nav>
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
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}

function BusinessSection({
  children,
  heading,
  outcomeLabel = "What this looks like",
  outcomes,
}: {
  children: ReactNode;
  heading: string;
  outcomeLabel?: string;
  outcomes: string[];
}) {
  return (
    <article className="grid gap-8 rounded-lg border border-border-light bg-white p-6 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="text-4xl font-semibold tracking-normal">{heading}</h2>
        <div className="mt-8">{children}</div>
      </div>
      <OutcomeList label={outcomeLabel} outcomes={outcomes} />
    </article>
  );
}

function CopyBlock({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 max-w-3xl leading-7 text-text-light-muted">{children}</p>
  );
}

function OutcomeList({
  label,
  outcomes,
}: {
  label: string;
  outcomes: string[];
}) {
  return (
    <aside className="self-start rounded-lg border border-border-light bg-bg-light-2 p-5">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div className="mt-5 grid gap-3">
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
  );
}

function BeforeAfterProcess() {
  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-2">
      <ProcessColumn
        color="problem"
        steps={[
          "100+ page operations manual",
          "Static, untrackable, unenforceable",
          "Inconsistent inspections",
        ]}
        title="BEFORE"
      />
      <ProcessColumn
        color="result"
        steps={[
          "Digital QA system",
          "Trackable, quantifiable, auditable",
          "Top 10% Airbnb, 5-star average, 3 awards",
        ]}
        title="AFTER"
      />
    </div>
  );
}

function ProcessColumn({
  color,
  steps,
  title,
}: {
  color: "problem" | "result";
  steps: string[];
  title: string;
}) {
  const isProblem = color === "problem";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isProblem
          ? "border-problem-red bg-problem-red-bg"
          : "border-result-green bg-result-green-bg"
      }`}
    >
      <h3
        className={`text-sm font-semibold ${
          isProblem ? "text-problem-red" : "text-result-green"
        }`}
      >
        {title}
      </h3>
      <div className="mt-4 grid gap-3">
        {steps.map((step) => (
          <div
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium"
            key={step}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function AtlasDiagram() {
  return (
    <div className="mb-8 rounded-lg border border-border-light bg-bg-light-2 p-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {atlasNodes.map((node, index) => (
          <div
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              index === 1
                ? "border-accent bg-white text-accent"
                : "border-border-light bg-white"
            }`}
            key={node}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
