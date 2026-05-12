"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  AtlasDemo,
  AtlasGallery,
  BeforeAfter,
  Button,
  CursorHalo,
  IndexedDivider,
  LiveStatusBadge,
  LocalAiDemo,
  ParallaxGhost,
  ScrollReveal,
  SectionDivider,
  SectionHeader,
  SiteFooter,
  SplitText,
} from "@/components";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

type ServiceStatus = "available" | "flagship" | "always";

const services: Array<{
  description: string;
  forWho: string;
  icon: string;
  includes: string[];
  name: string;
  status: ServiceStatus;
  statusLabel: string;
}> = [
  {
    description:
      "Manual workflows automated through Zapier, n8n, and custom APIs. Built with you in the review loop, not around you.",
    forWho: "Operations-heavy businesses",
    icon: "01",
    includes: ["Zapier", "n8n", "Custom APIs", "Review loop"],
    name: "Process Automation",
    status: "available",
    statusLabel: "Available · 2 slots Q2",
  },
  {
    description:
      "Chatbots that learn your voice from your data and draft inside your existing tools. Every reply stays human-reviewed before send.",
    forWho: "Customer-facing teams",
    icon: "02",
    includes: ["Curated data prep", "In-tool drafting", "Human review"],
    name: "Custom Chatbots",
    status: "available",
    statusLabel: "Available · 1 slot Q2",
  },
  {
    description:
      "Next.js + Supabase web apps, Flutter / Kotlin mobile builds. Idea to deployed product, end-to-end.",
    forWho: "End-to-end product builds",
    icon: "03",
    includes: ["Next.js", "Supabase", "Flutter", "Kotlin"],
    name: "Full-Stack Web & Mobile",
    status: "available",
    statusLabel: "Available · in-flight",
  },
  {
    description:
      "Multi-level autonomous agent systems modeled on Atlas — the harness I co-architect at Blackdoor.",
    forWho: "Teams replacing manual coordination",
    icon: "04",
    includes: ["Multi-agent architecture", "MCP wiring", "Model routing"],
    name: "Agent Harness Design",
    status: "flagship",
    statusLabel: "Flagship · always taking",
  },
  {
    description:
      "If you have a problem and need AI to solve it, I'll figure out how.",
    forWho: "Novel problems, vague briefs",
    icon: "05",
    includes: ["Research-led discovery", "Rapid prototyping"],
    name: "Whatever the brief calls for",
    status: "always",
    statusLabel: "Always · intro call",
  },
];

