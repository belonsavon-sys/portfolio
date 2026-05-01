import {
  AtlasDemo,
  Button,
  LocalAiDemo,
  NavPill,
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

const services = [
  {
    icon: "API",
    name: "Process Automation",
    description:
      "Turn your manual workflows into automated systems. API integrations, Zapier flows, and custom pipelines that run without you.",
  },
  {
    icon: "AI",
    name: "Custom Chatbot Development",
    description:
      "AI-powered communication tools trained on your data, tuned to your brand voice, and connected to your existing tools — with every action reviewed before it executes.",
  },
  {
    icon: "APP",
    name: "Full-Stack Web & Mobile Apps",
    description:
      "End-to-end applications built to solve a specific business problem. From idea to deployed product, built with the right stack for the outcome.",
  },
  {
    icon: "OPS",
    name: "Agent Harness Design (Atlas-style)",
    description:
      "Multi-level autonomous agent systems that route work, spin up sub-agents, and take action — modeled on the same architecture powering Blackdoor.",
  },
  {
    icon: "$",
    name: "Anything a Business Pays For",
    description:
      "If you have a problem and need AI to solve it, I'll figure out how.",
  },
];

const caseStudies = [
  {
    title: "Guest Communications Chatbot",
    problem:
      "Guest messages at ThePrivateHotels were taking up to 48 hours to receive a response. Missed notifications meant guests sometimes waited days.",
    built:
      "A chatbot trained on curated company data — approved message templates, brand voice, every guest scenario from check-in instructions to pet rules to TV troubleshooting. It drafts replies inside Smarttask. Staff review, approve, and send in seconds.",
    result:
      "Response time dropped from up to 48 hours → under 3 minutes. Every message saves 15–20 minutes of manual drafting. Consistent brand voice. Zero unapproved messages sent.",
    diagram: "chatbot",
  },
  {
    title: "Operations Manual → QA System",
    problem:
      "A 100+ page property operations manual. No way to track compliance, audit performance, or hold anyone accountable to standards.",
    built:
      "Digitized the entire manual into a trackable, quantifiable inspection system — room by room, process by process. Static documentation became an auditable QA tool.",
    result:
      "Inspections are now measurable. Staff are accountable to defined standards. Property maintains top-10% Airbnb rating and Booking.com Travelers' Choice award.",
    diagram: "qa",
  },
  {
    title: "Workflow Automation (Zapier + Guesty + Twilio)",
    problem:
      "Hotel operations ran on manual coordination — messages, bookings, and communications all requiring human handoffs.",
    built:
      "A connected automation layer using Zapier, Guesty API, and Twilio API — replacing multi-hour coordination loops with automated triggers and responses.",
    result:
      "Manual coordination significantly reduced. Team focuses on decisions, not data movement.",
    diagram: "workflow",
  },
];

export default function AiPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LightSection className="pb-20 pt-6 sm:pb-24">
        <SiteNav />

        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-20 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold text-accent">/ai</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-normal sm:text-7xl">
              I build AI that ships.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Agent harnesses, process automation, full-stack applications —
              built to change how your business operates, not just to impress
              in a demo.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact">Get in Touch</Button>
              <Button href="#built-and-shipped" variant="ghost">
                Built and Shipped
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border-light bg-bg-light-2 p-5">
            <div className="grid gap-3">
              {["Agent harnesses", "Process automation", "Full-stack apps"].map(
                (item) => (
                  <div
                    className="flex items-center justify-between rounded-lg border border-border-light bg-white px-4 py-3"
                    key={item}
                  >
                    <span className="font-medium">{item}</span>
                    <span className="text-sm font-semibold text-accent">
                      ships
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </LightSection>

      <LightSection className="py-20 sm:py-24">
        <SectionHeader title="What I Build" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {services.map((service) => (
            <article
              className="rounded-lg border border-border-light bg-white p-5"
              key={service.name}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-light-2 text-xs font-semibold text-accent">
                {service.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{service.name}</h3>
              <p className="mt-3 text-sm leading-6 text-text-light-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </LightSection>

      <LightSection className="py-20 sm:py-24" id="built-and-shipped">
        <SectionHeader title="Built and Shipped" />
        <div className="mt-10 grid gap-8">
          {caseStudies.map((study) => (
            <article
              className="grid gap-8 rounded-lg border border-border-light bg-white p-6 lg:grid-cols-[1fr_420px]"
              key={study.title}
            >
              <div>
                <h3 className="text-2xl font-semibold">{study.title}</h3>
                <CaseStudyCopy label="The problem" text={study.problem} />
                <CaseStudyCopy label="What I built" text={study.built} />
                <CaseStudyCopy label="The result" text={study.result} />
              </div>
              <CaseStudyDiagram type={study.diagram} />
            </article>
          ))}
        </div>
      </LightSection>

      <SectionDivider direction="light-to-dark" />

      <DarkSection className="py-20 sm:py-24">
        <DarkHeader
          title="Local AI. Real business. No cloud required."
          intro="Cloud AI is everywhere. But compute and energy costs are rising, and every modern computer already has the hardware to run capable AI models locally — they just aren't being used that way yet. These demos show what that looks like when it's actually deployed."
        />

        <LocalAiDemo />
      </DarkSection>

      <DarkSection className="pb-20 sm:pb-24">
        <DarkHeader
          title="This is what an agent harness looks like in motion."
          intro="Atlas is the multi-agent system I co-architect at Blackdoor. Send a prompt. Watch the CEO agent route it. Sub-agents act. The database updates. Tasks appear, get assigned, get completed. This is what AI that ships looks like under the hood."
        />

        <AtlasDemo />

        <AtlasHierarchy />
      </DarkSection>

      <SectionDivider direction="dark-to-light" />

      <LightSection className="py-20 sm:py-24">
        <div className="rounded-lg border border-border-light bg-white p-8 text-center sm:p-12">
          <h2 className="text-4xl font-semibold tracking-normal">
            Ready to ship something real?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-text-light-muted">
            Remote. Available now. I reply within 24 hours.
          </p>
          <div className="mt-8">
            <Button href="/contact">Get in Touch →</Button>
          </div>
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
        <NavPill active={item.href === "/ai"} href={item.href} key={item.href}>
          {item.label}
        </NavPill>
      ))}
    </nav>
  );
}

function LightSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={className} id={id}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
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
    <section className={`bg-bg-dark text-text-dark ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function CaseStudyDiagram({ type }: { type: string | undefined }) {
  if (type === "chatbot") {
    return <BeforeAfterDiagram />;
  }

  if (type === "qa") {
    return (
      <FlowPanel
        steps={[
          "100+ page property operations manual",
          "Trackable, quantifiable inspection system",
          "Auditable QA tool",
        ]}
      />
    );
  }

  return (
    <FlowPanel
      steps={[
        "Manual coordination",
        "Zapier, Guesty API, and Twilio API",
        "Automated triggers and responses",
      ]}
    />
  );
}

function DarkHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div>
      <h2 className="max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-text-dark-muted">
        {intro}
      </p>
    </div>
  );
}

function CaseStudyCopy({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-accent">{label}:</p>
      <p className="mt-2 leading-7 text-text-light-muted">{text}</p>
    </div>
  );
}

function BeforeAfterDiagram() {
  return (
    <div className="grid gap-4 self-start">
      <DiagramColumn
        color="problem"
        steps={[
          "Guest message arrives",
          "Staff manually composes reply",
          "Wait up to 48 hours",
          "Reply sent",
        ]}
        title="BEFORE"
      />
      <DiagramColumn
        color="result"
        steps={[
          "Guest message arrives",
          "Chatbot drafts in Smarttask",
          "Staff review and approve",
          "Reply sent under 3 min",
        ]}
        title="AFTER"
      />
    </div>
  );
}

function DiagramColumn({
  color,
  steps,
  title,
}: {
  color: "problem" | "result";
  steps: string[];
  title: string;
}) {
  const isProblem = color === "problem";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isProblem
          ? "border-problem-red bg-problem-red-bg"
          : "border-result-green bg-result-green-bg"
      }`}
    >
      <h4
        className={`text-sm font-semibold ${
          isProblem ? "text-problem-red" : "text-result-green"
        }`}
      >
        {title}
      </h4>
      <div className="mt-4 grid gap-3">
        {steps.map((step, index) => (
          <div className="flex items-center gap-3" key={step}>
            <div className="rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-sm">
              {step}
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={isProblem ? "text-problem-red" : "text-result-green"}
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowPanel({ steps }: { steps: string[] }) {
  return (
    <div className="self-start rounded-lg border border-border-light bg-bg-light-2 p-5">
      <div className="grid gap-3">
        {steps.map((item, index) => (
          <div className="flex items-center gap-3" key={item}>
            <div className="rounded-lg border border-border-light bg-white px-4 py-3 text-sm font-medium">
              {item}
            </div>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="text-accent">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function AtlasHierarchy() {
  return (
    <div className="mt-10 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-5">
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1.2fr_auto_1.2fr]">
        <HierarchyNode label="User prompt" tone="warm" />
        <Arrow />
        <HierarchyNode label="CEO Agent routes work" tone="accent" />
        <Arrow />
        <div className="grid gap-3">
          <HierarchyNode label="CFO Agent" />
          <HierarchyNode label="CMO Agent" />
        </div>
        <Arrow />
        <div className="grid gap-3">
          <HierarchyNode label="Manager Agents" />
          <HierarchyNode label="Field Agents execute work" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <HierarchyNode label="Database" tone="cyan" />
        <HierarchyNode label="Task Board" tone="green" />
      </div>
    </div>
  );
}

function HierarchyNode({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "accent" | "cyan" | "default" | "green" | "warm";
}) {
  const toneClasses = {
    accent: "border-accent bg-[rgba(41,110,214,0.18)]",
    cyan: "border-[#00D4FF] bg-[rgba(0,212,255,0.10)]",
    default: "border-[rgba(41,110,214,0.25)] bg-bg-dark",
    green: "border-result-green bg-[rgba(16,185,129,0.12)]",
    warm: "border-[#F59E0B] bg-[rgba(245,158,11,0.12)]",
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-center text-sm font-medium text-text-dark ${toneClasses[tone]}`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="hidden text-center font-mono text-lg text-accent lg:block"
    >
      →
    </span>
  );
}
