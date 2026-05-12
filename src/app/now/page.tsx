import Link from "next/link";
import { Button, ChapterRail, ParallaxGhost } from "@/components";

type BuildingStatus = "active" | "maintaining" | "warm";

const BUILDING: Array<{
  detail: string;
  health: BuildingStatus;
  label: string;
  project: string;
  status: string;
}> = [
  {
    detail:
      "Lead AI R&D — multi-level autonomous agent harness shipping under PR review.",
    health: "active",
    label: "Atlas v3",
    project: "Blackdoor",
    status: "Daily",
  },
  {
    detail:
      "Hotel operations supervisor — guest comms, QA system, automation pipelines.",
    health: "maintaining",
    label: "Live operations",
    project: "ThePrivateHotels",
    status: "Weekly",
  },
  {
    detail:
      "This portfolio. Every iteration shipped through a PR — sometimes 5 in a row.",
    health: "active",
    label: "pierrebelonsavon.com",
    project: "Personal",
    status: "Hourly",
  },
];

const BUILDING_STATUS_META: Record<
  BuildingStatus,
  { dot: string; label: string; pulse: boolean; text: string }
> = {
  active: {
    dot: "bg-result-green",
    label: "Active",
    pulse: true,
    text: "text-result-green",
  },
  maintaining: {
    dot: "bg-accent",
    label: "Maintaining",
    pulse: false,
    text: "text-accent",
  },
  warm: {
    dot: "bg-text-light-muted",
    label: "Warm",
    pulse: false,
    text: "text-text-light-muted",
  },
};

const READING = [
  {
    detail: "Daniel Kahneman · re-read for the system-1/system-2 framework.",
    label: "Thinking, Fast and Slow",
    medium: "Book",
  },
  {
    detail:
      "Following the latest Anthropic / OpenAI / DeepMind agent-systems research drops.",
    label: "Agent design papers",
    medium: "Papers",
  },
  {
    detail: "Watching the MCP spec land in production projects across the ecosystem.",
    label: "MCP changelog",
    medium: "Spec",
  },
];

const LEARNING = [
  {
    detail:
      "Pushing the harness toward fewer human checkpoints without losing reviewability.",
    label: "Multi-agent orchestration patterns",
  },
  {
    detail:
      "Curating real conversations into RAG-quality datasets for brand-voice replies.",
    label: "Voice-trained chatbot data prep",
  },
  {
    detail: "Tightening cold start + cache hit rates on Vercel Fluid Compute.",
    label: "Edge-first deployment trade-offs",
  },
];

type ShippedEntry = {
  fullSha?: string;
  sha?: string;
  subject: string;
  when?: string;
};

const SHIPPED_FALLBACK: ShippedEntry[] = [
  { subject: "FinanceSection editorial datasheet", when: "/business" },
  { subject: "SectionShell → editorial datasheet", when: "/business" },
  { subject: "/ai page overhaul (5 iters)", when: "/ai" },
  { subject: "/contact intake page (5 iters)", when: "/contact" },
  { subject: "Editorial command palette", when: "site-wide" },
  { subject: "Site-wide precision cursor ring", when: "site-wide" },
  { subject: "404 editorial", when: "/404" },
];

/**
 * Parse the build-time recent-commits JSON list. Commits that are
 * merge commits get filtered (we want the feature commits, not the
 * "Merge pull request" noise). Falls back to the static list when
 * the env var is absent (Vercel builds have no git history).
 */
function readShipped(): ShippedEntry[] {
  const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
  if (!raw) return SHIPPED_FALLBACK;
  try {
    const parsed = JSON.parse(raw) as ShippedEntry[];
    const filtered = parsed.filter(
      (c) => c.subject && !c.subject.startsWith("Merge pull request"),
    );
    return filtered.length > 0 ? filtered.slice(0, 8) : SHIPPED_FALLBACK;
  } catch {
    return SHIPPED_FALLBACK;
  }
}

const SHIPPED = readShipped();

/**
 * "Updated X ago" label for the ~/snapshot header. Derived from
 * NEXT_PUBLIC_BUILD_TIME at build, so the value refreshes every
 * deploy. Server-rendered — won't tick while the page is open, but
 * recruiters scanning at deploy-time see fresh signal.
 */
function updatedLabel() {
  const raw = process.env.NEXT_PUBLIC_BUILD_TIME;
  if (!raw) return "Just now";
  const then = new Date(raw).getTime();
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return "Updated just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `Updated ${days} d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `Updated ${weeks} wk ago`;
  const months = Math.round(days / 30);
  return `Updated ${months} mo ago`;
}

export const metadata = {
  description:
    "What Pierre Belon Savon is working on, reading, and learning right now. Inspired by nownownow.com.",
  title: "Now",
};

