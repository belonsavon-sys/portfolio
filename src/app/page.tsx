"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Button,
  GlassCard,
  PhotoSlot,
  ScrollReveal,
  SectionDivider,
} from "@/components";
import type { ReactNode } from "react";

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
  { items: ["Flutter", "Kotlin (KMP)"], title: "Mobile" },
  { items: ["Node.js", "Express.js"], title: "Backend" },
  { items: ["Supabase", "MySQL"], title: "Database" },
  { items: ["Vercel", "GitHub"], title: "Infra" },
  { items: ["Figma", "Framer"], title: "Design" },
  { items: ["VS Code", "Antigravity", "Cursor"], title: "IDEs" },
];

const metrics = [
  { label: "Guest response time", value: "48 hrs → < 3 min" },
  { label: "Drafting time saved", value: "15-20 min / msg" },
  { label: "Inventory managed", value: "100+ items" },
  { label: "Staff trained", value: "6" },
  { label: "Manual digitized", value: "100+ pages → QA" },
  { label: "Awards", value: "Top 10% Airbnb · Travelers' Choice" },
  { label: "Agent harness", value: "Atlas — 3 products shipping" },
  { label: "Languages", value: "EN · ES · IT (native)" },
];

const sidebarBio =
  "AI Engineer based in Ocean Shores, WA. I build systems that automate operations, eliminate inefficiency, and scale — whether that's a hotel running on AI, or a multi-agent company operating itself.";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <Hero />

      <SectionDivider direction="light-to-dark" />
      <MetricsBand />
      <SectionDivider direction="dark-to-light" />

      <LightSection className="pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="grid gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Sidebar />
          <div className="min-w-0">
            <About />
            <Stack />
          </div>
        </div>
      </LightSection>

      <LightSection className="pb-24 pt-4 sm:pb-32">
        <Cta />
      </LightSection>

      <Footer />
    </main>
  );
}

function Hero() {
  const reduce = useReducedMotion();

  const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];
  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.7, ease: easeOut },
        };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.p
          className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent"
          {...fadeUp(0)}
        >
          Hello,
        </motion.p>

        <motion.h1
          className="mt-4 text-5xl font-semibold leading-[0.95] tracking-tight text-text-light sm:text-7xl lg:text-[7.5rem]"
          {...fadeUp(0.08)}
        >
          Pierre Belon Savon
        </motion.h1>

        <motion.div
          aria-hidden="true"
          animate={{ scaleX: 1 }}
          className="mt-6 h-[3px] w-24 origin-left rounded-full bg-accent"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.55, duration: 0.55, ease: "easeOut" }}
        />

        <motion.p
          className="mt-8 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9"
          {...fadeUp(0.18)}
        >
          Engineering intelligent automation and full-stack applications that
          turn complex business processes into scalable, profitable systems.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          {...fadeUp(0.28)}
        >
          <Button href="/contact">Contact Me →</Button>
          <Button href="/ai" variant="ghost">
            See What I Build
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.18em] text-text-light-muted"
          {...fadeUp(0.38)}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI Engineer
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Full-Stack Builder
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Systems Architect
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function MetricsBand() {
  return (
    <section className="bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <ScrollReveal direction="left">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent-light">
              Outcomes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-dark sm:text-4xl lg:text-5xl">
              Shipped to production. Measured by what changed.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-text-dark-muted">
              Faster responses, clearer operations, systems people actually use
              every day.
            </p>
          </ScrollReveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric, index) => (
              <ScrollReveal
                delay={0.05 + index * 0.04}
                direction="fade"
                key={metric.label}
              >
                <GlassCard className="h-full p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-light">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-text-dark sm:text-xl">
                    {metric.value}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-2xl border border-border-light bg-white p-5 shadow-sm">
        <PhotoSlot
          alt="Pierre Belon Savon"
          className="h-72"
          fallbackMeta="Save public/hero-photo.png to replace this placeholder."
          fallbackTitle="Hero photo pending"
          fit="contain"
          priority
          src="/hero-photo.png"
        />
        <p className="mt-5 text-sm leading-6 text-text-light-muted">
          {sidebarBio}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <SidebarIcon
            href="https://github.com/belonsavon-sys"
            label="GitHub"
            target="_blank"
          >
            <GitHubIcon className="h-4 w-4" />
          </SidebarIcon>
          <span className="h-5 w-px bg-border-light" />
          <SidebarIcon href="tel:+13606602460" label="Phone">
            <PhoneIcon className="h-4 w-4" />
          </SidebarIcon>
          <span className="h-5 w-px bg-border-light" />
          <SidebarIcon href="mailto:belonsavon@gmail.com" label="Email">
            <MailIcon className="h-4 w-4" />
          </SidebarIcon>
        </div>
      </div>
    </aside>
  );
}

