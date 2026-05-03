"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AnimatedCounter,
  BentoStack,
  Button,
  CursorHalo,
  GlassCard,
  GreetingRotator,
  LightGlassCard,
  LiveStatusBadge,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
  TrustStrip,
} from "@/components";
import type { ReactNode } from "react";

const aboutParagraphs = [
  "I'm an engineer who learned to ship by automating the business I was hired to run.",
  "Two years ago I supervised a hotel. Today, the AI systems running it are systems I built — every guest message, every inspection, every automated workflow. In parallel, at Blackdoor (the company I co-founded), I co-architect Atlas: a multi-level autonomous agent harness shipping real games, apps, and operating systems.",
  'When a problem enters my scope, I take it to mastery before I execute. Solo or paired with AI, I research relentlessly and finish what I start. My divergent thinking catches what specialists miss — and turns "we should automate that" into "it\'s already running."',
  "Trilingual. Hyperfocused. Built to ship.",
];

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

const heroMetrics = [
  {
    context: "Guest reply latency at ThePrivateHotels",
    label: "Response time",
    suffix: " min",
    to: 3,
    valuePrefix: "from 48 hrs to ",
  },
  {
    context: "Operations manual digitized into trackable QA",
    label: "Pages digitized",
    suffix: "+ pages",
    to: 100,
    valuePrefix: "",
  },
  {
    context: "Game · Budget · Project Mgmt — built end-to-end via Atlas",
    label: "Atlas products",
    suffix: " shipping",
    to: 3,
    valuePrefix: "",
  },
];

