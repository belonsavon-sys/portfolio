import { AtlasHierarchy, ParallaxGhost } from "@/components";

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

      {/* Trailing spacer — iters 236–238 inject sections here. */}
      <div className="h-24" aria-hidden="true" />
    </main>
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
