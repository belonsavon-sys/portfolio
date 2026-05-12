import { Button, ChapterRail, ParallaxGhost } from "@/components";

type StackEntry = {
  detail: string;
  name: string;
  role: string;
  tags: string[];
};

const HARDWARE_STACK: StackEntry[] = [
  {
    detail:
      "Main machine. Runs the whole stack — VS Code with multiple harness sessions, browser, Figma, terminal — without breaking a sweat.",
    name: "MacBook Pro",
    role: "Main rig",
    tags: ["Apple Silicon", "macOS"],
  },
  {
    detail:
      "Connects everything. Hotel ops control, Atlas roadmap, message routing — all surfaced on one device for the times I'm away from the rig.",
    name: "iPhone",
    role: "Mobile control",
    tags: ["iOS", "Notifications", "On-call"],
  },
  {
    detail:
      "External display when I'm at the desk. Wide enough to keep editor + browser + terminal stacked vertically without window juggling.",
    name: "External display",
    role: "Desk · pairing",
    tags: ["27in", "Single window"],
  },
  {
    detail:
      "Mechanical keyboard for the typing miles. Quiet enough for shared spaces, satisfying enough to sit at for 10-hour shipping sessions.",
    name: "Keyboard",
    role: "Input · daily driver",
    tags: ["Mechanical", "Tactile"],
  },
];

const INFRA_STACK: StackEntry[] = [
  {
    detail:
      "Default deploy target. Fluid Compute + Next.js App Router + preview URLs on every PR. Build time live-shipped badge on the home hero comes straight from Vercel build vars.",
    name: "Vercel",
    role: "Deploy · Preview · Edge",
    tags: ["Next.js", "Fluid Compute", "Preview URLs"],
  },
  {
    detail:
      "Every change ships through a PR. Branch naming convention is claude/iter-NNN-<slug>. Auto-merge after Vercel checks pass.",
    name: "GitHub",
    role: "VCS · PR workflow",
    tags: ["Branch protection", "Auto-merge", "Reviews"],
  },
  {
    detail:
      "Postgres + auth + storage for personal projects (budget app, workout tracker). Row-level security configured by default.",
    name: "Supabase",
    role: "DB · Auth · Storage",
    tags: ["Postgres", "RLS", "Edge functions"],
  },
  {
    detail:
      "Glue layer for hospitality automation. Guest message in → triggers Zapier → routes through Guesty / Twilio. Replaces multi-hour manual coordination loops.",
    name: "Zapier",
    role: "Automation glue",
    tags: ["Guesty", "Twilio", "Triggers"],
  },
  {
    detail:
      "Self-hosted automation runner when Zapier hits its ceiling on data volume or custom logic.",
    name: "n8n",
    role: "Self-hosted automation",
    tags: ["Self-hosted", "Webhooks"],
  },
  {
    detail:
      "API ↔ guest flow for hotel ops. Booking sync, message routing, calendar pushes.",
    name: "Guesty API",
    role: "Hotel ops backbone",
    tags: ["Bookings", "Messaging", "Pricing"],
  },
];

const EDITOR_STACK: StackEntry[] = [
  {
    detail:
      "Primary editor. Configured for TypeScript + Tailwind + Next.js. Same window I keep open for code review, terminal, and AI sidecars.",
    name: "VS Code",
    role: "Primary editor",
    tags: ["TypeScript", "Tailwind", "Next.js"],
  },
  {
    detail:
      "Where the Atlas harness actually lives. Multi-agent code sessions that spin up Claude + Codex side-by-side and route work through them automatically.",
    name: "Antigravity",
    role: "Harness IDE",
    tags: ["Atlas", "Multi-agent", "PR-driven"],
  },
  {
    detail:
      "Used for fast single-file edits where the agent picks up context aggressively. Great when I want one tool to read the whole repo before suggesting.",
    name: "Cursor",
    role: "Single-file edits",
    tags: ["Tab-complete", "Repo context"],
  },
  {
    detail:
      "Design surface for layout prototypes before they hit React. Variables + component states map cleanly to Tailwind tokens.",
    name: "Figma",
    role: "Design + tokens",
    tags: ["Variables", "Components"],
  },
];