const detailedMetrics = [
  { label: "Hours of guest-reply lag eliminated", suffix: " hrs", to: 48 },
  { label: "Minutes saved per drafted reply", suffix: "-20 min", to: 15 },
  { label: "Inventory items under management", suffix: "+", to: 100 },
  { label: "Staff trained on the new tooling", suffix: "", to: 6 },
  { label: "Months of error-free QuickBooks", suffix: "", to: 6 },
  { label: "Native languages", suffix: "", to: 3 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <Hero />

      <SectionDivider direction="light-to-dark" />
      <MetricsBand />
      <SectionDivider direction="dark-to-light" />

      <LightSection className="pb-12 pt-12 sm:pt-16">
        <TrustStrip />
      </LightSection>

      <LightSection className="pb-16 pt-12 sm:pb-20 sm:pt-16">
        <About />
      </LightSection>

      <SectionDivider direction="light-to-dark" />
      <BeyondTheCode />
      <SectionDivider direction="dark-to-light" />

      <section
        className="relative py-20 sm:py-24"
        style={{
          background:
            "linear-gradient(180deg, #F5F1E8 0%, #EEE9DA 40%, #E8F0FD 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stack />
        </div>
      </section>

      <SectionDivider direction="light-to-dark" />
      <Cta />
    </main>
  );
}

function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.7, ease: easeOut },
        };

  return (
    <section className="relative overflow-hidden">
      <CursorHalo />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/10 blur-3xl" />
        <div className="absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.div {...fadeUp(0)}>
          <LiveStatusBadge label="Currently shipping · Atlas v3" />
        </motion.div>

        <motion.h1
          className="mt-8 flex flex-col items-center gap-2 text-text-light"
          {...fadeUp(0.08)}
        >
          <span className="font-mono text-2xl font-medium tracking-tight text-text-light/70 sm:text-3xl lg:text-4xl">
            <GreetingRotator />
          </span>
          <span className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-[7.5rem]">
            Pierre Belon Savon
          </span>
        </motion.h1>

        <motion.div
          aria-hidden="true"
          animate={{ scaleX: 1 }}
          className="mt-8 h-[3px] w-24 origin-center rounded-full bg-accent"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.55, duration: 0.55, ease: "easeOut" }}
        />

        <motion.p
          className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-accent"
          {...fadeUp(0.16)}
        >
          AI for operations-heavy businesses
        </motion.p>

        <motion.p
          className="mt-6 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9"
          {...fadeUp(0.22)}
        >
          Engineering intelligent automation and full-stack applications that
          turn complex business processes into scalable, profitable systems.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          {...fadeUp(0.32)}
        >
          <Button href="/contact">Contact Me →</Button>
          <Button href="/ai" variant="ghost">
            See What I Build
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
          {...fadeUp(0.44)}
        >
          {heroMetrics.map((m, index) => (
            <LightGlassCard
              className="px-5 py-5 text-left"
              hoverable={false}
              key={m.label}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {m.label}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-text-light sm:text-3xl">
                {m.valuePrefix ? (
                  <span className="text-text-light/40 text-base sm:text-lg font-mono">{m.valuePrefix}</span>
                ) : null}
                <AnimatedCounter
                  delay={index * 0.1}
                  suffix={m.suffix}
                  to={m.to}
                />
              </p>
              <p className="mt-2 text-xs leading-5 text-text-light-muted">
                {m.context}
              </p>
            </LightGlassCard>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.18em] text-text-light-muted"
          {...fadeUp(0.55)}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI Engineer
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Full-Stack Builder
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Systems Architect
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function MetricsBand() {
  return (
    <section className="bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <ScrollReveal direction="left">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent-light">
              Outcomes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-dark sm:text-4xl lg:text-5xl">
              Shipped to production. Measured by what changed.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-text-dark-muted">
              Faster responses, clearer operations, systems people actually use
              every day.
            </p>
          </ScrollReveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {detailedMetrics.map((metric, index) => (
              <ScrollReveal
                delay={0.05 + index * 0.04}
                direction="fade"
                key={metric.label}
              >
                <GlassCard className="h-full p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-light">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-text-dark sm:text-4xl">
                    <AnimatedCounter suffix={metric.suffix} to={metric.to} />
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-4xl text-center" id="about">
      <ScrollReveal direction="up">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent">
          About me
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {aboutParagraphs[0]}
        </h2>
      </ScrollReveal>

      <div className="mx-auto mt-8 grid max-w-3xl gap-5 text-left text-lg leading-8 text-text-light-muted">
        {aboutParagraphs.slice(1).map((paragraph, index) => (
          <ScrollReveal delay={index * 0.06} direction="up" key={paragraph}>
            <p>{paragraph}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function BeyondTheCode() {
  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-[10%] h-[460px] w-[460px] rounded-full bg-accent/16 blur-3xl" />
        <div className="absolute -top-12 right-[8%] h-[380px] w-[380px] rounded-full bg-accent-light/12 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[40%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent-light">
              Beyond the code
            </p>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05} direction="up">
          <h2 className="mx-auto mt-6 max-w-3xl text-center text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
            More than engineering.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} direction="up">
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-text-dark-muted">
            The habit of taking problems to mastery before executing runs
            through everything I do — agent architecture, accounting, music.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={0.05} direction="left">
            <PortraitCard
              caption="Music · Italy"
              fallbackMeta="Save public/about-guitar.png to replace this placeholder."
              fallbackTitle="Photo 1 selected"
              imgAlt="Pierre playing guitar off-shift"
              imgSrc="/about-guitar.png"
              tag="Off-shift"
              title="Guitar before deep work"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.12} direction="right">
            <PortraitCard
              caption="Leadership retreat · 2024"
              fallbackMeta="Save public/about-hawaii.png to replace this placeholder."
              fallbackTitle="Photo 2 selected"
              imgAlt="Pierre at the Hawaii leadership retreat"
              imgSrc="/about-hawaii.png"
              tag="Hawaii"
              title="The room where strategy gets made"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2} direction="up">
          <figure className="mx-auto mt-20 max-w-3xl text-center">
            <span
              aria-hidden="true"
              className="font-mono text-5xl leading-none text-accent-light/60"
            >
              &ldquo;
            </span>
            <blockquote className="mt-2 text-2xl font-medium leading-relaxed text-text-dark sm:text-4xl">
              Solo or paired with AI, I research relentlessly and finish what I
              start.
            </blockquote>
            <figcaption className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
              — How I work
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PortraitCard({
  caption,
  fallbackMeta,
  fallbackTitle,
  imgAlt,
  imgSrc,
  tag,
  title,
}: {
  caption: string;
  fallbackMeta: string;
  fallbackTitle: string;
  imgAlt: string;
  imgSrc: string;
  tag: string;
  title: string;
}) {
  return (
    <GlassCard className="flex h-full flex-col gap-5 p-5 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2/60">
        <PhotoSlot
          alt={imgAlt}
          className="h-72 sm:h-80"
          fallbackMeta={fallbackMeta}
          fallbackTitle={fallbackTitle}
          fit="cover"
          src={imgSrc}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-accent/40 bg-[rgba(41,110,214,0.12)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
          {tag}
        </span>
        <span className="h-px flex-1 bg-[rgba(41,110,214,0.25)]" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
          {caption}
        </p>
      </div>
    </GlassCard>
  );
}

function Stack() {
  return (
    <section id="stack">
      <div className="text-center">
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent">
            My stack
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            What I use to ship.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-light-muted">
            Pragmatic mix of cloud AI, local AI, modern web frameworks, and the
            orchestration layer that ties them together.
          </p>
        </ScrollReveal>
      </div>

      <div className="mt-12">
        <BentoStack />
      </div>
    </section>
  );
}

function Cta() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/18 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-10%] h-[420px] w-[420px] rounded-full bg-accent-light/14 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <LiveStatusBadge label="Available now · 3 min reply average" />
        </ScrollReveal>

        <ScrollReveal delay={0.08} direction="up">
          <h2 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Let&apos;s build something</span>
            <span
              className="block bg-gradient-to-r from-text-dark via-accent-light to-accent-light bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              that actually works.
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="up">
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: 1 }}
            className="mt-8 h-[3px] w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="up">
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
            Whether you need AI automation, a full-stack product, or a system
            that runs itself — I&apos;m available for remote roles and projects.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.28} direction="up">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact">Contact Me →</Button>
            <Button href="/resume" variant="ghostDark">
              View Resume
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.36} direction="up">
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
            <span>Remote</span>
            <span aria-hidden="true" className="text-accent">·</span>
            <span>Trilingual</span>
            <span aria-hidden="true" className="text-accent">·</span>
            <span>Replies in 24 hrs</span>
          </p>
        </ScrollReveal>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(41,110,214,0.2)] pt-8 sm:flex-row">
        <p className="text-sm text-text-dark-muted">
          © 2026 Pierre Belon Savon
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
          Built business-first
        </p>
      </div>
    </footer>
  );
}

function LightSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
