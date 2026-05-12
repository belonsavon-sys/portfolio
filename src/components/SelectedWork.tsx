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
          <li key={work.title}>
            <button
              aria-controls={`work-panel-${index}`}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-3 py-5 text-left transition-colors duration-200 sm:py-6"
              onClick={() => setExpandedIndex(isOpen ? null : index)}
              type="button"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                {work.index}
              </span>
              <span
                aria-hidden="true"
                className="hidden h-px w-6 bg-border-light transition-colors duration-300 group-hover:bg-accent/60 sm:inline-block"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                {work.tag}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
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
              {/* Open/close chevron */}
              <span
                aria-hidden="true"
                className={`ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-[transform,border-color,background] duration-300 ${
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
            </button>

            {/* Title sits between the meta row and the expanding body */}
            <button
              className="group block w-full text-left"
              onClick={() => setExpandedIndex(isOpen ? null : index)}
              type="button"
            >
              <h3
                className="-mt-2 font-semibold tracking-tight text-text-light transition-colors duration-200 group-hover:text-accent-deep"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                }}
              >
                {work.title}
              </h3>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  animate={reduce ? { height: "auto" } : { height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={
                    reduce
                      ? { height: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  id={`work-panel-${index}`}
                  initial={
                    reduce
                      ? { height: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  key="panel"
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  <div className="grid gap-8 pb-8 pt-6 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-12">
                    {/* LEFT — big metric anchor */}
                    <div>
                      <p
                        className="select-none font-bold leading-[0.95] tracking-tight text-accent"
                        style={{
                          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {work.metric}
                      </p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-text-light-muted">
                        {work.metricLabel}
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] tracking-[0.04em] text-text-light/55">
                        <span className="text-accent/70">↳</span> {work.source}
                      </p>
                    </div>

                    {/* RIGHT — context + tech */}
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