const AI_STACK: StackEntry[] = [
  {
    detail:
      "Spec research before implementation. Multi-day projects via /loop. Code review on every PR. Default first-choice for anything that touches reasoning.",
    name: "Claude",
    role: "Reasoning · Code · Specs",
    tags: ["Claude Code", "Anthropic API", "MCP"],
  },
  {
    detail:
      "Boilerplate generation, multi-file edits inside VS Code. Strong for repetitive scaffolding the harness then verifies.",
    name: "Codex",
    role: "Code generation",
    tags: ["VS Code", "Cursor", "Pair-programming"],
  },
  {
    detail:
      "Long-form research, source citations, real-time web for fast-moving topics. Often the first call before opening a doc.",
    name: "Perplexity",
    role: "Research · Citations",
    tags: ["Live web", "Sourced"],
  },
  {
    detail:
      "Quick utility model — name suggestions, copy variants, one-shot prompts where I don't need a reasoning chain.",
    name: "ChatGPT",
    role: "Utility · One-shot",
    tags: ["OpenAI API"],
  },
  {
    detail:
      "The connective tissue between Claude and every external tool. Custom MCP servers expose Notion, Gmail, Spotify, Supabase, Vercel.",
    name: "MCP",
    role: "Agent ↔ tool bridge",
    tags: ["Custom servers", "Anthropic spec", "Public + private"],
  },
];

const PHILOSOPHY = [
  {
    detail: "Mastery before execute — research deeply, then ship cleanly.",
    label: "Loop",
  },
  {
    detail: "Production is the only environment that matters.",
    label: "Bar",
  },
  {
    detail: "Solo or paired with AI. Every change ships under PR review.",
    label: "Pair",
  },
  {
    detail: "Pick tools that get out of the way once the work starts.",
    label: "Filter",
  },
];

const _usesDescription =
  "What Pierre Belon Savon actually uses to ship AI systems — tools, editors, infra, hardware, with usage notes.";

export const metadata = {
  alternates: { canonical: "/uses" },
  description: _usesDescription,
  openGraph: {
    description: _usesDescription,
    title: "Uses · Pierre Belon Savon",
    type: "website",
    url: "/uses",
  },
  title: "Uses",
  twitter: {
    card: "summary_large_image",
    description: _usesDescription,
    title: "Uses · Pierre Belon Savon",
  },
};

