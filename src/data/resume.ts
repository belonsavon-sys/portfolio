/**
 * Single source of truth for Pierre's résumé content. Consumed by:
 *   - /resume page (editorial profile)
 *   - /api/resume (downloadable PDF)
 *
 * Keeping the content here means the two surfaces never drift apart.
 */

export const professionalSummary =
  "I learned to ship by automating the hotel I was hired to supervise. In 2025 I co-founded Blackdoor and co-architected Atlas — the multi-level agent harness that ships our real apps under human PR review. I work the seam between live operations (hospitality, finance) and AI engineering. I speak EN · ES · IT.";

export type ExperienceEntry = {
  bullets: string[];
  company: string;
  featured?: boolean;
  location: string;
  period: string;
  receipts?: { href: string; label: string };
  role: string;
  summary: string;
};

export const experience: ExperienceEntry[] = [
  {
    bullets: [
      "Co-founded the holding company. Products ship end-to-end through an autonomous agent harness — no human dev team.",
      "Designed and built Atlas — a multi-level autonomous agent harness that connects any AI model to any external tool through MCP or OAuth.",
      "Had Atlas orchestrate a full company hierarchy: CEO agent down to C-suite agents, manager agents, and field agents.",
      "Shipped a game app, a budget web app, and an agent-augmented project management system through Atlas.",
      "Lead AI R&D — harness architecture, backend systems, on-device + cloud deployment.",
      "Every change ships through a GitHub PR with documentation + spec research filed before the implementation sprint.",
      "Tooling: Claude, Codex, Perplexity, Antigravity, Cursor, VS Code, GitHub.",
    ],
    company: "Blackdoor",
    featured: true,
    location: "Remote",
    period: "Sept 2025 — Present",
    receipts: { href: "https://pierrebelonsavon.com/atlas", label: "pierrebelonsavon.com/atlas" },
    role: "Co-founder & President",
    summary:
      "Co-architecting Atlas — the multi-agent harness that ships our products under my review.",
  },
  {
    bullets: [
      "Progressed from Finance Data Entry Assistant and part-time Housekeeper to Hotel Operations Supervisor.",
      "Built and deployed a guest communications chatbot trained on curated company data — drafts replies in Smarttask, I review before send.",
      "Cut response time from up to 48 hours down to under 3 minutes, saving 15–20 minutes of drafting per message.",
      "Digitized the property's 100+ page operations manual into a room-by-room QA inspection system with trackable scores.",
      "Automated hotel workflows with Zapier, the Guesty API, and the Twilio API — replaced multi-hour manual coordination loops.",
      "Supervised a team of 6, authored room-by-room SOPs and inspection checklists, and trained everyone on every tool I deployed.",
      "Handled customer invoices, bills, and expenses in QuickBooks for 6 months — error-free record.",
      "Work contributed to Airbnb Guest Favorites top 10%, Booking.com Travelers' Choice Award, and VRBO Premier Partner status.",
    ],
    company: "ThePrivateHotels",
    location: "Ocean Shores, WA",
    period: "Apr 2024 — Present",
    receipts: { href: "https://pierrebelonsavon.com/business", label: "pierrebelonsavon.com/business" },
    role: "Hotel Operations Supervisor",
    summary:
      "Walked into a 100+ page manual and a 48-hour reply lag; left behind a digital QA system and 3-minute responses.",
  },
];

export type ProjectEntry = {
  bullets: string[];
  name: string;
  scope: string;
  shipped: string;
  stack: string[];
  status: "active" | "archived";
};

export const projects: ProjectEntry[] = [
  {
    bullets: [
      "Workout tracker that replaced paid subscription fitness apps — Next.js + React + Supabase + Vercel.",
    ],
    name: "Workout App",
    scope: "End-to-end, personal",
    shipped: "2025",
    stack: ["Next.js", "React", "Supabase", "Vercel"],
    status: "active",
  },
  {
    bullets: [
      "Budgeting app with an AI advisor wired to read full transaction history and answer in plain language.",
    ],
    name: "Personal Budgeting App",
    scope: "End-to-end, personal",
    shipped: "2025",
    stack: ["Next.js", "Supabase", "AI advisor"],
    status: "active",
  },
  {
    bullets: [
      "Automated daily pipeline: ChatGPT-powered web searches for investment research + company news, synced into Google Calendar.",
    ],
    name: "Daily Market & News Automation",
    scope: "Personal",
    shipped: "2024",
    stack: ["ChatGPT", "Google Calendar API"],
    status: "active",
  },
];

export const skillGroups: { items: string[]; title: string }[] = [
  {
    items: [
      "Claude · ChatGPT · Codex · Perplexity",
      "Multi-agent harness design · MCP",
      "Zapier · n8n",
      "Guesty · Twilio · OpenAI · Anthropic · REST",
    ],
    title: "AI & Automation",
  },
  {
    items: [
      "JavaScript · TypeScript · React · Next.js",
      "Flutter (Dart) · Kotlin Multiplatform",
      "Node.js · Express.js",
      "Supabase (Postgres) · MySQL · Vercel · Git · GitHub",
    ],
    title: "Full-Stack",
  },
  {
    items: ["Figma · Framer", "VS Code · Antigravity · Cursor"],
    title: "Design & Tooling",
  },
  {
    items: [
      "Process design + digitization",
      "QA inspection systems",
      "Guest communications systems",
      "Team supervision + contractor coordination",
      "Finance data entry + operational reporting",
    ],
    title: "Business & Operations",
  },
];

export const education = [
  {
    issuer: "IBM",
    meta: "Expected June 2026",
    program: "IBM Full Stack Software Engineer · Professional Certificate",
    status: "In progress",
  },
  {
    issuer: "Texas A&M University–Kingsville",
    meta: "Kingsville, TX · 2019 — 2020",
    program: "Civil Engineering",
    status: "Archived",
  },
];

export const languages = ["English", "Spanish", "Italian"];
