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
  // mismatch. Re-render every 30s so the "X ago" stays current.
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

/**
 * Latest commit subject — captured at build time via next.config.ts
 * (VERCEL_GIT_COMMIT_MESSAGE or local git log). Renders inline next
 * to the live-shipped badge as a mono "latest:" tag, giving the
 * hero top strip a real "what just shipped" line.
 *
 * Truncated past ~64 chars so long commit messages don't break
 * the editorial top strip layout. Hidden when no subject is set.
 */
/**
 * Live local-time chip — shows the current time in Pacific (where
 * Pierre is based) and updates every 30 seconds. Client-only to
 * avoid SSR/CSR mismatch; renders a placeholder until mount so
 * the hero markup is identical on the server.
 */
/**
 * Rotating role tag — cycles the editorial kicker through 3 phrases
 * with a fade swap every 3.6s. Drops to a single static phrase under
 * prefers-reduced-motion to keep the hero accessible.
 */
const HERO_ROLE_PHRASES = [
  "AI for operations-heavy businesses",
  "Multi-agent harnesses in production",
  "Shipping under PR review",
];

function HeroRoleTagRotator() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_ROLE_PHRASES.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative inline-block min-h-[1.25em] font-mono text-xs text-accent sm:text-sm">
      {HERO_ROLE_PHRASES.map((phrase, i) => (
        <motion.span
          aria-hidden={i !== index}
          animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : -4 }}
          className="absolute inset-y-0 left-0 whitespace-nowrap"
          initial={false}
          key={phrase}
          transition={{ duration: reduce ? 0 : 0.4, ease: easeOut }}
        >
          {phrase}
        </motion.span>
      ))}
      {/* Reserve width via the longest phrase rendered invisibly */}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        AI for operations-heavy businesses
      </span>
    </span>
  );
}

function HeroLocalClockChip() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const label = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
        timeZoneName: "short",
      }).format(now)
    : "Pacific time";

  return (
    <span className="inline-flex items-baseline gap-2 font-mono text-xs text-text-light">
      <span aria-hidden="true" className="text-result-green">—</span>
      {label}
    </span>
  );
}

/**
 * Compact ~/recent datasheet for the hero — three columns showing
 * last ship freshness, ships in last 24h, PR merges in last 24h.
 * Server-rendered: counts derived from BUILD_RECENT_COMMITS so the
 * numbers reflect each deploy without runtime fetches.
 */