export default function NowPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      {/* HERO — editorial chapter slate for /now */}
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
            NOW
          </ParallaxGhost>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
          {/* TOP STRIP — status pill + chapter marker */}
          <div className="col-span-12 flex flex-wrap items-center gap-3 self-start">
            <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
                /now · what I&apos;m doing
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Inspired by nownownow.com
            </span>
          </div>

          {/* LEFT — stacked massive headline (cols 1–8 lg) */}
          <div className="col-span-12 self-center lg:col-span-8">
            <h1
              className="font-semibold text-text-light"
              style={{
                fontSize: "clamp(3rem, 12vw, 10rem)",
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
              }}
            >
              <span className="block">What I&apos;m</span>
              <span className="gradient-shift block">
                doing now<span className="text-accent">.</span>
              </span>
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                Current focus · this week
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              A snapshot of the work, the reading, and the learning right now.
              Updated as things change.
            </p>
          </div>

          {/* RIGHT — last-updated datasheet (cols 9–12 lg) */}
          <div className="col-span-12 self-center lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
                <span>~/snapshot</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
                <span className="text-text-light-muted">{updatedLabel()}</span>
              </div>
              <ul className="grid">
                {[
                  { key: "Building", value: `${BUILDING.length} projects` },
                  { key: "Reading", value: `${READING.length} sources` },
                  { key: "Learning", value: `${LEARNING.length} threads` },
                  { key: "Shipped", value: `${SHIPPED.length} this week` },
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
          </div>
        </div>
      </section>

      {/* BUILDING */}
      <NowSection chapter="01" eyebrow="Building" id="building" title="What I'm shipping.">
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {BUILDING.map((entry, index) => (
            <li
              className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-10 sm:py-12"
              key={entry.label}
            >
              <div className="col-span-12 lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                  {String(index + 1).padStart(2, "0")} · {entry.project}
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                  }}
                >
                  {entry.label}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                  {entry.detail}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
                {(() => {
                  const meta = BUILDING_STATUS_META[entry.health];
                  return (
                    <>
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        Status
                      </p>
                      <p
                        className={`mt-2 inline-flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] ${meta.text}`}
                      >
                        <span className="relative inline-flex h-1.5 w-1.5">
                          {meta.pulse ? (
                            <span
                              className={`absolute inset-0 animate-ping rounded-full ${meta.dot}/60`}
                            />
                          ) : null}
                          <span
                            className={`relative inline-block h-1.5 w-1.5 rounded-full ${meta.dot}`}
                          />
                        </span>
                        {meta.label}
                      </p>
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        Cadence
                      </p>
                      <p className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-text-light">
                        {entry.status}
                      </p>
                    </>
                  );
                })()}
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>
      </NowSection>

      {/* READING */}
      <NowSection chapter="02" eyebrow="Reading" id="reading" title="In my queue.">
        <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
          <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>~/reading-queue</span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span className="text-text-light-muted">{READING.length} sources</span>
          </div>
          <ul className="grid divide-y divide-border-light md:grid-cols-3 md:divide-x md:divide-y-0">
            {READING.map((entry, index) => (
              <li className="relative px-5 py-5" key={entry.label}>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-accent/50"
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                  <span className="text-text-light-muted/60">// </span>
                  {String(index + 1).padStart(2, "0")} {entry.medium}
                </p>
                <h3 className="mt-3 text-base font-semibold leading-6 text-text-light sm:text-lg">
                  {entry.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-light-muted">
                  {entry.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </NowSection>

      {/* LEARNING */}
      <NowSection chapter="03" eyebrow="Learning" id="learning" title="Open loops.">
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {LEARNING.map((entry, index) => (
            <li
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 sm:py-8"
              key={entry.label}
            >
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.32em] text-accent lg:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className="col-span-12 font-semibold tracking-tight text-text-light lg:col-span-6"
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {entry.label}
              </h3>
              <p className="col-span-12 text-sm leading-6 text-text-light-muted lg:col-span-5 lg:text-right">
                {entry.detail}
              </p>
            </li>
          ))}
        </ol>
      </NowSection>

      {/* SHIPPED — real recent commits captured at build time
          (next.config.ts reads `git log -10`). Falls back to a
          curated static list when no git history is available. */}
      <NowSection
        chapter="04"
        eyebrow="Recent ships"
        id="shipped"
        title="Last commits, real time."
      >
        <ol className="grid divide-y divide-border-light border-y border-border-light">
          {SHIPPED.map((entry, index) => (
            <li
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-4 sm:py-5"
              key={`${entry.subject}-${index}`}
            >
              <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.32em] text-accent sm:col-span-1">
                {entry.sha ?? String(index + 1).padStart(2, "0")}
              </span>
              <span className="col-span-12 font-mono text-sm leading-6 text-text-light sm:col-span-8">
                <span aria-hidden="true" className="mr-2 text-accent/70">
                  &gt;
                </span>
                {entry.subject}
              </span>
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.22em] text-text-light-muted sm:col-span-3 sm:text-right">
                {entry.when ?? "—"}
              </span>
            </li>
          ))}
        </ol>
      </NowSection>

      {/* CLOSING */}
      <section className="relative pb-24 pt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                05 · What this is
              </p>
              <h2
                className="mt-3 font-semibold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                }}
              >
                A snapshot. Not a feed.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                Inspired by{" "}
                <Link
                  className="link-underline text-text-light hover:text-accent"
                  href="https://nownownow.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  nownownow.com
                </Link>
                . The point of a /now page is to answer the question a friend
                would ask if you bumped into them this week. It changes as
                things change — not on an interval.
              </p>
            </div>
            <div className="col-span-12 self-end lg:col-span-4">
              <div className="flex flex-wrap gap-3">
                <Button arrow href="/contact">
                  Get in Touch
                </Button>
                <Button href="/ai" variant="ghost">
                  See the work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER RAIL — floating right-margin nav for the four /now
          sections. */}
      <ChapterRail
        sections={[
          { id: "building", index: "01", label: "Building" },
          { id: "reading", index: "02", label: "Reading" },
          { id: "learning", index: "03", label: "Learning" },
          { id: "shipped", index: "04", label: "Recent ships" },
        ]}
      />
    </main>
  );
}

function NowSection({
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
