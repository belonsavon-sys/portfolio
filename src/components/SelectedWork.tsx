"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Work = {
  context: string;
  index: string;
  metric: string;
  metricLabel: string;
  source: string;
  status: "shipped" | "live" | "internal";
  tag: string;
  tech: string[];
  title: string;
};

const works: Work[] = [
  {
    context:
      "AI chatbot trained on company data — drafts guest replies in Smarttask, human-reviewed before send.",
    index: "01",
    metric: "<3 min",
    metricLabel: "reply time",
    source: "ThePrivateHotels · live since 2024",
    status: "live",
    tag: "Hospitality AI",
    tech: ["Claude", "Smarttask", "Custom data"],
    title: "Guest Communications Chatbot",
  },
  {
    context:
      "100+ page operations manual digitized room-by-room into a trackable QA inspection system.",
    index: "02",
    metric: "Top 10%",
    metricLabel: "Airbnb rating",
    source: "ThePrivateHotels · Guest Favorites + Travelers' Choice",
    status: "shipped",
    tag: "Ops · QA",
    tech: ["Process design", "QA tooling", "Inspections"],
    title: "Manual → Auditable QA System",
  },
  {
    context:
      "Multi-level autonomous agent harness that ships real products end-to-end.",
    index: "03",
    metric: "3 products",
    metricLabel: "shipping",
    source: "Blackdoor · co-founded 2025",
    status: "live",
    tag: "Multi-agent harness",
    tech: ["MCP", "Claude", "Codex", "GitHub"],
    title: "Atlas — Agent Architecture",
  },
  {
    context:
      "Zapier + Guesty API + Twilio orchestration replacing multi-hour manual coordination loops.",
    index: "04",
    metric: "−hours",
    metricLabel: "of coordination",
    source: "ThePrivateHotels · ops automation, 2024",
    status: "shipped",
    tag: "Workflow Automation",
    tech: ["Zapier", "Guesty API", "Twilio API"],
    title: "Connected Automation Layer",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const statusMeta: Record<
  Work["status"],
  { dot: string; label: string; text: string }
> = {
  live: {
    dot: "bg-result-green",
    label: "Live",
    text: "text-result-green",
  },
  shipped: {
    dot: "bg-accent",
    label: "Shipped",
    text: "text-accent",
  },
  internal: {
    dot: "bg-text-light-muted",
    label: "Internal",
    text: "text-text-light-muted",
  },
};

export function SelectedWork() {
  const reduce = useReducedMotion();
  // First work expanded by default so users see real content immediately.
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <ol className="grid divide-y divide-border-light border-y border-border-light">
      {works.map((work, index) => {
        const isOpen = expandedIndex === index;
        const meta = statusMeta[work.status];
        return (
          <li className="relative" key={work.title}>
            {/* SINGLE-TILE TRIGGER — index + title front and center,
                tag + status + metric on the right. Click anywhere to
                expand. Proof (the metric) is visible BEFORE expand —
                no more "click to find out what shipped". */}
            <button
              aria-controls={`work-panel-${index}`}
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-12 items-center gap-x-4 gap-y-3 py-7 text-left transition-colors duration-200 sm:py-8"
              onClick={() => setExpandedIndex(isOpen ? null : index)}
              type="button"
            >
              {/* LEFT 7 — chapter rail + title */}
              <span className="col-span-12 lg:col-span-7">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                    {work.index} · Work
                  </span>
                  <span aria-hidden="true" className="h-px w-8 bg-accent/40" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                    {work.tag}
                  </span>
                </span>
                <span
                  className="mt-3 block font-semibold tracking-tight text-text-light transition-colors duration-200 group-hover:text-accent-deep"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    letterSpacing: "-0.035em",
                    lineHeight: 1.02,
                  }}
                >
                  {work.title}
                </span>
              </span>

              {/* RIGHT 5 — metric + status + expand chevron.
                  The metric is the headline number — visible at rest
                  so users see proof before they expand. */}
              <span className="col-span-12 flex items-center justify-end gap-5 lg:col-span-5">
                <span className="text-right">
                  <span
                    className="block font-bold leading-[1] tracking-tight text-text-light transition-colors duration-200 group-hover:text-accent-deep"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {work.metric}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                    {work.metricLabel}
                  </span>
                </span>

                <span
                  className={`hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] sm:inline-flex ${meta.text}`}
                >
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${meta.dot}`}
                  >
                    {work.status === "live" ? (
                      <span
                        className={`absolute inset-0 animate-ping rounded-full ${meta.dot} opacity-60`}
                      />
                    ) : null}
                  </span>
                  {meta.label}
                </span>

                <span
                  aria-hidden="true"
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,background] duration-300 ${
                    isOpen
                      ? "rotate-45 border-accent bg-accent text-white"
                      : "border-border-light bg-bg-light text-text-light-muted group-hover:border-accent group-hover:text-accent"
                  }`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </span>

              {/* Hover gradient hairline — matches the rest of the
                  divided-list patterns on the site. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  animate={
                    reduce
                      ? { height: "auto" }
                      : { height: "auto", opacity: 1 }
                  }
                  className="overflow-hidden"
                  exit={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
                  id={`work-panel-${index}`}
                  initial={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
                  key="panel"
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  <div className="grid gap-8 pb-9 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
                    {/* LEFT — context paragraph + tech chips */}
                    <div>
                      <p className="text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
                        {work.context}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-1.5">
                        {work.tech.map((t) => (
                          <span
                            className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted"
                            key={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT — source citation in a mono spec card */}
                    <div className="rounded-xl border border-border-light bg-bg-light-2 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                        <span className="text-text-light-muted/60">// </span>
                        Source
                      </p>
                      <p className="mt-2 inline-flex items-start gap-2 font-mono text-[12.5px] leading-6 text-text-light">
                        <span aria-hidden="true" className="text-accent/70">
                          ↳
                        </span>
                        {work.source}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
