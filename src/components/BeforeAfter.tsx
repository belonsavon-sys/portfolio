"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type BeforeAfterSide = {
  caption: string;
  metric: string;
  points: string[];
};

export type BeforeAfterProps = {
  after: BeforeAfterSide;
  before: BeforeAfterSide;
  className?: string;
  /** Reserved for future dark-section use; visual stays neutral either way. */
  variant?: "light" | "dark";
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
const viewport = { amount: 0.3, once: true } as const;

export function BeforeAfter({
  after,
  before,
  className = "",
}: BeforeAfterProps) {
  return (
    <div
      className={`grid items-stretch gap-6 sm:grid-cols-[1fr_auto_1fr] ${className}`}
    >
      <SideColumn
        caption={before.caption}
        delay={0}
        kind="before"
        metric={before.metric}
        points={before.points}
      />

      <Connector />

      <SideColumn
        caption={after.caption}
        delay={0.25}
        kind="after"
        metric={after.metric}
        points={after.points}
      />
    </div>
  );
}

function SideColumn({
  caption,
  delay,
  kind,
  metric,
  points,
}: {
  caption: string;
  delay: number;
  kind: "before" | "after";
  metric: string;
  points: string[];
}) {
  const reduce = useReducedMotion();
  const isAfter = kind === "after";
  const labelText = isAfter ? "After" : "Before";

  const metricClass = isAfter ? "text-accent" : "text-text-light/55";

  return (
    <motion.div
      className={`group relative flex flex-col border-l-2 ${
        isAfter ? "border-accent/50" : "border-border-light"
      } pl-5 transition-[border-color] duration-300 sm:pl-6`}
      initial={reduce ? false : { opacity: 0, x: isAfter ? 16 : -16 }}
      transition={{ delay, duration: 0.65, ease: easeOut }}
      viewport={viewport}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
    >
      <p
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] ${
          isAfter
            ? "border-accent/40 bg-[rgba(41,110,214,0.08)] text-accent"
            : "border-border-light bg-bg-light-2 text-text-light-muted"
        }`}
      >
        <span
          className={`h-1 w-1 rounded-full ${isAfter ? "bg-accent" : "bg-text-light-muted/60"}`}
        />
        {labelText}
      </p>

      <span className="mt-3 inline-block overflow-hidden align-top">
        <motion.span
          className={`block text-4xl font-semibold leading-tight tracking-tight sm:text-5xl ${metricClass}`}
          initial={reduce ? false : { y: "100%" }}
          transition={{ delay: delay + 0.15, duration: 0.75, ease: easeOut }}
          viewport={viewport}
          whileInView={reduce ? undefined : { y: 0 }}
        >
          {metric}
        </motion.span>
      </span>

      <p className="mt-2 text-sm leading-6 text-text-light-muted">{caption}</p>

      <ul className="mt-6 grid gap-2 text-sm leading-6 text-text-light-muted">
        {points.map((point, index) => (
          <motion.li
            className="flex items-start gap-2"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            key={point}
            transition={{
              delay: delay + 0.3 + index * 0.06,
              duration: 0.5,
              ease: easeOut,
            }}
            viewport={viewport}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          >
            <span
              aria-hidden="true"
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                isAfter ? "bg-accent" : "bg-text-light-muted/50"
              }`}
            />
            <span>{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function Connector(): ReactNode {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <motion.svg
        aria-hidden="true"
        className="h-8 w-8 text-accent"
        fill="none"
        initial="hidden"
        viewBox="0 0 32 32"
        viewport={viewport}
        whileInView="show"
      >
        <motion.path
          d="M6 16h20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              pathLength: 1,
              transition: { delay: 0.15, duration: 0.6, ease: easeOut },
            },
          }}
        />
        <motion.path
          d="m20 10 6 6-6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          variants={{
            hidden: { opacity: 0, x: -4 },
            show: {
              opacity: 1,
              x: 0,
              transition: { delay: 0.7, duration: 0.4, ease: easeOut },
            },
          }}
        />
      </motion.svg>
    </div>
  );
}
