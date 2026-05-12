import { Button, ChapterRail, ParallaxGhost } from "@/components";

type StackEntry = {
  detail: string;
  label: string;
  link: { href: string; label: string };
  role: string;
  since: string;
};

const STACK: StackEntry[] = [
  {
    detail: "App Router · Server Components · Turbopack",
    label: "Next.js 16",
    link: { href: "/uses#runtime", label: "the runtime" },
    role: "Framework",
    since: "2026",
  },
  {
    detail: "Atomic styling · variable axes · CSS containment",
    label: "Tailwind v4",
    link: { href: "/uses#design", label: "the design system" },
    role: "Style",
    since: "2026",
  },
  {
    detail: "Scroll-driven animations · spring physics · layout",
    label: "Framer Motion",
    link: { href: "/", label: "see it on home" },
    role: "Motion",
    since: "2026",
  },
  {
    detail: "Per-route ImageResponse cards · edge runtime",
    label: "next/og",
    link: { href: "/atlas/opengraph-image", label: "an OG card" },
    role: "OG/SEO",
    since: "2026",
  },
  {
    detail: "Edge hosting · preview URLs · analytics",
    label: "Vercel",
    link: { href: "/uses#hosting", label: "the deploy story" },
    role: "Hosting",
    since: "2025",
  },
  {
    detail: "PR-driven · auto-merge · branch-per-iter",
    label: "GitHub",
    link: { href: "/now#shipped", label: "the ship log" },
    role: "Source",
    since: "2024",
  },
];

type Principle = {
  detail: string;
  label: string;
  receipt: { href: string; label: string };
};

const PRINCIPLES: Principle[] = [
  {
    detail:
      "Every chapter / section / page on this site uses the same ~/slug · meta datasheet header, the same indexed rows, the same gradient hairline on hover. Cohesion is built, not decorated.",
    label: "One editorial language",
    receipt: { href: "/atlas#capabilities", label: "atlas capabilities" },
  },
  {
    detail:
      "Live commit subject in the hero. Real git data on /now. ~/career years that auto-tick. The site shouldn't lie about how fresh it is.",
    label: "Honest live signals",
    receipt: { href: "/now#shipped", label: "live ship log" },
  },
  {
    detail:
      "⌘K palette, precision cursor, chapter-slate transitions, scroll-progress ring. Top-tier interactions don't pile on — they pick one signature and ship it well.",
    label: "Signature beats novelty",
    receipt: { href: "/", label: "open ⌘K on home" },
  },
  {
    detail:
      "JSON-LD for Person · WebSite · SoftwareApplication · ProfessionalService · ItemList. Per-route OG cards. PWA manifest. Sitemap. Recruiters' tools see the same structure humans do.",
    label: "Structured-data first",
    receipt: { href: "/sitemap.xml", label: "the sitemap" },
  },
];

const PROCESS = [
  {
    body: "Every change ships through a branch named claude/iter-NNN-<slug> → PR → merge. The history is the spec.",
    verb: "PR-driven",
  },
  {
    body: "Each batch of 5 iters targets one section. Each single iter targets one bold change. Discipline shows in the commit log.",
    verb: "Section-scoped",
  },
  {
    body: "Pair with Claude on the architecture, with Codex on the boilerplate, with myself on the judgment of what ships.",
    verb: "AI-paired",
  },
];

