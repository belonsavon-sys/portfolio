import {
  Button,
  GlassCard,
  ScrollReveal,
  SectionDivider,
} from "@/components";
import type { ReactNode } from "react";

const stats = [
  { label: "Active product", value: "Atlas — multi-agent harness" },
  { label: "Hotel ops", value: "48 hrs → < 3 min response" },
  { label: "Inventory managed", value: "100+ items" },
  { label: "Staff trained", value: "6" },
  { label: "QuickBooks ledger", value: "6 months · error-free" },
  { label: "Languages", value: "EN · ES · IT (native)" },
];

const contactItems = [
  {
    href: "mailto:belonsavon@gmail.com",
    label: "Email",
    value: "belonsavon@gmail.com",
  },
  { href: "tel:+13606602460", label: "Phone", value: "360-660-2460" },
  {
    href: "https://github.com/belonsavon-sys",
    label: "GitHub",
    value: "github.com/belonsavon-sys",
  },
];

const professionalSummary =
  "AI Engineer with a proven track record of designing and deploying intelligent automation systems that eliminate operational inefficiency and produce measurable business outcomes. Experienced building full-stack applications, multi-agent AI harnesses, and process digitization tools, and putting them to work inside live business operations. Trilingual communicator with a background bridging hospitality operations, finance, and AI-driven product development.";

const experience = [
  {
    bullets: [
      "Co-founded a holding company developing and operating agentic companies across entertainment, SaaS, robotics, and AI.",
      "Designed and built Atlas, a multi-level autonomous agent harness connecting subscription AI models, local models, API models, and any external tool via API, MCP, or OAuth.",
      "Atlas orchestrates a full company hierarchy: CEO agent to C-suite agents, manager agents, and field agents.",
      "Atlas has shipped a game app, a budget web app, and an agent-augmented project management system.",
      "Directing AI R&D across agent harness architecture, backend AI systems, and cloud and local deployment strategies.",
      "All development is governed through GitHub PR workflows, with full documentation and spec research completed before implementation sprints.",
      "Technologies: Claude, Codex, Perplexity, Antigravity, Cursor, VS Code, GitHub.",
      "Underlying technology reworked and deployed at an active hospitality business.",
    ],
    company: "Blackdoor",
    meta: "Sept 2025 - Present | Remote",
    role: "Co-founder & President",
  },
  {
    bullets: [
      "Progressed from Finance Data Entry Assistant and part-time Housekeeper to Housekeeping Supervisor and Hotel Operations Supervisor.",
      "Originally onboarded as a remote contractor from Italy, then recruited to relocate to Washington for full-time employment.",
      "Supervised a team of 6 and managed contractor relationships and scheduling.",
      "Oversaw operations across 1 active property while supporting the buildout of 3 additional properties and 2 event venues.",
      "Digitized a 100+ page property operations manual into a trackable, quantifiable digital inspection process.",
      "Built and deployed a guest communications chatbot trained on curated company data for human-reviewed replies in Smarttask.",
      "Cut response time from up to 48 hours to under 3 minutes, saving 15-20 minutes of drafting per message.",
      "Automated hotel workflows using Zapier, Guesty API, and Twilio API, replacing multi-hour manual coordination loops.",
      "Authored room-by-room SOPs, laundry procedures, and inspection checklists; trained 6 staff on systems, standards, and tools.",
      "Managed 100+ inventory items across linens, amenities, F&B, laundry supplies, and property equipment.",
      "Processed invoices, bills, and receipts in QuickBooks for roughly 6 months with zero errors on record.",
      "Contributed to Airbnb Guest Favorites top 10%, Booking.com Travelers' Choice Award, VRBO Premier Partner, and a consistent 5-star average.",
      "Attended leadership and manager-level meetings, prepared operational reports, and participated in a company leadership retreat in Hawaii.",
    ],
    company: "ThePrivateHotels (Soquinomere)",
    meta: "Apr 2024 - Present | Ocean Shores, WA",
    role: "Hotel Operations Supervisor",
  },
];

const projects = [
  {
    bullets: [
      "Built a fully functional personal workout tracking application from scratch, eliminating the need for paid subscription fitness apps.",
      "Stack: Next.js, React, Supabase, Vercel, built with Codex and Claude in VS Code and Antigravity.",
    ],
    name: "Workout App",
    scope: "End-to-end, personal",
  },
  {
    bullets: [
      "Developed a budgeting application with a built-in AI financial advisor that had full context of the user's financial data.",
      "Stack: Next.js, React, Supabase, Vercel, built with Codex and Claude.",
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

const languages = ["English (native)", "Spanish (native)", "Italian (native)"];

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <ResumeHero />
      <SectionDivider direction="dark-to-light" />

      <LightSection className="pb-24 pt-12 sm:pb-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <ScrollReveal direction="up">
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
          </ScrollReveal>

          <aside className="rounded-3xl border border-border-light bg-bg-light-2 p-6 lg:sticky lg:top-24">
            <Button
              className="!bg-accent !text-white w-full !py-4 text-base"
              download
              href="/pierre-belon-savon-resume.pdf"
            >
              Download Resume ↓
            </Button>

            <div className="mt-8 border-t border-border-light pt-6">
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
            </div>

            <div className="mt-8 border-t border-border-light pt-6">
              <h2 className="text-lg font-semibold">Languages</h2>
              <ul className="mt-4 grid gap-2 text-sm text-text-light-muted">
                {languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </LightSection>
    </main>
  );
}

function ResumeHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/10 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
            /resume
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="up">
          <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-text-dark sm:text-7xl">
            Pierre Belon Savon
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1} direction="up">
          <p className="mt-4 text-xl text-text-dark-muted">AI Engineer</p>
        </ScrollReveal>
        <ScrollReveal delay={0.15} direction="up">
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
            <span className="rounded-full border border-[rgba(41,110,214,0.35)] px-3 py-1.5">
              Ocean Shores, WA
            </span>
            <span className="rounded-full border border-[rgba(41,110,214,0.35)] px-3 py-1.5">
              Remote roles
            </span>
            <span className="rounded-full border border-[rgba(41,110,214,0.35)] px-3 py-1.5">
              Freelance projects
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.22} direction="up">
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <GlassCard className="p-5" key={stat.label}>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-light">
                  {stat.label}
                </p>
                <p className="mt-2 text-base font-semibold leading-7 text-text-dark sm:text-lg">
                  {stat.value}
                </p>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
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
      <h2 className="mb-5 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function RoleEntry({
  bullets,
  meta,
  role,
}: {
  bullets: string[];
  meta: string;
  role: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h3 className="text-lg font-semibold">{role}</h3>
        <p className="shrink-0 text-sm text-text-light-muted sm:text-right">
          {meta}
        </p>
      </div>
      <ul className="mt-4 grid gap-2 pl-5 text-sm leading-6 text-text-light-muted">
        {bullets.map((bullet) => (
          <li className="list-disc" key={bullet}>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
