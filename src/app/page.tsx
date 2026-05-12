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
  NowReading,
  ParallaxBackdrop,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SelectedWork,
  SiteFooter,
  SplitText,
  VelocityMarquee,
} from "@/components";
import { useRef, useState, type ReactNode } from "react";

const aboutParagraphs = [
  "I'm an engineer who learned to ship by automating the business I was hired to run.",
  "Two years ago I supervised a hotel. Today, the AI systems running it are systems I built — every guest message, every inspection, every automated workflow. In parallel, at Blackdoor (the company I co-founded), I co-architect Atlas: a multi-level autonomous agent harness that ships real products end-to-end.",
  'When a problem enters my scope, I take it to mastery before I execute. Solo or paired with AI, I research relentlessly and finish what I start. My divergent thinking catches what specialists miss — and turns "we should automate that" into "it\'s already running."',
  "Trilingual EN · ES · IT. Based in Ocean Shores, WA — open to remote roles and freelance projects.",
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const heroMetrics = [
  {
    context: "ThePrivateHotels · live since Apr 2024",
    label: "Guest reply time",
    suffix: " min",
    to: 3,
    valuePrefix: "from 48 hrs → ",
  },
  {
    context: "Ops manual → QA system, ThePrivateHotels",
    label: "Pages digitized",
    suffix: "+",
    to: 100,
    valuePrefix: "",
  },
  {
    context: "Game · Budget · Project mgmt — Blackdoor",
    label: "Atlas products",
    suffix: " live",
    to: 3,
    valuePrefix: "",
  },
];

const detailedMetrics = [
  { label: "Guest-reply lag eliminated", suffix: " hrs", to: 48 },
  { label: "Saved per drafted reply", suffix: "–20 min", to: 15 },
  { label: "Inventory items managed", suffix: "+", to: 100 },
  { label: "Staff trained on the stack", suffix: "", to: 6 },
  { label: "Error-free months in QuickBooks", suffix: "", to: 6 },
  { label: "Native languages", suffix: "", to: 3 },
];

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <Hero onOpenAbout={() => setAboutOpen(true)} />

      <LightSection className="pt-16 sm:pt-24" id="outcomes">
        <MetricsBand />
      </LightSection>

      <CurtainWipe />

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

      <BeyondTheCodeBand />

      <VelocityMarquee
        items={["Research", "Build", "Ship", "Measure", "Iterate"]}
        tone="light"
      />

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

      <NowReading
        sections={[
          { id: "outcomes", index: "01", label: "Outcomes" },
          { id: "work", index: "02", label: "Selected work" },
          { id: "beyond", index: "03", label: "Beyond the code" },
          { id: "stack", index: "04", label: "My stack" },
        ]}
      />
    </main>
  );
}

