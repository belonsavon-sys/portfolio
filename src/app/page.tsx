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
  AboutModal,
  AnimatedCounter,
  BentoStack,
  Button,
  ChapterRail,
  CursorHalo,
  GreetingRotator,
  HeroAvatarFrame,
  LightGlassCard,
  LiveStatusBadge,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SelectedWork,
  SiteFooter,
  SplitText,
  VelocityMarquee,
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
    <span className="relative inline-block min-h-[1.25em] font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
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
    <span className="group inline-flex items-center gap-2 rounded-full border border-result-green/35 bg-white/65 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-text-light backdrop-blur-md transition-[border-color,background] duration-200 hover:border-result-green hover:bg-white/85">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
        <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
      </span>
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
    <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
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
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="text-text-light-muted/60">// </span>
              {String(index + 1).padStart(2, "0")} {row.key}
            </span>
            <span className="flex items-center gap-2 truncate text-right font-mono text-[12px] text-text-light">
              {row.pulse ? (
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
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
      className="group/commit relative hidden max-w-[42ch] items-center gap-2 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted lg:inline-flex"
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
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.32em] text-accent">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
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
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(selectedWorkLd) }}
        type="application/ld+json"
      />
      <Hero onOpenAbout={() => setAboutOpen(true)} />

      {/* About reveal — fires from the HeroAvatarFrame click. Reuses
          the AboutModal that lived as dead code until this iter. */}
      <AboutModal
        onClose={() => setAboutOpen(false)}
        open={aboutOpen}
        title="I ship what others would plan."
      >
        {aboutParagraphs.map((paragraph, index) => (
          <p
            className={
              index === 0
                ? "text-lg font-medium text-text-light sm:text-xl"
                : undefined
            }
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </AboutModal>


      <LightSection className="pt-20 sm:pt-28" id="about">
        <AboutBand />
      </LightSection>

      <LightSection className="pt-16 sm:pt-24" id="process">
        <ProcessBand />
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

      <ChapterRail
        sections={[
          { id: "about", index: "01", label: "About" },
          { id: "process", index: "02", label: "How I work" },
          { id: "outcomes", index: "03", label: "Outcomes" },
          { id: "work", index: "04", label: "Selected work" },
          { id: "beyond", index: "05", label: "Beyond the code" },
          { id: "stack", index: "06", label: "My stack" },
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
    link: { href: "/uses", label: "see the stack" },
    verb: "Research",
  },
  {
    body: "Solo or paired with AI, I prototype until something works. The harness writes the boring parts; I keep judgment on what ships.",
    link: { href: "/atlas", label: "see the harness" },
    verb: "Build",
  },
  {
    body: "Every change goes through a PR with documentation, spec, and a clean commit history. Production is the only environment that matters.",
    link: { href: "/now#shipped", label: "see recent ships" },
    verb: "Ship",
  },
  {
    body: "Real numbers, real systems running. No demos that didn't survive contact with a guest, a payment, or a manager.",
    link: { href: "#outcomes", label: "see the numbers" },
    verb: "Measure",
  },
];

function ProcessBand() {
  const reduce = useReducedMotion();
  return (
    <div>
      <SectionHeader
        description="The same loop runs across every project — from a hotel ops system to Atlas. Research, build, ship, measure."
        eyebrow="How I work"
        size="md"
        title="The loop, four moves."
      />

      <ol className="mt-14 grid divide-y divide-border-light border-y border-border-light">
        {processSteps.map((step, index) => (
          <motion.li
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-10 sm:py-12"
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
            {/* LEFT 8 — number + huge verb */}
            <div className="col-span-12 lg:col-span-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                {`0${index + 1}`} · Step
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
            </div>

            {/* RIGHT 4 — body prose + cross-link to where the
                practice shows up elsewhere on the site. */}
            <div className="col-span-12 lg:col-span-4">
              <p className="text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                {step.body}
              </p>
              <a
                className="group/proc-link mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent transition-colors duration-200 hover:text-accent-deep"
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
    <div className="mt-12 overflow-hidden rounded-xl border border-border-light bg-bg-light-2 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
          ~/career-arc
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-border-light" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-light-muted">
          5 milestones · 2020 → now
        </span>
      </div>
      <ol className="mt-6 grid gap-y-6 sm:grid-cols-5 sm:gap-x-3">
        {milestones.map((m, index) => (
          <li className="group/arc relative" key={`${m.year}-${index}`}>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                {m.live ? (
                  <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                ) : null}
                <span
                  className={`relative inline-block h-2 w-2 rounded-full ${m.live ? "bg-result-green" : "bg-accent"}`}
                />
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-border-light"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
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
    <span className="inline-flex items-center gap-2 rounded-full border border-result-green/30 bg-result-green/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-result-green">
      <span aria-hidden="true">●</span>
      {years} years shipping in production
    </span>
  );
}

function AboutBand() {
  return (
    <div>
      <SectionHeader
        description="The two-minute version. The systems came from somebody who had to make payroll, not from a slide deck."
        eyebrow="About"
        size="md"
        title="I ship what others would plan."
      />

      {/* PULL QUOTE — first paragraph becomes the editorial centerpiece.
          Same display-typography treatment used on the page heroes;
          the rest of the about copy reads as supporting prose underneath. */}
      <figure className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <blockquote className="col-span-12 lg:col-span-8">
          <span
            aria-hidden="true"
            className="block select-none font-bold leading-none text-accent/15"
            style={{
              fontSize: "clamp(5rem, 12vw, 11rem)",
              letterSpacing: "-0.08em",
              marginBottom: "-1.5rem",
            }}
          >
            &ldquo;
          </span>
          <p
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            {aboutParagraphs[0]}
          </p>
          <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-xs uppercase tracking-[0.32em] text-accent">
            <span className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Pierre · in his own words
            </span>
            <AboutYearsStat />
          </figcaption>
        </blockquote>

        {/* FIELD NOTES — small datasheet sidebar pinned next to the
            pull quote. Same ~/slug · meta pattern used everywhere. */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/about</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="text-text-light-muted">Field notes</span>
            </div>
            <ul className="grid">
              {[
                {
                  href: "/resume",
                  key: "Role",
                  link: "see the cv",
                  value: "AI Engineer · Co-founder",
                },
                {
                  href: "/business#blackdoor",
                  key: "At",
                  link: "see Blackdoor",
                  value: "Blackdoor + ThePrivateHotels",
                },
                {
                  href: "/uses",
                  key: "Voice",
                  link: "see the stack",
                  value: "EN · ES · IT",
                },
                {
                  href: "/contact",
                  key: "Base",
                  link: "open to remote",
                  value: "Ocean Shores, WA",
                },
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
                    <span>{row.value}</span>
                    <a
                      className="group/abt mt-1 flex items-center justify-end gap-1 font-mono text-[9px] uppercase tracking-[0.22em] text-accent transition-colors duration-200 hover:text-accent-deep"
                      href={row.href}
                    >
                      <span aria-hidden="true" className="text-accent/60">↳</span>
                      <span className="link-underline">{row.link}</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover/abt:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </figure>

      {/* CAREER ARC — horizontal milestone strip between the field-
          notes datasheet and the supporting-prose chapters. Reads as
          a printed timeline: 4 dots, dated, with one-line annotations. */}
      <AboutCareerArc />

      {/* SUPPORTING PROSE — indexed chapters. The three follow-up
          paragraphs are framed with their own eyebrows so the about
          flows as a narrative arc rather than a wall of text. */}
      <ol className="mt-12 grid gap-10 lg:max-w-3xl">
        {[
          { eyebrow: "01 · The pivot", paragraph: aboutParagraphs[1] },
          { eyebrow: "02 · The work", paragraph: aboutParagraphs[2] },
          { eyebrow: "03 · The thesis", paragraph: aboutParagraphs[3] },
        ].map((chapter) => (
          <li className="group/about" key={chapter.eyebrow}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                {chapter.eyebrow}
              </span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-accent/30 transition-all duration-300 group-hover/about:w-12 group-hover/about:bg-accent"
              />
            </div>
            <p className="mt-3 text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
              {chapter.paragraph}
            </p>
          </li>
        ))}
      </ol>

      {/* CLOSING DUAL CTA — two doors out of About:
          → the receipts (resume) for the formal story
          → what's shipping (now) for the latest in-flight work */}
      <div className="mt-14 grid gap-3 sm:grid-cols-2">
        {[
          {
            cta: "See the receipts",
            eyebrow: "Want the formal story?",
            href: "/resume",
            meta: "/resume · curriculum",
          },
          {
            cta: "See what's shipping",
            eyebrow: "Want the latest in-flight?",
            href: "/now",
            meta: "/now · this week",
          },
        ].map((card) => (
          <a
            className="group/aboutcta flex items-center justify-between gap-4 rounded-2xl border border-border-light bg-bg-light-2 px-5 py-4 transition-[border-color,background] duration-200 hover:border-accent/45 hover:bg-accent/5 sm:px-6 sm:py-5"
            href={card.href}
            key={card.href}
          >
            <span className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                {card.meta}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-text-light-muted">
                {card.eyebrow}
              </span>
              <span
                className="mt-1 font-semibold tracking-tight text-text-light transition-colors duration-200 group-hover/aboutcta:text-accent-deep"
                style={{
                  fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {card.cta}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent transition-[transform,border-color,background,color] duration-300 group-hover/aboutcta:translate-x-1 group-hover/aboutcta:border-accent group-hover/aboutcta:bg-accent group-hover/aboutcta:text-bg-light"
            >
              →
            </span>
          </a>
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
          <HeroLiveShipped />
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
            01 / Welcome
          </span>
          <HeroLatestCommit />
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

          {/* Mono kicker right below the name — rotating role tag */}
          <motion.div
            className="mt-8 flex items-center gap-3"
            {...fadeUp(0.36)}
          >
            <span
              aria-hidden="true"
              className="h-px w-10 origin-left bg-accent"
            />
            <HeroRoleTagRotator />
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

          {/* ⌘K teaser — surfaces the command palette to first-time
              visitors without making them scroll to the footer hint. */}
          <motion.p
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-text-light-muted"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            transition={{ delay: 0.78, duration: 0.55, ease: easeOut }}
          >
            <span>or</span>
            <kbd className="inline-flex h-6 min-w-[44px] items-center justify-center rounded-md border border-accent/35 bg-[rgba(41,110,214,0.08)] px-1.5 font-mono text-[11px] font-semibold text-accent">
              ⌘K
            </kbd>
            <span>to jump anywhere</span>
          </motion.p>

          {/* EXPLORE DECK — 3 high-value destinations beyond the two CTAs */}
          <motion.ul
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            className="mt-8 grid gap-2.5 sm:grid-cols-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            transition={{ delay: 0.84, duration: 0.55, ease: easeOut }}
          >
            {[
              {
                href: "/atlas",
                label: "/atlas",
                meta: "the harness",
                teaser: "5-layer agent harness",
              },
              {
                href: "/now",
                label: "/now",
                meta: "this week",
                teaser: "what's shipping right now",
              },
              {
                href: "/uses",
                label: "/uses",
                meta: "the stack",
                teaser: "tools with reasons",
              },
            ].map((entry) => (
              <li key={entry.label}>
                <a
                  className="group/explore flex items-center justify-between gap-3 rounded-xl border border-border-light bg-white/55 px-3.5 py-2.5 backdrop-blur-sm transition-[border-color,background] duration-200 hover:border-accent/45 hover:bg-white/85"
                  href={entry.href}
                >
                  <span className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                      {entry.label} · {entry.meta}
                    </span>
                    <span className="mt-0.5 font-mono text-[12.5px] text-text-light">
                      {entry.teaser}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-accent transition-transform duration-200 group-hover/explore:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
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
            <motion.a
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              className="group/metric relative block text-left transition-transform duration-300 hover:-translate-y-0.5"
              href={m.href}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              key={m.label}
              transition={{
                delay: 0.62 + index * 0.1,
                duration: 0.6,
                ease: easeOut,
              }}
            >
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                <span>{`0${index + 1}`} · {m.label}</span>
                <span
                  aria-hidden="true"
                  className="inline-block opacity-0 transition-[opacity,transform] duration-200 group-hover/metric:translate-x-0.5 group-hover/metric:opacity-100"
                >
                  →
                </span>
              </p>
              <p className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover/metric:text-accent-deep"
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
            </motion.a>
          ))}
        </motion.div>

        {/* ~/recent datasheet — compact 3-column build signal beneath
            the metric ribbon. Server-rendered counts of recent commits
            (today's ships, today's PRs) + last-ship freshness. */}
        <motion.div
          className="col-span-12"
          style={
            reduce ? undefined : { opacity: bottomZoneOpacity, y: bottomZoneY }
          }
        >
          <HeroRecentDatasheet />
        </motion.div>

        {/* CHIP STRIP — left-aligned, last chip is a live local clock */}
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
          <motion.span
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            transition={{ delay: 0.92 + 3 * 0.08, duration: 0.55, ease: easeOut }}
          >
            <HeroLocalClockChip />
          </motion.span>
        </motion.div>

        {/* SCROLL CUE — left-aligned, anchored to lower-left margin.
            Names the next section ("Next · About") instead of a vague
            "Scroll" prompt, so first-time visitors know what's below
            before they commit. Hover surfaces a richer preview chip. */}
        <motion.a
          aria-label="Scroll to About"
          className="group/cue col-span-12 hidden flex-row items-center gap-3 self-end sm:flex"
          href="#about"
          {...fadeUp(1.1)}
        >
          <span className="relative h-px w-10 overflow-hidden bg-gradient-to-r from-border-light via-accent to-transparent transition-colors duration-200 group-hover/cue:via-accent">
            <span className="scroll-cue-dot absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent" />
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-light-muted/60 transition-colors duration-200 group-hover/cue:text-accent">
            <span aria-hidden="true" className="text-accent/70">↓</span>
            Next · About
            <span
              aria-hidden="true"
              className="hidden translate-x-[-4px] opacity-0 transition-[opacity,transform] duration-200 group-hover/cue:translate-x-0 group-hover/cue:opacity-100 sm:inline"
            >
              · the two-minute version
            </span>
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

      {/* CLOSING BAND — sends readers to the page where these
          metrics are described in depth. Mirrors the per-metric
          deep-links but as a one-stop "see how they shipped". */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
          07 · Where the receipts live
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            className="group/recv inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-light-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-light transition-[border-color,background,color] duration-200 hover:border-accent hover:bg-white hover:text-accent"
            href="/business"
          >
            <span>/business · 5 chapters</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/recv:translate-x-0.5"
            >
              →
            </span>
          </a>
          <a
            className="group/recv inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-light-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-light transition-[border-color,background,color] duration-200 hover:border-accent hover:bg-white hover:text-accent"
            href="/ai#built-and-shipped"
          >
            <span>/ai · case studies</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/recv:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  index,
  metric,
}: {
  index: number;
  metric: DetailedMetric;
}) {
  const reduce = useReducedMotion();

  // Whole-row link when an href is set; falls back to a non-link
  // wrapper for the few metrics that have no destination.
  const RowTag = metric.href ? "a" : "div";

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="group relative"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.05,
        duration: 0.55,
        ease: easeOut,
      }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <RowTag
        className={`grid grid-cols-12 items-baseline gap-4 py-8 sm:py-10 lg:py-12 ${
          metric.href
            ? "block transition-transform duration-300 hover:-translate-y-0.5"
            : ""
        }`}
        href={metric.href}
      >
        {/* LEFT 7 — massive number + optional "from" prefix */}
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
            {metric.fromLabel ? (
              <span className="ml-3 font-mono text-base font-medium text-text-light/40 sm:text-lg">
                {metric.fromLabel}
              </span>
            ) : null}
          </p>
        </div>

        {/* RIGHT 5 — label + index + live pulse + context */}
        <div className="col-span-12 flex items-baseline gap-4 lg:col-span-5 lg:justify-end">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            {metric.live ? (
              <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
              </span>
            ) : null}
            <span>{`0${index + 1}`}</span>
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border-light lg:w-12 lg:flex-none" />
          <div className="flex max-w-xs flex-col items-end gap-1 lg:text-right">
            <p className="text-base font-medium leading-6 text-text-light sm:text-lg">
              {metric.label}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
              {metric.context}
            </p>
            {metric.href ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                See receipts <span aria-hidden="true">→</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Hover accent — thin gradient line that draws across on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </RowTag>
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
