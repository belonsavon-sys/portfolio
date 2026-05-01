import {
  Button,
  GlassCard,
  NavPill,
  PhotoSlot,
  SectionDivider,
} from "@/components";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

const contactLinks = [
  {
    href: "https://github.com/belonsavon-sys",
    Icon: GitHubIcon,
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
  },
  {
    href: "tel:+13606602460",
    Icon: PhoneIcon,
    label: "Phone",
  },
  {
    href: "mailto:belonsavon@gmail.com",
    Icon: MailIcon,
    label: "Email",
  },
];

const roleTags = ["AI Engineer", "Full-Stack Builder", "Systems Architect"];

const toolNodes = [
  {
    className: "left-3 top-6 sm:left-6 sm:top-8",
    label: "GitHub",
    shortLabel: "GH",
    x: 18,
    y: 15,
  },
  {
    className: "right-5 top-4 sm:right-8 sm:top-9",
    label: "Zapier",
    shortLabel: "ZA",
    x: 80,
    y: 16,
  },
  {
    className: "left-0 top-1/3 sm:left-4",
    label: "React",
    shortLabel: "R",
    x: 12,
    y: 36,
  },
  {
    className: "right-0 top-[37%] sm:right-3",
    label: "MySQL",
    shortLabel: "SQL",
    x: 88,
    y: 39,
  },
  {
    className: "left-4 bottom-[25%] sm:left-9",
    label: "Next.js",
    shortLabel: "N",
    x: 20,
    y: 68,
  },
  {
    className: "right-3 bottom-[24%] sm:right-7",
    label: "Express.js",
    shortLabel: "EX",
    x: 82,
    y: 69,
  },
  {
    className: "left-1/2 bottom-4 -translate-x-1/2",
    label: "JavaScript",
    shortLabel: "JS",
    x: 50,
    y: 86,
  },
];

const aboutParagraphs = [
  "Two years ago, I supervised a hotel.",
  "Today, the AI systems running that hotel are systems I built — every guest message, every inspection, every automated workflow. In parallel, at Blackdoor (the company I co-founded), I co-architect Atlas: a multi-level autonomous agent harness shipping real games, apps, and operating systems.",
  'When a problem enters my scope, I take it to mastery before I execute. Solo or paired with AI, I research relentlessly and finish what I start. My divergent thinking catches what specialists miss — and turns "we should automate that" into "it\'s already running."',
  "Trilingual. Hyperfocused. Built to ship.",
];

const stackGroups = [
  {
    items: [
      "Claude",
      "Codex",
      "ChatGPT",
      "MCP",
      "Zapier",
      "n8n",
      "Twilio",
      "Guesty API",
    ],
    title: "AI & Automation",
  },
  {
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    title: "Frontend",
  },
  {
    items: ["Flutter", "Kotlin (KMP)"],
    title: "Mobile",
  },
  {
    items: ["Node.js", "Express.js"],
    title: "Backend",
  },
  {
    items: ["Supabase", "MySQL"],
    title: "Database",
  },
  {
    items: ["Vercel", "GitHub"],
    title: "Infra",
  },
  {
    items: ["Figma", "Framer"],
    title: "Design",
  },
  {
    items: ["VS Code", "Antigravity", "Cursor"],
    title: "IDEs",
  },
];

const metrics = [
  {
    label: "Guest response time",
    value: "48 hrs → under 3 min",
  },
  {
    label: "Drafting time saved",
    value: "15-20 min per message",
  },
  {
    label: "Inventory managed",
    value: "100+ items",
  },
  {
    label: "Staff trained",
    value: "6",
  },
  {
    label: "Operations manual digitized",
    value: "100+ pages → auditable QA",
  },
  {
    label: "Awards",
    value: "Airbnb Top 10% · Booking.com Travelers' Choice · VRBO Premier",
  },
  {
    label: "Agent harness",
    value: "Atlas shipping games, apps, and operating systems",
  },
  {
    label: "Languages",
    value: "English · Spanish · Italian",
  },
];

