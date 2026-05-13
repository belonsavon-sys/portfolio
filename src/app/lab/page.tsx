"use client";

import { CommitTicker, GlitchTitle, LocalAiDemo, ParallaxGhost, SiteFooter, TextScramble } from "@/components";

// CONSOLIDATED FROM /now, /ai, /uses, /colophon
// Consciously trimmed to one screen per section. The full source pages
// lived independently for ~6 months; merging into /lab is a deliberate
// editing pass, not a re-skin.

type BuildingStatus = "active" | "maintaining" | "warm";

const BUILDING: Array<{
  detail: string;
  health: BuildingStatus;
  label: string;
  project: string;
  cadence: string;
}> = [
  {
    detail:
      "I lead AI R&D on Atlas — the multi-level autonomous agent harness I co-architected. Every layer ships under my PR review.",
    health: "active",
    label: "Atlas v3",
    project: "Blackdoor",
    cadence: "daily",
  },
  {
    detail:
      "I supervise hotel operations. I built and I run the guest comms, the QA system, and the automation pipelines that keep it all moving.",
    health: "maintaining",
    label: "Live operations",
    project: "ThePrivateHotels",
    cadence: "weekly",
  },
  {
    detail:
      "I rebuild this portfolio every iteration through a PR — sometimes five in a row when I'm onto something.",
    health: "active",
    label: "pierrebelonsavon.com",
    project: "Personal",
    cadence: "hourly",
  },
];

const BUILDING_STATUS_META: Record<
  BuildingStatus,
  { label: string; text: string }
> = {
  active: { label: "active", text: "text-result-green" },
  maintaining: { label: "maintaining", text: "text-accent" },
  warm: { label: "warm", text: "text-text-light-muted" },
};

// Reading + Learning collapsed into one "queue" list. Each entry is a
// thing actively occupying mind-space this week.
const QUEUE: Array<{ detail: string; label: string; kind: string }> = [
  {
    detail: "I'm pushing the harness toward fewer human checkpoints without losing reviewability. Drafting a 3-tier authority spec to figure out what each layer should be allowed to ship without me.",
    label: "Drafting a 3-tier authority spec",
    kind: "open loop",
  },
  {
    detail: "I'm reading every Anthropic / OpenAI / DeepMind agent paper as they drop, and watching the MCP spec land in real projects so I can pick the patterns that actually hold up.",
    label: "Agent design papers + MCP changelog",
    kind: "reading",
  },
  {
    detail: "I'm curating real guest conversations into RAG-quality datasets so the hotel chatbot replies in our actual voice instead of a corporate template. Building the curation pipeline now.",
    label: "Voice-trained chatbot data prep",
    kind: "open loop",
  },
];

type StackEntry = {
  detail: string;
  name: string;
  role: string;
  tags: string[];
};

const AI_STACK: StackEntry[] = [
  {
    detail:
      "My default first call for anything that touches reasoning. I run multi-day projects through Claude Code via /loop and let it review every PR I open.",
    name: "Claude",
    role: "reasoning · code · specs",
    tags: ["Claude Code", "Anthropic API", "MCP"],
  },
  {
    detail:
      "Where I lean for boilerplate generation and multi-file edits inside VS Code. Strong at the repetitive scaffolding the harness then verifies.",
    name: "Codex",
    role: "code generation",
    tags: ["VS Code", "Cursor"],
  },
  {
    detail:
      "Where I go for long-form research with real citations. Often the first call I make before opening a doc.",
    name: "Perplexity",
    role: "research · citations",
    tags: ["Live web", "Sourced"],
  },
  {
    detail:
      "The connective tissue I wire between Claude and every external tool. My own MCP servers expose Notion, Gmail, Supabase, and Vercel to the harness.",
    name: "MCP",
    role: "agent ↔ tool bridge",
    tags: ["Custom servers", "Anthropic spec"],
  },
];

