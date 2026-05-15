"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AnimatedCounter,
  BentoStack,
  Button,
  ChapterRail,
  GlitchTitle,
  GreetingRotator,
  HeroSplitTitle,
  LiveStatusBadge,
  PhotoSlot,
  SectionDivider,
  SelectedWork,
  SiteFooter,
  TextScramble,
} from "@/components";
import { useEffect, useRef, useState, type ReactNode } from "react";

const aboutParagraphs = [
  "I'm an engineer who learned to ship by automating the business I was hired to run.",
  "Two years ago I supervised a hotel. Today, the AI systems running it are systems I built — every guest message, every inspection, every automated workflow. In parallel, at Blackdoor (the company I co-founded), I co-architect Atlas: a multi-level autonomous agent harness that ships real products end-to-end.",
  'When a problem enters my scope, I take it to mastery before I execute. Solo or paired with AI, I research relentlessly and finish what I start. My divergent thinking catches what specialists miss — and turns "we should automate that" into "it\'s already running."',
  "Trilingual EN · ES · IT. Based in Ocean Shores, WA — open to remote roles and freelance projects.",
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Live-shipped pulse — reads NEXT_PUBLIC_BUILD_TIME +
 * NEXT_PUBLIC_BUILD_SHA captured at build time and renders them as
 * the hero's status badge. Each redeploy advances both values, so
 * the home page top strip feels alive instead of carrying a
 * hardcoded "currently shipping" label. Falls back to the Atlas v3
 * label in dev when the build vars are absent.
 */
function HeroLiveShipped() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const [now, setNow] = useState<number | null>(null);

  // Defer relative-time formatting to the client to avoid SSR/CSR
  // mismatch. Re-render every 30s so the "X ago" stays current. The
  // initial setNow IS a cascading render — that's the point, so the
  // first paint matches what the server returned, then the client
  // upgrades to live time.
  useEffect(() => {
    if (!buildTime) return;

    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [buildTime]);

  if (!buildTime) {
    return <LiveStatusBadge label="Currently shipping · Atlas v3" />;
  }

  const buildDate = new Date(buildTime);
  const shortSha = buildSha ? buildSha.slice(0, 7) : "dev";
  const relativeTime = now ? formatTimeAgo(buildDate, now) : "just now";

  return (
    <LiveStatusBadge
      label={`Shipped ${relativeTime} · ${shortSha}`}
    />
  );
}

function formatTimeAgo(then: Date, now: number) {
  const seconds = Math.max(0, Math.round((now - then.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} wk ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.round(days / 365);
  return `${years} yr ago`;
}

type DetailedMetric = {
  context: string;
  fromLabel?: string;
  href?: string;
  label: string;
  live: boolean;
  suffix: string;
  to: number;
};

const detailedMetrics: DetailedMetric[] = [
  {
    context: "ThePrivateHotels · live since Apr 2024",
    fromLabel: "→ < 3 min now",
    href: "/business#communications",
    label: "Guest-reply lag eliminated",
    live: true,
    suffix: " hrs",
    to: 48,
  },
  {
    context: "ThePrivateHotels · per-reply average",
    href: "/business#communications",
    label: "Saved per drafted reply",
    live: true,
    suffix: "–20 min",
    to: 15,
  },
  {
    context: "ThePrivateHotels · digital QA system",
    href: "/business#process",
    label: "Inventory items managed",
    live: true,
    suffix: "+",
    to: 100,
  },
  {
    context: "ThePrivateHotels · 2 teams · 6 staff",
    href: "/business#training",
    label: "Staff trained on the stack",
    live: true,
    suffix: "",
    to: 6,
  },
  {
    context: "ThePrivateHotels · Finance, 6 months in 2024",
    href: "/business#finance",
    label: "Error-free months in QuickBooks",
    live: false,
    suffix: "",
    to: 6,
  },
  {
    context: "EN · ES · IT · all native",
    href: "/resume",
    label: "Native languages",
    live: true,
    suffix: "",
    to: 3,
  },
];

// schema.org ItemList of Pierre's Selected Work — gives search
// engines a structured catalog of the 4 projects shown on the
// home page Work band. Mirrors the SelectedWork component data;
// only the home page emits this LD (the component renders the
// same projects in HTML).
const selectedWorkLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      item: {
        "@type": "CreativeWork",
        about: "AI guest communications chatbot trained on company data",
        creator: { "@type": "Person", name: "Pierre Belon Savon" },
        datePublished: "2024",
        name: "Guest Communications Chatbot",
        publisher: { "@type": "Organization", name: "ThePrivateHotels" },
      },
      position: 1,
    },
    {
      "@type": "ListItem",
      item: {
        "@type": "CreativeWork",
        about: "100+ page operations manual digitized into a QA inspection system",
        creator: { "@type": "Person", name: "Pierre Belon Savon" },
        datePublished: "2024",
        name: "Manual → Auditable QA System",
        publisher: { "@type": "Organization", name: "ThePrivateHotels" },
      },
      position: 2,
    },
    {
      "@type": "ListItem",
      item: {
        "@type": "SoftwareApplication",
        about: "Multi-level autonomous agent harness shipping real products",
        applicationCategory: "DeveloperApplication",
        creator: { "@type": "Organization", name: "Blackdoor" },
        datePublished: "2025",
        name: "Atlas — Agent Architecture",
      },
      position: 3,
    },
    {
      "@type": "ListItem",
      item: {
        "@type": "CreativeWork",
        about: "Zapier + Guesty + Twilio orchestration replacing manual coordination",
        creator: { "@type": "Person", name: "Pierre Belon Savon" },
        datePublished: "2024",
        name: "Connected Automation Layer",
        publisher: { "@type": "Organization", name: "ThePrivateHotels" },
      },
      position: 4,
    },
  ],
  name: "Selected Work — Pierre Belon Savon",
  numberOfItems: 4,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(selectedWorkLd) }}
        type="application/ld+json"
      />
      <Hero />

      <LightSection className="pt-20 sm:pt-28" id="about">
        <AboutBand />
      </LightSection>

      <LightSection className="pt-16 sm:pt-24" id="outcomes">
        <MetricsBand />
      </LightSection>

      <CurtainWipe />

      <LightSection className="relative pb-12 pt-8 sm:pb-16 sm:pt-12" id="work">
        <span aria-hidden="true" className="glitch-bar" />
        <GlitchTitle
          chapter="03"
          eyebrow="Selected work"
          meta="// 4 cards · 3 live"
          title="What I've shipped."
        />

        <div className="mt-8">
          <SelectedWork />
        </div>
      </LightSection>

      <LightSection className="py-20 sm:py-24" id="stack">
        <Stack />
      </LightSection>

      <SectionDivider direction="light-to-dark" />

      <SiteFooter />

      <ChapterRail
        sections={[
          { id: "about", index: "01", label: "About" },
          { id: "outcomes", index: "02", label: "Outcomes" },
          { id: "work", index: "03", label: "Selected work" },
          { id: "stack", index: "04", label: "My stack" },
        ]}
      />
    </main>
  );
}

