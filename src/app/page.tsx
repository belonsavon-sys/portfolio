"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AnimatedCounter,
  BentoStack,
  Button,
  CursorHalo,
  GreetingRotator,
  HeroAvatarFrame,
  LightGlassCard,
  LiveStatusBadge,
  NowReading,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SelectedWork,
  SiteFooter,
  SplitText,
  VelocityMarquee,
} from "@/components";
import { useRef, type ReactNode } from "react";

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
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <Hero onOpenAbout={scrollToAbout} />

      <LightSection className="pt-20 sm:pt-28" id="about">
        <AboutBand />
      </LightSection>

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

      <NowReading
        sections={[
          { id: "about", index: "01", label: "About" },
          { id: "outcomes", index: "02", label: "Outcomes" },
          { id: "work", index: "03", label: "Selected work" },
          { id: "beyond", index: "04", label: "Beyond the code" },
          { id: "stack", index: "05", label: "My stack" },
        ]}
      />
    </main>
  );
}

function scrollToAbout() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("about");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AboutBand() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,1.6fr)] lg:gap-12">
      <SectionHeader
        description="The two-minute version. The systems came from somebody who had to make payroll, not from a slide deck."
        eyebrow="About"
        size="md"
        title="I ship what others would plan."
      />
      <div className="grid gap-5 text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
        {aboutParagraphs.map((paragraph, index) => (
          <p
            className={
              index === 0
                ? "text-xl font-medium leading-8 text-text-light sm:text-2xl sm:leading-9"
                : undefined
            }
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
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

  // Mouse-parallax for the stacked name. Each line responds with a
  // different magnitude — Pierre least, Savon. most — so the name feels
  // like it's catching a breeze when the cursor moves over the hero.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, {
    damping: 30,
    mass: 0.5,
    stiffness: 180,
  });
  const springMouseY = useSpring(mouseY, {
    damping: 30,
    mass: 0.5,
    stiffness: 180,
  });
  const line1X = useTransform(springMouseX, (v) => v * 8);
  const line1Y = useTransform(springMouseY, (v) => v * 4);
  const line2X = useTransform(springMouseX, (v) => v * 18);
  const line2Y = useTransform(springMouseY, (v) => v * 9);
  const line3X = useTransform(springMouseX, (v) => v * 30);
  const line3Y = useTransform(springMouseY, (v) => v * 14);

  const onHeroMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(Math.max(-1, Math.min(1, nx)));
    mouseY.set(Math.max(-1, Math.min(1, ny)));
  };
  const onHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.7, ease: easeOut },
        };

  return (
    <section
      className="relative overflow-hidden"
      onMouseLeave={onHeroMouseLeave}
      onMouseMove={onHeroMouseMove}
      ref={heroRef}
    >
      <CursorHalo />

      {/* Floating accent labels — desktop-only decoration */}
      <FloatingHeroLabels />

      <motion.div
        className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-16 sm:px-6 sm:py-20 lg:gap-x-8 lg:py-24"
        style={reduce ? undefined : { opacity: heroOpacity, y: heroY }}
      >
        {/* TOP STRIP — editorial kicker pinned to the top-left margin */}
        <motion.div
          className="col-span-12 flex flex-wrap items-center gap-3 self-start"
          {...fadeUp(0.04)}
        >
          <LiveStatusBadge label="Currently shipping · Atlas v3" />
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
            01 / Welcome
          </span>
        </motion.div>

        {/* LEFT — oversized typographic name + tagline + CTAs (cols 1–7 on lg) */}
        <div className="col-span-12 self-center lg:col-span-7">
          {/* Greeting (rotates EN · ES · IT) */}
          <motion.p
            className="font-mono text-base font-medium tracking-tight text-text-light/55 sm:text-lg"
            {...fadeUp(0.1)}
          >
            <GreetingRotator />
          </motion.p>

          {/* MASSIVE name — stacked across 3 lines, hard-bound left, breaks
              the grid on lg. Each line gets its own mouse-parallax
              magnitude (Pierre least, Savon. most) so the name catches a
              breeze when the cursor passes over the hero. */}
          <h1
            className="mt-2 font-semibold text-text-light"
            style={{
              fontSize: "clamp(3rem, 12vw, 10.5rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.86,
            }}
          >
            <motion.span
              className="block will-change-transform"
              style={reduce ? undefined : { x: line1X, y: line1Y }}
            >
              <SplitText charDelay={0.025} delay={0.18} duration={0.85}>
                Pierre
              </SplitText>
            </motion.span>
            <motion.span
              className="block will-change-transform"
              style={reduce ? undefined : { x: line2X, y: line2Y }}
            >
              <SplitText charDelay={0.025} delay={0.36} duration={0.85}>
                Belon
              </SplitText>
            </motion.span>
            <motion.span
              className="gradient-shift block will-change-transform"
              style={reduce ? undefined : { x: line3X, y: line3Y }}
            >
              <SplitText charDelay={0.025} delay={0.52} duration={0.85}>
                Savon.
              </SplitText>
            </motion.span>
          </h1>

          {/* Mono kicker right below the name — editorial role tag */}
          <motion.div
            className="mt-8 flex items-center gap-3"
            {...fadeUp(0.36)}
          >
            <span
              aria-hidden="true"
              className="h-px w-10 origin-left bg-accent"
            />
            <span className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
              AI for operations-heavy businesses
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9"
            {...fadeUp(0.42)}
          >
            The hotel I was hired to supervise now runs on AI systems I built.
            At Blackdoor, I co-architect Atlas — a multi-level agent harness
            shipping real products end-to-end.
          </motion.p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
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
                  delay: 0.5 + index * 0.1,
                  duration: 0.55,
                  ease: easeOut,
                }}
              >
                {cta}
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — avatar, justified to the right edge on lg (cols 8–12) */}
        <motion.div
          className="col-span-12 flex justify-center self-center lg:col-span-5 lg:justify-end"
          style={reduce ? undefined : { scale: avatarScale, y: avatarY }}
        >
          <HeroAvatarFrame onClick={onOpenAbout} src="/avatar-photo.png" />
        </motion.div>

        {/* METRIC RIBBON — full-width, left-aligned, 01/02/03 editorial numbering */}
        <motion.div
          className="col-span-12 mt-6 grid gap-x-6 gap-y-8 border-t border-border-light pt-10 sm:grid-cols-3"
          style={
            reduce ? undefined : { opacity: bottomZoneOpacity, y: bottomZoneY }
          }
        >
          {heroMetrics.map((m, index) => (
            <motion.div
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              className="text-left"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              key={m.label}
              transition={{
                delay: 0.62 + index * 0.1,
                duration: 0.6,
                ease: easeOut,
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                {`0${index + 1}`} · {m.label}
              </p>
              <p className="mt-3 font-semibold tracking-tight text-text-light"
                 style={{
                   fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                   letterSpacing: "-0.035em",
                   lineHeight: 1,
                 }}
              >
                {m.valuePrefix ? (
                  <span className="font-mono text-base text-text-light/40 sm:text-lg">
                    {m.valuePrefix}
                  </span>
                ) : null}
                <AnimatedCounter
                  delay={index * 0.1}
                  suffix={m.suffix}
                  to={m.to}
                />
              </p>
              <p className="mt-3 text-xs leading-5 text-text-light-muted">
                {m.context}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CHIP STRIP — left-aligned */}
        <motion.div
          className="col-span-12 flex flex-wrap items-center gap-2.5"
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
                delay: 0.92 + index * 0.08,
                duration: 0.55,
                ease: easeOut,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {role}
            </motion.span>
          ))}
        </motion.div>

        {/* SCROLL CUE — left-aligned, anchored to lower-left margin */}
        <motion.a
          aria-label="Scroll to live status"
          className="group/cue col-span-12 hidden flex-row items-center gap-3 self-end sm:flex"
          href="#work"
          {...fadeUp(1.1)}
        >
          <span className="relative h-px w-10 overflow-hidden bg-gradient-to-r from-border-light via-accent to-transparent transition-colors duration-200 group-hover/cue:via-accent">
            <span className="scroll-cue-dot absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-light-muted/60 transition-colors duration-200 group-hover/cue:text-accent">
            Scroll
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}

