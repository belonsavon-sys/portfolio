import {
  AtlasDemo,
  AtlasGallery,
  BeforeAfter,
  Button,
  CursorHalo,
  IndexedDivider,
  LiveStatusBadge,
  LocalAiDemo,
  ParallaxBackdrop,
  ParallaxGhost,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SiteFooter,
  SplitText,
} from "@/components";
import type { ReactNode } from "react";

const services = [
  {
    description:
      "Manual workflows automated through Zapier, n8n, and custom APIs. Built with you in the review loop, not around you.",
    icon: "01",
    name: "Process Automation",
  },
  {
    description:
      "Chatbots trained on your data, tuned to your voice, drafting inside your existing tools. Every reply stays human-reviewed before send.",
    icon: "02",
    name: "Custom Chatbots",
  },
  {
    description:
      "Next.js + Supabase web apps, Flutter / Kotlin mobile builds. Idea to deployed product, end-to-end.",
    icon: "03",
    name: "Full-Stack Web & Mobile",
  },
  {
    description:
      "Multi-level autonomous agent systems modeled on Atlas — the harness I co-architect at Blackdoor.",
    icon: "04",
    name: "Agent Harness Design",
  },
  {
    description:
      "If you have a problem and need AI to solve it, I'll figure out how.",
    icon: "05",
    name: "Whatever the brief calls for",
  },
];

const caseStudies = [
  {
    body: "Trained on curated company data — approved templates, brand voice, every guest scenario from check-in instructions to pet rules to TV troubleshooting. Drafts replies inside Smarttask. Staff review, approve, and send in seconds.",
    eyebrow: "01 · ThePrivateHotels · 2024",
    title: "Guest Communications Chatbot",
    comparison: {
      after: {
        caption: "Drafted, reviewed, sent in seconds",
        metric: "< 3 min",
        points: [
          "Chatbot drafts in Smarttask",
          "Staff review and approve",
          "15-20 min saved per message",
        ],
      },
      before: {
        caption: "Manual drafts, missed messages",
        metric: "48 hrs",
        points: [
          "Guest messages waited up to 48 hours",
          "Staff manually composed every reply",
          "Missed notifications meant guests waited days",
        ],
      },
    },
  },
  {
    body: "A 100+ page property operations manual digitized, room by room, into a trackable, quantifiable inspection system. Static documentation became an auditable QA tool.",
    eyebrow: "02 · ThePrivateHotels · 2024",
    title: "Operations Manual → QA System",
    comparison: {
      after: {
        caption: "Trackable QA, accountability built in",
        metric: "Top 10%",
        points: [
          "Every standard a measurable checkpoint",
          "Top 10% Airbnb rating maintained",
          "Booking.com Travelers' Choice + VRBO Premier",
        ],
      },
      before: {
        caption: "Static, unenforceable, no accountability",
        metric: "100+ pages",
        points: [
          "No way to track compliance",
          "Couldn't audit performance",
          "Standards inconsistent across properties",
        ],
      },
    },
  },
];

export default function AiPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <AiHero />

      <LightSection className="py-20 sm:py-24">
        <ServicesSection />
      </LightSection>

      <IndexedDivider index="01" label="Built and shipped" />

      <LightSection className="py-20 sm:py-24" id="built-and-shipped">
        <CaseStudiesSection />
      </LightSection>

      <IndexedDivider index="02" label="Atlas portfolio" />

      <LightSection className="py-20 sm:py-24">
        <AtlasGallerySection />
      </LightSection>

      <SectionDivider direction="light-to-dark" />

      <DemoSection
        eyebrow="Demo 1"
        statusLabel="Local · In your browser"
        title="Local AI. Real business. No cloud required."
        description="Five tasks running on your machine. Pick a tab, load the model, run it. Models cache after first download. No API key, no server, no data leaving your browser."
      >
        <LocalAiDemo />
      </DemoSection>

      <DemoSection
        eyebrow="Demo 2"
        statusLabel="Atlas · Live runtime"
        title="This is what an agent harness looks like in motion."
        description="Atlas is the multi-agent system I co-architect at Blackdoor. Send a prompt. The CEO agent routes it through C-suite to manager to field agents."
      >
        <AtlasDemo />
      </DemoSection>

      <SiteFooter />
    </main>
  );
}

