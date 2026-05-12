import { Button, ChapterRail, ParallaxGhost } from "@/components";

const STACK = [
  { detail: "App Router · Server Components · Turbopack", label: "Next.js 16" },
  { detail: "Atomic styling · variable axes · CSS containment", label: "Tailwind v4" },
  { detail: "Scroll-driven animations · spring physics · layout", label: "Framer Motion" },
  { detail: "Per-route ImageResponse cards · edge runtime", label: "next/og" },
  { detail: "Edge hosting · preview URLs · analytics", label: "Vercel" },
  { detail: "PR-driven · auto-merge · branch-per-iter", label: "GitHub" },
];

const PRINCIPLES = [
  {
    detail:
      "Every chapter / section / page on this site uses the same ~/slug · meta datasheet header, the same indexed rows, the same gradient hairline on hover. Cohesion is built, not decorated.",
    label: "One editorial language",
  },
  {
    detail:
      "Live commit subject in the hero. Real git data on /now. ~/career years that auto-tick. The site shouldn't lie about how fresh it is.",
    label: "Honest live signals",
  },
  {
    detail:
      "⌘K palette, precision cursor, chapter-slate transitions, scroll-progress ring. Top-tier interactions don't pile on — they pick one signature and ship it well.",
    label: "Signature beats novelty",
  },
  {
    detail:
      "JSON-LD for Person · WebSite · SoftwareApplication · ProfessionalService · ItemList. Per-route OG cards. PWA manifest. Sitemap. Recruiters' tools see the same structure humans do.",
    label: "Structured-data first",
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
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
                <span>~/build</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
                <span className="text-text-light-muted">At a glance</span>
              </div>
              <ul className="grid">
                {[
                  { key: "Iterations", value: "200+ PRs" },
                  { key: "Routes", value: "9 · all editorial" },
                  { key: "Components", value: "40+ shared" },
                  { key: "Stack", value: "Next.js · Tailwind · Vercel" },
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
              className="relative px-5 py-5 sm:px-7 sm:py-6"
              key={item.label}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-accent/50"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                <span className="text-text-light-muted/60">// </span>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3
                className="mt-3 font-semibold tracking-tight text-text-light"
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
              <p className="col-span-12 text-base leading-7 text-text-light-muted lg:col-span-7">
                {entry.detail}
              </p>
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
      </ColophonSection>

      {/* 04 · CREDITS */}
      <ColophonSection
        chapter="04"
        eyebrow="Credits"
        id="credits"
        title="Standing on shoulders."
      >
        <div className="grid gap-6 text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8 lg:grid-cols-2 lg:gap-10">
          <p>
            Inspired by the editorial design language of{" "}
            <strong className="text-text-light">awwwards</strong> winners,
            the live-data discipline of <strong className="text-text-light">nownownow.com</strong>,
            and the developer ergonomics of <strong className="text-text-light">uses.tech</strong>.
          </p>
          <p>
            Type: <strong className="text-text-light">Bricolage Grotesque</strong>{" "}
            (display) + <strong className="text-text-light">Geist Sans / Mono</strong> (body & code).
            Brand: a single accent blue carried through all 9 routes.
          </p>
          <p>
            Built end-to-end in the open. Every iteration is a commit you
            can read. Every design choice is reversible because the next
            PR ships in minutes.
          </p>
          <p>
            Curious about Pierre? <a className="link-underline text-text-light hover:text-accent" href="/resume">the receipts live here</a>.
            Want to talk? <a className="link-underline text-text-light hover:text-accent" href="/contact">the door is open</a>.
          </p>
        </div>
      </ColophonSection>

      {/* CLOSING */}
      <section className="relative pb-24 pt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