const sidebarBio =
  "AI Engineer based in Ocean Shores, WA. I build systems that automate operations, eliminate inefficiency, and scale — whether that's a hotel running on AI, or a multi-agent company operating itself.";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LightSection className="pb-20 pt-6 sm:pb-24">
        <HomeHeader />

        <div className="mt-12 grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
          <StickySidebar />

          <div className="min-w-0">
            <HeroSection />
            <CompactBio />
            <AboutSection />
            <StackSection />
          </div>
        </div>
      </LightSection>

      <SectionDivider direction="light-to-dark" />
      <MetricsSection />
      <SectionDivider direction="dark-to-light" />

      <LightSection className="py-20 sm:py-24">
        <CtaSection />
      </LightSection>

      <Footer />
    </main>
  );
}

function HomeHeader() {
  return (
    <header className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <div aria-hidden="true" className="hidden lg:block" />
      <nav
        aria-label="Primary"
        className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-border-light bg-white p-2 shadow-sm"
      >
        {navItems.map((item) => (
          <NavPill active={item.href === "/"} href={item.href} key={item.href}>
            {item.label}
          </NavPill>
        ))}
      </nav>
      <div className="flex items-center justify-center gap-2 lg:justify-end">
        <IconLinks size="sm" />
      </div>
    </header>
  );
}

function StickySidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6 rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <PhotoSlot
          alt="Pierre Belon Savon"
          className="h-72"
          fallbackMeta="Save public/hero-photo.png to replace this automatic fallback."
          fallbackTitle="Hero photo pending"
          fit="contain"
          priority
          src="/hero-photo.png"
        />
        <p className="mt-5 text-sm leading-6 text-text-light-muted">
          {sidebarBio}
        </p>
        <div className="mt-5">
          <IconLinks size="md" />
        </div>
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <section className="grid min-h-[calc(100vh-132px)] items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
      <div>
        <RoleTags />
        <h1 className="text-5xl font-semibold tracking-normal sm:text-7xl lg:text-8xl">
          Hello,
          <span className="mt-3 block">Pierre Belon Savon</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Engineering intelligent automation and full-stack applications that
          turn complex business processes into scalable, profitable systems.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Contact Me →</Button>
          <Button href="/resume" variant="ghost">
            View Resume
          </Button>
        </div>
      </div>

      <HeroConstellation />
    </section>
  );
}

