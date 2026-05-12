import {
  AtlasGallery,
  AtlasHierarchy,
  Button,
  ChapterRail,
  LiveStatusBadge,
  ParallaxGhost,
} from "@/components";

type Capability = {
  detail: string;
  label: string;
  link: { href: string; label: string };
  role: string;
};

const CAPABILITIES: Capability[] = [
  {
    detail:
      "Reads briefs, pulls source docs, drafts specs before any code lands. Spec research is a separate PR; implementation is its own.",
    label: "Research",
    link: { href: "/uses", label: "the stack" },
    role: "First pass",
  },
  {
    detail:
      "Field agents pick tickets, write tests + code locally, run them, and only file a PR when the local suite is green.",
    label: "Build",
    link: { href: "/now#shipped", label: "recent ships" },
    role: "Implementation",
  },
  {
    detail:
      "PRs include the spec, the diff, and an auto-generated commit history. CI runs Vercel previews. Humans hit merge.",
    label: "Ship",
    link: { href: "/now#shipped", label: "today's commits" },
    role: "PR-driven",
  },
  {
    detail:
      "Every decision is governed. The audit log records which agent made what choice, on what input, with what model.",
    label: "Govern",
    link: { href: "/business#process", label: "audit example" },
    role: "Audit trail",
  },
  {
    detail:
      "Atlas reads its own production logs, surfaces incidents to manager agents, and proposes follow-up tickets autonomously.",
    label: "Operate",
    link: { href: "/business#communications", label: "ops in prod" },
    role: "Self-monitoring",
  },
  {
    detail:
      "Same harness powers Blackdoor's three products AND the hotel ops chatbot at ThePrivateHotels. One codepath, two deployments.",
    label: "Reuse",
    link: { href: "/business#blackdoor", label: "Blackdoor → Hotels" },
    role: "Cross-deploy",
  },
];

