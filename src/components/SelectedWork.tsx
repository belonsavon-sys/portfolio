"use client";

import { motion, useReducedMotion } from "framer-motion";

type Work = {
  branch: string;
  context: string;
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
    diffClass: "text-text-light-muted",
    glow: "rgba(100,116,139,0.55)",
    node: "#64748b",
  },
  live: {
    diffClass: "text-result-green",
    glow: "rgba(16,185,129,0.7)",
    node: "#10b981",
  },
  shipped: {
    diffClass: "text-accent",
    glow: "rgba(41,110,214,0.55)",
    node: "#296ed6",
  },
} as const;

const TRACK = { 0: 26, 1: 58 } as const;
const GUTTER_W = 84;

/**
 * Selected Work — "ship.log" dialect. Deliberately departs from the
 * bento-with-massive-number pattern used by Outcomes. Renders as a
 * git-log file panel: file-tab strip, command echo, a real two-track
 * branch graph in the gutter (atlas/main + privatehotels/*),
 * diff-prefixed display titles, mono commit preamble, redacted tail.
 */
export function SelectedWork() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative"
    >
      {/* outer halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-accent/[0.04] blur-3xl"
      />

      {/* File-tab strip — lowercase tabs, no caps tracking */}
      <div className="relative flex items-end gap-1">
        <div className="relative z-10 flex items-center gap-2 rounded-t-lg border border-b-0 border-accent/30 bg-bg-light-2 px-4 py-2 font-mono text-[12px] text-text-light shadow-[0_-4px_12px_-6px_rgba(41,110,214,0.18)]">
          <span aria-hidden="true" className="not-italic text-accent">▸</span>
          <span>ship.log</span>
          <span aria-hidden="true" className="ml-1 inline-block h-px w-3 bg-accent" />
        </div>
        <div className="relative flex items-center gap-2 rounded-t-lg border border-b-0 border-accent/15 bg-accent/[0.025] px-4 py-2 font-mono text-[12px] text-text-light-muted">
          <span>redacted.log</span>
        </div>
        <div className="ml-auto hidden items-baseline gap-2 self-end pb-1 pr-1 font-mono text-[12px] text-text-light-muted sm:flex">
          <span>head at </span>
          <span className="not-italic tabular-nums text-accent">{works[0]!.hash}</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative overflow-hidden rounded-b-lg rounded-tr-lg border border-accent/25 bg-bg-light-2 shadow-[0_18px_50px_-22px_rgba(41,110,214,0.30)]">
        {/* Command echo line */}
        <div className="relative flex items-center gap-2 border-b border-accent/15 bg-accent/[0.04] px-5 py-3 font-mono text-[11px] tracking-tight text-text-light-muted sm:px-6">
          <span className="font-semibold text-accent">$</span>
          <span className="min-w-0 truncate">
            <span className="font-semibold text-text-light/90">git log</span>
            <span className="text-text-light-muted">
              {" "}
              --graph --pretty=ship --since=2024 --author=pierre
            </span>
          </span>
          <span className="ml-auto inline-flex shrink-0 items-baseline gap-1.5 font-mono text-[12px] text-result-green">
            <span>4 commits, 2 still live</span>
          </span>
        </div>

        {/* Faint scanline texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-12 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 0, transparent 26px, rgba(41,110,214,0.03) 27px, transparent 28px)",
            backgroundSize: "100% 28px",
          }}
        />

        <ol className="relative divide-y divide-accent/12">
          {works.map((work, i) => (
            <CommitRow
              first={i === 0}
              key={work.hash}
              last={i === works.length - 1}
              reduce={!!reduce}
              rowIndex={i}
              work={work}
            />
          ))}
        </ol>

        {/* Redacted tail — editorial caption */}
        <div className="relative flex items-center border-t border-accent/15 bg-accent/[0.025] py-3 font-mono text-[12px]">
          <span className="relative shrink-0" style={{ width: GUTTER_W }}>
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible"
              preserveAspectRatio="none"
              viewBox={`0 0 ${GUTTER_W} 100`}
            >
              <line
                strokeDasharray="2 3"
                strokeLinecap="round"
                strokeWidth="1"
                x1={TRACK[0]}
                x2={TRACK[0]}
                y1="0"
                y2="100"
                stroke="rgba(41,110,214,0.20)"
              />
            </svg>
            <span
              aria-hidden="true"
              className="absolute font-mono text-base leading-none text-accent/55"
              style={{
                left: TRACK[0],
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              ⋮
            </span>
          </span>
          <span className="text-text-light-muted">
            earlier commits redacted — client confidentiality
          </span>
        </div>
      </div>
    </div>
  );
}

