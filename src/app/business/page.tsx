"use client";

import {
  AtlasHierarchy,
  BeforeAfter,
  Button,
  ChapterRail,
  CursorHalo,
  GlitchTitle,
  HeroSplitTitle,
  IndexedDivider,
  ParallaxGhost,
  SectionDivider,
  SiteFooter,
  Testimonial,
} from "@/components";
import { useEffect } from "react";
import type { ReactNode } from "react";

const processOutcomes = [
  "I turn manual workflows into auditable digital systems",
  "I hold standards consistent across every property and shift",
  "I build accountability into the workflow, not bolted on afterward",
];

const communicationOutcomes = [
  "I get response times measured in minutes, not hours",
  "I keep the voice on-brand even when staff turn over",
  "AI drafts, I decide. Nothing autopilots.",
];

const trainingOutcomes = [
  "I write clear SOPs that anyone on the team can follow",
  "I train staff on the tools, not just tell them to use them",
  "I leave accountability that doesn't require me in the room",
];

const blackdoorOutcomes = [
  "I architected and shipped Atlas — not slideware",
  "I run multi-agent pipelines across two live businesses",
  "I co-founded Blackdoor and ship at owner-pace",
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
    <main
      className="min-h-screen bg-bg-light text-text-light"
    >
      <BusinessHero />
      {/* Chapter 01 — Blackdoor */}
      <div className="scroll-mt-28 snap-start" id="blackdoor">
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <BlackdoorSection />
        </LightSection>
      </div>

      {/* Chapter 02 — Process */}
      <div className="scroll-mt-28 snap-start" id="process">
        <IndexedDivider index="01" label="Process design" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <ProcessSection />
        </LightSection>
      </div>

      {/* Chapter 03 — Communications */}
      <div className="scroll-mt-28 snap-start" id="communications">
        <IndexedDivider index="02" label="Communications" />
        <LightSection className="min-h-[calc(100vh-72px)] py-20 sm:py-24">
          <CommunicationsSection />
        </LightSection>
      </div>

      {/* Chapter 04 — Team & training (bundles the testimonial frame) */}
      <div className="scroll-mt-28 snap-start" id="training">
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
      <div className="scroll-mt-28 snap-start" id="finance">
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

      {/* CHAPTER RAIL — completes the cross-site nav coverage. The
          /business chapters use scroll-snap (proximity), so smooth
          scroll to id still lands cleanly. */}
      <ChapterRail
        sections={[
          { id: "blackdoor", index: "00", label: "Blackdoor" },
          { id: "process", index: "01", label: "Process" },
          { id: "communications", index: "02", label: "Comms" },
          { id: "training", index: "03", label: "Training" },
          { id: "finance", index: "04", label: "Finance" },
        ]}
      />
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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        {/* TOP STRIP — centered */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-12">
          <span className="inline-flex items-center gap-3 px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs font-medium text-accent">
              /business · for operators
            </span>
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] text-text-light-muted">
            Chapter 01 / Hero
          </span>
        </div>

        {/* TITLE — centered, single line, welcome-style glitch */}
        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 7.5rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="I ship AI." />
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-md"
            />
          </span>
          <span
            aria-hidden="true"
            className="hero-cursor ml-2 -translate-y-[0.1em] align-middle bg-accent"
            style={{
              display: "inline-block",
              height: "0.85em",
              width: "0.08em",
            }}
          />
        </h1>

        {/* CENTERED INTRO */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Not plans. Not decks. Real systems I built from inside the
          operations I was hired to run — and I&apos;m still the one
          running them.
        </p>

        {/* CENTERED CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button arrow className="!px-8 !py-4 !text-base" href="/resume#contact">
            Let&apos;s talk
          </Button>
        </div>
      </div>
    </section>
  );
}

function BlackdoorSection() {
  return (
    <div>
      {/* Editorial heading strip — matches the SectionShell chapter
          treatment used by the other /business chapters. */}
      <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
        <span className="font-mono text-[11px] text-accent">
          00 · Blackdoor operations
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
        Building the company that builds companies.
      </h2>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
        Blackdoor is the holding company I co-founded with Ryder in
        2025. Our products are built and shipped end-to-end by Atlas —
        the autonomous agent harness I architected — in place of a
        human dev team.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* ~/outcomes datasheet — same shape as the Process /
            Communications / Training / Finance sidebars so the four
            chapters speak one language. */}
        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] text-accent">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/outcomes</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="text-text-light-muted">
                {blackdoorOutcomes.length} signals
              </span>
            </div>
            <ul className="grid">
              {blackdoorOutcomes.map((outcome, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                  key={outcome}
                >
                  <span className="font-mono text-[10px] text-accent">
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

        <div>
          <AtlasHierarchy layers={atlasLayers} />

          {/* ~/atlas live-status datasheet — quick "at a glance"
              stats about Atlas before the architecture/proof spec
              cards below. */}
          <div className="mt-10 overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] text-accent">
              <span className="relative inline-flex h-2 w-2">
                <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
              </span>
              <span>~/atlas</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="text-text-light-muted">Live · in motion</span>
            </div>
            <ul className="grid divide-y divide-border-light sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {[
                { key: "Version", value: "v3" },
                { key: "Layers", value: "5 · Founders → Shipped" },
                { key: "Products live", value: "3" },
                { key: "Review", value: "Human PR · 100%" },
                { key: "Tooling", value: "Claude · Codex · MCP · GitHub" },
                { key: "Deployed at", value: "Blackdoor · ThePrivateHotels" },
              ].map((row, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 px-5 py-3"
                  key={row.key}
                >
                  <span className="font-mono text-[10px] text-accent">
                    <span className="text-text-light-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {row.key}
                  </span>
                  <span className="text-right font-mono text-[12.5px] leading-6 text-text-light">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Two editorial spec cards — first card explains the
              architecture, second card shows the proof. Replaces the
              flat side-by-side paragraph block. */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="relative rounded-2xl border border-border-light bg-bg-light-2 p-6 sm:p-7">
              <p className="font-mono text-[10px] text-accent">
                <span className="text-text-light-muted/60">// </span>
                01 · Architecture
              </p>
              <h3
                className="mt-3 font-semibold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                What Atlas is.
              </h3>
              <p className="mt-3 text-base leading-7 text-text-light-muted">
                At Blackdoor I lead AI R&amp;D and implementation. I
                built Atlas as a multi-level autonomous harness — a CEO
                agent routes work to C-suite agents (CFO, CMO) who
                delegate to manager and field agents. I designed it to
                build, operate, and improve software products without
                needing me at every step.
              </p>
            </article>

            <article className="relative rounded-2xl border border-accent/40 bg-[rgba(41,110,214,0.04)] p-6 shadow-[0_18px_36px_-22px_rgba(41,110,214,0.25)] sm:p-7">
              <p className="font-mono text-[10px] text-accent">
                <span className="text-text-light-muted/60">// </span>
                02 · Proof
              </p>
              <h3
                className="mt-3 font-semibold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                What Atlas has done.
              </h3>
              <p className="mt-3 text-base leading-7 text-text-light-muted">
                Atlas has already shipped a game app, a budget web app,
                and an agent-augmented project management system. The
                same tech is deployed in the hotel I run. Everything
                ships through GitHub PRs I review.{" "}
                <span className="font-semibold text-text-light">
                  Every decision is governed.
                </span>
              </p>
            </article>
          </div>
        </div>
      </div>

      {/* Closing band — sends readers deeper into Atlas. Cross-links
          to /ai (live demos), /uses (the AI stack reasoning), and
          /now (what Atlas is shipping this week). */}
      <div className="mt-16 rounded-2xl border border-border-light bg-bg-light-2 p-6 sm:p-8">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[10px] text-accent">
              Dig deeper
            </p>
            <h3
              className="mt-3 font-semibold tracking-tight text-text-light"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              See Atlas in motion.
            </h3>
            <p className="mt-3 max-w-xl text-base leading-7 text-text-light-muted">
              Three doors into the engine I built — live demos of the
              harness, the AI stack reasoning, and what Atlas is
              shipping for me this week.
            </p>
          </div>
          <div className="col-span-12 self-center lg:col-span-5">
            <ul className="grid gap-2 font-mono text-sm text-text-light-muted">
              <li className="flex items-baseline gap-3">
                <span aria-hidden="true" className="text-accent">→</span>
                <a
                  className="link-underline inline-block transition-colors hover:text-accent"
                  href="/lab#demos"
                >
                  /ai · the harness demo + case studies
                </a>
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden="true" className="text-accent">→</span>
                <a
                  className="link-underline inline-block transition-colors hover:text-accent"
                  href="/lab#uses"
                >
                  /uses · the AI stack with reasoning
                </a>
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden="true" className="text-accent">→</span>
                <a
                  className="link-underline inline-block transition-colors hover:text-accent"
                  href="/lab#now"
                >
                  /now · what Atlas is shipping this week
                </a>
              </li>
            </ul>
          </div>
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
      meta="// digitized 100+ pages"
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
      meta="// 48 hrs → under 3 min"
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
      meta="// 6 staff · 2 teams"
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
    <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
        {/* Editorial heading strip — matches the SectionShell chapters */}
        <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
          <span className="font-mono text-[11px] text-accent">
            04 · Finance &amp; administration
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
          Precision behind the scenes.
        </h2>
        <p className="mt-8 text-lg leading-8 text-text-light-muted">
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

      {/* ~/ledger datasheet — replaces the loose dl block. Same DNA as
          the ~/outcomes panel used by the other /business chapters. */}
      <aside className="self-start lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] text-accent">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>~/ledger</span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span className="text-text-light-muted">3 signals</span>
          </div>
          <dl className="grid">
            {[
              { label: "Tool", value: "QuickBooks" },
              { label: "Duration", value: "6 months" },
              { label: "Record", value: "Error-free" },
            ].map((item, index) => (
              <div
                className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                key={item.label}
              >
                <dt className="font-mono text-[10px] text-accent">
                  <span className="text-text-light-muted/60">// </span>
                  {String(index + 1).padStart(2, "0")} {item.label}
                </dt>
                <dd className="text-right font-mono text-[12.5px] font-semibold text-text-light">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
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
  meta,
  outcomes,
}: {
  chapter: string;
  children: ReactNode;
  eyebrow: string;
  heading: string;
  meta?: string;
  outcomes: string[];
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
        <GlitchTitle
          chapter={chapter}
          eyebrow={eyebrow}
          meta={meta}
          title={heading}
        />
        <div className="mt-10">{children}</div>
      </div>

      {/* ~/outcomes datasheet — same DNA as the SiteFooter ~/now, the
          /resume ~/contact + ~/languages, the 404 ~/diagnostic, the
          /contact ~/engagements. Anchors each chapter's "what this
          looks like" as a real spec sheet. */}
      <aside className="self-start lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] text-accent">
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
                <span className="font-mono text-[10px] text-accent">
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
