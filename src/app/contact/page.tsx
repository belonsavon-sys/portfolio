"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChapterRail, ParallaxGhost } from "@/components";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/components/contact-config";

type ContactCardConfig = {
  Icon: (props: { className?: string }) => React.ReactNode;
  href: string;
  label: string;
  rel?: string;
  target?: "_blank";
  value: string;
};

const contactLinks: ContactCardConfig[] = [
  {
    Icon: MailIcon,
    href: EMAIL_MAILTO,
    label: "Email",
    value: EMAIL_DISPLAY,
  },
  {
    Icon: PhoneIcon,
    href: PHONE_TEL,
    label: "Phone",
    value: PHONE_DISPLAY,
  },
  {
    Icon: GitHubIcon,
    href: GITHUB_URL,
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
    value: "github.com/belonsavon-sys",
  },
  ...(LINKEDIN_URL
    ? [
        {
          Icon: LinkedInIcon,
          href: LINKEDIN_URL,
          label: "LinkedIn",
          rel: "noreferrer",
          target: "_blank" as const,
          value: LINKEDIN_URL.replace(/^https?:\/\//, ""),
        },
      ]
    : []),
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const availabilityStats = [
  {
    detail: "Lead AI R&D · Atlas multi-agent harness shipping under PR review.",
    label: "Engaged",
    live: false,
    value: "Blackdoor · Atlas v3",
  },
  {
    detail: "Hotel operations supervisor — guest comms, QA system, automation.",
    label: "Engaged",
    live: false,
    value: "ThePrivateHotels",
  },
  {
    detail: "Open for one new freelance build this quarter. Q2 2026.",
    label: "Open slot",
    live: true,
    value: "1 · this quarter",
  },
  {
    detail: "Always taking advisory + consult calls. 30-min intro is free.",
    label: "Always open",
    live: true,
    value: "Advisory · consults",
  },
];

const engagementTypes = [
  {
    description:
      "Senior AI Engineer / Founding Engineer roles. Remote-first. I'll commit deeply to one team's mission.",
    fit: "Long-term · Mission alignment",
    label: "Full-time role",
    shape: "Permanent",
  },
  {
    description:
      "End-to-end product builds — automation systems, chatbots, agent harnesses. Idea to deployed.",
    fit: "Scoped · 4–12 weeks",
    label: "Freelance build",
    shape: "Project",
  },
  {
    description:
      "Agent harness design, AI strategy for ops-heavy businesses. I review your architecture, suggest the cuts.",
    fit: "1–2 day intensive · Async follow-up",
    label: "Advisory",
    shape: "Consult",
  },
  {
    description:
      "Pair with your team on a hard problem. Same loop I run at Blackdoor — research, build, ship under PR review.",
    fit: "Embedded · 2–6 weeks",
    label: "Co-build",
    shape: "Pairing",
  },
];

const pipelineSteps = [
  {
    body: "Within 24 hours. I confirm the scope, ask any clarifying questions, and propose a time to talk if there's a fit.",
    timing: "Within 24 hrs",
    verb: "Reply",
  },
  {
    body: "A 30-min call. We talk through what you need, what's measurable, what's not. You get a written brief back the same day.",
    timing: "Week 1",
    verb: "Scope",
  },
  {
    body: "Solo or paired with AI. Research-first. Every change ships through a PR with documentation and a clean commit history.",
    timing: "Weeks 2+",
    verb: "Build",
  },
  {
    body: "Live in production. We measure what changed against the manual workflow it replaced. Done means measured-done.",
    timing: "On cadence",
    verb: "Ship",
  },
];

export default function ContactPage() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.6, ease: easeOut },
        };

  return (
    <main className="min-h-screen bg-bg-dark text-text-dark">
      {/* HERO — tightened to ~80vh so the page becomes scrollable into
          the contact methods, pipeline, engagements, and availability
          sections that follow. */}
      <section className="relative overflow-hidden">
        {/* Giant ghost watermark — same parallax pattern as other heroes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
        >
          <ParallaxGhost
            className="select-none font-bold leading-[0.85] tracking-tighter text-accent-light/[0.05]"
            style={{
              fontSize: "clamp(6rem, 22vw, 22rem)",
              WebkitTextStroke: "1px rgba(91,155,244,0.10)",
              color: "transparent",
            }}
          >
            HELLO
          </ParallaxGhost>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
          {/* TOP STRIP — status pill + chapter mark */}
          <motion.div
            className="col-span-12 flex flex-wrap items-center gap-3 self-start"
            {...fadeUp(0)}
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-result-green/40 bg-[rgba(16,185,129,0.10)] px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-result-green">
                /contact · open to work
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-dark-muted">
              Chapter 05 · Intake
            </span>
          </motion.div>

          {/* LEFT — massive editorial headline (cols 1–8 lg) */}
          <motion.h1
            className="col-span-12 self-center font-semibold text-text-dark lg:col-span-8"
            style={{
              fontSize: "clamp(3rem, 11vw, 9.5rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
            {...fadeUp(0.08)}
          >
            <span className="block">Ready when</span>
            <span className="gradient-shift-dark block">
              you are<span className="text-accent-light">.</span>
            </span>
          </motion.h1>

          {/* RIGHT — supporting prose + quick stats (cols 9–12 lg) */}
          <motion.div
            className="col-span-12 self-center lg:col-span-4"
            {...fadeUp(0.18)}
          >
            <p className="text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
              Open to remote roles and freelance projects. Replies inside
              24 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
              {["Remote", "EN · ES · IT", "Ocean Shores, WA"].map(
                (stat, index, arr) => (
                  <span
                    className="inline-flex items-center gap-x-6"
                    key={stat}
                  >
                    <motion.span
                      animate={reduce ? undefined : { opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      transition={{
                        delay: 0.24 + index * 0.08,
                        duration: 0.45,
                        ease: easeOut,
                      }}
                    >
                      <span className="text-accent-light">→</span> {stat}
                    </motion.span>
                    {index < arr.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="h-3 w-px bg-[rgba(91,155,244,0.25)]"
                      />
                    ) : null}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* SCROLL CUE — anchors the hero to the methods section below */}
          <motion.a
            aria-label="Scroll to contact methods"
            className="group/cue col-span-12 mt-10 hidden flex-row items-center gap-3 self-end sm:flex"
            href="#methods"
            {...fadeUp(0.34)}
          >
            <span className="relative h-px w-10 overflow-hidden bg-gradient-to-r from-[rgba(91,155,244,0.2)] via-accent-light to-transparent transition-colors duration-200 group-hover/cue:via-accent-light">
              <span className="scroll-cue-dot absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent-light" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dark-muted transition-colors duration-200 group-hover/cue:text-accent-light">
              Reach me
            </span>
          </motion.a>
        </div>
      </section>

      {/* AVAILABILITY STRIPE — 4-column band between hero and form */}
      <ContactAvailabilityStripe />

      {/* SEND — quick intake form. Composes a pre-filled mailto so
          the user lands in their own mail client with the message
          already drafted. Zero backend, zero spam vector. */}
      <ContactSendSection />

      {/* METHODS — alternative direct channels for users who skip
          the form. */}
      <section className="relative" id="methods">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              01 · Reach me
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Four ways in.
            </h2>
          </div>

          {/* Methods rebuilt as editorial chapter cards — same indexed
              row pattern used by KeyboardNav and the 404 route ledger.
              Each card has chapter index + method + value + a magic
              key chip (E/P/G/L) on the right to hint that the
              KeyboardNav palette can be used too. */}
          <motion.ol
            className="grid divide-y divide-[rgba(91,155,244,0.18)]"
            {...fadeUp(0)}
          >
            {contactLinks.map(
              ({ Icon, href, label, rel, target, value }, index) => (
                <motion.li
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  key={label}
                  transition={{
                    delay: 0.12 + index * 0.06,
                    duration: 0.45,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.3, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <a
                    aria-label={label}
                    className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light sm:py-8"
                    href={href}
                    rel={rel}
                    target={target}
                  >
                    {/* LEFT 7 — chapter index, method title, value */}
                    <span className="col-span-12 lg:col-span-7">
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
                          {String(index + 1).padStart(2, "0")} · Method
                        </span>
                        <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(91,155,244,0.30)] bg-[rgba(41,110,214,0.10)] text-accent-light">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </span>
                      <span
                        className="mt-3 block font-semibold tracking-tight text-text-dark transition-colors duration-200 group-hover:text-accent-light"
                        style={{
                          fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                          letterSpacing: "-0.04em",
                          lineHeight: 0.98,
                        }}
                      >
                        {label}
                      </span>
                      <span className="mt-3 inline-block break-all font-mono text-sm text-text-dark-muted transition-colors duration-200 group-hover:text-accent-light/80 sm:text-base">
                        {value}
                      </span>
                    </span>

                    {/* RIGHT 5 — magic key chip + arrow indicator */}
                    <span className="col-span-12 flex items-end justify-end gap-4 lg:col-span-5 lg:items-center">
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted sm:inline">
                        {target === "_blank" ? "Opens in new tab" : "Direct"}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(91,155,244,0.30)] text-accent-light/70 transition-[transform,border-color,background,color] duration-300 group-hover:translate-x-1 group-hover:border-accent-light group-hover:bg-accent-light group-hover:text-bg-dark"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </span>
                    </span>

                    {/* Hover gradient hairline */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </a>
                </motion.li>
              ),
            )}
          </motion.ol>
        </div>
      </section>

      {/* PIPELINE — what happens after a user reaches out. Reads like
          the Process band on the home page (verb + body + hover
          hairline) so the contact page extends the same "research →
          build → ship" rhythm into the engagement itself. */}
      <section className="relative mt-24" id="pipeline">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              02 · What happens next
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              From send to ship.
            </h2>
          </div>

          <ol className="grid divide-y divide-[rgba(91,155,244,0.18)] border-b border-[rgba(91,155,244,0.18)]">
            {pipelineSteps.map((step, index) => (
              <motion.li
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-10 sm:py-12"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                key={step.verb}
                transition={{
                  delay: index * 0.06,
                  duration: 0.55,
                  ease: easeOut,
                }}
                viewport={{ amount: 0.3, once: true }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              >
                {/* LEFT 8 — index + massive verb */}
                <div className="col-span-12 lg:col-span-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
                    {String(index + 1).padStart(2, "0")} · {step.timing}
                  </p>
                  <h3
                    className="mt-3 font-semibold tracking-tight text-text-dark transition-colors duration-300 group-hover:text-accent-light"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 6rem)",
                      letterSpacing: "-0.05em",
                      lineHeight: 0.95,
                    }}
                  >
                    {step.verb}
                    <span className="text-accent-light">.</span>
                  </h3>
                </div>

                {/* RIGHT 4 — body prose */}
                <div className="col-span-12 lg:col-span-4">
                  <p className="text-base leading-7 text-text-dark-muted sm:text-lg sm:leading-8">
                    {step.body}
                  </p>
                </div>

                {/* Hover gradient hairline */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ENGAGEMENTS — datasheet of commitment shapes Pierre takes on.
          Mono header (~/engagements · 04 shapes) + indexed rows.
          Distinct from /ai's services (those are WHAT I build);
          this answers HOW we work together. */}
      <section className="relative mt-24" id="engagements">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              03 · Engagement shapes
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              How we work together.
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-[rgba(91,155,244,0.20)] bg-[rgba(15,23,42,0.55)] backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/engagements</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
              <span className="text-text-dark-muted">
                {engagementTypes.length} shapes
              </span>
            </div>
            <ul className="grid divide-y divide-[rgba(91,155,244,0.14)] md:grid-cols-2 md:divide-x md:divide-y-0">
              {engagementTypes.map((engagement, index) => (
                <li
                  className="group relative px-6 py-7 transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] sm:px-7 sm:py-8"
                  key={engagement.label}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-7 h-[calc(100%-3.5rem)] w-0.5 bg-accent-light/45"
                  />
                  <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                    <span className="text-text-dark-muted/60">//</span>
                    <span>
                      {String(index + 1).padStart(2, "0")} · {engagement.shape}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.16)]" />
                  </p>

                  <h3
                    className="mt-4 font-semibold tracking-tight text-text-dark transition-colors duration-300 group-hover:text-accent-light"
                    style={{
                      fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.04,
                    }}
                  >
                    {engagement.label}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-text-dark-muted">
                    {engagement.description}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light/70">
                    <span aria-hidden="true">→</span>
                    {engagement.fit}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AVAILABILITY — capacity snapshot. Reads like a status board:
          where I am this quarter, what's open, what's on hold. */}
      <section className="relative mt-24" id="availability">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              04 · Availability
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Where I am this quarter.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-8">
            {availabilityStats.map((stat, index) => (
              <motion.div
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                className="col-span-12 border-l-2 border-accent-light/40 pl-6 sm:col-span-6 lg:col-span-3"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                key={stat.label}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                  ease: easeOut,
                }}
                viewport={{ amount: 0.3, once: true }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              >
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                  <span className="text-text-dark-muted/60">//</span>
                  {String(index + 1).padStart(2, "0")} {stat.label}
                </p>
                <p
                  className="mt-3 font-semibold tracking-tight text-text-dark"
                  style={{
                    fontSize: "clamp(1.5rem, 3.2vw, 2.1rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  {stat.live ? (
                    <span className="inline-flex items-center gap-2.5">
                      <span className="relative inline-flex h-2.5 w-2.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                        <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-result-green" />
                      </span>
                      <span>{stat.value}</span>
                    </span>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-3 text-sm leading-6 text-text-dark-muted">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING BAND — editorial outro that points back to /ai and
          /resume so users who landed on /contact via a deep link
          can still discover the proof-of-work. */}
      <section className="relative mt-24 pb-24" id="closing">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-[rgba(91,155,244,0.20)] bg-[rgba(15,23,42,0.5)] p-8 backdrop-blur-sm sm:p-12">
            <div className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-8">
              <div className="col-span-12 lg:col-span-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
                  05 · Before you send
                </p>
                <h3
                  className="mt-3 font-semibold tracking-tight text-text-dark"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.98,
                  }}
                >
                  Want to see what I&apos;ve
                  <br />
                  <span className="gradient-shift-dark">already shipped</span>
                  <span className="text-accent-light">?</span>
                </h3>
              </div>
              <div className="col-span-12 self-end lg:col-span-4">
                <ul className="grid gap-3 font-mono text-sm text-text-dark-muted">
                  <li className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="text-accent-light">
                      →
                    </span>
                    <a
                      className="link-underline inline-block transition-colors hover:text-text-dark"
                      href="/ai"
                    >
                      /ai · multi-agent harnesses, case studies, demos
                    </a>
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="text-accent-light">
                      →
                    </span>
                    <a
                      className="link-underline inline-block transition-colors hover:text-text-dark"
                      href="/business"
                    >
                      /business · how the systems run in production
                    </a>
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="text-accent-light">
                      →
                    </span>
                    <a
                      className="link-underline inline-block transition-colors hover:text-text-dark"
                      href="/resume"
                    >
                      /resume · the receipts, one page, PDF-ready
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER RAIL — floating right-margin nav for the five
          /contact sections (methods → pipeline → engagements →
          availability → closing). Same component the home and
          resume pages use. */}
      <ChapterRail
        sections={[
          { id: "send", index: "00", label: "Send" },
          { id: "methods", index: "01", label: "Reach me" },
          { id: "pipeline", index: "02", label: "What happens next" },
          { id: "engagements", index: "03", label: "Engagements" },
          { id: "availability", index: "04", label: "Availability" },
          { id: "closing", index: "05", label: "Before you send" },
        ]}
      />
    </main>
  );
}

/**
 * Quick intake form. Builds a pre-filled mailto: link from the
 * form inputs and routes the user to their own mail client. No
 * backend, no spam concerns; serves the "send me a message"
 * intent without a third-party form service.
 */
/**
 * Availability stripe — dark-mode 4-column band that sits between
 * /contact's hero and the intake form. Surfaces the four signals a
 * stranger most wants before reaching out: reply window, open slots,
 * preferred channel, time zone. Mirrors the ~/stack and ~/cadence
 * stripe pattern on /now and /uses.
 */
function ContactAvailabilityStripe() {
  const items: Array<{
    href?: string;
    key: string;
    pulse?: boolean;
    tone?: "green" | "accent";
    value: string;
  }> = [
    {
      key: "Reply window",
      pulse: true,
      tone: "green",
      value: "Inside 24 h",
    },
    {
      href: "#engagements",
      key: "Open slots",
      tone: "accent",
      value: "Q2 · taking",
    },
    {
      href: "#methods",
      key: "Best channel",
      value: "Email / LinkedIn",
    },
    {
      key: "Time zone",
      value: "Pacific · UTC-08",
    },
  ];

  return (
    <div className="relative border-y border-[rgba(91,155,244,0.20)] bg-bg-dark-2">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
          </span>
          <span>~/availability</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
          <span className="text-text-dark-muted">{items.length} signals · live</span>
        </div>
        <ul className="grid grid-cols-2 divide-y divide-[rgba(91,155,244,0.18)] border-t border-[rgba(91,155,244,0.20)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {items.map((item, index) => {
            const valueClass =
              item.tone === "green"
                ? "text-result-green"
                : item.tone === "accent"
                  ? "text-accent-light"
                  : "text-text-dark";
            const inner = (
              <span className="flex flex-col gap-1 px-3 py-4 sm:px-5 sm:py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                  <span className="text-text-dark-muted/60">// </span>
                  {String(index + 1).padStart(2, "0")} {item.key}
                </span>
                <span
                  className={`flex items-center gap-2 font-mono text-[13px] leading-6 ${valueClass} sm:text-sm`}
                >
                  {item.pulse ? (
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                      <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
                    </span>
                  ) : null}
                  <span className="truncate">{item.value}</span>
                </span>
              </span>
            );

            return (
              <li className="group/avail relative" key={item.key}>
                {item.href ? (
                  <a
                    className="block transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)]"
                    href={item.href}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ContactSendSection() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const ready = name.trim().length > 0 && message.trim().length > 0;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = topic.trim() || `Message from ${name.trim() || "your site"}`;
    const body = [
      `From: ${name.trim()}${from.trim() ? ` <${from.trim()}>` : ""}`,
      "",
      message.trim(),
    ].join("\n");
    const url = `${EMAIL_MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  }

  return (
    <section className="relative scroll-mt-28" id="send">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
            00 · Send
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
          <h2
            className="font-semibold tracking-tight text-text-dark"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            Say hello.
          </h2>
        </div>

        <form
          className="mt-10 overflow-hidden rounded-xl border border-[rgba(91,155,244,0.20)] bg-[rgba(15,23,42,0.55)] backdrop-blur-sm"
          onSubmit={onSubmit}
        >
          <div className="flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
            <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
            <span>~/compose</span>
            <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
            <span className="text-text-dark-muted">
              Opens in your mail client · No backend
            </span>
          </div>

          <div className="grid gap-x-6 gap-y-4 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-7">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                01 Name
              </span>
              <input
                autoComplete="name"
                className="w-full rounded-md border border-[rgba(91,155,244,0.22)] bg-bg-dark/40 px-3 py-2 font-mono text-sm text-text-dark placeholder:text-text-dark-muted/40 transition-[border-color,background] duration-200 focus:border-accent-light focus:bg-bg-dark/55 focus:outline-none"
                onChange={(e) => setName(e.target.value)}
                placeholder="Pierre Sender"
                required
                type="text"
                value={name}
              />
            </label>

            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                02 Email <span className="text-text-dark-muted">· optional</span>
              </span>
              <input
                autoComplete="email"
                className="w-full rounded-md border border-[rgba(91,155,244,0.22)] bg-bg-dark/40 px-3 py-2 font-mono text-sm text-text-dark placeholder:text-text-dark-muted/40 transition-[border-color,background] duration-200 focus:border-accent-light focus:bg-bg-dark/55 focus:outline-none"
                onChange={(e) => setFrom(e.target.value)}
                placeholder="you@yourcompany.com"
                type="email"
                value={from}
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                03 What it&apos;s about
              </span>
              <input
                className="w-full rounded-md border border-[rgba(91,155,244,0.22)] bg-bg-dark/40 px-3 py-2 font-mono text-sm text-text-dark placeholder:text-text-dark-muted/40 transition-[border-color,background] duration-200 focus:border-accent-light focus:bg-bg-dark/55 focus:outline-none"
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Freelance build · Advisory · Role · Just saying hi"
                type="text"
                value={topic}
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                04 Message
              </span>
              <textarea
                className="w-full resize-y rounded-md border border-[rgba(91,155,244,0.22)] bg-bg-dark/40 px-3 py-2 font-mono text-sm leading-6 text-text-dark placeholder:text-text-dark-muted/40 transition-[border-color,background] duration-200 focus:border-accent-light focus:bg-bg-dark/55 focus:outline-none"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what you're trying to build, the rough timeline, and how I can help."
                required
                rows={5}
                value={message}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(91,155,244,0.14)] bg-[rgba(91,155,244,0.04)] px-6 py-4 sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
              Reply window · within 24 hrs
            </p>
            <button
              className="group inline-flex items-center gap-3 rounded-md border border-accent-light/45 bg-[rgba(91,155,244,0.16)] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent-light transition-[transform,border-color,background] duration-200 hover:-translate-y-0.5 hover:border-accent-light hover:bg-[rgba(91,155,244,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              disabled={!ready}
              type="submit"
            >
              Send via mail client
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </form>
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

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.99H5.67v8.35h2.67Zm-1.34-9.5a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9.5v-4.57c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.32V9.99h-2.67c.04.75 0 8.35 0 8.35h2.67v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.34.73 1.34 1.79v4.49h2.66Z" />
    </svg>
  );
}