function CommitRow({
  first,
  last,
  reduce,
  rowIndex,
  work,
}: {
  first: boolean;
  last: boolean;
  reduce: boolean;
  rowIndex: number;
  work: Work;
}) {
  const status = STATUS[work.status];
  const Tag = work.href ? "a" : "div";
  const trackX = TRACK[work.track];

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, x: 0 }}
      initial={reduce ? false : { opacity: 0, x: -10 }}
      transition={{ delay: rowIndex * 0.08, duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
    >
      <Tag
        className="group/row relative flex min-h-[200px] items-stretch transition-colors duration-300 hover:bg-accent/[0.045] focus-visible:bg-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
        href={work.href}
      >
        {/* Status diff rail on the RIGHT edge (full-height, status-tinted).
            Distinct from Outcomes' inset-y left edge bar. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[3px] opacity-55 transition-opacity duration-300 group-hover/row:opacity-100"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${status.glow} 45%, ${status.glow} 55%, transparent 100%)`,
          }}
        />

        {/* Branch-graph gutter */}
        <div
          aria-hidden="true"
          className="relative shrink-0"
          style={{ width: GUTTER_W }}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox={`0 0 ${GUTTER_W} 100`}
          >
            {rowIndex === 0 ? (
              <>
                {/* Track A active: top → atlas node — animated draw */}
                <motion.line
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke="rgba(41,110,214,0.55)"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  transition={{
                    delay: 0.15,
                    duration: 0.65,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                  x1={TRACK[0]}
                  x2={TRACK[0]}
                  y1="0"
                  y2="50"
                />
                {/* Track A continues into older history — dashed below */}
                <motion.line
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke="rgba(41,110,214,0.22)"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                  strokeWidth="1"
                  transition={{
                    delay: 0.95,
                    duration: 0.6,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                  x1={TRACK[0]}
                  x2={TRACK[0]}
                  y1="56"
                  y2="100"
                />
                {/* Fork curve A → B — draws after track A reaches the node */}
                <motion.path
                  d={`M ${TRACK[0]} 50 Q ${TRACK[0]} 86 ${TRACK[1]} 100`}
                  fill="none"
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke="rgba(41,110,214,0.55)"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  transition={{
                    delay: 0.7,
                    duration: 0.75,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                />
              </>
            ) : (
              <>
                {/* Track A continues, faded dashed */}
                <motion.line
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke="rgba(41,110,214,0.22)"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                  strokeWidth="1"
                  transition={{
                    delay: rowIndex * 0.08 + 0.1,
                    duration: 0.7,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                  x1={TRACK[0]}
                  x2={TRACK[0]}
                  y1="0"
                  y2="100"
                />
                {/* Track B vertical — animates down to (or through) the node */}
                <motion.line
                  initial={reduce ? false : { pathLength: 0 }}
                  stroke="rgba(41,110,214,0.55)"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  transition={{
                    delay: rowIndex * 0.08 + 0.18,
                    duration: 0.7,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={reduce ? undefined : { pathLength: 1 }}
                  x1={TRACK[1]}
                  x2={TRACK[1]}
                  y1="0"
                  y2={last ? 50 : 100}
                />
                {last ? (
                  <motion.line
                    initial={reduce ? false : { pathLength: 0 }}
                    stroke="rgba(41,110,214,0.35)"
                    strokeLinecap="round"
                    strokeWidth="1"
                    transition={{
                      delay: rowIndex * 0.08 + 0.9,
                      duration: 0.5,
                      ease: easeOut,
                    }}
                    viewport={{ amount: 0.2, once: true }}
                    whileInView={reduce ? undefined : { pathLength: 1 }}
                    x1={TRACK[1] - 6}
                    x2={TRACK[1] + 6}
                    y1="98"
                    y2="98"
                  />
                ) : null}
              </>
            )}

            {/* Node — bg ring + filled circle + soft glow */}
            <circle cx={trackX} cy="50" fill="var(--bg-light-2)" r="6.5" />
            <circle
              cx={trackX}
              cy="50"
              fill={status.node}
              r="4.5"
              style={{ filter: `drop-shadow(0 0 6px ${status.glow})` }}
            />
            <circle
              cx={trackX}
              cy="50"
              fill="none"
              r="4.5"
              stroke={status.node}
              strokeOpacity="0.35"
              strokeWidth="3"
            />
          </svg>

        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 py-7 pr-6 sm:py-9 sm:pr-9">
          {/* Mono commit preamble — editorial, no caps tracking */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[12px]">
            <span className="text-text-light-muted">commit</span>
            <span className="not-italic tabular-nums text-accent">
              {work.hash}
            </span>
            <span className="text-text-light-muted/60">on</span>
            <span className="text-text-light">{work.branch}</span>
            {first ? (
              <span className="text-result-green">— head</span>
            ) : null}
            <span className="text-text-light-muted/60">·</span>
            <span className="text-text-light-muted">{work.year}</span>
          </div>

          {/* Diff-prefixed BIG title — the bold typographic move */}
          <h3
            className="mt-3 flex items-baseline gap-3 font-semibold tracking-tight text-text-light transition-colors duration-300 group-hover/row:text-accent-deep"
            style={{
              fontSize: "clamp(1.45rem, 2.6vw, 1.95rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
            }}
          >
            <span
              aria-hidden="true"
              className={`shrink-0 font-mono font-bold ${status.diffClass}`}
              style={{ fontSize: "0.9em" }}
            >
              +
            </span>
            <span>{work.title}</span>
          </h3>

          {/* Body */}
          <p className="mt-2.5 max-w-[60ch] text-[0.95rem] leading-relaxed text-text-light-muted">
            {work.context}
          </p>

          {/* Footer — metric + tech as editorial prose, no rounded
              chip wrappers. */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[12px]">
            <span className="not-italic text-accent/80">→</span>
            <span className="font-semibold tabular-nums text-text-light">
              {work.metric}
            </span>
            <span className="text-text-light-muted">{work.metricLabel}</span>

            <span className="text-text-light-muted/40">·</span>

            <span className="text-text-light-muted">
              built with {work.tech.join(", ")}
            </span>

            {work.href ? (
              <span className="ml-auto inline-flex items-baseline gap-1.5 text-accent">
                <span className="link-underline">see receipts</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/row:translate-x-1"
                >
                  →
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </Tag>
    </motion.li>
  );
}