const EDITOR_STACK: StackEntry[] = [
  {
    detail:
      "My primary editor. I have it configured for TypeScript + Tailwind + Next.js, and I keep one window open for code, review, terminal, and the AI sidecars.",
    name: "VS Code",
    role: "primary editor",
    tags: ["TypeScript", "Tailwind"],
  },
  {
    detail:
      "Where I actually run Atlas. It spins up Claude + Codex side-by-side and I route work through them from one cockpit.",
    name: "Antigravity",
    role: "harness IDE",
    tags: ["Atlas", "Multi-agent"],
  },
  {
    detail:
      "Where I prototype layouts before they hit React. The variables map cleanly to my Tailwind tokens so the handoff is one paste.",
    name: "Figma",
    role: "design + tokens",
    tags: ["Variables", "Components"],
  },
];

const INFRA_STACK: StackEntry[] = [
  {
    detail:
      "My default deploy target. Fluid Compute + Next.js App Router + a preview URL on every PR I open.",
    name: "Vercel",
    role: "deploy · preview · edge",
    tags: ["Next.js", "Fluid Compute"],
  },
  {
    detail:
      "Where I keep everything. Every change I ship goes through a PR; auto-merge fires after the Vercel checks pass.",
    name: "GitHub",
    role: "VCS · PR workflow",
    tags: ["Auto-merge", "Branch protection"],
  },
  {
    detail:
      "What I reach for when a personal project needs Postgres + auth + storage. I set up row-level security by default.",
    name: "Supabase",
    role: "db · auth · storage",
    tags: ["Postgres", "RLS"],
  },
  {
    detail:
      "How I glue hotel comms together. A guest message comes in, my pipeline routes it through Guesty / Twilio without me touching it.",
    name: "Zapier + n8n",
    role: "automation glue",
    tags: ["Guesty", "Twilio"],
  },
];

const HARDWARE_STACK: StackEntry[] = [
  {
    detail:
      "My main machine. Runs the whole stack — VS Code with multiple harness sessions, browser, Figma, terminal — without ever breaking a sweat.",
    name: "MacBook Pro",
    role: "main rig",
    tags: ["Apple Silicon"],
  },
  {
    detail:
      "Where I work when I'm at the desk. Wide enough that I keep editor + browser + terminal stacked vertically and never window-juggle.",
    name: "External display + mech keyboard",
    role: "desk setup",
    tags: ["27in", "Tactile"],
  },
  {
    detail:
      "How I stay on-call. Hotel ops, Atlas roadmap, message routing — all surfaced here when I'm away from the rig.",
    name: "iPhone",
    role: "mobile control",
    tags: ["On-call", "Notifications"],
  },
];

const STACKS: Array<{ id: string; label: string; entries: StackEntry[] }> = [
  { id: "ai", label: "AI", entries: AI_STACK },
  { id: "editor", label: "Editor", entries: EDITOR_STACK },
  { id: "infra", label: "Infra", entries: INFRA_STACK },
  { id: "hardware", label: "Hardware", entries: HARDWARE_STACK },
];

const PROCESS: Array<{ label: string; detail: string }> = [
  {
    label: "research → build → ship",
    detail:
      "Every feature I touch starts as a written spec. Then a branch. Then a PR with a preview URL. I never let something land without a Vercel green check.",
  },
  {
    label: "agent-paired by default",
    detail:
      "Claude Code does my heavy lifting. Codex covers the boilerplate. I'm the editor, the reviewer, and the one deciding what ships.",
  },
  {
    label: "production is the only environment",
    detail:
      "If it doesn't run in prod under real load, I don't count it. The portfolio, the hotel ops, Atlas — all of it ships continuously, all of it for real users.",
  },
];

