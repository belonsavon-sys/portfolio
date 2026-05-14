import {
  AtlasHierarchy,
  AtlasManifest,
  type AtlasHierarchyLayer,
  Button,
  ChapterRail,
  GlitchTitle,
  HeroSplitTitle,
  ParallaxGhost,
  ShipFlow,
  SiteFooter,
} from "@/components";

const ATLAS_LAYERS: AtlasHierarchyLayer[] = [
  {
    badge: "01",
    description:
      "Just the two of us. I lead AI R&D and harness implementation; my co-founder Ryder runs business and strategy. No employees, no junior staff — the harness is our team.",
    items: ["Pierre + Ryder · co-founders"],
    signature: "founders",
    title: "Founders",
  },
  {
    badge: "02",
    description:
      "Atlas itself — the multi-level autonomous harness I built. I wired it to connect any AI model to any external tool through MCP or OAuth. It owns routing, retries, governance, and the audit log.",
    items: ["Atlas v3 · the engine"],
    signature: "engine",
    title: "Engine",
  },
  {
    badge: "03",
    description:
      "The strategic tier I architected. CEO reads the brief and routes the work. CFO scopes budget + capacity. CMO shapes voice and channel. Every call lands in the audit log so I can trace it back.",
    items: ["CEO agent", "CFO agent", "CMO agent"],
    signature: "csuite",
    title: "C-suite agents",
  },
  {
    badge: "04",
    description:
      "Where the work actually gets done. Manager agents break the spec into tickets and assign them; field agents pick them up, write code, run tests locally, and file PRs against the board. I review at the merge boundary.",
    items: ["Manager agents", "Field agents"],
    signature: "execution",
    title: "Execution",
  },
  {
    badge: "05",
    description:
      "What I have running in production right now. A game app, a budget web app, an agent-augmented project management system — plus the same tech powering hotel ops at ThePrivateHotels.",
    items: ["Game · Budget · PM", "Hotel ops automation"],
    signature: "products",
    title: "Shipped products",
  },
];

export default function AtlasPage() {
  return (
    <main
      className="min-h-screen bg-bg-light text-text-light"
    >
      {/* HERO — centered single-line title with welcome-style glitch
          (auto-glitch + gradient-shift + TextScramble + blurred
          underglow + cursor). Side cards removed. */}
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

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
          {/* TOP STRIP — centered */}
          <div className="flex flex-wrap items-center justify-center gap-3 pb-12">
            <span className="inline-flex items-center gap-3 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium text-accent">
                /atlas · the harness
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] text-text-light-muted">
              Multi-agent · shipping under PR review
            </span>
          </div>

          {/* TITLE — centered, single line, welcome-style glitch */}
          <h1
            className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 5.5rem)",
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
            }}
          >
            <span className="relative inline-block">
              <HeroSplitTitle text="A harness that ships." />
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
            Atlas is the autonomous multi-level agent harness I
            co-architect at Blackdoor. Five layers, three products live
            in production, and every change ships through a
            human-reviewed PR — because I don&apos;t trust autonomy
            without a review boundary.
          </p>

          {/* CENTERED CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button arrow href="/resume#contact">
              Let&apos;s talk
            </Button>
            <Button href="/lab#demos" variant="ghost">
              See my live demos
            </Button>
          </div>
        </div>
      </section>

      {/* 01 · HIERARCHY */}
      <AtlasSection
        chapter="01"
        eyebrow="Hierarchy"
        id="hierarchy"
        meta="// 5 layers · 14 wires"
        title="Five layers, top to bottom."
      >
        <AtlasHierarchy layers={ATLAS_LAYERS} />
      </AtlasSection>

      {/* 02 · PRODUCTS */}
      <AtlasSection
        chapter="02"
        eyebrow="Products"
        id="products"
        meta="// 3 live · shipped end-to-end"
        title="What Atlas has shipped."
      >
        <AtlasManifest />
      </AtlasSection>

      {/* 03 · WORKFLOW */}
      <AtlasSection
        chapter="03"
        eyebrow="Workflow"
        id="workflow"
        meta="// brief → spec → build → ship → operate"
        title="How I ship."
      >
        <ShipFlow />
      </AtlasSection>

      <ChapterRail
        sections={[
          { id: "hierarchy", index: "01", label: "Hierarchy" },
          { id: "products", index: "02", label: "Products" },
          { id: "workflow", index: "03", label: "Workflow" },
        ]}
      />

      <SiteFooter />
    </main>
  );
}

function AtlasSection({
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
  id?: string;
  meta?: string;
  title: string;
}) {
  return (
    <section className="relative mt-16 scroll-mt-28 sm:mt-20" id={id}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlitchTitle
          chapter={chapter}
          eyebrow={eyebrow}
          meta={meta}
          title={title}
        />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