export default function UsesPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      {/* HERO — editorial chapter slate for /uses */}
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
            USES
          </ParallaxGhost>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
          {/* TOP STRIP */}
          <div className="col-span-12 flex flex-wrap items-center gap-3 self-start">
            <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
                /uses · stack with reasons
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Inspired by uses.tech
            </span>
          </div>

          {/* LEFT — stacked massive headline */}
          <div className="col-span-12 self-center lg:col-span-8">
            <h1
              className="font-semibold text-text-light"
              style={{
                fontSize: "clamp(3rem, 12vw, 10rem)",
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
              }}
            >
              <span className="block">What I</span>
              <span className="gradient-shift block">
                actually use<span className="text-accent">.</span>
              </span>
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                Tools · editors · infra · hardware
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Not the &quot;stack page&quot; chosen for sponsorship —
              the actual stack the systems run on. Every entry includes
              why, not just what.
            </p>
          </div>

          {/* RIGHT — philosophy datasheet */}
          <div className="col-span-12 self-center lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
                <span>~/philosophy</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
                <span className="text-text-light-muted">{PHILOSOPHY.length} signals</span>
              </div>
              <ul className="grid">
                {PHILOSOPHY.map((row, index) => (
                  <li
                    className="border-t border-border-light px-5 py-3 first:border-t-0"
                    key={row.label}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                      <span className="text-text-light-muted/60">// </span>
                      {String(index + 1).padStart(2, "0")} {row.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-text-light">
                      {row.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 01 · AI STACK */}
      <UsesStackSection
        chapter="01"
        eyebrow="AI stack"
        entries={AI_STACK}
        id="ai-stack"
        slug="~/ai-stack"
        title="What the harness runs on."
      />

      {/* 02 · EDITOR / IDE */}
      <UsesStackSection
        chapter="02"
        eyebrow="Editor / IDE"
        entries={EDITOR_STACK}
        id="editor"
        slug="~/editor"
        title="Where the code gets written."
      />

      {/* 03 · INFRA */}
      <UsesStackSection
        chapter="03"
        eyebrow="Infrastructure"
        entries={INFRA_STACK}
        id="infra"
        slug="~/infra"
        title="Where it ships and runs."
      />

      {/* 04 · HARDWARE */}
      <UsesStackSection
        chapter="04"
        eyebrow="Hardware"
        entries={HARDWARE_STACK}
        id="hardware"
        slug="~/hardware"
        title="What it physically runs on."
      />
      <section className="relative pb-24 pt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                Closing · before you go
              </p>
              <h2
                className="mt-3 font-semibold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                }}
              >
                Want to see the stack in motion?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                /ai has the live demos and case studies. /now has what
                the stack is shipping this week.
              </p>
            </div>
            <div className="col-span-12 self-end lg:col-span-4">
              <div className="flex flex-wrap gap-3">
                <Button arrow href="/ai">
                  See the demos
                </Button>
                <Button href="/now" variant="ghost">
                  What I&apos;m doing now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER RAIL — floating right-margin nav for the four
          /uses stack datasheets. */}
      <ChapterRail
        sections={[
          { id: "ai-stack", index: "01", label: "AI stack" },
          { id: "editor", index: "02", label: "Editor / IDE" },
          { id: "infra", index: "03", label: "Infrastructure" },
          { id: "hardware", index: "04", label: "Hardware" },
        ]}
      />
    </main>
  );
}

/**
 * Editorial stack datasheet. Each block (~/ai-stack, ~/editor,
 * ~/infra, ~/hardware) reuses this shape: terminal header + 2-col
 * grid of tool entries, each entry having a chapter mark + name +
 * role + usage note + relationship tags. Reads as one continuous
 * uses.tech-style dossier across all 4 blocks.
 */
function UsesStackSection({
  chapter,
  entries,
  eyebrow,
  id,
  slug,
  title,
}: {
  chapter: string;
  entries: StackEntry[];
  eyebrow: string;
  id?: string;
  slug: string;
  title: string;
}) {
  return (
    <section className="relative mt-16 scroll-mt-28 sm:mt-20" id={id}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            {chapter} · {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-accent/40" />
          <h2
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>{slug}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span className="text-text-light-muted">
              {entries.length} entries
            </span>
          </div>
          <ul className="grid divide-y divide-border-light md:grid-cols-2 md:divide-x md:divide-y-0">
            {entries.map((entry, index) => (
              <li
                className="group relative px-6 py-7 transition-colors duration-200 hover:bg-[rgba(41,110,214,0.04)] sm:px-7 sm:py-8"
                key={entry.name}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-7 h-[calc(100%-3.5rem)] w-0.5 bg-accent/50"
                />
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  <span className="text-text-light-muted/60">//</span>
                  <span>
                    {String(index + 1).padStart(2, "0")} · {entry.role}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-[rgba(41,110,214,0.18)]" />
                </p>

                <h3
                  className="mt-4 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.04,
                  }}
                >
                  {entry.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-light-muted sm:text-base sm:leading-7">
                  {entry.detail}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <li
                      className="inline-flex items-center rounded-md border border-border-light bg-bg-light px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted"
                      key={tag}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function UsesSection({
  chapter,
  children,
  eyebrow,
  title,
}: {
  chapter: string;
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="relative mt-16 sm:mt-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            {chapter} · {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-accent/40" />
          <h2
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
