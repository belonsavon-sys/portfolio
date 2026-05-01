import { Button, NavPill } from "@/components";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

const contactItems = [
  {
    href: "mailto:belonsavon@gmail.com",
    label: "Email",
    value: "belonsavon@gmail.com",
  },
  {
    href: "tel:+13606602460",
    label: "Phone",
    value: "360-660-2460",
  },
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
    company: "Blackdoor",
    meta: "Sept 2025 - Present | Remote",
    role: "Co-founder & President",
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
  },
  {
    company: "ThePrivateHotels (Soquinomere)",
    meta: "Apr 2024 - Present | Ocean Shores, WA",
    role: "Hotel Operations Supervisor",
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
  },
];

const projects = [
  {
    name: "Workout App",
    scope: "End-to-end, personal",
    bullets: [
      "Built a fully functional personal workout tracking application from scratch, eliminating the need for paid subscription fitness apps.",
      "Stack: Next.js, React, Supabase, Vercel, built with Codex and Claude in VS Code and Antigravity.",
    ],
  },
  {
    name: "Personal Budgeting App",
    scope: "End-to-end, personal",
    bullets: [
      "Developed a budgeting application with a built-in AI financial advisor that had full context of the user's financial data.",
      "Stack: Next.js, React, Supabase, Vercel, built with Codex and Claude.",
    ],
  },
  {
    name: "Daily Market & News Automation",
    scope: "Personal",
    bullets: [
      "Built an automated daily pipeline: ChatGPT-powered web searches for investment research and company news, synced to Google Calendar alongside bills and reminders.",
    ],
  },
];

const skillGroups = [
  {
    title: "AI & Automation",
    items: [
      "LLMs: Claude, ChatGPT, Codex, Perplexity",
      "Agent frameworks: multi-agent harness design, MCP (Model Context Protocol)",
      "Automation platforms: Zapier, n8n",
      "APIs: Guesty, Twilio, OpenAI, Anthropic, REST API integration",
    ],
  },
  {
    title: "Full-Stack Development",
    items: [
      "Frontend: JavaScript, TypeScript, React, Next.js (App Router)",
      "Mobile: Flutter (Dart), Kotlin Multiplatform (KMP) - research/experimental",
      "Backend: Node.js, Express.js",
      "Database: Supabase (PostgreSQL), MySQL",
      "Deployment: Vercel",
      "Version control: Git, GitHub (PR-driven workflow)",
    ],
  },
  {
    title: "Design & Tooling",
    items: ["Figma, Framer", "VS Code, Antigravity, Cursor"],
  },
  {
    title: "Business & Operations",
    items: [
      "Process design and digitization",
      "QA inspection systems",
      "Guest communications systems",
      "Team supervision up to 6 direct/indirect reports",
      "Contractor coordination",
      "Finance data entry",
      "Operational reporting",
    ],
  },
];

const education = [
  {
    meta: "Expected completion: June 2026",
    program: "IBM Full Stack Software Engineer - Professional Certificate",
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
      <LightSection className="pb-20 pt-6 sm:pb-24">
        <SiteNav />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="rounded-lg border border-border-light bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <header>
              <p className="text-sm font-semibold text-accent">/resume</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-normal sm:text-6xl">
                Pierre Belon Savon
              </h1>
              <p className="mt-4 text-xl font-medium text-text-light-muted">
                AI Engineer
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-text-light-muted">
                <span className="rounded-full border border-border-light px-3 py-1">
                  Ocean Shores, WA
                </span>
                <span className="rounded-full border border-border-light px-3 py-1">
                  Remote roles
                </span>
                <span className="rounded-full border border-border-light px-3 py-1">
                  Freelance projects
                </span>
              </div>
            </header>

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
                    role={`${item.company} - ${item.role}`}
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

          <aside className="rounded-lg border border-border-light bg-bg-light-2 p-6 lg:sticky lg:top-8">
            <Button
              className="w-full"
              download
              href="/pierre-belon-savon-resume.pdf"
            >
              Download Resume
            </Button>

            <div className="mt-8 border-t border-border-light pt-6">
              <h2 className="text-lg font-semibold">Contact</h2>
              <dl className="mt-4 grid gap-4 text-sm">
                {contactItems.map((item) => (
                  <div key={item.label}>
                    <dt className="font-semibold">{item.label}</dt>
                    <dd className="mt-1 text-text-light-muted">
                      <a
                        className="break-words transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-border-light bg-white p-2 shadow-sm"
    >
      {navItems.map((item) => (
        <NavPill
          active={item.href === "/resume"}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </NavPill>
      ))}
    </nav>
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
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
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
    <section className="mt-10 border-t border-border-light pt-8">
      <h2 className="mb-5 text-2xl font-semibold tracking-normal">{title}</h2>
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