function FloatingHeroLabels() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Single scroll window for the whole hero (start of element meeting
  // viewport bottom -> end of element meeting viewport top). Each label
  // takes a different slice for parallax depth + a different fade-out
  // band so they stagger out as the hero exits.
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: wrapperRef,
  });

  // Per-label parallax y — slower y range = "further back".
  const ySlow = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yMid = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yFast = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const yVeryFast = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  // Per-label fade-out: labels exit over a 0.20 progress band each,
  // staggered so the top-left label exits first and the bottom-right
  // label exits last. (On initial load the hero is at ~0.5 progress so
  // labels are visible at full opacity.)
  const opTL = useTransform(scrollYProgress, [0.5, 0.7], [0.85, 0]);
  const opTR = useTransform(scrollYProgress, [0.55, 0.75], [0.85, 0]);
  const opBL = useTransform(scrollYProgress, [0.6, 0.8], [0.85, 0]);
  const opBR = useTransform(scrollYProgress, [0.65, 0.85], [0.85, 0]);

  const labels = [
    {
      className:
        "left-[6%] top-[18%] -rotate-2 sm:left-[8%] sm:top-[22%] lg:left-[10%] lg:top-[26%]",
      opacity: opTL,
      parallaxY: ySlow,
      text: "AI Engineer",
    },
    {
      className:
        "right-[5%] top-[14%] rotate-3 sm:right-[8%] sm:top-[18%] lg:right-[9%] lg:top-[24%]",
      opacity: opTR,
      parallaxY: yFast,
      text: "Atlas · Multi-agent harness",
    },
    {
      className:
        "left-[4%] bottom-[16%] -rotate-3 sm:left-[7%] sm:bottom-[20%] lg:left-[8%] lg:bottom-[28%]",
      opacity: opBL,
      parallaxY: yMid,
      text: "EN · ES · IT",
    },
    {
      className:
        "right-[5%] bottom-[14%] rotate-2 sm:right-[8%] sm:bottom-[18%] lg:right-[8%] lg:bottom-[24%]",
      opacity: opBR,
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
      {labels.map((label, index) => (
        // Outer wrapper handles the one-shot mount fade-in. Inner span
        // owns the scroll-driven parallax + exit opacity. CSS multiplies
        // both opacities so the composed value reads as: 0 → 0.85 on
        // mount (staggered), hold at 0.85 through the hero, then fade
        // to 0 as the hero scrolls out.
        <motion.span
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          className={`absolute ${label.className}`}
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          key={label.text}
          transition={{
            delay: 0.9 + index * 0.12,
            duration: 0.7,
            ease: easeOut,
          }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent backdrop-blur-md"
            style={
              reduce
                ? {
                    boxShadow:
                      "0 8px 24px -10px rgba(41,110,214,0.25), 0 1px 0 0 rgba(255,255,255,0.9) inset",
                    opacity: 0.85,
                  }
                : {
                    boxShadow:
                      "0 8px 24px -10px rgba(41,110,214,0.25), 0 1px 0 0 rgba(255,255,255,0.9) inset",
                    opacity: label.opacity,
                    y: label.parallaxY,
                  }
            }
          >
            <span className="h-1 w-1 rounded-full bg-accent" />
            {label.text}
          </motion.span>
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
  // Composite scroll-exit choreography: the hero doesn't fade as one
  // block. Top zone (avatar, title, badge, divider) lifts up FAST and
  // shrinks; bottom zone (metrics, chip rail) drifts DOWN, lags behind,
  // and fades on its own band. The two trajectories diverge so the
  // hero scatters open like a curtain rather than fading flat.
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

  // Avatar shrinks + drifts up faster than the wrapper.
  const avatarScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.82]);
  const avatarY = useTransform(scrollYProgress, [0, 0.55], [0, -80]);

  // Bottom zone (metrics + chips) lags BEHIND the wrapper's upward y
  // (composite y = wrapper y + this y → net drifts down).
  const bottomZoneY = useTransform(scrollYProgress, [0, 0.55], [0, 96]);
  const bottomZoneOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55],
    [1, 0.9, 0],
  );

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
        {/* Centered orb — outer div is sized to the orb and centered, so
            the inner orb-drift transform doesn't fight horizontal
            centering. */}
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2">
          <div className="orb-drift-a h-full w-full rounded-full bg-accent/55 blur-3xl" />
        </div>
        <div className="orb-drift-b absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/45 blur-3xl" />
        <div className="orb-drift-c absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/40 blur-3xl" />
      </ParallaxBackdrop>

      {/* Floating accent labels — desktop-only decoration */}
      <FloatingHeroLabels />

      <motion.div
        className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8"
        style={reduce ? undefined : { opacity: heroOpacity, y: heroY }}
      >
        <motion.div
          style={reduce ? undefined : { scale: avatarScale, y: avatarY }}
        >
          <HeroAvatarFrame onClick={onOpenAbout} src="/avatar-photo.png" />
        </motion.div>

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
          The hotel I was hired to supervise now runs on AI systems I built.
          At Blackdoor, I co-architect Atlas — a multi-level agent harness
          shipping real products end-to-end.
        </motion.p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {[
            <Button
              arrow
              className="!px-8 !py-4 !text-base"
              href="/ai"
              key="see-work"
            >
              See the work
            </Button>,
            <Button
              className="!px-8 !py-4 !text-base"
              href="/resume"
              key="read-resume"
              variant="ghost"
            >
              Read the résumé
            </Button>,
          ].map((cta, index) => (
            <motion.div
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              key={cta.key}
              transition={{
                delay: 0.32 + index * 0.1,
                duration: 0.55,
                ease: easeOut,
              }}
            >
              {cta}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
          style={
            reduce ? undefined : { opacity: bottomZoneOpacity, y: bottomZoneY }
          }
        >
          {heroMetrics.map((m, index) => (
            <motion.div
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              key={m.label}
              transition={{
                delay: 0.44 + index * 0.1,
                duration: 0.6,
                ease: easeOut,
              }}
            >
              <LightGlassCard
                className="group relative px-5 py-5 text-left"
                hoverable={false}
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
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-2.5"
          style={
            reduce ? undefined : { opacity: bottomZoneOpacity, y: bottomZoneY }
          }
        >
          {[
            "EN · ES · IT",
            "Remote-first",
            "Ocean Shores, WA",
          ].map((role, index) => (
            <motion.span
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              className="group inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/65 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-text-light backdrop-blur-md transition-[border-color,background] duration-200 hover:border-accent hover:bg-white/85"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              key={role}
              transition={{
                delay: 0.55 + index * 0.08,
                duration: 0.55,
                ease: easeOut,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {role}
            </motion.span>
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
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-tied scatter for the 6 metric cards on the way out of the
  // section. Each column drifts in a different direction in the back
  // half of progress, mirroring the hero's parting-curtain feel —
  // column 0 lifts and drifts left, column 1 just fades, column 2
  // drifts right.
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: sectionRef,
  });
  const scatterLeftX = useTransform(scrollYProgress, [0.55, 1], [0, -90]);
  const scatterRightX = useTransform(scrollYProgress, [0.55, 1], [0, 90]);
  const scatterOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.95],
    [1, 0],
  );

  return (
    <div
      className="relative grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)]"
      ref={sectionRef}
    >
      {/* Ambient corner glow on the left side */}
      <div
        aria-hidden="true"
        className="orb-drift-b pointer-events-none absolute -left-32 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
      />
      <SectionHeader
        description="Six numbers from systems still running today — each one measured against the manual workflow it replaced."
        eyebrow="Outcomes"
        size="md"
        title="Shipped to production. Measured by what changed."
      />

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {detailedMetrics.map((metric, index) => {
          // 3-col layout (lg): col 0,1,2 → scatter left / none / right.
          const col = index % 3;
          const exitX =
            col === 0 ? scatterLeftX : col === 2 ? scatterRightX : undefined;
          return (
          <ScrollReveal delay={index * 0.05} direction="up" key={metric.label}>
            <motion.div
              style={
                reduce
                  ? undefined
                  : exitX
                    ? { opacity: scatterOpacity, x: exitX }
                    : { opacity: scatterOpacity }
              }
            >
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
              <motion.span
                aria-hidden="true"
                className="mt-4 block h-px w-12 origin-left bg-accent/40 transition-transform duration-500 group-hover:scale-x-[2]"
                initial={
                  reduce ? false : { clipPath: "inset(0 100% 0 0)" }
                }
                transition={{
                  delay: 0.22 + index * 0.05,
                  duration: 0.75,
                  ease: easeOut,
                }}
                viewport={{ amount: 0.3, once: true }}
                whileInView={
                  reduce ? undefined : { clipPath: "inset(0 0 0 0)" }
                }
              />
            </div>
            </motion.div>
          </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

function BeyondTheCodeBand() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-28"
      id="beyond"
    >
      <ParallaxBackdrop>
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2">
          <div className="orb-drift-a h-full w-full rounded-full bg-accent/35 blur-3xl" />
        </div>
        <div className="orb-drift-b absolute bottom-[-8rem] right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/30 blur-3xl" />
        <div className="orb-drift-c absolute bottom-[-8rem] left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/28 blur-3xl" />
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
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scatter on scroll-out: the two portraits split outward as you scroll
  // past the dark band. Quote stays anchored.
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: sectionRef,
  });
  const exitOpacity = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);
  const exitLeft = useTransform(scrollYProgress, [0.55, 1], [0, -100]);
  const exitRight = useTransform(scrollYProgress, [0.55, 1], [0, 100]);

  return (
    <div ref={sectionRef}>
      <SectionHeader
        align="center"
        description="The habit of taking problems to mastery before executing runs through everything I do — from agent harness design to the accounting books I keep."
        eyebrow="Beyond the code"
        title="More than engineering."
        tone="dark"
      />

      <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2 sm:gap-10">
        <motion.div
          style={reduce ? undefined : { opacity: exitOpacity, x: exitLeft }}
        >
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
        </motion.div>
        <motion.div
          style={reduce ? undefined : { opacity: exitOpacity, x: exitRight }}
        >
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
        </motion.div>
      </div>

      <ScrollProgressQuote />
    </div>
  );
}

function ScrollProgressQuote() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // The quote enters reveal at "start 80%" (top edge crosses 80% viewport)
  // and finishes by "start 20%" — so the reveal happens over the first
  // ~60% of the quote's vertical scroll journey, well before it exits.
  const { scrollYProgress } = useScroll({
    offset: ["start 80%", "start 20%"],
    target: ref,
  });

  const quote =
    "Solo or paired with AI, I research relentlessly and finish what I start.";
  const words = quote.split(" ");

  return (
    <figure className="relative mx-auto mt-24 max-w-4xl text-center" ref={ref}>
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
      <blockquote className="-mt-6 text-2xl font-medium leading-[1.25] text-text-dark sm:text-4xl lg:text-5xl">
        {words.map((word, index) => (
          <ScrollProgressWord
            isLast={index === words.length - 1}
            key={`${word}-${index}`}
            progress={scrollYProgress}
            reduce={reduce}
            // Spread the word reveal across the first 75% of progress so
            // every word is visible well before the quote scrolls past.
            start={(index / words.length) * 0.75}
            word={word}
          />
        ))}
      </blockquote>
      <figcaption className="mt-8 inline-flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-accent-light">
        <span aria-hidden="true" className="h-px w-8 bg-accent-light/50" />
        — How I work
        <span aria-hidden="true" className="h-px w-8 bg-accent-light/50" />
      </figcaption>
    </figure>
  );
}

function ScrollProgressWord({
  isLast,
  progress,
  reduce,
  start,
  word,
}: {
  isLast: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean | null;
  start: number;
  word: string;
}) {
  const opacity = useTransform(progress, [start, start + 0.18], [0.18, 1]);

  if (reduce) {
    return (
      <span>
        {word}
        {!isLast ? " " : ""}
      </span>
    );
  }

  return (
    <motion.span style={{ opacity }}>
      {word}
      {!isLast ? " " : ""}
    </motion.span>
  );
}

function CurtainWipe() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative my-4 h-1 overflow-hidden sm:my-6"
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_24px_rgba(41,110,214,0.45)]"
        initial={reduce ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        viewport={{ amount: 0.5, once: true }}
        whileInView={{ x: "100%" }}
      />
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
        description="The tools I reach for first — chosen because they get out of the way once the work starts."
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