const CREDITS: Array<{ kind: string; name: string }> = [
  { kind: "Framework", name: "Next.js 16 · App Router · Turbopack" },
  { kind: "Styling", name: "Tailwind CSS 4 + custom tokens" },
  { kind: "Motion", name: "framer-motion v12" },
  { kind: "Display face", name: "Bricolage Grotesque (variable wdth + opsz)" },
  { kind: "Mono", name: "Geist Mono" },
  { kind: "Local ML", name: "@huggingface/transformers + onnxruntime-web" },
  { kind: "Hosting", name: "Vercel · Fluid Compute" },
  { kind: "Analytics", name: "Vercel Analytics + Speed Insights" },
  { kind: "Build pipeline", name: "GitHub PR · Vercel preview · auto-merge" },
];

export default function LabPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LabHero />
      <NowBand />
      <DemosBand />
      <UsesBand />
      <ColophonBand />
      <SiteFooter />
    </main>
  );
}

function LabHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            fontSize: "clamp(6rem, 22vw, 22rem)",
            WebkitTextStroke: "1px rgba(41,110,214,0.10)",
            color: "transparent",
          }}
        >
          LAB
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        {/* TOP STRIP — centered */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-12 font-mono text-[11px] text-accent">
          <span className="text-accent-deep">$</span>
          <span>
            <TextScramble
              durationMs={950}
              stepMs={38}
              text="cd ~/lab · open everything"
            />
          </span>
          <span className="font-mono text-[12px] text-result-green">
            — 4 chapters
          </span>
        </div>

        {/* TITLE — centered, single line, welcome-style glitch */}
        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 7rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <span className="gradient-shift inline-block">
              <TextScramble
                durationMs={1400}
                stepMs={55}
                text="The lab."
              />
            </span>
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
          This is where I keep the receipts. What I&apos;m shipping
          right now, the demos I run in the browser, the tools I
          actually pay for, and how I built this site. One scroll
          instead of four routes.
        </p>
      </div>
    </section>
  );
}

