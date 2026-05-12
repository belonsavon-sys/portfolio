"use client";

import {
  AtlasHierarchy,
  BeforeAfter,
  Button,
  CursorHalo,
  IndexedDivider,
  ParallaxGhost,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SiteFooter,
  SplitText,
  Testimonial,
} from "@/components";
import { useEffect } from "react";
import type { ReactNode } from "react";

const processOutcomes = [
  "Manual workflows turned into auditable digital systems",
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
  "Architected and shipped Atlas — not slideware",
  "Multi-agent pipelines running across two live businesses",
  "Co-founded Blackdoor — I ship at owner-pace",
];

const atlasLayers = [
  {
    badge: "01",
    description:
      "Two co-founders set scope. Pierre handles AI R&D and implementation; Ryder runs the business side.",
    items: ["Pierre + Ryder — co-founders"],
    title: "Founders",
  },
  {
    badge: "02",
    description:
      "The multi-level autonomous harness that runs the rest. Connects any AI model to any external tool through MCP or OAuth.",
    items: ["Atlas — multi-agent harness"],
    title: "Engine",
  },
  {
    badge: "03",
    description:
      "Strategic-tier agents that read the brief, decide direction, and route work down to managers.",
    items: ["CEO Agent", "CFO Agent", "CMO Agent"],
    title: "C-suite agents",
  },
  {
    badge: "04",
    description:
      "Manager agents break work into tasks; field agents pick them up, write the code, and file PRs against the board.",
    items: ["Manager agents", "Field agents"],
    title: "Execution layer",
  },
  {
    badge: "05",
    description:
      "Real products operating in production — game, budget tracker, agent-augmented PM. Every change shipped under human review.",
    items: ["Game app", "Budget app", "Project management"],
    title: "Shipped products",
  },
];

const TESTIMONIAL_BODY: string | null = null;
const TESTIMONIAL_AUTHOR = "";
const TESTIMONIAL_ROLE = "";

export default function BusinessPage() {
  // Activate scroll-snap chapters on /business only. Sets
  // scroll-snap-type on the html scroller while this page is mounted;
  // restores on unmount. "proximity" lets users free-scroll within a
  // chapter without being yanked to the next one.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    html.style.scrollSnapType = "y proximity";
    return () => {
      html.style.scrollSnapType = prev;
    };
  }, []);

  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <BusinessHero />

      {/* Chapter 01 — Blackdoor */}
      <div className="snap-start">
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <BlackdoorSection />
        </LightSection>
      </div>

      {/* Chapter 02 — Process */}
      <div className="snap-start">
        <IndexedDivider index="01" label="Process design" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <ProcessSection />
        </LightSection>
      </div>

      {/* Chapter 03 — Communications */}
      <div className="snap-start">
        <IndexedDivider index="02" label="Communications" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <CommunicationsSection />
        </LightSection>
      </div>

      {/* Chapter 04 — Team & training (bundles the testimonial frame) */}
      <div className="snap-start">
        <IndexedDivider index="03" label="Team & training" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
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
      </div>

      {/* Chapter 05 — Finance */}
      <div className="snap-start">
        <IndexedDivider index="04" label="Finance & admin" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <FinanceSection />
        </LightSection>
      </div>

      {/* Chapter 06 — Closer (footer) */}
      <div className="snap-start">
        <SectionDivider direction="light-to-dark" />
        <SiteFooter />
      </div>
    </main>
  );
}