/**
 * Auto-computed "N years building in production" stat — anchors the
 * About attribution with a fact that updates itself. Anchored to
 * 2020 (when Pierre started shipping in production); refreshes on
 * every deploy via the rendered year.
 */

function AboutBand() {
  const years = Math.max(1, new Date().getFullYear() - 2020);
  const reduce = useReducedMotion();

  const career: { live: boolean; note: string; year: string }[] = [
    { live: false, note: "started shipping in production", year: "2020" },
    { live: false, note: "took over hotel operations", year: "2022" },
    { live: false, note: "hotel ops fully digitized + AI-driven", year: "2024" },
    { live: false, note: "co-founded Blackdoor · Atlas v3", year: "2025" },
    { live: true, note: "shipping under PR review", year: "now" },
  ];

  return (
    <div
      className="relative"
    >
      <span aria-hidden="true" className="glitch-bar" />

      <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
        {/* LEFT — bio content. Replaces the prior fake-terminal session
            ("$ whoami / $ cat thesis.md / $ history / $ cat methods.md")
            since this section is the human one and shouldn't read as
            another shell window. */}
        <div className="col-span-12 lg:col-span-8">
          {/* Eyebrow */}
          <p className="font-mono text-[12px] text-accent">
            about — 01
          </p>

          {/* Thesis quote, set as the section's display headline */}
          <h2
            className="auto-glitch mt-4 text-text-light"
            style={{
              fontFamily:
                "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "clamp(2rem, 5.5vw, 4rem)",
              fontVariationSettings: '"wdth" 92, "opsz" 96',
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
            }}
          >
            <span aria-hidden="true" className="text-accent-light/70">
              &ldquo;
            </span>
            <TextScramble
              durationMs={1300}
              stepMs={50}
              text="I ship what others would plan."
            />
            <span aria-hidden="true" className="text-accent-light/70">
              &rdquo;
            </span>
          </h2>

          {/* Role / location byline — editorial italic, no caps */}
          <p className="mt-5 font-mono text-[13px] text-text-light-muted">
            <span className="text-text-light">pierre belon savon</span>, ai engineer, co-founder — ocean shores, wa
          </p>

          {/* Accent divider */}
          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-[2px] w-12 bg-accent" />
            <span aria-hidden="true" className="h-px flex-1 bg-text-light/15" />
          </div>

          {/* Bio prose */}
          <div className="mt-8 max-w-[60ch] space-y-5 text-[1.02rem] leading-relaxed text-text-light">
            {aboutParagraphs.map((paragraph, i) => (
              <motion.p
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                key={paragraph.slice(0, 20)}
                transition={{
                  delay: i * 0.06,
                  duration: 0.55,
                  ease: easeOut,
                }}
                viewport={{ amount: 0.2, once: true }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Career timeline — editorial, no pill, no ping */}
          <div className="mt-12">
            <p className="font-mono text-[11px] text-accent">
              career — {years} years
            </p>
            <ol className="mt-4 divide-y divide-accent/15 border-y border-accent/15">
              {career.map((entry) => (
                <li
                  className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-baseline gap-x-4 py-3.5 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-4"
                  key={entry.year}
                >
                  <span className="font-mono text-[11px] tabular-nums text-accent">
                    {entry.year}
                  </span>
                  <span className="text-text-light">{entry.note}</span>
                  {entry.live ? (
                    <span className="font-mono text-[12px] text-result-green">
                      — still shipping
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          {/* Trilingual identity banner */}
          <div className="mt-14">
            <span
              className="block text-text-light"
              style={{
                fontFamily:
                  "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 5.25rem)",
                fontVariationSettings: '"wdth" 85, "opsz" 96',
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.94,
              }}
            >
              EN
              <span className="px-2 text-accent/55">·</span>
              ES
              <span className="px-2 text-accent/55">·</span>
              IT
            </span>
            <p className="mt-3 text-sm text-text-light-muted">
              Three tongues. All native.
            </p>
          </div>

          {/* Read more — text links set as editorial captions */}
          <div className="mt-12 flex flex-col gap-2.5">
            {[
              {
                desc: "the receipts, one page, PDF",
                href: "/resume",
                label: "read my résumé",
              },
              {
                desc: "what's shipping this week",
                href: "/lab#now",
                label: "/lab#now",
              },
              {
                desc: "open the channels",
                href: "/resume#contact",
                label: "/resume#contact",
              },
            ].map((link) => (
              <a
                className="group/r inline-flex flex-wrap items-baseline gap-x-3 font-mono text-[12px] text-text-light transition-colors duration-200 hover:text-accent"
                href={link.href}
                key={link.href}
              >
                <span className="link-underline">{link.label}</span>
                <span className="not-italic text-text-light-muted/60">—</span>
                <span className="text-text-light-muted">{link.desc}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/r:translate-x-1"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — the polaroids that used to live in Beyond the Code.
            They belong here in the personal section. */}
        <div className="col-span-12 lg:col-span-4 lg:pt-14">
          <div className="flex flex-row items-start justify-center gap-6 lg:flex-col lg:items-end lg:gap-10">
            <FieldNote
              caption="Hotel ops · hands-on"
              fallbackMeta="Save public/about-guitar.png to replace this placeholder."
              fallbackTitle="Photo 1"
              imgAlt="Pierre smiling on the job at the hotel"
              imgSrc="/about-guitar.png"
              revealDelay={0.05}
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
              revealDelay={0.2}
              rotateDeg={2.5}
              tag="Hawaii"
              title="The room where strategy gets made"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-progress driven fade-out. Pushed late in the scroll window
  // so the hero stays fully legible while the reader is still reading
  // it — only fades when they're clearly past it.
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: heroRef,
  });
  const rawOpacity = useTransform(scrollYProgress, [0.7, 0.95], [1, 0]);
  const rawY = useTransform(scrollYProgress, [0.7, 0.95], [0, -40]);
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
      {/* GLITCH BAR — slow VHS-style scan line crosses the hero. */}
      {reduce ? null : <span aria-hidden="true" className="glitch-bar" />}

      {/* GRID OVERLAY — faint CAD-style accent grid behind the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(41,110,214,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,110,214,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 90%)",
        }}
      />

      {/* SCANLINE — slow vertical accent line sliding top→bottom. */}
      {reduce ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -z-10 h-px"
          style={{
            animation: "hero-scanline 9s linear infinite",
            background:
              "linear-gradient(to right, transparent, rgba(91,155,244,0.45), transparent)",
          }}
        />
      )}

      <motion.div
        className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:gap-10 sm:px-10 sm:py-32"
        style={reduce ? undefined : { opacity: heroOpacity, y: heroY }}
      >
        {/* LIVE STATUS BADGE — real build SHA + shipped-ago time. */}
        <motion.div {...fadeUp(0.04)}>
          <HeroLiveShipped />
        </motion.div>

        {/* GREETING — Georgia rotator with tilde flourishes. */}
        <motion.p
          className="flex items-center justify-center gap-4 text-text-light"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
            fontStyle: "",
            letterSpacing: "0.01em",
            lineHeight: 1.1,
          }}
          {...fadeUp(0.12)}
        >
          <span aria-hidden="true" className="text-accent/70">
            ~
          </span>
          <GreetingRotator />
          <span aria-hidden="true" className="text-accent/70">
            ~
          </span>
        </motion.p>

        {/* NAME — single line, TextScramble decode + blinking cursor +
            auto-glitch pulse + gradient-shift sweep. The wow stack. */}
        <h1
          className="auto-glitch whitespace-nowrap font-semibold text-text-light"
          style={{
            fontSize: "clamp(2rem, 7.5vw, 6rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="Pierre Belon Savon." />
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

        {/* Description — one tight centered sentence */}
        <motion.p
          className="max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9"
          {...fadeUp(0.42)}
        >
          I build AI for businesses that have to actually run. Most of
          it I shipped while running one.
        </motion.p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.div
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            transition={{ delay: 0.5, duration: 0.55, ease: easeOut }}
          >
            <Button
              arrow
              className="btn-techy !px-8 !py-4 !text-base"
              href="/lab#demos"
            >
              See what I&apos;ve built
            </Button>
          </motion.div>
          <motion.div
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            transition={{ delay: 0.6, duration: 0.55, ease: easeOut }}
          >
            <Button
              className="btn-techy !px-8 !py-4 !text-base"
              href="/resume"
              variant="ghost"
            >
              Read my résumé
            </Button>
          </motion.div>
        </div>

        {/* About me — scrolls down to the in-page #about section. */}
        <motion.a
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="group/about inline-flex items-center gap-2 font-mono text-[11px] text-text-light-muted transition-colors duration-200 hover:text-accent"
          href="#about"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          transition={{ delay: 0.8, duration: 0.55, ease: easeOut }}
        >
          <span aria-hidden="true" className="text-accent/70">
            ↓
          </span>
          <span className="link-underline">about me</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/about:translate-y-0.5"
          >
            ↓
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}

/**
 * Section 02 — Outcomes rendered as a split-flap-style departures
 * board. A dark amber-on-black panel sits on the light page like a
 * real board mounted on a station wall. Each metric is a
 * "departure" row: flight number, metric label, animated value,
 * status. When a row scrolls into view the STATUS column does a
 * one-shot character cycle (split-flap effect) before settling.
 */
function MetricsBand() {
  const liveCount = detailedMetrics.filter((m) => m.live).length;

  return (
    <div className="relative">
      <span aria-hidden="true" className="glitch-bar" />

      <GlitchTitle
        chapter="02"
        eyebrow="Outcomes"
        meta={`// ${liveCount} live · ${detailedMetrics.length} shipped`}
        title="Measured by what changed."
      />

      <div className="mt-10 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]">
        {/* CROWN — board header with live indicator + clock */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/15 bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-3 sm:px-6">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-amber-300 sm:text-[12px]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]"
            />
            PRODUCTION DEPARTURES
          </span>
          <span className="font-mono text-[11px] tabular-nums text-amber-200/70 sm:text-[12px]">
            <BoardClock />
          </span>
        </div>

        {/* COLUMN HEADERS */}
        <div className="grid grid-cols-[44px_minmax(0,1fr)_auto_88px] items-baseline gap-x-4 border-b border-amber-400/12 px-4 py-2 font-mono text-[9px] tracking-[0.22em] text-amber-300/55 sm:grid-cols-[60px_minmax(0,1fr)_220px_120px] sm:gap-x-6 sm:px-6 sm:text-[10px]">
          <span>FLT</span>
          <span>METRIC</span>
          <span className="text-right">VALUE</span>
          <span className="text-right">STATUS</span>
        </div>

        {/* ROWS */}
        <ol>
          {detailedMetrics.map((m, i) => (
            <DepartureRow index={i} key={m.label} metric={m} />
          ))}
        </ol>

        {/* FOOTNOTE */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-400/12 bg-zinc-900/40 px-4 py-3 font-mono text-[10px] tracking-[0.18em] text-amber-300/60 sm:px-6 sm:text-[11px]">
          <span>END OF SCHEDULE · {detailedMetrics.length} ENTRIES</span>
          <span>
            <span className="text-emerald-400">{liveCount} STILL LIVE</span>
            <span className="mx-2 text-amber-300/40">·</span>
            ALL NUMBERS VERIFIABLE
          </span>
        </div>
      </div>
    </div>
  );
}

/** A single departure row. On scroll-in, the STATUS column briefly
 *  cycles through random characters before settling — the visual
 *  signature of a split-flap board. The number counts up via the
 *  shared AnimatedCounter. */
function DepartureRow({
  index,
  metric,
}: {
  index: number;
  metric: DetailedMetric;
}) {
  const Tag = metric.href ? "a" : "div";
  const reduce = useReducedMotion();
  const targetStatus = metric.live ? "LIVE" : "DELIVERED";
  const ref = useRef<HTMLLIElement | null>(null);
  const [statusText, setStatusText] = useState<string>(
    reduce ? targetStatus : " ".repeat(targetStatus.length),
  );

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            // Stagger the start so rows ripple top→bottom.
            window.setTimeout(() => {
              if (cancelled) return;
              flapStatus(targetStatus, setStatusText);
            }, index * 110);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [index, reduce, targetStatus]);

  const statusColor = metric.live ? "text-emerald-400" : "text-amber-300";
  const statusDot = metric.live ? "▲" : "■";

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="group"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      ref={ref}
      transition={{ delay: index * 0.08, duration: 0.4, ease: easeOut }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <Tag
        className="grid grid-cols-[44px_minmax(0,1fr)_auto_88px] items-baseline gap-x-4 border-b border-amber-400/8 px-4 py-4 transition-colors duration-200 last:border-b-0 hover:bg-amber-400/[0.04] focus-visible:bg-amber-400/[0.06] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-300 sm:grid-cols-[60px_minmax(0,1fr)_220px_120px] sm:gap-x-6 sm:px-6 sm:py-5"
        href={metric.href}
      >
        {/* FLT — flight number */}
        <span className="font-mono text-[10px] tabular-nums text-amber-300/85 sm:text-[11px]">
          {String(index + 1).padStart(3, "0")}
        </span>

        {/* METRIC — label + small caption underneath */}
        <div className="min-w-0">
          <p className="truncate font-mono text-[12px] uppercase tracking-[0.14em] text-amber-100 sm:text-[13px]">
            {metric.label}
          </p>
          <p className="mt-1 truncate font-mono text-[9.5px] tracking-[0.14em] text-amber-200/45 sm:text-[10px]">
            {metric.context}
          </p>
        </div>

        {/* VALUE — animated counter, big amber tabular */}
        <div className="grid justify-items-end">
          <span
            className="font-mono font-bold tabular-nums text-amber-200 sm:text-[28px]"
            style={{
              fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
              letterSpacing: "-0.02em",
              textShadow:
                "0 0 8px rgba(251, 191, 36, 0.35), 0 0 18px rgba(251, 191, 36, 0.15)",
            }}
          >
            <AnimatedCounter suffix={metric.suffix} to={metric.to} />
          </span>
          {metric.fromLabel ? (
            <span className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-emerald-400/80 sm:text-[10px]">
              {metric.fromLabel}
            </span>
          ) : null}
        </div>

        {/* STATUS — split-flap reveal */}
        <span className="grid justify-items-end">
          <span
            className={`flex items-baseline gap-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] sm:text-[12px] ${statusColor}`}
            style={{ minWidth: "9ch", textAlign: "right" }}
          >
            <span aria-hidden="true" className="opacity-80">
              {statusDot}
            </span>
            <span className="tabular-nums" style={{ fontVariantLigatures: "none" }}>
              {statusText}
            </span>
          </span>
        </span>
      </Tag>
    </motion.li>
  );
}

/** Drive a one-shot split-flap reveal of the status word. Each
 *  character cycles through random chars before settling. */
function flapStatus(
  target: string,
  setter: (next: string) => void,
) {
  const cycleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▲▼■◆";
  const totalSteps = 14;
  const settleStep = (i: number) =>
    Math.floor((i / (target.length - 1 || 1)) * (totalSteps - 4)) + 3;
  let step = 0;
  const interval = window.setInterval(() => {
    step += 1;
    const next = Array.from(target)
      .map((ch, i) => {
        if (step >= settleStep(i)) return ch;
        if (ch === " ") return " ";
        return cycleChars[Math.floor(Math.random() * cycleChars.length)] ?? ch;
      })
      .join("");
    setter(next);
    if (step >= totalSteps) {
      setter(target);
      window.clearInterval(interval);
    }
  }, 55);
}

/** Live HH:MM:SS UTC clock for the board header. Renders a
 *  placeholder during SSR to avoid hydration mismatch, then
 *  updates every second on mount. */
function BoardClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <span>UTC · ——:——:——</span>;
  const hms = now.toISOString().slice(11, 19);
  return (
    <span>
      UTC · <span className="text-amber-300">{hms}</span>
    </span>
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
          <p className="font-mono text-[9px] text-accent">
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
    <div className="relative">
      <span aria-hidden="true" className="glitch-bar" />
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="w-full">
          <GlitchTitle
            chapter="04"
            eyebrow="The stack"
            meta="// 23 elements · paid"
            title="What I use to ship."
          />
        </div>
        <p className="inline-flex items-center gap-2 font-mono text-[11px] text-text-light-muted">
          <span>
            <span className="text-accent">23</span> elements
          </span>
          <span aria-hidden="true" className="text-text-light-muted/40">
            ·
          </span>
          <span>
            <span className="text-accent">6</span> primary
          </span>
          <span aria-hidden="true" className="text-text-light-muted/40">
            ·
          </span>
          <span>{6} groups</span>
        </p>
      </div>

      <div className="mt-10">
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
