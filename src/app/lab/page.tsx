"use client";

import {
  HeroSplitTitle,
  LocalAiDemo,
  ParallaxGhost,
  SiteFooter,
  TextScramble,
} from "@/components";

/* /lab — interactive ML demos.
 *
 * Hero stays locked to the site's welcome pattern (HeroSplitTitle +
 * auto-glitch + cursor). Below it, the demo wrapper handles its own
 * tabbed surface. The page uses site tokens (bg-bg-light /
 * text-text-light) so the LightSwitch toggle actually flips it. */

export default function LabPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LabHero />

      <section className="mx-auto w-full max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
        <LocalAiDemo />
      </section>

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
            color: "transparent",
            fontSize: "clamp(6rem, 22vw, 22rem)",
            WebkitTextStroke: "1px rgba(41,110,214,0.10)",
          }}
        >
          LAB
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-12 font-mono text-[11px] text-accent">
          <span className="text-accent-deep">$</span>
          <span>
            <TextScramble
              durationMs={950}
              stepMs={38}
              text="cd ~/lab · open the demos"
            />
          </span>
          <span className="font-mono text-[12px] text-result-green">
            — 7 probes · in your tab
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
            <HeroSplitTitle text="The lab." />
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

        <p className="mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Seven interactive ML demos. Every model runs in your tab via
          Transformers.js + MediaPipe — no API keys, no uploads, nothing
          leaves your browser.
        </p>
      </div>
    </section>
  );
}
