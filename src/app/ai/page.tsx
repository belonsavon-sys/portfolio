import {
  AtlasDemo,
  AtlasGallery,
  BeforeAfter,
  Button,
  CursorHalo,
  GlassCard,
  LightGlassCard,
  LiveStatusBadge,
  LocalAiDemo,
  ScrollReveal,
  SectionDivider,
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

export default function AiPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <AiHero />

      <LightSection className="py-20 sm:py-24">
        <ServicesSection />
      </LightSection>

      <SectionDivider direction="light-to-dark" />
      <CaseStudiesBand />

      <DarkSection className="py-20 sm:py-24">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
              Atlas portfolio
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
            <LiveStatusBadge label="3 products · in motion" />
          </div>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
            What Atlas has shipped.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-dark-muted">
            Three products built end-to-end via the Atlas multi-agent harness.
            Real agents wrote the code, opened the PRs, and shipped the
            features under human review.
          </p>
        </ScrollReveal>
        <div className="mt-12">
          <AtlasGallery />
        </div>
      </DarkSection>

      <DarkSection className="pt-10 pb-10 sm:pt-12">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
              Demo 1
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
            <LiveStatusBadge label="WebGPU · Running" />
          </div>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
            Local AI. Real business. No cloud required.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-dark-muted">
            Five tasks running on your machine. Pick a tab, load the model,
            run it. Models cache after first download. No API key, no server,
            no data leaving your browser.
          </p>
        </ScrollReveal>
        <div className="scanlines mt-10 rounded-3xl">
          <LocalAiDemo />
        </div>
      </DarkSection>

      <DarkSection className="pb-20 sm:pb-24">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
              Demo 2
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
            <LiveStatusBadge label="Atlas · Live runtime" />
          </div>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
            This is what an agent harness looks like in motion.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-dark-muted">
            Atlas is the multi-agent system I co-architect at Blackdoor. Send
            a prompt. The CEO agent routes it through C-suite to manager to
            field agents. Click <span className="font-semibold text-text-dark">Run Live</span>
            {" "}to call Anthropic in real time, or <span className="font-semibold text-text-dark">Run Simulation</span>
            {" "}to see the choreography.
          </p>
        </ScrollReveal>
        <div className="scanlines mt-10 rounded-3xl">
          <AtlasDemo />
        </div>
      </DarkSection>
      <SectionDivider direction="dark-to-light" />

      <LightSection className="py-24 sm:py-32">
        <Cta />
      </LightSection>
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
            I build AI that ships.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1} direction="up">
          <div
            aria-hidden="true"
            className="mt-8 h-[3px] w-24 rounded-full bg-accent"
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
      <ScrollReveal direction="up">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          What I build
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          From process to product.
        </h2>
      </ScrollReveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <ScrollReveal
            delay={index * 0.05}
            direction="up"
            key={service.name}
          >
            <article className="group h-full rounded-2xl border border-border-light bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {service.icon}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-text-light">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-light-muted">
                {service.description}
              </p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function CaseStudiesBand() {
  return (
    <section
      className="relative overflow-hidden bg-bg-dark py-20 text-text-dark sm:py-24"
      id="built-and-shipped"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent-light">
            Built and shipped
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-dark sm:text-5xl">
            Case studies. Real systems. Real outcomes.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-10">
          <ScrollReveal direction="up">
            <GlassCard className="p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                Case study 01
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-text-dark sm:text-3xl">
                Guest Communications Chatbot
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-text-dark-muted">
                Trained on curated company data — approved templates, brand
                voice, every guest scenario from check-in instructions to pet
                rules to TV troubleshooting. Drafts replies inside Smarttask.
                Staff review, approve, and send in seconds.
              </p>
              <div className="mt-8">
                <BeforeAfter
                  variant="dark"
                  after={{
                    caption: "Drafted, reviewed, sent in seconds",
                    metric: "< 3 min",
                    points: [
                      "Chatbot drafts in Smarttask",
                      "Staff review and approve",
                      "15-20 min saved per message",
                    ],
                  }}
                  before={{
                    caption: "Manual drafts, missed messages",
                    metric: "48 hrs",
                    points: [
                      "Guest messages waited up to 48 hours",
                      "Staff manually composed every reply",
                      "Missed notifications meant guests waited days",
                    ],
                  }}
                />
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <GlassCard className="p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                Case study 02
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-text-dark sm:text-3xl">
                Operations Manual → QA System
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-text-dark-muted">
                A 100+ page property operations manual digitized, room by
                room, into a trackable, quantifiable inspection system. Static
                documentation became an auditable QA tool.
              </p>
              <div className="mt-8">
                <BeforeAfter
                  variant="dark"
                  after={{
                    caption: "Trackable QA, accountability built in",
                    metric: "Top 10%",
                    points: [
                      "Every standard a measurable checkpoint",
                      "Top 10% Airbnb rating maintained",
                      "Booking.com Travelers' Choice + VRBO Premier",
                    ],
                  }}
                  before={{
                    caption: "Static, unenforceable, no accountability",
                    metric: "100+ pages",
                    points: [
                      "No way to track compliance",
                      "Couldn't audit performance",
                      "Standards inconsistent across properties",
                    ],
                  }}
                />
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <GlassCard className="p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                Case study 03
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-text-dark sm:text-3xl">
                Workflow Automation — Zapier + Guesty + Twilio
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-text-dark-muted">
                A connected automation layer using Zapier, Guesty API, and
                Twilio API — replacing multi-hour coordination loops with
                automated triggers and responses. Team focuses on decisions,
                not data movement.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Zapier", "Guesty API", "Twilio API"].map((item) => (
                  <div
                    className="rounded-xl border border-[rgba(41,110,214,0.35)] bg-[rgba(41,110,214,0.08)] px-4 py-3 text-center font-mono text-sm uppercase tracking-[0.18em] text-text-dark"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <ScrollReveal direction="up">
      <LightGlassCard className="p-8 text-center sm:p-14" hoverable={false}>
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Ready when you are
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Ready to ship something real?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-text-light-muted">
          Remote. Available now. I reply within 24 hours.
        </p>
        <div className="mt-8">
          <Button href="/contact">Get in Touch →</Button>
        </div>
      </LightGlassCard>
    </ScrollReveal>
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

function DarkSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-bg-dark text-text-dark ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