export default function ColophonPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      {/* HERO */}
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
            BUILT
          </ParallaxGhost>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
          <div className="col-span-12 flex flex-wrap items-center gap-3 self-start">
            <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
                /colophon · how this is built
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Open source · PR-driven · AI-paired
            </span>
          </div>

          <div className="col-span-12 self-center lg:col-span-8">
            <h1
              className="font-semibold text-text-light"
              style={{
                fontSize: "clamp(3rem, 12vw, 10rem)",
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
              }}
            >
              <span className="block">Built</span>
              <span className="gradient-shift block">
                in the open<span className="text-accent">.</span>
              </span>
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                Stack · principles · process
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Notes on the stack, the design language, and the iteration
              process behind this site. Every page shipped through a PR —
              the commit log is the spec.
            </p>
          </div>

          <div className="col-span-12 self-center lg:col-span-4">
            <ColophonBuildCard />
          </div>
        </div>
      </section>

      {/* 01 · STACK */}
      <ColophonSection
        chapter="01"
        eyebrow="Stack"
        id="stack"
        title="What it runs on."
      >
        <ul className="grid divide-y divide-border-light border-y border-border-light sm:grid-cols-2 sm:divide-x">
          {STACK.map((item, index) => (
            <li
              className="group/stack relative px-5 py-5 sm:px-7 sm:py-6"
              key={item.label}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-accent/50"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                  <span className="text-text-light-muted/60">// </span>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  {item.role}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                  since {item.since}
                </span>
              </div>
              <h3
                className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-200 group-hover/stack:text-accent-deep"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-light-muted">
                {item.detail}
              </p>
              <a
                className="group/stacklink mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors duration-200 hover:text-accent-deep"
                href={item.link.href}
              >
                <span aria-hidden="true" className="text-accent/70">↳</span>
                <span className="link-underline">{item.link.label}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/stacklink:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </ColophonSection>

      {/* 02 · PRINCIPLES */}
      <ColophonSection
        chapter="02"
        eyebrow="Principles"
        id="principles"
        title="The four cuts."
      >
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {PRINCIPLES.map((entry, index) => (
            <li
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 sm:py-9"
              key={entry.label}
            >
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.32em] text-accent lg:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className="col-span-12 font-semibold tracking-tight text-text-light lg:col-span-4"
                style={{
                  fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                {entry.label}
              </h3>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-base leading-7 text-text-light-muted">
                  {entry.detail}
                </p>
                <a
                  className="group/recpt mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent transition-colors duration-200 hover:text-accent-deep"
                  href={entry.receipt.href}
                >
                  <span aria-hidden="true" className="text-accent/70">↳</span>
                  <span className="link-underline">see it: {entry.receipt.label}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/recpt:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </ColophonSection>

      {/* 03 · PROCESS */}
      <ColophonSection
        chapter="03"
        eyebrow="Process"
        id="process"
        title="How it shipped."
      >
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {PROCESS.map((step, index) => (
            <li
              className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-10 sm:py-12"
              key={step.verb}
            >
              <div className="col-span-12 lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-light"
                  style={{
                    fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                    letterSpacing: "-0.045em",
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

        {/* CADENCE — real stats from the last 10 commits */}
        <CadenceDatasheet />
      </ColophonSection>

      {/* 04 · CREDITS */}
      <ColophonSection
        chapter="04"
        eyebrow="Credits"
        id="credits"
        title="Standing on shoulders."
      >
        <ul className="grid divide-y divide-border-light border-y border-border-light">
          {[
            {
              detail: "The reference for editorial design language — type · grid · pacing.",
              href: "https://www.awwwards.com",
              role: "Design",
              source: "awwwards",
            },
            {
              detail: "Live-data discipline — sites that ship a fresh signal, not a static page.",
              href: "https://nownownow.com",
              role: "Now-page",
              source: "nownownow.com",
            },
            {
              detail: "Developer ergonomics — be specific about the tools that make work possible.",
              href: "https://uses.tech",
              role: "Tools",
              source: "uses.tech",
            },
            {
              detail: "Display typeface — variable axes for the editorial display headings.",
              href: "https://fonts.google.com/specimen/Bricolage+Grotesque",
              role: "Type",
              source: "Bricolage Grotesque",
            },
            {
              detail: "Body & monospace — Vercel's open-source pairing, used everywhere on this site.",
              href: "https://vercel.com/font",
              role: "Type",
              source: "Geist Sans / Mono",
            },
          ].map((entry, index) => (
            <li
              className="group/cred grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 sm:py-8"
              key={entry.source}
            >
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.32em] text-accent lg:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="col-span-12 flex flex-wrap items-center gap-x-3 gap-y-1 lg:col-span-4">
                <h3
                  className="font-semibold tracking-tight text-text-light"
                  style={{
                    fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {entry.source}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  {entry.role}
                </span>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-base leading-7 text-text-light-muted">
                  {entry.detail}
                </p>
                <a
                  className="group/credlink mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors duration-200 hover:text-accent-deep"
                  href={entry.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span aria-hidden="true" className="text-accent/70">↳</span>
                  <span className="link-underline">visit source</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/credlink:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base leading-7 text-text-light-muted">
          Built end-to-end in the open. Every iteration is a commit you can
          read.{" "}
          <a
            className="link-underline text-text-light hover:text-accent"
            href="/resume"
          >
            Curious about Pierre?
          </a>{" "}
          ·{" "}
          <a
            className="link-underline text-text-light hover:text-accent"
            href="/contact"
          >
            the door is open
          </a>
          .
        </p>
      </ColophonSection>

      {/* CLOSING */}
      <section className="relative pb-24 pt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ACTIVE PULSE BAND — this site is not a museum piece */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-accent/30 bg-[rgba(41,110,214,0.06)] px-5 py-3">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
              <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-result-green" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              Actively shipping
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-accent/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-light-muted">
              new pass every few hours · no archive page
            </span>
          </div>

          <div className="rounded-2xl border border-border-light bg-bg-light-2 p-6 sm:p-8">
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 lg:gap-x-8">
              <div className="col-span-12 lg:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                  05 · Where to next
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  Want to see the harness behind all this?
                </h3>
              </div>
              <div className="col-span-12 self-center lg:col-span-5">
                <div className="flex flex-wrap gap-3">
                  <Button arrow href="/atlas">
                    See Atlas
                  </Button>
                  <Button href="/now" variant="ghost">
                    Now shipping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChapterRail
        sections={[
          { id: "stack", index: "01", label: "Stack" },
          { id: "principles", index: "02", label: "Principles" },
          { id: "process", index: "03", label: "Process" },
          { id: "credits", index: "04", label: "Credits" },
        ]}
      />
    </main>
  );
}

type RecentCommit = {
  fullSha?: string;
  sha: string;
  subject: string;
  when: string;
};

function parseRecentCommits(): RecentCommit[] {
  try {
    const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function CadenceDatasheet() {
  const commits = parseRecentCommits();
  const prMerges = commits.filter((c) =>
    c.subject.startsWith("Merge pull request"),
  ).length;
  const directCommits = commits.length - prMerges;
  const latest = commits[0];
  const oldest = commits[commits.length - 1];
  const range = latest && oldest ? `${oldest.when} → ${latest.when}` : "—";

  const rows: Array<{ key: string; tone?: "accent" | "green"; value: string }> = [
    {
      key: "Last ship",
      tone: "green",
      value: latest ? `${latest.when} · ${latest.sha}` : "—",
    },
    {
      key: "Last 10 span",
      value: range,
    },
    {
      key: "PR merges",
      tone: "accent",
      value: `${prMerges} of ${commits.length || 10}`,
    },
    {
      key: "Direct commits",
      value: `${directCommits} of ${commits.length || 10}`,
    },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
        </span>
        <span>~/cadence</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">last 10 commits</span>
      </div>
      <ul className="grid sm:grid-cols-2 sm:divide-x sm:divide-border-light">
        {rows.map((row, index) => (
          <li
            className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
            key={row.key}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="text-text-light-muted/60">// </span>
              {String(index + 1).padStart(2, "0")} {row.key}
            </span>
            <span
              className={`text-right font-mono text-[12.5px] leading-6 ${
                row.tone === "green"
                  ? "text-result-green"
                  : row.tone === "accent"
                    ? "text-accent"
                    : "text-text-light"
              }`}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColophonBuildCard() {
  const commitCount = process.env.NEXT_PUBLIC_BUILD_COMMIT_COUNT ?? "";
  const prCount = process.env.NEXT_PUBLIC_BUILD_PR_COUNT ?? "";
  const sha = (process.env.NEXT_PUBLIC_BUILD_SHA ?? "").slice(0, 7);
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

  function shippedAgo(iso?: string): string {
    if (!iso) return "fresh";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "fresh";
    const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.round(hours / 24);
    return `${days} d ago`;
  }

  const rows: Array<{ key: string; value: string }> = [
    {
      key: "Commits",
      value: commitCount ? `${commitCount} on main` : "many",
    },
    { key: "PRs merged", value: prCount ? `${prCount} · all reviewed` : "200+" },
    { key: "Routes", value: "9 · all editorial" },
    { key: "Shipped", value: `${shippedAgo(buildTime)} · ${sha || "dev"}` },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
        </span>
        <span>~/build</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">At a glance</span>
      </div>
      <ul className="grid">
        {rows.map((row, index) => (
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
  );
}

function ColophonSection({
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