function HeroRecentDatasheet() {
  type C = { sha: string; subject: string; when: string };
  let recent: C[] = [];
  try {
    const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) recent = parsed;
    }
  } catch {
    recent = [];
  }

  function approxSeconds(w: string): number {
    const m = w.match(
      /^(\d+|a|an)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i,
    );
    if (!m) return w.toLowerCase().includes("now") ? 0 : Infinity;
    const n = m[1] === "a" || m[1] === "an" ? 1 : Number(m[1]);
    const unit = m[2].toLowerCase();
    const mult: Record<string, number> = {
      day: 86400,
      hour: 3600,
      minute: 60,
      month: 2628000,
      second: 1,
      week: 604800,
      year: 31536000,
    };
    return n * (mult[unit] ?? Infinity);
  }

  const last = recent[0];
  const todayShips = recent.filter(
    (c) =>
      !c.subject.startsWith("Merge pull request") &&
      approxSeconds(c.when) < 86400,
  ).length;
  const todayPrs = recent.filter(
    (c) =>
      c.subject.startsWith("Merge pull request") &&
      approxSeconds(c.when) < 86400,
  ).length;

  const rows: Array<{ key: string; pulse?: boolean; value: string }> = [
    {
      key: "Last ship",
      pulse: true,
      value: last ? `${last.when} · ${last.sha}` : "—",
    },
    { key: "Ships today", value: todayShips ? `${todayShips}` : "0" },
    { key: "PRs today", value: todayPrs ? `${todayPrs}` : "0" },
  ];

  return (
    <div
      className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2"
    >
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-4 py-2.5 font-mono text-[10px] text-accent">
        <span className="relative inline-flex h-2 w-2">
          <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
        </span>
        <span>~/recent</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">live · from build</span>
      </div>
      <ul className="grid divide-y divide-border-light sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {rows.map((row, index) => (
          <li
            className="flex items-baseline justify-between gap-3 px-4 py-2.5"
            key={row.key}
          >
            <span className="font-mono text-[10px] text-accent">
              <span className="text-text-light-muted/60">// </span>
              {String(index + 1).padStart(2, "0")} {row.key}
            </span>
            <span className="flex items-center gap-2 truncate text-right font-mono text-[12px] text-text-light">
              {row.pulse ? (
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
                </span>
              ) : null}
              <span className="truncate">{row.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type HeroRecentCommit = {
  sha: string;
  subject: string;
  when: string;
};

function readHeroRecentCommits(): HeroRecentCommit[] {
  try {
    const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 3);
  } catch {
    return [];
  }
}

function HeroLatestCommit() {
  const subject = process.env.NEXT_PUBLIC_BUILD_COMMIT_SUBJECT;
  if (!subject) return null;
  const truncated = subject.length > 64 ? `${subject.slice(0, 64)}…` : subject;
  const recent = readHeroRecentCommits();

  return (
    <span
      aria-label="Latest commit subject"
      className="group/commit relative hidden max-w-[42ch] items-center gap-2 truncate font-mono text-[10px] text-text-light-muted lg:inline-flex"
      title={subject}
    >
      <span aria-hidden="true" className="text-accent/60">
        latest:
      </span>
      <span className="truncate text-text-light/70">{truncated}</span>
      {recent.length > 0 ? (
        <span
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-full z-30 mt-2 w-[420px] -translate-y-1 rounded-xl border border-border-light bg-white/95 p-3 opacity-0 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.28)] backdrop-blur transition-[opacity,transform,visibility] duration-200 group-hover/commit:visible group-hover/commit:translate-y-0 group-hover/commit:opacity-100"
        >
          <span className="flex items-center gap-2 font-mono text-[9px] text-accent">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
            </span>
            last 3 ships
          </span>
          <ul className="mt-2 grid divide-y divide-border-light">
            {recent.map((c) => (
              <li
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-2 py-2 font-mono text-[10px] normal-case tracking-normal"
                key={c.sha}
              >
                <span className="text-accent">{c.sha}</span>
                <span className="truncate text-text-light/80">{c.subject}</span>
                <span className="text-text-light-muted">{c.when}</span>
              </li>
            ))}
          </ul>
        </span>
      ) : null}
    </span>
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

const heroMetrics = [
  {
    context: "ThePrivateHotels · live since Apr 2024",
    href: "/ai#built-and-shipped",
    label: "Guest reply time",
    suffix: " min",
    to: 3,
    valuePrefix: "from 48 hrs → ",
  },
  {
    context: "Ops manual → QA system, ThePrivateHotels",
    href: "/business#process",
    label: "Pages digitized",
    suffix: "+",
    to: 100,
    valuePrefix: "",
  },
  {
    context: "Game · Budget · Project mgmt — Blackdoor",
    href: "/ai#atlas-portfolio",
    label: "Atlas products",
    suffix: " live",
    to: 3,
    valuePrefix: "",
  },
];

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

      {/* Section break — glitch-tear divider. Reads as a static
          hairline most of the time; every ~8s the line tears apart,
          flashes "// what i use to ship" in the gap, and snaps closed.
          Keyframes live in globals.css. */}
      <div className="glitch-tear bg-bg-light-2">
        <span aria-hidden="true" className="glitch-tear-text">
          // what i use to ship ↓
        </span>
        <span aria-hidden="true" className="glitch-tear-top" />
        <span aria-hidden="true" className="glitch-tear-bottom" />
      </div>

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

function scrollToAbout() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("about");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

type ProcessStep = {
  body: string;
  link: { href: string; label: string };
  verb: string;
};

const processSteps: ProcessStep[] = [
  {
    body: "I take problems to mastery before I execute. The first hours go to research — docs, primary sources, working code I can read.",
    link: { href: "/lab#uses", label: "see my stack" },
    verb: "Research",
  },
  {
    body: "Solo or paired with AI, I prototype until something works. The harness writes the boring parts; I keep judgment on what ships.",
    link: { href: "/atlas", label: "see my harness" },
    verb: "Build",
  },
  {
    body: "Every change goes through a PR with documentation, spec, and a clean commit history. Production is the only environment that matters.",
    link: { href: "/lab#now", label: "see what I just shipped" },
    verb: "Ship",
  },
  {
    body: "Real numbers, real systems running. No demos that didn't survive contact with a guest, a payment, or a manager.",
    link: { href: "#outcomes", label: "see my numbers" },
    verb: "Measure",
  },
];

function ProcessBand() {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <span aria-hidden="true" className="glitch-bar" />
      {/* HEADER — CLI loop prompt that "runs" the four steps forever.
          Scrambles on mount; green status pill confirms the schedule. */}
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-accent">
          <span className="text-accent-deep">$</span>
          <span>
            <TextScramble
              durationMs={1100}
              stepMs={32}
              text="run-loop --steps research,build,ship,measure --forever"
            />
          </span>
          <span className="inline-flex items-baseline gap-1.5 font-mono text-[12px] text-result-green">
            — 4 steps · scheduled
          </span>
        </div>

        <h2
          className="auto-glitch mt-5 font-semibold tracking-tight text-text-light"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
          }}
        >
          The loop, four moves.
        </h2>
      </div>

      <ol className="mt-10 grid divide-y divide-border-light border-y border-border-light">
        {processSteps.map((step, index) => (
          <motion.li
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-8 sm:py-10"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            key={step.verb}
            transition={{
              delay: index * 0.06,
              duration: 0.6,
              ease: easeOut,
            }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          >
            {/* LEFT 8 — CLI shebang prompt + huge verb */}
            <div className="col-span-12 lg:col-span-8">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
                <span className="text-accent-deep">$</span>
                <span className="text-accent">
                  ./{String(index + 1).padStart(2, "0")}-
                  {step.verb.toLowerCase()}.sh
                </span>
              </p>
              <h3
                className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                }}
              >
                {step.verb}
                <span className="text-accent">.</span>
              </h3>

              {/* ASCII PROGRESS BAR — animates fill on view */}
              <div className="mt-6 flex items-center gap-3 font-mono text-[11px] text-text-light-muted">
                <span className="text-accent/70">[</span>
                <span className="relative inline-block h-1.5 flex-1 overflow-hidden bg-bg-light-2">
                  <motion.span
                    animate={reduce ? undefined : { width: "100%" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                    initial={reduce ? { width: "100%" } : { width: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 1.2,
                      ease: easeOut,
                    }}
                    viewport={{ amount: 0.5, once: true }}
                    whileInView={reduce ? undefined : { width: "100%" }}
                  />
                </span>
                <span className="text-accent/70">]</span>
                <span className="text-accent">100%</span>
              </div>
            </div>

            {/* RIGHT 4 — body prose + cross-link to where the
                practice shows up elsewhere on the site. */}
            <div className="col-span-12 lg:col-span-4">
              <p className="text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                {step.body}
              </p>
              <a
                className="group/proc-link mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-accent transition-colors duration-200 hover:text-accent-deep"
                href={step.link.href}
              >
                <span aria-hidden="true" className="text-accent/70">
                  ↳
                </span>
                <span className="link-underline">{step.link.label}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/proc-link:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </div>

            {/* Hover accent — gradient hair-line draws under the row */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Auto-computed "N years building in production" stat — anchors the
 * About attribution with a fact that updates itself. Anchored to
 * 2020 (when Pierre started shipping in production); refreshes on
 * every deploy via the rendered year.
 */
/**
 * Career arc — horizontal milestone timeline. 4 dots evenly spaced
 * along a hairline rule, each annotated with a year + one-line
 * summary. The "Now" milestone pulses to signal it's the live one.
 */
function AboutCareerArc() {
  const milestones: Array<{ live?: boolean; note: string; year: string }> = [
    { note: "Started shipping in production", year: "2020" },
    { note: "Took over hotel operations", year: "2022" },
    { note: "Hotel ops fully digitized + AI-driven", year: "2024" },
    { note: "Co-founded Blackdoor · Atlas v3", year: "2025" },
    { live: true, note: "Shipping under PR review", year: "Now" },
  ];

  return (
    <div
      className="mt-12 overflow-hidden rounded-xl border border-border-light bg-bg-light-2 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-[10px] text-accent">
          ~/career-arc
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-border-light" />
        <span className="font-mono text-[10px] text-text-light-muted">
          5 milestones · 2020 → now
        </span>
      </div>
      <ol className="mt-6 grid gap-y-6 sm:grid-cols-5 sm:gap-x-3">
        {milestones.map((m, index) => (
          <li className="group/arc relative" key={`${m.year}-${index}`}>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span
                  className={`relative inline-block h-2 w-2 rounded-full ${m.live ? "bg-result-green" : "bg-accent"}`}
                />
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-border-light"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-accent">
              {m.year}
            </p>
            <p className="mt-1 text-xs leading-5 text-text-light-muted sm:text-[12.5px]">
              {m.note}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AboutYearsStat() {
  const START_YEAR = 2020;
  const years = Math.max(1, new Date().getFullYear() - START_YEAR);
  return (
    <span className="inline-flex items-baseline gap-2 font-mono text-[12px] text-result-green">
      <span aria-hidden="true" className="text-result-green/60">—</span>
      {years} years shipping in production
    </span>
  );
}

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

  // One label is now LIVE — it picks up the short build sha so it
  // ties to the live-shipped pulse in the top strip. The other three
  // carry sharpened editorial copy.
  const shortSha = process.env.NEXT_PUBLIC_BUILD_SHA
    ? process.env.NEXT_PUBLIC_BUILD_SHA.slice(0, 7)
    : null;
  const liveLabel = shortSha
    ? `Shipping · ${shortSha}`
    : "Shipping · daily";

  const labels = [
    {
      className:
        "left-[6%] top-[18%] -rotate-2 sm:left-[8%] sm:top-[22%] lg:left-[10%] lg:top-[26%]",
      opacity: opTL,
      parallaxY: ySlow,
      text: liveLabel,
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
      text: "Trilingual · EN · ES · IT",
    },
    {
      className:
        "right-[5%] bottom-[14%] rotate-2 sm:right-[8%] sm:bottom-[18%] lg:right-[8%] lg:bottom-[24%]",
      opacity: opBR,
      parallaxY: yVeryFast,
      text: "Co-founder · Blackdoor · 2025",
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
            className="inline-flex items-baseline gap-2 font-mono text-[11px] text-accent"
            style={
              reduce
                ? { opacity: 0.85 }
                : { opacity: label.opacity, y: label.parallaxY }
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

function MetricsBand() {
  const liveCount = detailedMetrics.filter((m) => m.live).length;
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <span aria-hidden="true" className="glitch-bar" />

      {/* Header */}
      <GlitchTitle
        chapter="02"
        eyebrow="Outcomes"
        meta={`// ${liveCount} live · ${detailedMetrics.length} shipped`}
        title="Measured by what changed."
      />

      {/* LEDGER — flat full-bleed list bracketed by heavy rules.
          Departs from the bento focus board (no carousel, no
          focus/list split, no card chrome): every metric is shown
          at once, the big number anchors each row, and the section
          reads top-to-bottom like a print statement. */}
      <div
        className="relative mt-10"
      >
        {/* Datasheet caption — editorial italic, not a mono caps strip */}
        <div className="flex flex-wrap items-end justify-between gap-3 pb-3 font-mono text-[12px] text-text-light-muted">
          <span>
            <span className="text-text-light">outcomes.ledger</span> — {detailedMetrics.length} entries
          </span>
          <span>annualized impact, 2024–2025</span>
        </div>

        {/* Heavy top rule — double, print-statement style */}
        <span
          aria-hidden="true"
          className="block h-[2px] w-full bg-text-light/85"
        />
        <span
          aria-hidden="true"
          className="mt-[3px] block h-px w-full bg-text-light/30"
        />

        {/* Rows */}
        <ol className="divide-y divide-accent/20">
          {detailedMetrics.map((m, i) => (
            <MetricLedgerRow
              index={i}
              key={m.label}
              metric={m}
              reduce={!!reduce}
            />
          ))}
        </ol>

        {/* Heavy bottom rule — double, mirrored */}
        <span
          aria-hidden="true"
          className="block h-px w-full bg-text-light/30"
        />
        <span
          aria-hidden="true"
          className="mt-[3px] block h-[2px] w-full bg-text-light/85"
        />

        {/* Footnote — editorial */}
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 font-mono text-[12px] text-text-light-muted">
          <span>end of ledger.</span>
          <span>
            <span className="text-result-green">{liveCount} still live</span> — all numbers verifiable
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricLedgerRow({
  index,
  metric,
  reduce,
}: {
  index: number;
  metric: DetailedMetric;
  reduce: boolean;
}) {
  const Tag = metric.href ? "a" : "div";

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <Tag
        className="group/row relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-4 px-2 py-7 transition-colors duration-300 hover:bg-accent/[0.04] focus-visible:bg-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent sm:grid-cols-[auto_240px_minmax(0,1fr)_auto] sm:gap-x-8 sm:py-8 lg:grid-cols-[auto_300px_minmax(0,1fr)_auto] lg:gap-x-10"
        href={metric.href}
      >
        {/* Status rail — left edge, status-tinted vertical gradient */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-3 left-0 w-[2px] opacity-65 transition-opacity duration-300 group-hover/row:opacity-100"
          style={{
            background: metric.live
              ? "linear-gradient(to bottom, transparent 0%, rgba(16,185,129,0.7) 50%, transparent 100%)"
              : "linear-gradient(to bottom, transparent 0%, rgba(41,110,214,0.55) 50%, transparent 100%)",
          }}
        />

        {/* Index — sequence number only. No pulse dot here anymore;
            status is communicated by the inline caption next
            to the receipts link. */}
        <div className="flex shrink-0 items-center self-start pt-2 font-mono text-[11px] tabular-nums text-accent">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* HUGE VALUE — the bold typographic anchor (Bricolage display) */}
        <div className="col-span-2 sm:col-span-1 sm:self-center">
          <div
            className="text-text-light transition-colors duration-300 group-hover/row:text-accent-deep"
            style={{
              fontFamily:
                "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
              fontVariationSettings: '"wdth" 92, "opsz" 96',
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
            }}
          >
            <AnimatedCounter suffix={metric.suffix} to={metric.to} />
          </div>
          {/* Reserved height — keep "from →" label slot stable across rows */}
          <p
            className={`mt-2 h-[18px] font-mono text-[12px] ${
              metric.fromLabel ? "text-result-green" : "text-transparent"
            }`}
          >
            {metric.fromLabel ?? "—"}
          </p>
        </div>

        {/* LABEL + CONTEXT */}
        <div className="col-span-2 min-w-0 sm:col-span-1 sm:self-center">
          <p
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
              letterSpacing: "-0.018em",
              lineHeight: 1.2,
            }}
          >
            {metric.label}
          </p>
          <p className="mt-1.5 font-mono text-[12px] text-text-light-muted">
            {metric.context}
          </p>
        </div>

        {/* Status caption + receipts link — editorial, no
            rounded pill, no ping. Status color carried by text only. */}
        <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
          <span
            className={`font-mono text-[12px] ${
              metric.live ? "text-result-green" : "text-accent"
            }`}
          >
            — {metric.live ? "live" : "shipped"}
          </span>
          {metric.href ? (
            <span className="inline-flex items-baseline gap-1.5 font-mono text-[11px] text-accent">
              <span className="link-underline">see receipts</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/row:translate-x-1"
              >
                →
              </span>
            </span>
          ) : null}
        </div>
      </Tag>
    </motion.li>
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
        <p className="font-mono text-[10px] text-accent-light">
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