function RoleTags() {
  return (
    <div className="mb-8 grid max-w-sm gap-3">
      {roleTags.map((tag, index) => (
        <div className="flex items-center gap-3" key={tag}>
          <span
            aria-hidden="true"
            className={`h-px bg-accent ${
              index === 1 ? "w-16" : "w-10"
            }`}
          />
          <span className="rounded-lg border border-border-light bg-white px-4 py-2 text-sm font-semibold text-text-light shadow-sm">
            {tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroConstellation() {
  return (
    <div className="relative mx-auto h-[500px] w-full max-w-[440px] overflow-hidden rounded-lg border border-border-light bg-bg-light-2">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
      >
        {toolNodes.map((node) => (
          <line
            key={node.label}
            stroke="rgba(41, 110, 214, 0.35)"
            strokeWidth="0.35"
            x1="50"
            x2={node.x}
            y1="48"
            y2={node.y}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 h-72 w-56 -translate-x-1/2 -translate-y-1/2 sm:h-80 sm:w-64">
        <PhotoSlot
          alt="Pierre Belon Savon"
          className="h-full"
          fallbackMeta="Transparent hero image will appear here when public/hero-photo.png is added."
          fallbackTitle="Photo 3 selected"
          fit="contain"
          priority
          src="/hero-photo.png"
        />
      </div>

      {toolNodes.map((node) => (
        <div
          className={`absolute ${node.className} flex items-center rounded-lg border border-border-light bg-white px-2 py-2 text-sm font-semibold text-text-light shadow-sm sm:px-3`}
          key={node.label}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-bg-light-2 text-xs text-accent sm:mr-2">
            {node.shortLabel}
          </span>
          <span className="hidden sm:inline">{node.label}</span>
        </div>
      ))}
    </div>
  );
}

function CompactBio() {
  return (
    <section className="mb-16 rounded-lg border border-border-light bg-white p-5 shadow-sm xl:hidden">
      <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
        <PhotoSlot
          alt="Pierre Belon Savon"
          className="h-56"
          fallbackMeta="Save public/hero-photo.png to replace this automatic fallback."
          fallbackTitle="Hero photo pending"
          fit="contain"
          src="/hero-photo.png"
        />
        <div>
          <p className="text-sm leading-6 text-text-light-muted">
            {sidebarBio}
          </p>
          <div className="mt-5">
            <IconLinks size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <h2 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            About Me
          </h2>
          <div className="mt-8 grid gap-5 text-lg leading-8 text-text-light-muted">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-5 self-start">
          <PhotoSlot
            alt="Pierre playing guitar off-shift"
            caption="Off-shift."
            className="h-64"
            fallbackMeta="Save public/about-guitar.jpg to replace this automatic fallback."
            fallbackTitle="Photo 1 selected"
            src="/about-guitar.jpg"
          />
          <PhotoSlot
            alt="Pierre at the Hawaii leadership retreat"
            caption="Hawaii — leadership retreat, ThePrivateHotels."
            className="h-64"
            fallbackMeta="Save public/about-hawaii.jpg to replace this automatic fallback."
            fallbackTitle="Photo 2 selected"
            src="/about-hawaii.jpg"
          />
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  return (
    <section className="py-20 sm:py-24">
      <h2 className="text-4xl font-semibold tracking-normal sm:text-5xl">
        My Stack
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stackGroups.map((group) => (
          <article
            className="rounded-lg border border-border-light bg-white p-5"
            key={group.title}
          >
            <h3 className="text-lg font-semibold">{group.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-bg-light-2 px-3 py-2 text-sm font-medium text-text-light"
                  key={item}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-accent"
                  />
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div>
            <h2 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Outcomes that made it into production.
            </h2>
            <p className="mt-5 text-lg leading-8 text-text-dark-muted">
              The work is measured by faster responses, clearer operations, and
              systems people actually use.
            </p>
          </div>

          <GlassCard className="p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4"
                  key={metric.label}
                >
                  <p className="font-mono text-sm text-accent-light">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-semibold leading-7 text-text-dark">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="rounded-lg border border-border-light bg-white p-8 text-center shadow-sm sm:p-12">
      <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
        Let&apos;s build something that actually works.
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-text-light-muted">
        Whether you need AI automation, a full-stack product, or a system that
        runs itself — I&apos;m available for remote roles and projects.
      </p>
      <div className="mt-8">
        <Button href="/contact">Contact Me →</Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-light bg-white py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:px-8 md:flex-row lg:px-12">
        <IconLinks size="sm" />
        <p className="text-sm text-text-light-muted">
          © 2026 Pierre Belon Savon
        </p>
      </div>
    </footer>
  );
}

function IconLinks({ size }: { size: "md" | "sm" }) {
  const sizeClasses = size === "md" ? "h-11 w-11" : "h-10 w-10";
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-2">
      {contactLinks.map(({ Icon, href, label, rel, target }) => (
        <a
          aria-label={label}
          className={`${sizeClasses} inline-flex items-center justify-center rounded-lg border border-border-light bg-white text-text-light transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
          href={href}
          key={label}
          rel={rel}
          target={target}
          title={label}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
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
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.62-.2.62-.44v-1.65c-2.54.55-3.07-1.09-3.07-1.09a2.42 2.42 0 0 0-1.01-1.33c-.83-.56.06-.55.06-.55a1.92 1.92 0 0 1 1.4.94 1.95 1.95 0 0 0 2.66.76 1.94 1.94 0 0 1 .58-1.22c-2.03-.23-4.16-1.01-4.16-4.5a3.52 3.52 0 0 1 .94-2.44 3.27 3.27 0 0 1 .09-2.41s.77-.25 2.52.93a8.7 8.7 0 0 1 4.58 0c1.75-1.18 2.52-.93 2.52-.93a3.27 3.27 0 0 1 .09 2.41 3.52 3.52 0 0 1 .94 2.44c0 3.5-2.14 4.27-4.17 4.49a2.18 2.18 0 0 1 .62 1.69v2.44c0 .25.16.53.63.44A9.25 9.25 0 0 0 12 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 4.75 9.4 4a1.7 1.7 0 0 1 2.1.85l1 2.15a1.8 1.8 0 0 1-.42 2.05l-1.1 1.02a10 10 0 0 0 3.95 3.95l1.02-1.1A1.8 1.8 0 0 1 18 12.5l2.15 1a1.7 1.7 0 0 1 .85 2.1l-.75 1.9A3.1 3.1 0 0 1 17.1 19.5 12.6 12.6 0 0 1 4.5 6.9a3.1 3.1 0 0 1 3-2.15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="18"
        x="3"
        y="5"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
