"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AboutModal,
  AnimatedCounter,
  BentoStack,
  Button,
  CursorHalo,
  GreetingRotator,
  HeroAvatarFrame,
  LightGlassCard,
  LiveStatusBadge,
  ParallaxBackdrop,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SelectedWork,
  SiteFooter,
  SplitText,
  TrustStrip,
} from "@/components";
import { useRef, useState, type ReactNode } from "react";

const aboutParagraphs = [
  "I'm an engineer who learned to ship by automating the business I was hired to run.",
  "Two years ago I supervised a hotel. Today, the AI systems running it are systems I built — every guest message, every inspection, every automated workflow. In parallel, at Blackdoor (the company I co-founded), I co-architect Atlas: a multi-level autonomous agent harness shipping real games, apps, and operating systems.",
  'When a problem enters my scope, I take it to mastery before I execute. Solo or paired with AI, I research relentlessly and finish what I start. My divergent thinking catches what specialists miss — and turns "we should automate that" into "it\'s already running."',
  "Trilingual. Hyperfocused. Built to ship.",
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <Hero onOpenAbout={() => setAboutOpen(true)} />

      <LightSection className="pt-16 sm:pt-24">
        <MetricsBand />
      </LightSection>

      <LightSection className="pb-16 pt-10 sm:pb-20 sm:pt-16" id="work">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                description="Four systems running in production right now. Each one started as somebody's manual workflow."
                eyebrow="Selected work"
                title="What I've built."
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <SelectedWork />
          </div>
        </div>
      </LightSection>

      <LightSection className="pb-16 pt-8 sm:pb-20 sm:pt-12">
        <TrustStrip />
      </LightSection>

      <BeyondTheCodeBand />

      <LightSection className="py-20 sm:py-24" id="stack">
        <Stack />
      </LightSection>

      <SectionDivider direction="light-to-dark" />

      <SiteFooter />

      <AboutModal
        onClose={() => setAboutOpen(false)}
        open={aboutOpen}
        title={aboutParagraphs[0]}
      >
        {aboutParagraphs.slice(1).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </AboutModal>
    </main>
  );
}

