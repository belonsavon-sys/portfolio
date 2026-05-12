"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Button,
  ChapterRail,
  ParallaxGhost,
  SplitText,
  StaggeredChipRail,
} from "@/components";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/components/contact-config";
import type { ReactNode } from "react";

const contactItems = [
  { href: EMAIL_MAILTO, label: "Email", value: EMAIL_DISPLAY },
  { href: PHONE_TEL, label: "Phone", value: PHONE_DISPLAY },
  { href: GITHUB_URL, label: "GitHub", value: "github.com/belonsavon-sys" },
  ...(LINKEDIN_URL
    ? [
        {
          href: LINKEDIN_URL,
          label: "LinkedIn",
          value: LINKEDIN_URL.replace(/^https?:\/\//, ""),
        },
      ]
    : []),
];

const professionalSummary =
  "AI engineer who learned to ship by automating the hotel I was hired to supervise. Co-founded Blackdoor in 2025 and co-architect Atlas — a multi-level agent harness shipping real apps under human review. Bridges live operations (hospitality, finance) and AI engineering. Trilingual EN · ES · IT.";

const experience: ExperienceEntry[] = [
  {
    bullets: [
      "Co-founded the holding company. Products are built and shipped end-to-end by an autonomous agent harness, in place of a human dev team.",
      "Designed and built Atlas — a multi-level autonomous agent harness that connects any AI model to any external tool through MCP or OAuth.",
      "Atlas orchestrates a full company hierarchy: CEO agent to C-suite agents, manager agents, and field agents.",
      "Atlas has shipped a game app, a budget web app, and an agent-augmented project management system.",
      "Lead AI R&D — agent harness architecture, backend systems, on-device + cloud deployment.",
      "Every change ships through a GitHub PR with documentation + spec research filed before the implementation sprint.",
      "Tooling: Claude, Codex, Perplexity, Antigravity, Cursor, VS Code, GitHub.",
      "Same underlying tech now running in production at ThePrivateHotels.",
    ],
    company: "Blackdoor",
    featured: true,
    location: "Remote",
    period: "Sept 2025 – Present",
    receipts: { href: "/atlas", label: "/atlas · the harness in depth" },
    role: "Co-founder & President",
    summary:
      "Co-architecting Atlas — the multi-agent harness that ships our products under human review.",
  },
  {
    bullets: [
      "Progressed from Finance Data Entry Assistant and part-time Housekeeper to Hotel Operations Supervisor.",
      "Built and deployed a guest communications chatbot trained on curated company data — drafts replies in Smarttask, human-reviewed before send.",
      "Cut response time from up to 48 hours to under 3 minutes, saving 15-20 minutes of drafting per message.",
      "Digitized the property's 100+ page operations manual into a room-by-room QA inspection system with trackable scores.",
      "Automated hotel workflows using Zapier, Guesty API, and Twilio API, replacing multi-hour manual coordination loops.",
      "Supervised a team of 6, authored room-by-room SOPs and inspection checklists, trained staff on every tool I deployed.",
      "Processed customer invoices, bills, and expenses in QuickBooks for 6 months — error-free record.",
      "Contributed to Airbnb Guest Favorites top 10%, Booking.com Travelers' Choice Award, VRBO Premier Partner status.",
      "Attended leadership meetings and a company leadership retreat in Hawaii.",
    ],
    company: "ThePrivateHotels",
    location: "Ocean Shores, WA",
    period: "Apr 2024 – Present",
    receipts: {
      href: "/ai#built-and-shipped",
      label: "/ai · case studies + receipts",
    },
    role: "Hotel Operations Supervisor",
    summary:
      "Took a 100+ page manual and a 48-hour reply lag — left a digital QA system and 3-minute responses.",
  },
];

const projects: ProjectEntry[] = [
  {
    bullets: [
      "Personal workout tracker. Replaced the paid subscription fitness apps I used to use.",
      "Stack: Next.js, React, Supabase, Vercel — built with Codex and Claude in VS Code and Antigravity.",
    ],
    name: "Workout App",
    scope: "End-to-end, personal",
    shipped: "2025",
    stack: ["Next.js", "React", "Supabase", "Vercel"],
    status: "active",
  },
  {
    bullets: [
      "Budgeting app with a built-in AI advisor that reads your full transaction history and answers in plain language.",
      "Stack: Next.js, React, Supabase, Vercel — built with Codex and Claude.",
    ],
    name: "Personal Budgeting App",
    scope: "End-to-end, personal",
    shipped: "2025",
    stack: ["Next.js", "Supabase", "AI advisor"],
    status: "active",
  },
  {
    bullets: [
      "Built an automated daily pipeline: ChatGPT-powered web searches for investment research and company news, synced to Google Calendar alongside bills and reminders.",
    ],
    name: "Daily Market & News Automation",
    scope: "Personal",
    shipped: "2024",
    stack: ["ChatGPT", "Google Calendar API"],
    status: "active",
  },
];

const skillGroups = [
  {
    items: [
      "LLMs: Claude, ChatGPT, Codex, Perplexity",
      "Agent frameworks: multi-agent harness design, MCP",
      "Automation platforms: Zapier, n8n",
      "APIs: Guesty, Twilio, OpenAI, Anthropic, REST",
    ],
    title: "AI & Automation",
  },
  {
    items: [
      "Frontend: JavaScript, TypeScript, React, Next.js",
      "Mobile: Flutter (Dart), Kotlin Multiplatform (KMP)",
      "Backend: Node.js, Express.js",
      "Database: Supabase (PostgreSQL), MySQL",
      "Deployment: Vercel · Version control: Git, GitHub",
    ],
    title: "Full-Stack Development",
  },
  {
    items: ["Figma, Framer", "VS Code, Antigravity, Cursor"],
    title: "Design & Tooling",
  },
  {
    items: [
      "Process design and digitization",
      "QA inspection systems",
      "Guest communications systems",
      "Team supervision · Contractor coordination",
      "Finance data entry · Operational reporting",
    ],
    title: "Business & Operations",
  },
];

const education = [
  {
    meta: "Expected completion: June 2026",
    program: "IBM Full Stack Software Engineer — Professional Certificate",
    status: "In progress",
  },
  {
    meta: "Kingsville, TX · 2019–2020",
    program: "Civil Engineering",
    status: "Texas A&M University of Kingsville",
  },
];

const languages = ["English", "Spanish", "Italian"];

const easeOutCurve = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Years between Apr 2024 (Pierre's first AI-shipping role) and now.
 * Rounded to one decimal so the figure ticks forward each month.
 */
function yearsBuilding(): string {
  const start = new Date("2024-04-01T00:00:00Z").getTime();
  const diffYears = (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000);
  return diffYears.toFixed(1);
}

/**
 * Bold-emphasize metric-bearing substrings inside an Experience or
 * Project bullet. Recruiters scan bullets quickly — the numbers
 * are the proof, so they get visual weight.
 *
 * Matched patterns:
 *   - "48 hours", "3 minutes", "20 min", "6 months"
 *   - "100+ pages", "6 staff", "3 products"
 *   - "top 10%", "5-star"
 *   - "<3 min", "98%"
 *   - "Error-free", "Travelers' Choice", "Premier"
 */
function highlightMetrics(text: string): React.ReactNode[] {
  const patterns = [
    // Time durations and counts with units.
    /\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|minutes?|mins?|months?|seconds?|secs?|weeks?|days?|years?)\b/gi,
    // Counts with a "+" suffix or counts with units like staff/pages.
    /\b\d+\+?\s*(?:pages?|staff|products?|properties|reviews?|companies?|projects?|languages?)\b/gi,
    // Standalone percentages or ratings.
    /\b(?:top\s+)?\d+(?:\.\d+)?%|\b\d+-star|\d+\/\d+/gi,
    // Headline brand markers earned at ThePrivateHotels.
    /\b(?:Airbnb Guest Favorites?|Travelers' Choice(?:\s+Award)?|VRBO Premier(?: Partner)?)\b/g,
    // Punctual qualitative wins.
    /\bError-free\b/g,
    // Money-like values.
    /\$\d[\d,]*(?:\.\d+)?\b/g,
    // Generic "<X min" / "<X hours" patterns.
    /<\s*\d+(?:\.\d+)?\s*(?:hours?|hrs?|minutes?|mins?|s)\b/gi,
  ];

  // Build a flat list of match ranges, dedupe overlaps by keeping
  // the earliest match per index.
  type Range = { end: number; start: number };
  const ranges: Range[] = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      ranges.push({ end: m.index + m[0].length, start: m.index });
      if (m[0].length === 0) pattern.lastIndex += 1;
    }
  }
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Range[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start < last.end) continue;
    merged.push(r);
  }

  if (merged.length === 0) return [text];

  const out: React.ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < merged.length; i += 1) {
    const range = merged[i];
    if (range.start > cursor) {
      out.push(text.slice(cursor, range.start));
    }
    out.push(
      <strong
        className="font-semibold text-text-light"
        key={`m-${range.start}`}
      >
        {text.slice(range.start, range.end)}
      </strong>,
    );
    cursor = range.end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

type ExperienceEntry = {
  bullets: string[];
  company: string;
  featured?: boolean;
  location: string;
  period: string;
  receipts?: { href: string; label: string };
  role: string;
  summary: string;
};

type ProjectEntry = {
  bullets: string[];
  name: string;
  scope: string;
  shipped: string;
  stack: string[];
  status: "active" | "archived";
};

export default function ResumePage() {
  const reduce = useReducedMotion();
  const asideEntry = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 16 },
          transition: { delay, duration: 0.55, ease: easeOutCurve },
        };

  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <ResumeHero />

      {/* Body — editorial dossier. No card wrapper, no boxed feel.
          Long-form sections breathe against the page. Sidebar mirrors
          the Technical Skills datasheet aesthetic. */}
      <LightSection className="pb-24 pt-4 sm:pb-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:items-start">
          <article className="min-w-0">
            <ResumeSection id="summary" index="00" title="Professional Summary">
              <p className="text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
                {professionalSummary}
              </p>
            </ResumeSection>

            <ResumeSection id="experience" index="01" title="Experience">
              <ExperienceLedger entries={experience} />
            </ResumeSection>

            <ResumeSection id="projects" index="02" title="Independent Projects">
              <ProjectLedger entries={projects} />
            </ResumeSection>

            <ResumeSection id="skills" index="03" title="Technical Skills">
              <SkillsDatasheet groups={skillGroups} />
            </ResumeSection>

            <ResumeSection id="education" index="04" title="Education">
              <EducationSpec entries={education} />
            </ResumeSection>
          </article>

          <aside className="lg:sticky lg:top-24">
            <motion.div {...asideEntry(0.1)}>
              <Button
                className="w-full !py-4 !text-base"
                download
                downArrow
                href="/pierre-belon-savon-resume.pdf"
              >
                Download Resume
              </Button>
              <button
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-light bg-bg-light-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-text-light-muted transition-[border-color,background,color] duration-200 hover:border-accent hover:bg-white hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent no-print"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                type="button"
              >
                <span aria-hidden="true" className="text-accent/70">
                  ⌥
                </span>
                Print clean (browser)
              </button>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                PDF · One page · Recruiter-ready
              </p>
            </motion.div>

            {/* CAREER SNAPSHOT — live "building since" + key roll-ups. */}
            <motion.div className="mt-8" {...asideEntry(0.18)}>
              <DatasheetCard slug="~/career" meta="At a glance">
                <ul className="grid">
                  {[
                    {
                      key: "Building since",
                      live: true,
                      value: `${yearsBuilding()} yrs · Apr 2024`,
                    },
                    {
                      key: "Roles now",
                      live: false,
                      value: "2 · Co-founder + Ops",
                    },
                    { key: "Languages", live: false, value: "EN · ES · IT" },
                    { key: "Live products", live: false, value: "3 via Atlas" },
                  ].map((row, index) => (
                    <li
                      className="flex items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                      key={row.key}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[12.5px] leading-6 text-text-light-muted">
                        {row.key}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto h-px flex-1 bg-border-light"
                      />
                      <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-semibold leading-6 text-text-light">
                        {row.live ? (
                          <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
                          </span>
                        ) : null}
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </DatasheetCard>
            </motion.div>

            {/* CONTACT DATASHEET — mirrors the Technical Skills aesthetic:
                terminal header, mono spec rows, accent rule on the side. */}
            <motion.div className="mt-8" {...asideEntry(0.22)}>
              <DatasheetCard
                slug="~/contact"
                meta={`${contactItems.length} channels`}
              >
                <ul className="grid">
                  {contactItems.map((item) => (
                    <li
                      className="group/row relative border-t border-border-light px-5 py-4 transition-colors duration-200 first:border-t-0 hover:bg-[rgba(41,110,214,0.04)]"
                      key={item.label}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        <span className="text-text-light-muted/60">// </span>
                        {item.label}
                      </p>
                      <a
                        className="mt-1.5 inline-flex items-center gap-2 break-all font-mono text-[12.5px] leading-6 text-text-light transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        href={item.href}
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-accent/70 transition-transform duration-200 group-hover/row:translate-x-0.5"
                        >
                          &gt;
                        </span>
                        <span>{item.value}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </DatasheetCard>
            </motion.div>

            <motion.div className="mt-8" {...asideEntry(0.34)}>
              <DatasheetCard slug="~/languages" meta="All native">
                <ul className="grid">
                  {languages.map((language, index) => (
                    <li
                      className="flex items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                      key={language}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[12.5px] leading-6 text-text-light">
                        {language}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto h-px flex-1 bg-border-light"
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                        Native
                      </span>
                    </li>
                  ))}
                </ul>
              </DatasheetCard>
            </motion.div>

            {/* SHIP STATS — anchor on the sidebar that ties the resume to
                the production receipts on the AI page. */}
            <motion.div className="mt-8" {...asideEntry(0.46)}>
              <DatasheetCard slug="~/receipts" meta="Production">
                <ul className="grid">
                  {[
                    { label: "Atlas products live", value: "3" },
                    { label: "Guest reply time", value: "< 3 min" },
                    { label: "Pages digitized to QA", value: "100+" },
                    { label: "Staff trained", value: "6" },
                  ].map((stat, index) => (
                    <li
                      className="flex items-baseline gap-3 border-t border-border-light px-5 py-3 first:border-t-0"
                      key={stat.label}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[12.5px] leading-6 text-text-light-muted">
                        {stat.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto h-px flex-1 bg-border-light"
                      />
                      <span className="font-mono text-[12.5px] font-semibold leading-6 text-text-light">
                        {stat.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </DatasheetCard>
            </motion.div>
          </aside>
        </div>
      </LightSection>

      {/* CHAPTER RAIL — floating right-margin navigation. Same
          component the home page uses; mirrors the 5 indexed
          ResumeSection blocks. */}
      <ChapterRail
        sections={[
          { id: "summary", index: "00", label: "Summary" },
          { id: "experience", index: "01", label: "Experience" },
          { id: "projects", index: "02", label: "Projects" },
          { id: "skills", index: "03", label: "Skills" },
          { id: "education", index: "04", label: "Education" },
        ]}
      />
    </main>
  );
}

function ResumeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            fontSize: "clamp(6rem, 20vw, 20rem)",
            WebkitTextStroke: "1px rgba(41,110,214,0.10)",
            color: "transparent",
          }}
        >
          RÉSUMÉ
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-16 sm:px-6 sm:py-20 lg:gap-x-8 lg:py-24">
        <div className="col-span-12 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
              /resume · curriculum
            </span>
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
            2026
          </span>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <h1
            className="font-semibold text-text-light"
            style={{
              fontSize: "clamp(2.75rem, 10vw, 8.5rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
          >
            <span className="block">
              <SplitText charDelay={0.025} delay={0.12} duration={0.85}>
                Pierre
              </SplitText>
            </span>
            <span className="block">
              <SplitText charDelay={0.025} delay={0.28} duration={0.85}>
                Belon
              </SplitText>
            </span>
            <span className="gradient-shift block">
              <SplitText charDelay={0.025} delay={0.42} duration={0.85}>
                Savon.
              </SplitText>
            </span>
          </h1>

          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent" />
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
              AI Engineer · Building production systems
            </p>
          </div>

          <div className="mt-6">
            <StaggeredChipRail
              baseDelay={0.5}
              chips={["Ocean Shores, WA", "Remote roles", "Freelance projects"]}
              className="flex flex-wrap items-center gap-2"
            />
          </div>
        </div>

        <div className="col-span-12 self-end lg:col-span-4 lg:justify-self-end">
          <Button
            className="!px-8 !py-4 !text-base"
            download
            downArrow
            href="/pierre-belon-savon-resume.pdf"
          >
            Download Resume
          </Button>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted lg:text-right">
            PDF · One page
          </p>
        </div>
      </div>
    </section>
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

/**
 * Editorial section heading — large H2 + chapter index + accent rule.
 * Anchors each resume section like a chapter mark in the rest of the site.
 */
function ResumeSection({
  children,
  id,
  index,
  title,
}: {
  children: ReactNode;
  id?: string;
  index: string;
  title: string;
}) {
  return (
    <section className="mt-20 scroll-mt-28 first:mt-0" id={id}>
      <div className="flex flex-wrap items-baseline gap-4 border-b border-border-light pb-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
          {index} · Section
        </span>
        <span aria-hidden="true" className="h-px w-10 bg-accent/40" />
        <h2
          className="font-semibold tracking-tight text-text-light"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/**
 * Editorial experience timeline. Each role is a full-width entry with
 * massive company display, mono role/period/location rail, summary line,
 * indexed terminal bullets, and a hover gradient hair-line at the bottom.
 * Reads like a printed dossier rather than a resume card.
 */
function ExperienceLedger({ entries }: { entries: ExperienceEntry[] }) {
  const reduce = useReducedMotion();

  return (
    <ol className="grid divide-y divide-border-light border-y border-border-light">
      {entries.map((entry, index) => (
        <motion.li
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="group relative grid grid-cols-12 gap-x-6 gap-y-6 py-12 sm:py-14"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          key={entry.company}
          transition={{
            delay: index * 0.08,
            duration: 0.6,
            ease: easeOutCurve,
          }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          {/* LEFT 7 — index + company display + summary + bullets */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                {String(index + 1).padStart(2, "0")} · Role
              </span>
              {entry.featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-result-green/40 bg-[rgba(16,185,129,0.10)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-result-green">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                    <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
                  </span>
                  Now · Active
                </span>
              ) : null}
            </div>

            <h3
              className="mt-4 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.96,
              }}
            >
              {entry.company}
            </h3>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-text-light sm:text-xl sm:leading-9">
              {entry.summary}
            </p>

            {/* Bullets — terminal `>` prefix to echo the Technical Skills datasheet. */}
            <motion.ul
              className="mt-8 grid gap-2.5"
              initial={reduce ? false : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
              viewport={{ amount: 0.2, once: true }}
              whileInView={reduce ? undefined : "show"}
            >
              {entry.bullets.map((bullet) => (
                <motion.li
                  className="flex items-start gap-2.5 font-mono text-[12.5px] leading-6 text-text-light-muted"
                  key={bullet}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.45, ease: easeOutCurve },
                    },
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent/70"
                  >
                    &gt;
                  </span>
                  <span className="text-[13.5px] leading-7 text-text-light-muted sm:text-sm">
                    {highlightMetrics(bullet)}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT 5 — spec block: role, period, location, accent vertical rule. */}
          <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
            <dl className="grid gap-5">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  Role
                </dt>
                <dd className="mt-2 text-base font-semibold leading-6 text-text-light sm:text-lg">
                  {entry.role}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  Period
                </dt>
                <dd className="mt-2 font-mono text-[12.5px] uppercase tracking-[0.16em] text-text-light">
                  {entry.period}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  Location
                </dt>
                <dd className="mt-2 font-mono text-[12.5px] uppercase tracking-[0.16em] text-text-light">
                  {entry.location}
                </dd>
              </div>
              {entry.receipts ? (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    Receipts
                  </dt>
                  <dd className="mt-2">
                    <a
                      className="group/receipts inline-flex items-baseline gap-1.5 font-mono text-[12.5px] leading-6 text-text-light transition-colors duration-200 hover:text-accent"
                      href={entry.receipts.href}
                    >
                      <span aria-hidden="true" className="text-accent/70">
                        ↳
                      </span>
                      <span className="link-underline">
                        {entry.receipts.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-accent/70 transition-transform duration-200 group-hover/receipts:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Hover gradient hair-line — matches the home page Process band. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </motion.li>
      ))}
    </ol>
  );
}

/**
 * Independent projects ledger — same editorial language as Experience
 * but tighter. Project name as display type, mono scope rail, terminal
 * bullets, stack chips on the right.
 */
function ProjectLedger({ entries }: { entries: ProjectEntry[] }) {
  const reduce = useReducedMotion();

  return (
    <ol className="grid divide-y divide-border-light border-y border-border-light">
      {entries.map((entry, index) => (
        <motion.li
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="group relative grid grid-cols-12 gap-x-6 gap-y-5 py-10 sm:py-12"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          key={entry.name}
          transition={{
            delay: index * 0.06,
            duration: 0.55,
            ease: easeOutCurve,
          }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              {String(index + 1).padStart(2, "0")} · Project
            </p>
            <h3
              className="mt-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
              }}
            >
              {entry.name}
            </h3>

            <ul className="mt-5 grid gap-2">
              {entry.bullets.map((bullet) => (
                <li
                  className="flex items-start gap-2.5 text-[13.5px] leading-7 text-text-light-muted sm:text-sm"
                  key={bullet}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 shrink-0 font-mono text-accent/70"
                  >
                    &gt;
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Status
            </p>
            <p className="mt-2 inline-flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-text-light">
              {entry.status === "active" ? (
                <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
                </span>
              ) : (
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-text-light-muted" />
              )}
              {entry.status === "active" ? "Active" : "Archived"}
              <span aria-hidden="true" className="text-text-light-muted/60">·</span>
              <span className="text-text-light-muted">Shipped {entry.shipped}</span>
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Scope
            </p>
            <p className="mt-2 text-sm leading-6 text-text-light">
              {entry.scope}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Stack
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {entry.stack.map((tech) => (
                <li
                  className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted"
                  key={tech}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </motion.li>
      ))}
    </ol>
  );
}

/**
 * Skills datasheet — reused from the prior Technical Skills design,
 * lifted into its own component so the sidebar datasheets and this
 * block share visual DNA.
 */
function SkillsDatasheet({
  groups,
}: {
  groups: { items: string[]; title: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
        <span>~/stack</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">{groups.length} categories</span>
      </div>
      <div className="grid divide-y divide-border-light md:grid-cols-2 md:divide-x md:divide-y-0">
        {groups.map((group, groupIndex) => (
          <div
            className="relative px-5 py-5 transition-colors duration-200 hover:bg-[rgba(41,110,214,0.04)]"
            key={group.title}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-accent/50"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
              <span className="text-text-light-muted/60">// </span>
              {String(groupIndex + 1).padStart(2, "0")} {group.title}
            </p>
            <ul className="mt-3 grid gap-1.5">
              {group.items.map((item) => (
                <li
                  className="flex items-start gap-2 font-mono text-[12.5px] leading-6 text-text-light-muted"
                  key={item}
                >
                  <span aria-hidden="true" className="mt-1 shrink-0 text-accent/70">
                    &gt;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Education spec rows — same datasheet feel as Skills but linear.
 */
function EducationSpec({
  entries,
}: {
  entries: { meta: string; program: string; status: string }[];
}) {
  return (
    <ol className="grid divide-y divide-border-light border-y border-border-light">
      {entries.map((entry, index) => (
        <li
          className="grid grid-cols-12 gap-x-6 gap-y-2 py-6 sm:py-8"
          key={entry.program}
        >
          <div className="col-span-12 flex items-baseline gap-3 lg:col-span-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="hidden h-px flex-1 bg-border-light lg:block"
            />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <h3 className="text-base font-semibold leading-7 text-text-light sm:text-lg">
              {entry.program}
            </h3>
            <p className="mt-1 text-sm text-text-light-muted">{entry.status}</p>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-light-muted">
              {entry.meta}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Generic datasheet card — reused for the sidebar contact, languages,
 * and ship-stats panels so they read as one consistent dossier of
 * spec sheets rather than mismatched blocks.
 */
function DatasheetCard({
  children,
  meta,
  slug,
}: {
  children: ReactNode;
  meta: string;
  slug: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
      <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
        <span>{slug}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">{meta}</span>
      </div>
      {children}
    </div>
  );
}
