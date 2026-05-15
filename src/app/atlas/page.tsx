"use client";

import {
  AtlasArchitecture,
  AtlasTerminal,
  HeroSplitTitle,
  ParallaxGhost,
  SiteFooter,
  StaggeredChipRail,
  TextScramble,
} from "@/components";

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <AtlasHero />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AtlasTerminal />
        <AtlasArchitecture />
        <OriginTieBack />
      </section>

      <SiteFooter />
    </main>
  );
}

function AtlasHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            color: "transparent",
            fontSize: "clamp(6rem, 20vw, 20rem)",
            WebkitTextStroke: "1px rgba(41,110,214,0.10)",
          }}
        >
          ATLAS
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-12 font-mono text-[11px] text-accent">
          <span className="text-accent-deep">$</span>
          <span>
            <TextScramble
              durationMs={950}
              stepMs={38}
              text="atlas · the multi-agent harness"
            />
          </span>
          <span className="font-mono text-[12px] text-result-green">
            — v3 · live
          </span>
        </div>

        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 7rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="Atlas v3." />
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

        <p className="mx-auto mt-10 max-w-2xl text-center text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Autonomous agent harness. Pierre Belon Savon, co-architect. Connects
          any AI model to any external tool through MCP or OAuth, and ships
          real apps through a GitHub PR workflow.
        </p>

        <div className="mt-8 flex justify-center">
          <StaggeredChipRail
            baseDelay={0.5}
            chips={["MCP", "OAuth", "ollama / qwen3-coder:30b", "GitHub PR"]}
            className="flex flex-wrap items-center justify-center gap-2"
          />
        </div>
      </div>
    </section>
  );
}

function OriginTieBack() {
  return (
    <section className="mx-auto mt-24 max-w-3xl border-t border-border-light pt-12 text-center">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">— origin</p>
      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-text-light-muted sm:text-[16px] sm:leading-9">
        This started as the auto-replier I built for hotel guest messages — a
        single Claude call dispatching follow-ups. Atlas is what happened when
        I generalized that work.
      </p>
      <a
        className="mt-7 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.18em] text-accent transition-colors hover:text-accent-deep"
        href="/business"
      >
        <span className="link-underline">See how it scaled</span>
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