function FloatingHeroLabels() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Each label drifts at a different parallax speed inside the hero's
  // own scroll window. As the hero passes through view (start end -> end start),
  // scrollYProgress 0→1 maps to per-label y offsets.
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: wrapperRef,
  });
  // Different "depths" — slower y range = "further back", faster y range = "closer to camera"
  const ySlow = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yMid = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yFast = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const yVeryFast = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  const labels = [
    {
      className:
        "left-[6%] top-[18%] -rotate-2 sm:left-[8%] sm:top-[22%] lg:left-[10%] lg:top-[26%]",
      delay: 0.6,
      parallaxY: ySlow,
      text: "AI Engineer",
    },
    {
      className:
        "right-[5%] top-[14%] rotate-3 sm:right-[8%] sm:top-[18%] lg:right-[9%] lg:top-[24%]",
      delay: 0.85,
      parallaxY: yFast,
      text: "Atlas · Multi-agent harness",
    },
    {
      className:
        "left-[4%] bottom-[16%] -rotate-3 sm:left-[7%] sm:bottom-[20%] lg:left-[8%] lg:bottom-[28%]",
      delay: 1.0,
      parallaxY: yMid,
      text: "Trilingual · EN · ES · IT",
    },
    {
      className:
        "right-[5%] bottom-[14%] rotate-2 sm:right-[8%] sm:bottom-[18%] lg:right-[8%] lg:bottom-[24%]",
      delay: 1.15,
      parallaxY: yVeryFast,
      text: "Co-founder · Blackdoor",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
      ref={wrapperRef}
    >
      {labels.map((label) => (
        <motion.span
          animate={
            reduce
              ? { opacity: 0.85, y: 0 }
              : {
                  opacity: [0, 0.85],
                }
          }
          className={`absolute inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent backdrop-blur-md ${label.className}`}
          initial={false}
          key={label.text}
          style={
            reduce
              ? {
                  boxShadow:
                    "0 8px 24px -10px rgba(41,110,214,0.25), 0 1px 0 0 rgba(255,255,255,0.9) inset",
                }
              : {
                  boxShadow:
                    "0 8px 24px -10px rgba(41,110,214,0.25), 0 1px 0 0 rgba(255,255,255,0.9) inset",
                  y: label.parallaxY,
                }
          }
          transition={{
            delay: label.delay,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="h-1 w-1 rounded-full bg-accent" />
          {label.text}
        </motion.span>
      ))}
    </div>
  );
}

function Hero({ onOpenAbout }: { onOpenAbout: () => void }) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-progress driven fade-out + drift: as the hero scrolls out
  // of view, its inner content fades and lifts slightly. Creates a
  // depth-of-field "you're descending past it" sensation.
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: heroRef,
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const rawY = useTransform(scrollYProgress, [0, 0.55], [0, -64]);
  const heroOpacity = useSpring(rawOpacity, {
    damping: 30,
    mass: 0.5,
    stiffness: 160,
  });
  const heroY = useSpring(rawY, {
    damping: 30,
    mass: 0.5,
    stiffness: 160,
  });

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.7, ease: easeOut },
        };

  return (
    <section className="relative overflow-hidden" ref={heroRef}>
      <CursorHalo />

      <ParallaxBackdrop>
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/25 blur-3xl" />
        <div className="absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/22 blur-3xl" />
      </ParallaxBackdrop>

      {/* Floating accent labels — desktop-only decoration */}
      <FloatingHeroLabels />

      <motion.div
        className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8"
        style={reduce ? undefined : { opacity: heroOpacity, y: heroY }}
      >
        <HeroAvatarFrame onClick={onOpenAbout} src="/avatar-photo.png" />

        <motion.div {...fadeUp(0.06)}>
          <LiveStatusBadge label="Currently shipping · Atlas v3" />
        </motion.div>

        <motion.h1
          className="mt-8 flex flex-col items-center gap-2 text-text-light"
          {...fadeUp(0.08)}
        >
          <span className="font-mono text-2xl font-medium tracking-tight text-text-light/70 sm:text-3xl lg:text-4xl">
            <GreetingRotator />
          </span>
          <span className="hero-display gradient-shift font-semibold">
            <SplitText charDelay={0.035} delay={0.15} duration={0.85}>
              Pierre Belon Savon
            </SplitText>
          </span>
        </motion.h1>

        <motion.div
          aria-hidden="true"
          animate={{ scaleX: 1 }}
          className="mt-8 h-[3px] w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
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
          Multi-agent harnesses, full-stack systems, and automation pipelines —
          engineered from inside live operations, designed to ship, measured by
          what they change.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          {...fadeUp(0.32)}
        >
          <Button className="!px-8 !py-4 !text-base" href="/contact">
            Get in Touch →
          </Button>
          <Button
            className="!px-8 !py-4 !text-base"
            href="/ai"
            variant="ghost"
          >
            See the Work
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
          {...fadeUp(0.44)}
        >
          {heroMetrics.map((m, index) => (
            <LightGlassCard
              className="group relative px-5 py-5 text-left"
              hoverable={false}
              key={m.label}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {m.label}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-text-light sm:text-3xl">
                {m.valuePrefix ? (
                  <span className="text-text-light/40 text-base sm:text-lg font-mono">
                    {m.valuePrefix}
                  </span>
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
          className="mt-16 flex flex-wrap items-center justify-center gap-2.5"
          {...fadeUp(0.55)}
        >
          {[
            "AI Engineer",
            "Full-Stack Builder",
            "Systems Architect",
          ].map((role) => (
            <span
              className="group inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/65 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-text-light backdrop-blur-md transition-[border-color,background] duration-200 hover:border-accent hover:bg-white/85"
              key={role}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {role}
            </span>
          ))}
        </motion.div>

        <motion.a
          aria-label="Scroll to live status"
          className="group/cue mt-20 hidden flex-col items-center gap-3 sm:flex"
          href="#work"
          {...fadeUp(0.7)}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-light-muted/60 transition-colors duration-200 group-hover/cue:text-accent">
            Scroll
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-gradient-to-b from-transparent via-border-light to-transparent transition-colors duration-200 group-hover/cue:via-accent">
            <span className="scroll-cue-dot absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-accent" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}

function MetricsBand() {
  return (
    <div className="relative grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]">
      {/* Ambient corner glow on the left side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <SectionHeader
        description="Faster responses, clearer operations, systems people actually use every day."
        eyebrow="Outcomes"
        size="md"
        title="Shipped to production. Measured by what changed."
      />

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {detailedMetrics.map((metric, index) => (
          <ScrollReveal delay={index * 0.05} direction="up" key={metric.label}>
            <div className="group relative border-l-2 border-border-light pl-5 transition-[border-color] duration-300 hover:border-accent">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {metric.label}
              </p>
              <p
                className="mt-3 font-bold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter suffix={metric.suffix} to={metric.to} />
              </p>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-12 origin-left bg-accent/40 transition-transform duration-500 group-hover:scale-x-[2]"
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function BeyondTheCodeBand() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-28">
      <ParallaxBackdrop>
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/18 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/14 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/12 blur-3xl" />
      </ParallaxBackdrop>

      {!reduce ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full"
          initial={{ x: "0%" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          viewport={{ amount: 0.25, once: true }}
          whileInView={{ x: "100%" }}
        >
          <div className="absolute inset-0 bg-bg-light" />
          <div className="absolute inset-y-0 left-0 w-1 bg-accent shadow-[0_0_28px_rgba(41,110,214,0.55)]" />
        </motion.div>
      ) : null}

      <motion.div
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        transition={{ delay: 0.45, duration: 0.6, ease: easeOut }}
        viewport={{ amount: 0.25, once: true }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      >
        <BeyondTheCode />
      </motion.div>
    </section>
  );
}

function BeyondTheCode() {
  return (
    <div>
      <SectionHeader
        align="center"
        description="The habit of taking problems to mastery before executing runs through everything I do — agent architecture, accounting, music."
        eyebrow="Beyond the code"
        title="More than engineering."
        tone="dark"
      />

      <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2 sm:gap-10">
        <Portrait
          caption="Hotel ops · hands-on"
          fallbackMeta="Save public/about-guitar.png to replace this placeholder."
          fallbackTitle="Photo 1"
          imgAlt="Pierre smiling on the job at the hotel"
          imgSrc="/about-guitar.png"
          revealDelay={0}
          tag="On-shift"
          title="Enjoying every part of the job"
        />
        <Portrait
          caption="Leadership retreat · 2024"
          fallbackMeta="Save public/about-hawaii.png to replace this placeholder."
          fallbackTitle="Photo 2"
          imgAlt="Pierre at the Hawaii leadership retreat"
          imgSrc="/about-hawaii.png"
          revealDelay={0.18}
          tag="Hawaii"
          title="The room where strategy gets made"
        />
      </div>

      <figure className="relative mx-auto mt-24 max-w-4xl text-center">
        <span
          aria-hidden="true"
          className="select-none font-bold leading-none text-accent-light/20"
          style={{
            fontSize: "clamp(6rem, 14vw, 12rem)",
            letterSpacing: "-0.08em",
          }}
        >
          &ldquo;
        </span>
        <blockquote className="-mt-6 text-2xl font-medium leading-[1.2] text-text-dark sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-text-dark via-accent-light to-text-dark bg-clip-text text-transparent">
            Solo or paired with AI, I research relentlessly and finish what I
            start.
          </span>
        </blockquote>
        <figcaption className="mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-accent-light">
          <span aria-hidden="true" className="h-px w-8 bg-accent-light/50" />
          — How I work
          <span aria-hidden="true" className="h-px w-8 bg-accent-light/50" />
        </figcaption>
      </figure>
    </div>
  );
}

function Portrait({
  caption,
  fallbackMeta,
  fallbackTitle,
  imgAlt,
  imgSrc,
  revealDelay = 0,
  tag,
  title,
}: {
  caption: string;
  fallbackMeta: string;
  fallbackTitle: string;
  imgAlt: string;
  imgSrc: string;
  revealDelay?: number;
  tag: string;
  title: string;
}) {
  const reduce = useReducedMotion();
  return (
    <figure className="flex flex-col gap-4">
      {/* clip-path scrubbed reveal: photo opens from a thin horizontal slit
          (40% top + 40% bottom) to fully visible as the section enters view */}
      <motion.div
        className="aspect-[3/4] overflow-hidden rounded-2xl"
        initial={reduce ? false : { clipPath: "inset(45% 0% 45% 0% round 16px)" }}
        transition={{
          delay: revealDelay,
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ amount: 0.3, once: true }}
        whileInView={
          reduce ? undefined : { clipPath: "inset(0% 0% 0% 0% round 16px)" }
        }
      >
        <PhotoSlot
          alt={imgAlt}
          className="h-full w-full"
          fallbackMeta={fallbackMeta}
          fallbackTitle={fallbackTitle}
          fit="cover"
          src={imgSrc}
        />
      </motion.div>
      <motion.figcaption
        initial={reduce ? false : { opacity: 0, y: 8 }}
        transition={{
          delay: revealDelay + 0.45,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ amount: 0.3, once: true }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
          {tag}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-text-dark">{title}</h3>
        <p className="mt-1 text-sm text-text-dark-muted">{caption}</p>
      </motion.figcaption>
    </figure>
  );
}

function Stack() {
  return (
    <div>
      <SectionHeader
        align="center"
        description="Cloud AI, local AI, the web stack to ship them, and the orchestration glue that ties everything together."
        eyebrow="My stack"
        title="What I use to ship."
      />

      <div className="mt-12">
        <BentoStack />
      </div>
    </div>
  );
}

function LightSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={className} id={id}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
