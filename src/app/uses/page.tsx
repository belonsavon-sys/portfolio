import { Button, ParallaxGhost } from "@/components";

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

export const metadata = {
  description:
    "What Pierre Belon Savon actually uses to ship AI systems — tools, editors, infra, hardware, with usage notes.",
  title: "Uses",
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

      {/* CLOSING placeholder — iters 202–205 inject sections here. */}
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
    </main>
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
