"use client";

import { motion, useReducedMotion } from "framer-motion";

type Work = {
  context: string;
  gradient: string;
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
    gradient: "linear-gradient(135deg, #1A4E9C 0%, #296ED6 50%, #5B9BF4 100%)",
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
    gradient: "linear-gradient(135deg, #0F172A 0%, #1A4E9C 60%, #296ED6 100%)",
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
    gradient: "linear-gradient(135deg, #1A4E9C 0%, #5B9BF4 100%)",
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
    gradient: "linear-gradient(135deg, #111827 0%, #296ED6 50%, #5B9BF4 100%)",
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
  { bg: string; border: string; dot: string; label: string; text: string }
> = {
  live: {
    bg: "bg-[rgba(16,185,129,0.10)]",
    border: "border-result-green/40",
    dot: "bg-result-green",
    label: "Live",
    text: "text-result-green",
  },
  shipped: {
    bg: "bg-[rgba(41,110,214,0.10)]",
    border: "border-accent/40",
    dot: "bg-accent",
    label: "Shipped",
    text: "text-accent",
  },
  internal: {
    bg: "bg-[rgba(255,255,255,0.04)]",
    border: "border-border-light",
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
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border-light bg-white/70 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[0_24px_48px_-20px_rgba(41,110,214,0.25)]"
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
            {/* GRADIENT THUMB */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
                style={{ background: work.gradient }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 60%)",
                }}
              />
              {/* Sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              {/* Big metric on the thumb */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/80">
                  {work.metricLabel}
                </p>
                <p
                  className="mt-1 select-none font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
                >
                  {work.metric}
                </p>
              </div>
              {/* Top-right status pill */}
              <div className="absolute right-3 top-3 z-10">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border ${meta.border} ${meta.bg} px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md ${meta.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              {/* Top-left tag */}
              <div className="absolute left-3 top-3 z-10">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  {work.tag}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-text-light sm:text-2xl">
                <span className="transition-colors duration-200 group-hover:text-accent-deep">
                  {work.title}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block translate-x-0 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                >
                  →
                </span>
              </h3>
              <p className="text-sm leading-6 text-text-light-muted">
                {work.context}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {work.tech.map((t) => (
                  <span
                    className="inline-flex items-center rounded-md border border-accent/25 bg-[rgba(41,110,214,0.06)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent"
                    key={t}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
