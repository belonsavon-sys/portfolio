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

/**
 * Before / After comparison block. Reads as a transformation: each
 * side is an editorial spec card (chapter mark + massive metric +
 * terminal-style bullets), and a strong animated connector with a
 * traveling pulse dot lives between them. The After column gets a
 * soft accent glow to mark it as the goal state.
 */
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
  const chapterMark = isAfter ? "02" : "01";

  return (
    <motion.div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-light-2 p-5 transition-[border-color,box-shadow] duration-300 sm:p-6 ${
        isAfter
          ? "border-accent/40 shadow-[0_18px_36px_-22px_rgba(41,110,214,0.30)] hover:border-accent/70"
          : "border-border-light hover:border-text-light/30"
      }`}
      initial={reduce ? false : { opacity: 0, x: isAfter ? 16 : -16 }}
      transition={{ delay, duration: 0.65, ease: easeOut }}
      viewport={viewport}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
    >
      {/* After-column accent glow — a subtle "goal state" wash sitting
          behind the card content. */}
      {isAfter ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        />
      ) : null}

      {/* Chapter rail — mark + label + accent rule. Matches the
          editorial chapter cards used elsewhere on the site. */}
      <div className="relative flex items-center gap-3">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.32em] ${
            isAfter ? "text-accent" : "text-text-light-muted"
          }`}
        >
          {chapterMark} · {labelText}
        </span>
        <span
          aria-hidden="true"
          className={`h-px w-8 ${isAfter ? "bg-accent/40" : "bg-border-light"}`}
        />
        {isAfter ? (
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ) : null}
      </div>

      {/* Massive metric — slides up on viewport-enter. */}
      <span className="relative mt-4 inline-block overflow-hidden align-top">
        <motion.span
          className={`block font-semibold leading-[1] tracking-tight ${
            isAfter ? "text-accent" : "text-text-light/55"
          }`}
          initial={reduce ? false : { y: "100%" }}
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            letterSpacing: "-0.04em",
          }}
          transition={{ delay: delay + 0.15, duration: 0.75, ease: easeOut }}
          viewport={viewport}
          whileInView={reduce ? undefined : { y: 0 }}
        >
          {metric}
        </motion.span>
      </span>

      <p className="relative mt-3 text-sm leading-6 text-text-light-muted">
        {caption}
      </p>

      {/* Terminal-style bullets — `>` prefix matches the resume
          datasheets, /now reading queue, and engagement specs. */}
      <ul className="relative mt-6 grid gap-2 text-sm leading-6 text-text-light-muted">
        {points.map((point, index) => (
          <motion.li
            className="flex items-start gap-2 font-mono text-[12.5px] leading-6"
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
              className={`shrink-0 ${isAfter ? "text-accent/70" : "text-text-light-muted/60"}`}
            >
              &gt;
            </span>
            <span className="text-[13.5px] leading-7 text-text-light-muted sm:text-sm">
              {point}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function Connector(): ReactNode {
  const reduce = useReducedMotion();
  return (
    <div className="relative hidden items-center justify-center sm:flex">
      {/* Gradient connector rail — draws from left to right as the
          comparison enters view. */}
      <motion.span
        aria-hidden="true"
        className="h-px w-12 origin-left bg-gradient-to-r from-text-light-muted/30 via-accent to-accent-light"
        initial={reduce ? false : { scaleX: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        viewport={viewport}
        whileInView={reduce ? undefined : { scaleX: 1 }}
      />

      {/* Pulsing dot at the After-end of the connector — signals
          "this is where the change lands". */}
      <span
        aria-hidden="true"
        className="absolute right-[-3px] top-1/2 inline-flex h-2 w-2 -translate-y-1/2"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
        <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
      </span>
    </div>
  );
}
