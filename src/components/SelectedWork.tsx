"use client";

import { motion, useReducedMotion } from "framer-motion";

type Work = {
  context: string;
  index: string;
  metric: string;
  metricLabel: string;
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
    status: "shipped",
    tag: "Ops · QA",
    tech: ["Process design", "QA tooling", "Inspections"],
    title: "Manual → Auditable QA System",
  },
  {
    context:
      "Multi-level autonomous agent harness shipping real games, apps, and operating systems end-to-end.",
    index: "03",
    metric: "3 products",
    metricLabel: "shipping",
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
      {works.map((work, index) => {
        const meta = statusMeta[work.status];
        return (
          <motion.article
            className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-border-light bg-white/75 p-7 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_56px_-22px_rgba(41,110,214,0.22)] sm:p-8"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            key={work.title}
            transition={{
              delay: index * 0.06,
              duration: 0.7,
              ease: easeOut,
            }}
            viewport={{ amount: 0.25, once: true }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          >
            {/* TOP META — index, tag, status — all in one row */}
            <div className="relative flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                {work.index}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                {work.tag}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${meta.text}`}
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
            </div>

            {/* METRIC — editorial display, accent color, the visual anchor */}
            <div className="relative">
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
            </div>

            {/* TITLE — moved below the metric, smaller than the metric so the
                metric does the heavy visual lifting. Title is reading-rank. */}
            <div className="relative">
              <h3 className="flex items-baseline gap-2 text-2xl font-semibold tracking-tight text-text-light sm:text-3xl">
                <span className="transition-colors duration-200 group-hover:text-accent-deep">
                  {work.title}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block translate-x-0 text-base text-accent opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                >
                  ↗
                </span>
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-light-muted">
                {work.context}
              </p>
            </div>

            {/* TECH FOOTER */}
            <div className="relative mt-auto flex flex-wrap items-center gap-1.5">
              {work.tech.map((t) => (
                <span
                  className="inline-flex items-center rounded-md border border-border-light bg-bg-light-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-muted transition-colors duration-200 group-hover:border-accent/30 group-hover:text-text-light"
                  key={t}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