function BusinessHero() {
  return (
    <section className="relative snap-start overflow-hidden">
      <CursorHalo />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost className="ghost-text select-none">OPS</ParallaxGhost>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-16 sm:px-6 sm:py-20 lg:gap-x-8 lg:py-24">
        {/* TOP STRIP — status pill + chapter mark */}
        <ScrollReveal className="col-span-12 self-start" direction="up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
                /business · for operators
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Chapter 01 / Hero
            </span>
          </div>
        </ScrollReveal>

        {/* LEFT — stacked massive title (cols 1–8 lg) */}
        <div className="col-span-12 self-center lg:col-span-8">
          <h1
            className="font-semibold text-text-light"
            style={{
              fontSize: "clamp(3rem, 12vw, 10rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
          >
            <span className="block">
              <SplitText charDelay={0.025} delay={0.16} duration={0.85}>
                I ship
              </SplitText>
            </span>
            <span className="relative inline-block">
              <span className="gradient-shift block">
                <SplitText charDelay={0.025} delay={0.36} duration={0.85}>
                  AI.
                </SplitText>
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-md"
              />
            </span>
          </h1>

          <ScrollReveal delay={0.32} direction="up">
            <div className="mt-10 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                For operators · For doers
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* RIGHT — subtitle + CTA (cols 9–12 lg) */}
        <div className="col-span-12 self-end lg:col-span-4 lg:self-center">
          <ScrollReveal delay={0.4} direction="up">
            <p className="text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Not plans. Not decks. Systems running in production —
              built from inside the operations I was hired to run.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.5} direction="up">
            <div className="mt-8">
              <Button arrow className="!px-8 !py-4 !text-base" href="/contact">
                Start a Conversation
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function BlackdoorSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]">
      <div>
        <SectionHeader
          description="Blackdoor is the holding company I co-founded with Ryder in 2025. Our products are built and shipped end-to-end by Atlas — our autonomous agent harness — in place of a human dev team."
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
      chapter="01"
      eyebrow="Process design & digitization"
      heading="I turn chaos into auditable systems."
      outcomes={processOutcomes}
    >
      <BeforeAfter
        after={{
          caption: "Auditable, every check enforced",
          metric: "Top 10% Airbnb",
          points: [
            "Digital QA system — every standard is a checkpoint",
            "Top 10% Airbnb · Travelers' Choice · VRBO Premier",
            "5-star average across the board",
          ],
        }}
        before={{
          caption: "Static documentation, no audit trail",
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
        manual — room by room, process by process — into an auditable QA
        inspection system where every standard became a measurable
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
      chapter="02"
      eyebrow="Customer & guest communications"
      heading="Replies inside three minutes, always in your voice."
      outcomes={communicationOutcomes}
    >
      <BeforeAfter
        after={{
          caption: "AI drafts; humans approve before send",
          metric: "< 3 min",
          points: [
            "Chatbot drafts replies inside the operating system",
            "Brand voice + every approved scenario",
            "Human-reviewed before every send",
          ],
        }}
        before={{
          caption: "Slow drafts, missed notifications",
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
        I built a chatbot trained on curated company data — brand voice
        plus every scenario a guest might raise. It drafts replies inside
        our operating system; we review, approve, send.
      </p>
    </SectionShell>
  );
}

function TrainingSection() {
  return (
    <SectionShell
      chapter="03"
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
          Finance Data Entry Assistant at ThePrivateHotels, I handled the
          company&apos;s bookkeeping in QuickBooks for six months —
          error-free record, first time doing it.
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

/**
 * Editorial chapter shell — wraps each /business chapter (Process,
 * Communications, Training). The IndexedDivider above each chapter
 * shows the chapter number on its own row; this shell carries the
 * editorial heading strip, the chapter body, and a ~/outcomes
 * datasheet sidebar that matches the ~/now / ~/contact / ~/engagements
 * datasheets used elsewhere on the site.
 */
function SectionShell({
  chapter,
  children,
  eyebrow,
  heading,
  outcomes,
}: {
  chapter: string;
  children: ReactNode;
  eyebrow: string;
  heading: string;
  outcomes: string[];
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
        {/* Editorial heading strip — chapter mark + accent rule + h2 */}
        <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            {chapter} · {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-accent/40" />
        </div>
        <h2
          className="mt-6 font-semibold tracking-tight text-text-light"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
          }}
        >
          {heading}
        </h2>
        <div className="mt-10">{children}</div>
      </div>

      {/* ~/outcomes datasheet — same DNA as the SiteFooter ~/now, the
          /resume ~/contact + ~/languages, the 404 ~/diagnostic, the
          /contact ~/engagements. Anchors each chapter's "what this
          looks like" as a real spec sheet. */}
      <aside className="self-start lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>~/outcomes</span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span className="text-text-light-muted">
              {outcomes.length} signals
            </span>
          </div>
          <ul className="grid">
            {outcomes.map((outcome, index) => (
              <li
                className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                key={outcome}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  <span className="text-text-light-muted/60">// </span>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-text-light">
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