function AiHero() {
  return (
    <section className="relative overflow-hidden">
      <CursorHalo />
      <ParallaxBackdrop>
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/25 blur-3xl" />
      </ParallaxBackdrop>

      {/* Giant ghost AI watermark — sits behind the hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost className="ghost-text select-none">AI</ParallaxGhost>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
        {/* Slash + animated pulse — section identifier */}
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/60 px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
              /ai · what I build
            </p>
          </div>
        </ScrollReveal>

        <h1 className="hero-display-md mt-8 font-semibold">
          <SplitText charDelay={0.03} delay={0.1} duration={0.8}>
            {"I build AI that "}
          </SplitText>
          <span className="relative inline-block">
            <span className="gradient-shift">ships.</span>
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-sm"
            />
          </span>
        </h1>

        <ScrollReveal delay={0.15} direction="up">
          <p className="mt-10 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9">
            Multi-agent harnesses and automation built to change how your
            business operates — not just to impress in a demo.
          </p>
        </ScrollReveal>

        {/* Inline marker stats — three small fact pills */}
        <ScrollReveal delay={0.22} direction="up">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.22em] text-text-light-muted">
            <span className="inline-flex items-center gap-2">
              <span className="text-accent">→</span>
              3 Atlas products live
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-border-light" />
            <span className="inline-flex items-center gap-2">
              <span className="text-accent">→</span>
              48 hrs &rarr; 3 min reply time
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-border-light" />
            <span className="inline-flex items-center gap-2">
              <span className="text-accent">→</span>
              100+ pages digitized into QA
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.32} direction="up">
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button arrow className="!px-8 !py-4 !text-base" href="/contact">
              Start a Project
            </Button>
            <Button
              className="!px-8 !py-4 !text-base"
              href="#built-and-shipped"
              variant="ghost"
            >
              See Built & Shipped
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <div>
      <SectionHeader eyebrow="What I build" title="From process to product." />
      <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <ScrollReveal
            delay={index * 0.05}
            direction="up"
            key={service.name}
          >
            <div className="group relative border-l border-border-light pl-5 transition-[border-color] duration-300 hover:border-accent">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                {service.icon}
              </p>
              <h3 className="mt-3 flex items-baseline gap-2 text-xl font-semibold text-text-light">
                <span>{service.name}</span>
                <span
                  aria-hidden="true"
                  className="inline-block translate-x-0 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                >
                  →
                </span>
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-light-muted">
                {service.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function CaseStudiesSection() {
  return (
    <div>
      <SectionHeader
        eyebrow="Built and shipped"
        title="Three case studies, with receipts."
      />

      <div className="mt-12 grid gap-16">
        {caseStudies.map((study) => (
          <article key={study.title}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {study.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
              {study.title}
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-text-light-muted">
              {study.body}
            </p>
            <div className="mt-8">
              <BeforeAfter
                after={study.comparison.after}
                before={study.comparison.before}
              />
            </div>
          </article>
        ))}

        <article>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            03 · ThePrivateHotels · 2024
          </p>
          <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Workflow Automation — Zapier + Guesty + Twilio
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-text-light-muted">
            A connected automation layer using Zapier, Guesty API, and Twilio
            API — replacing multi-hour coordination loops with automated
            triggers and responses. Team focuses on decisions, not data
            movement.
          </p>
          {/* Wired-system visualization */}
          <div className="relative mt-8">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-between">
              {[
                { label: "Zapier", role: "Trigger" },
                { label: "Guesty API", role: "Source" },
                { label: "Twilio API", role: "Channel" },
              ].map((item, i, arr) => (
                <ScrollReveal
                  delay={i * 0.08}
                  direction="up"
                  key={item.label}
                >
                  <div className="group flex items-center gap-3">
                    <div className="rounded-xl border border-accent/30 bg-[rgba(41,110,214,0.06)] px-5 py-4 text-center transition-[border-color,background] duration-300 hover:border-accent hover:bg-[rgba(41,110,214,0.12)]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                        {item.role}
                      </p>
                      <p className="mt-1.5 text-base font-semibold text-text-light">
                        {item.label}
                      </p>
                    </div>
                    {i < arr.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="hidden text-accent/50 sm:inline-block"
                      >
                        →
                      </span>
                    ) : null}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function AtlasGallerySection() {
  return (
    <div>
      <SectionHeader
        badge={<LiveStatusBadge label="3 products · in motion" />}
        description="Three products built end-to-end via the Atlas multi-agent harness. Real agents wrote the code, opened the PRs, and shipped the features under human review."
        eyebrow="Atlas portfolio"
        title="What Atlas has shipped."
      />
      <div className="mt-12">
        <AtlasGallery />
      </div>
    </div>
  );
}

function DemoSection({
  children,
  description,
  eyebrow,
  statusLabel,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  statusLabel: string;
  title: string;
}) {
  return (
    <section className="relative overflow-hidden bg-bg-dark py-20 text-text-dark sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={<LiveStatusBadge label={statusLabel} />}
          description={description}
          eyebrow={eyebrow}
          title={title}
          tone="dark"
        />
        <div className="scanlines mt-10 rounded-3xl">{children}</div>
      </div>
    </section>
  );
}

function LightSection({
  children,
  className = "",
  id,
}: {
  children?: ReactNode;
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