// Single reusable band — header uses the GlitchTitle pattern so the
// title sits on a hairline that periodically tears, flashing a meta
// caption next to it.
function LabSection({
  chapter,
  children,
  eyebrow,
  id,
  meta,
  title,
}: {
  chapter: string;
  children: React.ReactNode;
  eyebrow: string;
  id: string;
  meta?: string;
  title: string;
}) {
  return (
    <section className="relative mt-16 scroll-mt-28 sm:mt-20" id={id}>
      <span aria-hidden="true" className="glitch-bar" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlitchTitle
          chapter={chapter}
          eyebrow={eyebrow}
          meta={meta}
          title={title}
        />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function NowBand() {
  return (
    <LabSection
      chapter="01"
      eyebrow="Now"
      id="now"
      meta="// 3 projects · shipping daily"
      title="What I'm shipping."
    >
      <ol className="grid divide-y divide-border-light border-y border-border-light">
        {BUILDING.map((entry, index) => {
          const meta = BUILDING_STATUS_META[entry.health];
          return (
            <li
              className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-9 sm:py-11"
              key={entry.label}
            >
              <div className="col-span-12 lg:col-span-7">
                <p className="font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, "0")} · {entry.project}
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.02,
                  }}
                >
                  {entry.label}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-text-light-muted">
                  {entry.detail}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
                <p className="font-mono text-[12px] text-accent">status</p>
                <p className={`mt-2 font-mono text-sm font-semibold ${meta.text}`}>
                  — {meta.label}
                </p>
                <p className="mt-5 font-mono text-[12px] text-accent">cadence</p>
                <p className="mt-2 font-mono text-sm font-semibold text-text-light">
                  {entry.cadence}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </li>
          );
        })}
      </ol>

      <div className="mt-12">
        <p className="font-mono text-[11px] text-accent">
          // recent ships — live from git
        </p>
        <div className="mt-4">
          <CommitTicker />
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-[11px] text-accent">
          // currently in the queue
        </p>
        <ul className="mt-4 grid divide-y divide-border-light border-y border-border-light">
          {QUEUE.map((entry, index) => (
            <li
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 sm:py-7"
              key={entry.label}
            >
              <div className="col-span-12 flex items-baseline gap-3 lg:col-span-3">
                <span className="font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] text-text-light-muted">
                  — {entry.kind}
                </span>
              </div>
              <div className="col-span-12 lg:col-span-9">
                <h4 className="font-semibold leading-snug text-text-light">
                  {entry.label}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-text-light-muted">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </LabSection>
  );
}

function DemosBand() {
  return (
    <LabSection
      chapter="02"
      eyebrow="Demos"
      id="demos"
      meta="// 5 demos · runs in your tab"
      title="Local ML, in your browser."
    >
      <p className="max-w-3xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
        Five interactive demos I built. All inference runs on your
        device via onnxruntime-web — nothing is uploaded, nothing leaves
        your tab. These are the same patterns I run in production at
        ThePrivateHotels and inside Atlas.
      </p>
      <LocalAiDemo />
    </LabSection>
  );
}

function UsesBand() {
  return (
    <LabSection
      chapter="03"
      eyebrow="Uses"
      id="uses"
      meta="// 14 items · paid this month"
      title="The tools."
    >
      <p className="max-w-3xl text-base leading-7 text-text-light-muted">
        Everything I list here is something I actually paid for and
        used this month. No aspirational stack.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        {STACKS.map((stack) => (
          <div className="relative" key={stack.id}>
            <div className="flex items-baseline gap-3 border-b border-border-light pb-3">
              <span className="font-mono text-[11px] text-accent">
                {stack.label.toLowerCase()}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="font-mono text-[11px] text-text-light-muted">
                {stack.entries.length} tools
              </span>
            </div>
            <ul className="mt-4 grid divide-y divide-border-light">
              {stack.entries.map((entry) => (
                <li className="py-5" key={entry.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold tracking-tight text-text-light">
                      {entry.name}
                    </h4>
                    <span className="font-mono text-[11px] text-accent">
                      — {entry.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-text-light-muted">
                    {entry.detail}
                  </p>
                  {entry.tags.length > 0 ? (
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-text-light-muted/80">
                      {entry.tags.map((tag, idx) => (
                        <span key={tag}>
                          {tag}
                          {idx < entry.tags.length - 1 ? (
                            <span className="ml-3 text-text-light-muted/40">·</span>
                          ) : null}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LabSection>
  );
}

function ColophonBand() {
  return (
    <LabSection
      chapter="04"
      eyebrow="Colophon"
      id="colophon"
      meta="// hand-built · MIT · solo"
      title="How this is built."
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] text-accent">// process</p>
          <ol className="mt-4 grid divide-y divide-border-light border-y border-border-light">
            {PROCESS.map((step, index) => (
              <li
                className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 sm:py-8"
                key={step.label}
              >
                <span className="col-span-12 flex items-baseline gap-3 lg:col-span-3">
                  <span className="font-mono text-[11px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <div className="col-span-12 lg:col-span-9">
                  <h4
                    className="font-semibold text-text-light"
                    style={{
                      fontSize: "clamp(1.125rem, 2vw, 1.35rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-text-light-muted sm:text-base">
                    {step.detail}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] text-accent">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/credits</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="text-text-light-muted">{CREDITS.length} entries</span>
            </div>
            <ul className="grid">
              {CREDITS.map((row, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                  key={row.kind}
                >
                  <span className="font-mono text-[10px] text-accent">
                    <span className="text-text-light-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {row.kind.toLowerCase()}
                  </span>
                  <span className="text-right font-mono text-[12.5px] leading-6 text-text-light">
                    {row.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 font-mono text-[11px] leading-6 text-text-light-muted">
            // I built this solo, paired with Claude Code. Every commit
            I push goes through a PR with a Vercel preview. Source is on{" "}
            <a
              className="text-accent underline-offset-2 hover:underline"
              href="https://github.com/belonsavon-sys/Portfolio"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </LabSection>
  );
}