function MetricsBand() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-tied exit fade for the metric rows — kept simple in the
  // typographic redesign: rows fade out together as the section
  // exits, no per-column scatter.
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: sectionRef,
  });
  const exitOpacity = useTransform(scrollYProgress, [0.6, 0.95], [1, 0]);

  return (
    <div className="relative" ref={sectionRef}>
      <SectionHeader
        description="Six numbers from systems still running today — each one measured against the manual workflow it replaced."
        eyebrow="Outcomes"
        size="md"
        title="Shipped to production. Measured by what changed."
      />

      {/* Typographic showcase — each metric is a full-width row with a
          MASSIVE number on the left and label/index on the right.
          Reads like a spec sheet / annual report spread. */}
      <motion.ol
        className="mt-12 grid divide-y divide-border-light border-y border-border-light"
        style={reduce ? undefined : { opacity: exitOpacity }}
      >
        {detailedMetrics.map((metric, index) => (
          <MetricRow index={index} key={metric.label} metric={metric} />
        ))}
      </motion.ol>
    </div>
  );
}

function MetricRow({
  index,
  metric,
}: {
  index: number;
  metric: (typeof detailedMetrics)[number];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="group relative grid grid-cols-12 items-baseline gap-4 py-8 sm:py-10 lg:py-12"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.05,
        duration: 0.55,
        ease: easeOut,
      }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      {/* LEFT 7 — massive number */}
      <div className="col-span-12 lg:col-span-7">
        <p
          className="font-bold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 7rem)",
            letterSpacing: "-0.055em",
            lineHeight: 0.88,
          }}
        >
          <AnimatedCounter suffix={metric.suffix} to={metric.to} />
        </p>
      </div>

      {/* RIGHT 5 — label + index */}
      <div className="col-span-12 flex items-baseline gap-4 lg:col-span-5 lg:justify-end">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
          {`0${index + 1}`}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light lg:w-12 lg:flex-none" />
        <p className="max-w-xs text-base font-medium leading-6 text-text-light sm:text-lg lg:text-right">
          {metric.label}
        </p>
      </div>

      {/* Hover accent — thin gradient line that draws across on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </motion.li>
  );
}

function BeyondTheCodeBand() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-28"
      id="beyond"
    >

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
    <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-8">
      {/* TOP — small editorial eyebrow */}
      <div className="col-span-12 flex flex-wrap items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
          B-side · beyond the code
        </span>
        <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted">
          03 / Welcome
        </span>
      </div>

      {/* LEFT — the manifesto. Huge typographic quote dominates the band. */}
      <div className="col-span-12 lg:col-span-8">
        <h2
          className="font-semibold leading-[0.92] tracking-tight text-text-dark"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            letterSpacing: "-0.045em",
          }}
        >
          More than
          <br />
          <span className="bg-gradient-to-r from-text-dark via-accent-light to-text-dark bg-clip-text text-transparent">
            engineering.
          </span>
        </h2>

        <ScrollProgressQuote />

        {/* Personal-spec strip — three field notes that ground the
            manifesto in concrete touchstones. */}
        <ul className="mt-12 grid gap-x-8 gap-y-6 border-t border-accent-light/20 pt-8 sm:grid-cols-3">
          {[
            {
              label: "Mode",
              value: "Mastery before execute",
            },
            {
              label: "Pair",
              value: "Solo or with AI",
            },
            {
              label: "Voice",
              value: "EN · ES · IT",
            },
          ].map((field) => (
            <li key={field.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                {field.label}
              </p>
              <p className="mt-2 text-base font-medium text-text-dark sm:text-lg">
                {field.value}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT — photos as taped-up field-note polaroids, tilted */}
      <div className="col-span-12 flex flex-row items-start justify-center gap-6 lg:col-span-4 lg:flex-col lg:items-end lg:gap-8">
        <FieldNote
          caption="Hotel ops · hands-on"
          fallbackMeta="Save public/about-guitar.png to replace this placeholder."
          fallbackTitle="Photo 1"
          imgAlt="Pierre smiling on the job at the hotel"
          imgSrc="/about-guitar.png"
          revealDelay={0}
          rotateDeg={-3}
          tag="On-shift"
          title="Enjoying every part of the job"
        />
        <FieldNote
          caption="Leadership retreat · 2024"
          fallbackMeta="Save public/about-hawaii.png to replace this placeholder."
          fallbackTitle="Photo 2"
          imgAlt="Pierre at the Hawaii leadership retreat"
          imgSrc="/about-hawaii.png"
          revealDelay={0.18}
          rotateDeg={2.5}
          tag="Hawaii"
          title="The room where strategy gets made"
        />
      </div>
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

function FieldNote({
  caption,
  fallbackMeta,
  fallbackTitle,
  imgAlt,
  imgSrc,
  revealDelay = 0,
  rotateDeg,
  tag,
  title,
}: {
  caption: string;
  fallbackMeta: string;
  fallbackTitle: string;
  imgAlt: string;
  imgSrc: string;
  revealDelay?: number;
  rotateDeg: number;
  tag: string;
  title: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="relative flex w-44 flex-col gap-2 sm:w-52 lg:w-60"
      initial={
        reduce ? false : { opacity: 0, rotate: 0, y: 18 }
      }
      style={{ transformOrigin: "top center" }}
      transition={{
        delay: revealDelay,
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={
        reduce ? undefined : { opacity: 1, rotate: rotateDeg, y: 0 }
      }
    >
      {/* Taped-up pin — small accent square anchored above the photo */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[-10px] z-10 h-3 w-8 -translate-x-1/2 rounded-sm bg-accent-light/40 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      />
      <div className="overflow-hidden rounded-lg border border-accent-light/15 bg-bg-light p-2 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.55)]">
        <div className="aspect-[4/5] overflow-hidden rounded">
          <PhotoSlot
            alt={imgAlt}
            className="h-full w-full"
            fallbackMeta={fallbackMeta}
            fallbackTitle={fallbackTitle}
            fit="cover"
            src={imgSrc}
          />
        </div>
        <figcaption className="mt-2 px-1 pb-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            {tag}
          </p>
          <p className="mt-1 text-xs font-semibold text-text-light">{title}</p>
          <p className="mt-0.5 text-[11px] text-text-light-muted">{caption}</p>
        </figcaption>
      </div>
    </motion.figure>
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
