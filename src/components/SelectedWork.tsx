"use client";

import { motion, useReducedMotion } from "framer-motion";

type Work = {
  branch: string;
  context: string;
  cta: string;
  hash: string;
  href?: string;
  metric: string;
  metricLabel: string;
  status: "shipped" | "live" | "internal";
  tech: string[];
  title: string;
  /** Which branch column in the graph: 0 = main (atlas), 1 = side (hotels). */
  track: 0 | 1;
  year: string;
};

const works: Work[] = [
  {
    branch: "atlas/agent-harness",
    context:
      "The multi-level autonomous agent harness I built to ship real products end-to-end.",
    cta: "Read Atlas in depth",
    hash: "a3f8c21",
    href: "/atlas",
    metric: "3 products",
    metricLabel: "shipping",
    status: "live",
    tech: ["MCP", "Claude", "Codex"],
    title: "Atlas — Agent Architecture",
    track: 0,
    year: "2025",
  },
  {
    branch: "privatehotels/comms",
    context:
      "An AI chatbot I trained on our company data — drafts guest replies in Smarttask, I review before send.",
    cta: "See it in action",
    hash: "7b2d44e",
    href: "/business#communications",
    metric: "<3 min",
    metricLabel: "reply time",
    status: "live",
    tech: ["Claude", "Smarttask"],
    title: "Guest Communications Chatbot",
    track: 1,
    year: "2024",
  },
  {
    branch: "privatehotels/ops",
    context:
      "Zapier + Guesty API + Twilio orchestration I wired up to replace the multi-hour coordination loops we used to run by hand.",
    cta: "See the pipeline",
    hash: "5c1e9a3",
    href: "/business#communications",
    metric: "−hours",
    metricLabel: "of coordination",
    status: "shipped",
    tech: ["Zapier", "Guesty API", "Twilio API"],
    title: "Connected Automation Layer",
    track: 1,
    year: "2024",
  },
  {
    branch: "privatehotels/qa",
    context:
      "The 100+ page operations manual I digitized room-by-room into a trackable QA inspection system.",
    cta: "See the system",
    hash: "9f4a08b",
    href: "/business#process",
    metric: "Top 10%",
    metricLabel: "Airbnb rating",
    status: "shipped",
    tech: ["Process design", "QA tooling"],
    title: "Manual → Auditable QA System",
    track: 1,
    year: "2024",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATUS = {
  internal: {
    accent: "text-text-light-muted",
    bg: "bg-text-light-muted/15",
    dot: "bg-text-light-muted",
    label: "Internal",
    ring: "ring-text-light-muted/40",
  },
  live: {
    accent: "text-result-green",
    bg: "bg-result-green/12",
    dot: "bg-result-green",
    label: "Live",
    ring: "ring-result-green/40",
  },
  shipped: {
    accent: "text-accent",
    bg: "bg-accent/10",
    dot: "bg-accent",
    label: "Shipped",
    ring: "ring-accent/40",
  },
} as const;

/**
 * Selected Work — theatre marquee. Stack of 4 Broadway-style bills.
 * Each bill: chasing-bulb top + bottom edges, year + status pip in
 * the top corners, big display title centered, then a horizontal
 * footer row with [metric badge · tech chips · CTA button] so the
 * key info reads at a glance. Cleaner than the original star-laden
 * "STARRING/FEATURING/BOX OFFICE" treatment — same theatre identity
 * but with obvious labels and a real call-to-action button.
 */
export function SelectedWork() {
  return (
    <ol className="grid gap-7 sm:gap-9">
      {works.map((work, i) => (
        <MarqueeBill index={i} key={work.hash} work={work} />
      ))}
    </ol>
  );
}

function MarqueeBill({ index, work }: { index: number; work: Work }) {
  const reduce = useReducedMotion();
  const Tag = work.href ? "a" : "div";
  const status = STATUS[work.status];

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <Tag
        className="marquee-bill group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href={work.href}
        data-direction={index % 2 === 0 ? "forward" : "reverse"}
      >
        {/* Bulb border — top + bottom rows of chasing lights */}
        <span aria-hidden="true" className="marquee-bulbs marquee-bulbs-top" />
        <span aria-hidden="true" className="marquee-bulbs marquee-bulbs-bottom" />

        {/* Bill interior */}
        <div className="relative grid gap-7 bg-bg-light-2 px-6 py-9 transition-colors duration-300 group-hover:bg-bg-light sm:gap-9 sm:px-12 sm:py-12">
          {/* HEADER ROW — year (top-left) + status pill (top-right) */}
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
            <span className="tabular-nums">
              {work.year}
              <span className="ml-3 text-text-light-muted/40">·</span>
              <span className="ml-3 hidden sm:inline">{work.branch}</span>
            </span>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1 ${status.bg} ${status.ring} ${status.accent}`}
            >
              <span
                aria-hidden="true"
                className={`relative inline-block h-1.5 w-1.5 rounded-full ${status.dot}`}
              >
                {work.status === "live" ? (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 animate-ping rounded-full ${status.dot} opacity-65`}
                  />
                ) : null}
              </span>
              <span className="font-semibold uppercase tracking-[0.18em]">
                {status.label}
              </span>
            </span>
          </div>

          {/* DISPLAY TITLE — the marquee headline, centered */}
          <h3
            className="text-center font-bold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
            style={{
              fontFamily:
                "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "clamp(1.875rem, 5vw, 3.75rem)",
              fontVariationSettings: '"wdth" 92, "opsz" 96',
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
            }}
          >
            {work.title.toUpperCase()}
          </h3>

          {/* Decorative double rule under the title */}
          <div className="mx-auto -mt-3 grid w-fit gap-0.5 sm:-mt-4">
            <span aria-hidden="true" className="h-px w-24 bg-accent/35 sm:w-36" />
            <span aria-hidden="true" className="h-px w-24 bg-accent/35 sm:w-36" />
          </div>

          {/* CONTEXT BLURB */}
          <p className="mx-auto max-w-2xl text-center text-[14.5px] leading-7 text-text-light-muted sm:text-[15.5px] sm:leading-8">
            {work.context}
          </p>

          {/* FOOTER ROW — metric badge (left) · tech chips (center) · CTA (right) */}
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-8">
            {/* METRIC BADGE — featured outcome, poster-style */}
            <div className="flex items-center gap-3 self-stretch border-t border-accent/15 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:[border-left-width:1px]">
              <span
                aria-hidden="true"
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${status.bg} ${status.accent}`}
              >
                ★
              </span>
              <div>
                <p
                  className={`font-bold tabular-nums ${status.accent}`}
                  style={{
                    fontFamily:
                      "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
                    fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)",
                    fontVariationSettings: '"wdth" 92, "opsz" 96',
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {work.metric}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-text-light-muted">
                  {work.metricLabel.toUpperCase()}
                </p>
              </div>
            </div>

            {/* TECH CHIPS — middle column */}
            <ul className="flex flex-wrap items-center justify-center gap-1.5">
              {work.tech.map((t) => (
                <li
                  className="rounded-full border border-border-light bg-bg-light px-3 py-1 font-mono text-[11px] tracking-[0.06em] text-text-light-muted transition-colors duration-200 group-hover:border-accent/35 group-hover:text-text-light"
                  key={t}
                >
                  {t}
                </li>
              ))}
            </ul>

            {/* CTA — real filled button, not a text link */}
            <span className="inline-flex items-center justify-center gap-2 self-center justify-self-end rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_-10px_rgba(41,110,214,0.55)] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_-12px_rgba(41,110,214,0.7)]">
              {work.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Tag>
    </motion.li>
  );
}
