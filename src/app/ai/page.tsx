import {
  AtlasDemo,
  AtlasGallery,
  BeforeAfter,
  Button,
  CursorHalo,
  LiveStatusBadge,
  LocalAiDemo,
  ScrollReveal,
  SiteFooter,
} from "@/components";
import type { ReactNode } from "react";

const services = [
  {
    description:
      "Turn your manual workflows into automated systems. API integrations, Zapier flows, and custom pipelines that run without you.",
    icon: "01",
    name: "Process Automation",
  },
  {
    description:
      "AI-powered communication tools trained on your data, tuned to your brand voice, and connected to your existing tools — with every action reviewed before it executes.",
    icon: "02",
    name: "Custom Chatbot Development",
  },
  {
    description:
      "End-to-end applications built to solve a specific business problem. From idea to deployed product, built with the right stack for the outcome.",
    icon: "03",
    name: "Full-Stack Web & Mobile Apps",
  },
  {
    description:
      "Multi-level autonomous agent systems that route work, spin up sub-agents, and take action — modeled on the same architecture powering Blackdoor.",
    icon: "04",
    name: "Agent Harness Design",
  },
  {
    description:
      "If you have a problem and need AI to solve it, I'll figure out how.",
    icon: "05",
    name: "Anything a Business Pays For",
  },
];

const caseStudies = [
  {
    body: "Trained on curated company data — approved templates, brand voice, every guest scenario from check-in instructions to pet rules to TV troubleshooting. Drafts replies inside Smarttask. Staff review, approve, and send in seconds.",
    eyebrow: "Case study 01",
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
    eyebrow: "Case study 02",
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

      <SectionRule />

      <LightSection className="py-20 sm:py-24" id="built-and-shipped">
        <CaseStudiesSection />
      </LightSection>

      <SectionRule />

      <LightSection className="py-20 sm:py-24">
        <AtlasGallerySection />
      </LightSection>

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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-light/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent">
            /ai
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="up">
          <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-[7rem]">
            I build AI that{" "}
            <span className="bg-gradient-to-r from-accent-deep via-accent to-accent-light bg-clip-text text-transparent">
              ships.
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1} direction="up">
          <div
            aria-hidden="true"
            className="mt-8 h-[3px] w-32 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.15} direction="up">
          <p className="mt-8 max-w-3xl text-lg leading-8 text-text-light-muted sm:text-2xl sm:leading-9">
            Agent harnesses, process automation, full-stack applications —
            built to change how your business operates, not just to impress in
            a demo.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.22} direction="up">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact">Get in Touch →</Button>
            <Button href="#built-and-shipped" variant="ghost">
              Built and Shipped
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
      <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
        What I build
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        From process to product.
      </h2>
      <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div className="border-l border-border-light pl-5" key={service.name}>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              {service.icon}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-text-light">
              {service.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-text-light-muted">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseStudiesSection() {
  return (
    <div>
      <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
        Built and shipped
      </p>
      <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Case studies. Real systems. Real outcomes.
      </h2>

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
            Case study 03
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
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Zapier", "Guesty API", "Twilio API"].map((item) => (
              <div
                className="rounded-xl border border-accent/30 bg-[rgba(41,110,214,0.06)] px-4 py-3 text-center font-mono text-sm uppercase tracking-[0.18em] text-text-light"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function AtlasGallerySection() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Atlas portfolio
        </p>
        <span aria-hidden="true" className="h-px w-8 bg-accent/40" />
        <LiveStatusBadge label="3 products · in motion" />
      </div>
      <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
        What Atlas has shipped.
      </h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-text-light-muted">
        Three products built end-to-end via the Atlas multi-agent harness.
        Real agents wrote the code, opened the PRs, and shipped the features
        under human review.
      </p>
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
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
            {eyebrow}
          </p>
          <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
          <LiveStatusBadge label={statusLabel} />
        </div>
        <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-dark-muted">
          {description}
        </p>
        <div className="scanlines mt-10 rounded-3xl">{children}</div>
      </div>
    </section>
  );
}

function SectionRule() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent"
      />
    </div>
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