function SidebarIcon({
  children,
  href,
  label,
  target,
}: {
  children: ReactNode;
  href: string;
  label: string;
  target?: "_blank";
}) {
  return (
    <a
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-light bg-white text-text-light transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={href}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
      title={label}
    >
      {children}
    </a>
  );
}

function About() {
  return (
    <section className="pb-16 sm:pb-20" id="about">
      <ScrollReveal direction="up">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          About me
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Two years ago, I supervised a hotel.
        </h2>
      </ScrollReveal>

      <div className="mt-8 grid gap-5 text-lg leading-8 text-text-light-muted">
        {aboutParagraphs.slice(1).map((paragraph, index) => (
          <ScrollReveal delay={index * 0.05} direction="up" key={paragraph}>
            <p>{paragraph}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal direction="up">
        <div className="mt-12 overflow-hidden rounded-3xl bg-bg-dark p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
            Outside the work
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <ScrollReveal delay={0.05} direction="left">
              <GlassCard className="h-full p-3">
                <PhotoSlot
                  alt="Pierre playing guitar off-shift"
                  className="h-72"
                  fallbackMeta="Save public/about-guitar.png to replace this placeholder."
                  fallbackTitle="Photo 1 selected"
                  fit="cover"
                  src="/about-guitar.png"
                />
                <p className="mt-3 px-2 text-sm text-text-dark-muted">
                  Off-shift.
                </p>
              </GlassCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1} direction="right">
              <GlassCard className="h-full p-3">
                <PhotoSlot
                  alt="Pierre at the Hawaii leadership retreat"
                  className="h-72"
                  fallbackMeta="Save public/about-hawaii.png to replace this placeholder."
                  fallbackTitle="Photo 2 selected"
                  fit="cover"
                  src="/about-hawaii.png"
                />
                <p className="mt-3 px-2 text-sm text-text-dark-muted">
                  Hawaii — leadership retreat, ThePrivateHotels.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Stack() {
  return (
    <section className="pb-12 pt-8 sm:pb-16" id="stack">
      <ScrollReveal direction="up">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          My stack
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          What I use to ship.
        </h2>
      </ScrollReveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stackGroups.map((group, index) => (
          <ScrollReveal
            delay={index * 0.04}
            direction="up"
            key={group.title}
          >
            <article className="group h-full rounded-2xl border border-border-light bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md">
              <h3 className="text-base font-semibold text-text-light">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2.5 py-1 text-xs font-medium text-text-light"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <ScrollReveal direction="up">
      <section className="rounded-3xl border border-border-light bg-white p-8 text-center shadow-sm sm:p-14">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Ready when you are
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Let&apos;s build something that actually works.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-text-light-muted">
          Whether you need AI automation, a full-stack product, or a system
          that runs itself — I&apos;m available for remote roles and projects.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact">Contact Me →</Button>
          <Button href="/resume" variant="ghost">
            View Resume
          </Button>
        </div>
      </section>
    </ScrollReveal>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-light bg-white py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-text-light-muted">
          © 2026 Pierre Belon Savon
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted">
          Built business-first
        </p>
      </div>
    </footer>
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