const ATLAS_LAYERS = [
  {
    badge: "01",
    description:
      "Two-person scope. Pierre leads AI R&D and harness implementation; Ryder runs business + strategy. No employees, no junior staff. The harness is the team.",
    items: ["Pierre + Ryder · co-founders"],
    title: "Founders",
  },
  {
    badge: "02",
    description:
      "Atlas itself — the multi-level autonomous harness. Wires any AI model to any external tool through MCP or OAuth. Owns routing, retries, governance, and audit log.",
    items: ["Atlas v3 · the engine"],
    title: "Engine",
  },
  {
    badge: "03",
    description:
      "Strategic-tier agents read the brief and decide direction. CEO routes work. CFO scopes budget + capacity. CMO shapes voice and channel. All decisions land in the audit log.",
    items: ["CEO agent", "CFO agent", "CMO agent"],
    title: "C-suite agents",
  },
  {
    badge: "04",
    description:
      "Manager agents break work into tickets and assign them. Field agents pick tickets up, write code, run tests locally, and file PRs against the project board. Human review at the merge boundary.",
    items: ["Manager agents", "Field agents"],
    title: "Execution",
  },
  {
    badge: "05",
    description:
      "Real products operating in production. Game app, budget web app, agent-augmented project management system. Same underlying tech deployed at ThePrivateHotels.",
    items: ["Game · Budget · PM", "Hotel ops automation"],
    title: "Shipped products",
  },
];

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      {/* HERO — editorial chapter slate for /atlas */}
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
            ATLAS
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
                /atlas · the harness
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Multi-agent · shipping under PR review
            </span>
          </div>

          {/* LEFT — massive editorial headline */}
          <div className="col-span-12 self-center lg:col-span-8">
            <h1
              className="font-semibold text-text-light"
              style={{
                fontSize: "clamp(3rem, 12vw, 10rem)",
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
              }}
            >
              <span className="block">A harness</span>
              <span className="gradient-shift block">
                that ships<span className="text-accent">.</span>
              </span>
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                Five layers · CEO → field
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Atlas is the autonomous multi-level agent harness I
              co-architect at Blackdoor. Five layers, three live
              products, every change shipped through a human-reviewed
              GitHub PR.
            </p>
          </div>

          {/* RIGHT — ~/snapshot datasheet */}
          <div className="col-span-12 self-center lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                  <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
                </span>
                <span>~/atlas</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
                <span className="text-text-light-muted">Live</span>
              </div>
              <ul className="grid">
                {[
                  { key: "Version", value: "v3" },
                  { key: "Layers", value: "5" },
                  { key: "Products", value: "3 live" },
                  { key: "Tooling", value: "Claude · Codex · MCP" },
                  { key: "Review", value: "Human PR · 100%" },
                ].map((row, index) => (
                  <li
                    className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                    key={row.key}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
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

            {/* ~/build — live build signal tied to the current
                deploy. Mirrors the home hero "Shipped X ago" pulse. */}
            <AtlasBuildCard />
          </div>
        </div>
      </section>

      {/* 01 · HIERARCHY */}
      <AtlasSection
        chapter="01"
        eyebrow="Hierarchy"
        id="hierarchy"
        title="Five layers, top to bottom."
      >
        <AtlasHierarchy layers={ATLAS_LAYERS} />
      </AtlasSection>

      {/* 02 · CAPABILITIES */}
      <AtlasSection
        chapter="02"
        eyebrow="Capabilities"
        id="capabilities"
        title="What it does."
      >
        <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>~/capabilities</span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span className="text-text-light-muted">
              {CAPABILITIES.length} signals
            </span>
          </div>
          <ul className="grid divide-y divide-border-light md:grid-cols-2 md:divide-x md:divide-y-0">
            {CAPABILITIES.map((entry, index) => (
              <li
                className="group relative px-6 py-6 transition-colors duration-200 hover:bg-[rgba(41,110,214,0.04)] sm:px-7 sm:py-7"
                key={entry.label}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-6 h-[calc(100%-3rem)] w-0.5 bg-accent/50"
                />
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  <span className="text-text-light-muted/60">//</span>
                  <span>
                    {String(index + 1).padStart(2, "0")} · {entry.role}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-[rgba(41,110,214,0.18)]"
                  />
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.04,
                  }}
                >
                  {entry.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-light-muted sm:text-base sm:leading-7">
                  {entry.detail}
                </p>
                <a
                  className="group/cap mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors duration-200 hover:text-accent-deep"
                  href={entry.link.href}
                >
                  <span aria-hidden="true" className="text-accent/70">↳</span>
                  <span className="link-underline">{entry.link.label}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/cap:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </AtlasSection>

      {/* 03 · PRODUCTS */}
      <AtlasSection
        chapter="03"
        eyebrow="Products"
        id="products"
        title="What Atlas has shipped."
      >
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <LiveStatusBadge label="3 products · in motion" />
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-light-muted">
            Built end-to-end · human PR review on every change
          </p>
        </div>
        <AtlasGallery />
      </AtlasSection>

      {/* 04 · WORKFLOW */}
      <AtlasSection
        chapter="04"
        eyebrow="Workflow"
        id="workflow"
        title="How it ships."
      >
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {[
            {
              body: "CEO agent reads the brief. Within minutes it routes to the right C-suite agent (CFO scope, CMO voice, or both).",
              timing: "~10 min",
              verb: "Brief",
            },
            {
              body: "A spec PR lands first — research, design choices, and acceptance criteria. Humans review the spec before any code is written.",
              timing: "~1 day",
              verb: "Spec",
            },
            {
              body: "Manager agents break the approved spec into tickets. Field agents claim tickets, write code, run tests locally.",
              timing: "per ticket",
              verb: "Build",
            },
            {
              body: "Implementation PR lands with the diff, the test results, and a Vercel preview URL. Human reviews + merges.",
              timing: "per PR",
              verb: "Ship",
            },
            {
              body: "Atlas monitors production logs. Incidents bubble up to manager agents and become tickets in the same loop.",
              timing: "always on",
              verb: "Operate",
            },
          ].map((step, index) => (
            <li
              className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-10 sm:py-12"
              key={step.verb}
            >
              <div className="col-span-12 lg:col-span-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                    {String(index + 1).padStart(2, "0")} · Step
                  </p>
                  <span
                    aria-hidden="true"
                    className="h-px w-6 bg-border-light"
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                    <span aria-hidden="true">⌛</span>
                    {step.timing}
                  </span>
                </div>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 6rem)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                  }}
                >
                  {step.verb}
                  <span className="text-accent">.</span>
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <p className="text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                  {step.body}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>

        {/* PROCESS LOOP DIAGRAM — visualizes the cyclical nature of the workflow */}
        <div className="mt-12 rounded-2xl border border-border-light bg-bg-light-2 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
              ~/loop
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-border-light" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-light-muted">
              the cycle, not a line
            </span>
          </div>

          {/* TERMINAL-STYLE DIAGRAM */}
          <div className="mt-6 overflow-x-auto">
            <pre className="select-none whitespace-pre font-mono text-[11px] leading-6 text-text-light-muted sm:text-xs sm:leading-7">
              <span className="text-accent">{"  ┌──→"}</span>
              {" brief "}
              <span className="text-accent-light/70">{"──→"}</span>
              {" spec "}
              <span className="text-accent-light/70">{"──→"}</span>
              {" build "}
              <span className="text-accent-light/70">{"──→"}</span>
              {" ship "}
              <span className="text-accent-light/70">{"──→"}</span>
              {" operate "}
              <span className="text-accent">{"──┐"}</span>
              {"\n"}
              <span className="text-accent">
                {"  │                                                                 │"}
              </span>
              {"\n"}
              <span className="text-accent">
                {"  └──────────────── incidents · learnings ←──────────────────────────┘"}
              </span>
            </pre>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-x-6 gap-y-4">
            <p className="col-span-12 text-sm leading-6 text-text-light-muted lg:col-span-7">
              Atlas isn&apos;t a one-shot. Production signal — incidents,
              latency, missing features — becomes the next brief. The harness
              keeps looping, with humans gating every PR.
            </p>
            <div className="col-span-12 flex flex-wrap items-center gap-2 lg:col-span-5 lg:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                <span aria-hidden="true">↻</span>
                no waterfall
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                <span aria-hidden="true">●</span>
                always shipping
              </span>
            </div>
          </div>
        </div>
      </AtlasSection>

      {/* CLOSING — sends readers deeper. */}
      <section className="relative mt-20 pb-24" id="closing">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border-light bg-bg-light-2 p-6 sm:p-8">
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 lg:gap-x-8">
              <div className="col-span-12 lg:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
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
                  Talk to me about Atlas.
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-text-light-muted">
                  If you&apos;re shipping AI under PR review and you want
                  the harness pattern in your stack — or you just want to
                  ask questions — let&apos;s talk.
                </p>
              </div>
              <div className="col-span-12 self-center lg:col-span-5">
                <div className="flex flex-wrap gap-3">
                  <Button arrow href="/contact">
                    Get in Touch
                  </Button>
                  <Button href="/ai" variant="ghost">
                    See live demos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChapterRail
        sections={[
          { id: "hierarchy", index: "01", label: "Hierarchy" },
          { id: "capabilities", index: "02", label: "Capabilities" },
          { id: "products", index: "03", label: "Products" },
          { id: "workflow", index: "04", label: "Workflow" },
          { id: "closing", index: "05", label: "Talk to me" },
        ]}
      />
    </main>
  );
}

/**
 * Live build signal — sha + relative time + commit subject from
 * the env vars captured in next.config.ts. Server-rendered, refreshes
 * on every deploy.
 */
function AtlasBuildCard() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const subject = process.env.NEXT_PUBLIC_BUILD_COMMIT_SUBJECT;
  if (!buildTime || !buildSha) return null;
  const seconds = Math.max(
    0,
    Math.round((Date.now() - new Date(buildTime).getTime()) / 1000),
  );
  const relative =
    seconds < 60
      ? "just now"
      : seconds < 3600
        ? `${Math.round(seconds / 60)} min ago`
        : seconds < 86_400
          ? `${Math.round(seconds / 3600)} hr ago`
          : `${Math.round(seconds / 86_400)} d ago`;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
        </span>
        <span>~/build</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">Live</span>
      </div>
      <ul className="grid">
        <li className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="text-text-light-muted/60">// </span>
            01 Shipped
          </span>
          <span className="text-right font-mono text-[12.5px] leading-6 text-text-light">
            {relative}
          </span>
        </li>
        <li className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="text-text-light-muted/60">// </span>
            02 SHA
          </span>
          <span className="text-right font-mono text-[12.5px] leading-6 text-text-light">
            {buildSha.slice(0, 7)}
          </span>
        </li>
        {subject ? (
          <li className="border-t border-border-light px-5 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="text-text-light-muted/60">// </span>
              03 Subject
            </span>
            <p className="mt-1 truncate font-mono text-[12.5px] leading-6 text-text-light" title={subject}>
              {subject}
            </p>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function AtlasSection({
  chapter,
  children,
  eyebrow,
  id,
  title,
}: {
  chapter: string;
  children: React.ReactNode;
  eyebrow: string;
  id?: string;
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
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