const STATUS_COLOR: Record<ServiceStatus, string> = {
  always: "bg-accent-light",
  available: "bg-result-green",
  flagship: "bg-accent",
};

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
    body: "The property's 100+ page operations manual digitized room-by-room into an auditable QA inspection system. Static documentation became a tool staff actually use on every shift.",
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
        caption: "Static document. No way to audit.",
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

      {/* PROGRAM HEADER — chapter slate that frames the two demos as
          one feature program. Establishes "you are now entering the
          theatre" before the first demo's cinematic curtain reveals. */}
      <DemoProgramHeader />

      <DemoSection
        chapter="01"
        eyebrow="Demo · Local AI"
        statusLabel="Local · In your browser"
        title="Local AI. Real business. No cloud required."
        description="Five tasks running on your machine. Pick a tab, load the model, run it. Models cache after first download. No API key, no server, no data leaving your browser."
        total="02"
      >
        <LocalAiDemo />
      </DemoSection>

      {/* INTERMISSION SEAM — a one-line marker between demos. Reads
          as a credits-roll moment that signals "next feature loading". */}
      <DemoIntermission />

      <DemoSection
        chapter="02"
        eyebrow="Demo · Atlas runtime"
        statusLabel="Atlas · Live runtime"
        title="This is what an agent harness looks like in motion."
        description="Atlas is the multi-agent system I co-architect at Blackdoor. Send a prompt. The CEO agent routes it through C-suite to manager to field agents."
        total="02"
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

      {/* Giant ghost AI watermark — sits behind the hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost className="ghost-text select-none">AI</ParallaxGhost>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
        {/* TOP STRIP — status pill + chapter mark, same editorial top
            strip used on every other hero. */}
        <ScrollReveal className="col-span-12 self-start" direction="up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/60 px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-accent">
                /ai · what I build
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-light-muted">
              Chapter 02 · AI
            </span>
          </div>
        </ScrollReveal>

        {/* LEFT — stacked massive headline (cols 1–8 lg) */}
        <div className="col-span-12 self-center lg:col-span-8">
          <h1
            className="font-semibold text-text-light"
            style={{
              fontSize: "clamp(3rem, 12vw, 10rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
          >
            <span className="block">
              <SplitText charDelay={0.025} delay={0.14} duration={0.85}>
                I build
              </SplitText>
            </span>
            <span className="block">
              <SplitText charDelay={0.025} delay={0.32} duration={0.85}>
                AI that
              </SplitText>
            </span>
            <span className="relative inline-block">
              <span className="gradient-shift block">
                <SplitText charDelay={0.025} delay={0.5} duration={0.85}>
                  ships.
                </SplitText>
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-md"
              />
            </span>
          </h1>

          <ScrollReveal delay={0.46} direction="up">
            <div className="mt-10 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent sm:text-sm">
                Multi-agent harnesses · automation · agents
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.54} direction="up">
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button arrow className="!px-8 !py-4 !text-base" href="/contact">
                Start a Project
              </Button>
              <Button
                className="!px-8 !py-4 !text-base"
                href="#built-and-shipped"
                variant="ghost"
              >
                See Built &amp; Shipped
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* RIGHT — supporting prose + 3 marker stats as a mono spec
            rail (cols 9–12 lg). Replaces the centered subtitle +
            inline-marker-row that lived below the headline. */}
        <div className="col-span-12 self-center lg:col-span-4">
          <ScrollReveal delay={0.24} direction="up">
            <p className="text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
              Multi-agent harnesses and automation, wired into the
              workflows you already run.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.34} direction="up">
            <ul className="mt-8 grid divide-y divide-border-light border-y border-border-light">
              {[
                { label: "Atlas products live", value: "3" },
                { label: "Reply time", value: "48 hrs → 3 min" },
                { label: "Pages digitized to QA", value: "100+" },
              ].map((stat, index) => (
                <li
                  className="flex items-baseline justify-between gap-4 py-3"
                  key={stat.label}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    <span className="text-text-light-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {stat.label}
                  </span>
                  <span className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-text-light">
                    {stat.value}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const reduce = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <div>
      <SectionHeader eyebrow="What I build" title="From process to product." />

      {/* Editorial services menu — each row reads like a printed bill
          entry: huge index + service name on the left, includes / for-
          whom spec block on the right. Hover draws a gradient hair-line
          across the bottom. */}
      <ol className="mt-14 grid divide-y divide-border-light border-y border-border-light">
        {services.map((service, index) => (
          <motion.li
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            className="group relative grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-12"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            key={service.name}
            transition={{
              delay: index * 0.06,
              duration: 0.55,
              ease: easeOut,
            }}
            viewport={{ amount: 0.2, once: true }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          >
            {/* LEFT 7 — index + service name + description + live status */}
            <div className="col-span-12 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                  {service.icon} · Service
                </p>
                {/* STATUS CHIP — pulse + label. Mirrors the availability
                    panel on /contact (Engaged / Open slot / Always open). */}
                <span className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset]">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span
                      className={`absolute inset-0 animate-ping rounded-full ${STATUS_COLOR[service.status]}/60`}
                    />
                    <span
                      className={`relative inline-block h-1.5 w-1.5 rounded-full ${STATUS_COLOR[service.status]}`}
                    />
                  </span>
                  {service.statusLabel}
                </span>
              </div>
              <h3
                className="mt-4 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                {service.name}
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                {service.description}
              </p>
            </div>

            {/* RIGHT 5 — spec block */}
            <div className="col-span-12 lg:col-span-5 lg:pl-8 lg:border-l lg:border-border-light">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                Includes
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {service.includes.map((item) => (
                  <li
                    className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                For
              </p>
              <p className="mt-2 text-sm leading-6 text-text-light">
                {service.forWho}
              </p>
            </div>

            {/* Hover gradient hair-line */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function CaseStudiesSection() {
  const reduce = useReducedMotion();

  return (
    <div>
      <SectionHeader
        eyebrow="Built and shipped"
        title="Three case studies, with receipts."
      />

      {/* Editorial timeline — each case study is a full-width indexed
          row matching the /resume Experience ledger and home Process
          band patterns. Hover gradient hairline ties the rows together. */}
      <ol className="mt-14 grid divide-y divide-border-light border-y border-border-light">
        {caseStudies.map((study, index) => (
          <CaseStudyRow
            body={study.body}
            comparison={study.comparison}
            eyebrow={study.eyebrow}
            index={index}
            key={study.title}
            reduce={!!reduce}
            title={study.title}
          />
        ))}

        {/* Third case study — Zapier + Guesty + Twilio (no BeforeAfter;
            uses the wired-system visualization instead). */}
        <motion.li
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="group relative grid grid-cols-12 gap-x-6 gap-y-6 py-14 sm:py-16"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          transition={{
            delay: caseStudies.length * 0.06,
            duration: 0.6,
            ease: easeOut,
          }}
          viewport={{ amount: 0.2, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              03 · Case study
            </p>
            <h3
              className="mt-4 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
              }}
            >
              Workflow Automation — Zapier + Guesty + Twilio
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
              A connected automation layer using Zapier, Guesty API, and
              Twilio API — replacing multi-hour coordination loops with
              automated triggers and responses. Team focuses on decisions,
              not data movement.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Property
            </p>
            <p className="mt-2 font-mono text-sm text-text-light">
              ThePrivateHotels · 2024
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Stack
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {["Zapier", "Guesty API", "Twilio API"].map((tech) => (
                <li
                  className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted"
                  key={tech}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12">
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
                  <div className="flex items-center gap-3">
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

          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </motion.li>
      </ol>
    </div>
  );
}

/**
 * Editorial case study row. Massive title + body on the left, mono
 * spec rail (property + stack) on the right, BeforeAfter spanning
 * full width below. Hover gradient hairline at the bottom of the row
 * ties it into the surrounding divided-list.
 */
function CaseStudyRow({
  body,
  comparison,
  eyebrow,
  index,
  reduce,
  title,
}: {
  body: string;
  comparison: (typeof caseStudies)[number]["comparison"];
  eyebrow: string;
  index: number;
  reduce: boolean;
  title: string;
}) {
  // Eyebrow comes in as "01 · ThePrivateHotels · 2024". Split into
  // chapter index vs property+year for the spec rail.
  const segments = eyebrow.split(" · ").map((s) => s.trim());
  const propertyMeta = segments.slice(1).join(" · ");

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="group relative grid grid-cols-12 gap-x-6 gap-y-6 py-14 sm:py-16"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{
        delay: index * 0.06,
        duration: 0.6,
        ease: easeOut,
      }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <div className="col-span-12 lg:col-span-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
          {String(index + 1).padStart(2, "0")} · Case study
        </p>
        <h3
          className="mt-4 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
          }}
        >
          {title}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
          {body}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-border-light lg:pl-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
          Property
        </p>
        <p className="mt-2 font-mono text-sm text-text-light">{propertyMeta}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
          Result
        </p>
        <p className="mt-2 text-base font-semibold leading-6 text-text-light sm:text-lg">
          {comparison.after.metric}
        </p>
        <p className="mt-1 text-xs leading-5 text-text-light-muted">
          {comparison.after.caption}
        </p>
      </div>

      <div className="col-span-12 mt-2">
        <BeforeAfter after={comparison.after} before={comparison.before} />
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </motion.li>
  );
}

function AtlasGallerySection() {
  const reduce = useReducedMotion();

  // Use a darker palette for the editorial top strip but stay on the
  // light page background (no curtain reveal — that's the DemoSection
  // signature). This gives the Atlas portfolio the same THEATER
  // HEADER treatment as the demos so the three feature sections read
  // as one continuous program.
  return (
    <div>
      {/* THEATER HEADER — chapter + headline left, oversized chapter
          mark + live-status badge right. Anchors the Atlas gallery
          like a feature in the program; DemoSection uses the exact
          same shape on the dark band. */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <motion.div
          className="lg:max-w-3xl"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: easeOut }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              Atlas portfolio
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-light-muted">
              02 / 03
            </span>
          </div>
          <h2
            className="mt-5 font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
            }}
          >
            What Atlas has shipped.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
            Three products built end-to-end via the Atlas multi-agent
            harness. The agents write the code and ship it; humans review
            every PR.
          </p>
        </motion.div>

        {/* RIGHT — oversized chapter mark + live-status badge */}
        <motion.div
          className="flex flex-row items-end gap-6 lg:flex-col lg:items-end"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          transition={{ delay: 0.15, duration: 0.55, ease: easeOut }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <span
            className="font-semibold leading-none text-accent/30"
            style={{
              fontSize: "clamp(4.5rem, 9vw, 7.5rem)",
              letterSpacing: "-0.06em",
            }}
          >
            02
          </span>
          <LiveStatusBadge label="3 products · in motion" />
        </motion.div>
      </div>

      {/* GALLERY — kept on the light bg with subtle editorial frame
          elements (corner ticks + ambient accent line) to echo the
          cinematic frame used by DemoSection without flipping the
          background tone. */}
      <div className="relative mt-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-accent/35 sm:-left-3 sm:-top-3 sm:h-8 sm:w-8"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-accent/35 sm:-right-3 sm:-top-3 sm:h-8 sm:w-8"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 -bottom-2 h-6 w-6 border-b-2 border-l-2 border-accent/35 sm:-left-3 sm:-bottom-3 sm:h-8 sm:w-8"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -bottom-2 h-6 w-6 border-b-2 border-r-2 border-accent/35 sm:-right-3 sm:-bottom-3 sm:h-8 sm:w-8"
        />
        <AtlasGallery />
      </div>
    </div>
  );
}

/**
 * Program header — sits on the dark band between the SectionDivider
 * and the first DemoSection. Reads like a film slate: "PROGRAM ·
 * Demos · 02 features". Tells the user the next two sections belong
 * together as one feature program.
 */
function DemoProgramHeader() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-bg-dark pb-10 pt-20 text-text-dark sm:pb-12 sm:pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.18)] pb-6"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: easeOut }}
          viewport={{ amount: 0.4, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
            03 · Program
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted">
            02 features · Run in your browser
          </span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-[rgba(91,155,244,0.12)] sm:block" />
          <h2
            className="ml-auto font-semibold tracking-tight text-text-dark"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            Now showing<span className="text-accent-light">.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Intermission seam — a thin accent band between the two demos with
 * a centered "INTERMISSION · feature 02 of 02 loading" marker. Reads
 * as a credits-roll beat that signals the next feature.
 */
function DemoIntermission() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden bg-bg-dark py-10 text-text-dark sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-transparent via-accent-light/50 to-transparent"
          initial={reduce ? false : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: easeOut }}
          viewport={{ amount: 0.5, once: true }}
          whileInView={reduce ? undefined : { scaleX: 1 }}
        />
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(91,155,244,0.30)] bg-[rgba(15,23,42,0.6)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light backdrop-blur">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent-light/60" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent-light" />
          </span>
          Intermission · Feature 02 / 02 loading
        </span>
        <motion.span
          className="h-px flex-1 origin-right bg-gradient-to-l from-transparent via-accent-light/50 to-transparent"
          initial={reduce ? false : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: easeOut }}
          viewport={{ amount: 0.5, once: true }}
          whileInView={reduce ? undefined : { scaleX: 1 }}
        />
      </div>
    </section>
  );
}

function DemoSection({
  chapter,
  children,
  description,
  eyebrow,
  statusLabel,
  title,
  total,
}: {
  chapter: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  statusLabel: string;
  title: string;
  total: string;
}) {
  const easeOutCubic = [0.65, 0, 0.35, 1] as [number, number, number, number];

  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* THEATER HEADER — chapter + headline left, oversized chapter
            number + live-status badge right. Anchored editorial layout
            that frames each demo like a feature in a film program. */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            className="lg:max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: easeOutCubic }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
                {eyebrow}
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted">
                {chapter} / {total}
              </span>
            </div>
            <h2
              className="mt-5 font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
                letterSpacing: "-0.045em",
                lineHeight: 0.95,
              }}
            >
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-text-dark-muted sm:text-lg sm:leading-8">
              {description}
            </p>
          </motion.div>

          {/* RIGHT — oversized chapter mark + status badge */}
          <motion.div
            className="flex flex-row items-end gap-6 lg:flex-col lg:items-end"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.15, duration: 0.55, ease: easeOutCubic }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span
              className="font-semibold leading-none text-accent-light/55"
              style={{
                fontSize: "clamp(4.5rem, 9vw, 7.5rem)",
                letterSpacing: "-0.06em",
              }}
            >
              {chapter}
            </span>
            <LiveStatusBadge label={statusLabel} />
          </motion.div>
        </div>

        {/* CINEMATIC DEMO FRAME — corner brackets + dual curtain reveal */}
        <CinematicFrame>{children}</CinematicFrame>
      </div>
    </section>
  );
}

function CinematicFrame({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const easeOutCubic = [0.65, 0, 0.35, 1] as [number, number, number, number];

  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl border border-accent-light/15 bg-[rgba(15,23,42,0.6)] p-3 shadow-[0_36px_72px_-30px_rgba(0,0,0,0.7)] sm:p-4">
      {/* Corner brackets — film-slate aesthetic */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Dual curtain reveal — top + bottom dark bars retract as the
          demo enters view, like a stage opening. */}
      {!reduce ? (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-bg-dark"
            initial={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: easeOutCubic }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={{ scaleY: 0 }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2 origin-bottom bg-bg-dark"
            initial={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: easeOutCubic }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={{ scaleY: 0 }}
          />
          {/* Accent seam line where the two curtains meet, briefly visible */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 z-30 h-px bg-gradient-to-r from-transparent via-accent-light to-transparent shadow-[0_0_24px_rgba(91,155,244,0.6)]"
            initial={{ opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: easeOutCubic,
              times: [0, 0.35, 1],
            }}
            viewport={{ amount: 0.3, once: true }}
            whileInView={{ opacity: [0, 1, 0] }}
          />
        </>
      ) : null}

      <div className="scanlines relative z-10 rounded-2xl">{children}</div>
    </div>
  );
}

function CornerBracket({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "left-0 top-0",
    tr: "right-0 top-0",
    bl: "left-0 bottom-0",
    br: "right-0 bottom-0",
  }[position];
  const rotation = {
    tl: "rotate-0",
    tr: "rotate-90",
    bl: "-rotate-90",
    br: "rotate-180",
  }[position];

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 h-6 w-6 text-accent-light sm:h-8 sm:w-8 ${posClass} ${rotation}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M2 8V2h6"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
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
