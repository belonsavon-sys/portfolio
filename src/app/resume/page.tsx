"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Button,
  ParallaxGhost,
  RoleEntry,
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

// Blackdoor leads now (most novel asset).
const experience = [
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
    meta: "Sept 2025 - Present | Remote",
    role: "Co-founder & President",
  },
  {
    // Trimmed: removed pure-ops bullets (laundry SOPs detail, F&B inventory specifics,
    // multi-line Hawaii breakdown). Kept the AI/engineering work.
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
    company: "ThePrivateHotels (Soquinomere)",
    meta: "Apr 2024 - Present | Ocean Shores, WA",
    role: "Hotel Operations Supervisor",
  },
];

const projects = [
  {
    bullets: [
      "Personal workout tracker. Replaced the paid subscription fitness apps I used to use.",
      "Stack: Next.js, React, Supabase, Vercel — built with Codex and Claude in VS Code and Antigravity.",
    ],
    name: "Workout App",
    scope: "End-to-end, personal",
  },
  {
    bullets: [
      "Budgeting app with a built-in AI advisor that reads your full transaction history and answers in plain language.",
      "Stack: Next.js, React, Supabase, Vercel — built with Codex and Claude.",
    ],
    name: "Personal Budgeting App",
    scope: "End-to-end, personal",
  },
  {
    bullets: [
      "Built an automated daily pipeline: ChatGPT-powered web searches for investment research and company news, synced to Google Calendar alongside bills and reminders.",
    ],
    name: "Daily Market & News Automation",
    scope: "Personal",
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
    school: "In Progress",
  },
  {
    meta: "Kingsville, TX | 2019-2020",
    program: "Civil Engineering",
    school: "Texas A&M University of Kingsville",
  },
];

const languages = ["English", "Spanish", "Italian"];

const easeOutCurve = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

      <LightSection className="pb-24 pt-8 sm:pb-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="rounded-3xl border border-border-light bg-white p-6 shadow-sm sm:p-10 lg:p-12">
              <ResumeSection title="Professional Summary">
                <p className="leading-8 text-text-light-muted">
                  {professionalSummary}
                </p>
              </ResumeSection>

              <ResumeSection title="Experience">
                <div className="grid gap-10">
                  {experience.map((item) => (
                    <RoleEntry
                      bullets={item.bullets}
                      featured={item.featured}
                      key={item.company}
                      meta={item.meta}
                      role={`${item.company} — ${item.role}`}
                    />
                  ))}
                </div>
              </ResumeSection>

              <ResumeSection title="Independent Projects">
                <div className="grid gap-8">
                  {projects.map((project) => (
                    <RoleEntry
                      bullets={project.bullets}
                      key={project.name}
                      meta={project.scope}
                      role={project.name}
                    />
                  ))}
                </div>
              </ResumeSection>

              <ResumeSection title="Technical Skills">
                <div className="grid gap-6 md:grid-cols-2">
                  {skillGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="font-semibold">{group.title}</h3>
                      <ul className="mt-3 grid gap-2 text-sm leading-6 text-text-light-muted">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ResumeSection>

              <ResumeSection title="Education">
                <div className="grid gap-5">
                  {education.map((item) => (
                    <div key={item.program}>
                      <h3 className="font-semibold">{item.program}</h3>
                      <p className="mt-1 text-text-light-muted">{item.school}</p>
                      <p className="mt-1 text-sm text-text-light-muted">
                        {item.meta}
                      </p>
                    </div>
                  ))}
                </div>
              </ResumeSection>
          </article>

          <aside className="rounded-3xl border border-border-light bg-bg-light-2 p-6 lg:sticky lg:top-24">
            <motion.div {...asideEntry(0.1)}>
              <Button
                className="w-full !py-4 !text-base"
                download
                downArrow
                href="/pierre-belon-savon-resume.pdf"
              >
                Download Resume
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 border-t border-border-light pt-6"
              {...asideEntry(0.22)}
            >
              <h2 className="text-lg font-semibold">Contact</h2>
              <dl className="mt-4 grid gap-4 text-sm">
                {contactItems.map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1">
                      <a
                        className="break-words text-text-light transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        href={item.href}
                      >
                        {item.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              className="mt-8 border-t border-border-light pt-6"
              {...asideEntry(0.34)}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold">Languages</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                  All native
                </p>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-text-light-muted">
                {languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </LightSection>
    </main>
  );
}

function ResumeHero() {
  return (
    <section className="relative overflow-hidden">

      {/* Ghost watermark */}
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

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/65 px-4 py-1.5 backdrop-blur-md">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
          </span>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
            /resume · curriculum
          </p>
        </div>

        <h1 className="hero-display-md mt-8 font-semibold">
          <SplitText charDelay={0.035} delay={0.15} duration={0.85}>
            Pierre Belon Savon
          </SplitText>
        </h1>
        <p className="mt-4 font-mono text-sm uppercase tracking-[0.28em] text-text-light-muted">
          AI Engineer
        </p>

        <StaggeredChipRail
          baseDelay={0.4}
          chips={["Ocean Shores, WA", "Remote roles", "Freelance projects"]}
        />

        <div className="mt-10">
          <Button
            className="!px-8 !py-4 !text-base"
            download
            href="/pierre-belon-savon-resume.pdf"
          >
            Download Resume ↓
          </Button>
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

function ResumeSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="mt-10 border-t border-border-light pt-8 first:mt-0 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-6 bg-accent"
        />
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

