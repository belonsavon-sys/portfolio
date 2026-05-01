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
  variant?: "light" | "dark";
};

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export function BeforeAfter({
  after,
  before,
  className = "",
  variant = "light",
}: BeforeAfterProps) {
  const reduce = useReducedMotion();
  const isDark = variant === "dark";

  return (
    <div
      className={`grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 ${className}`}
    >
      <SideCard
        accent="problem"
        caption={before.caption}
        delay={0}
        isDark={isDark}
        metric={before.metric}
        points={before.points}
        reduce={reduce ?? false}
        title="Before"
      />

      <Connector reduce={reduce ?? false} />

      <SideCard
        accent="result"
        caption={after.caption}
        delay={0.25}
        isDark={isDark}
        metric={after.metric}
        points={after.points}
        reduce={reduce ?? false}
        title="After"
      />
    </div>
  );
}

function SideCard({
  accent,
  caption,
  delay,
  isDark,
  metric,
  points,
  reduce,
  title,
}: {
  accent: "problem" | "result";
  caption: string;
  delay: number;
  isDark: boolean;
  metric: string;
  points: string[];
  reduce: boolean;
  title: string;
}) {
  const isProblem = accent === "problem";

  const containerClasses = isDark
    ? `relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md ${
        isProblem
          ? "border-problem-red/40 bg-[rgba(239,68,68,0.08)]"
          : "border-result-green/45 bg-[rgba(16,185,129,0.10)]"
      }`
    : `relative overflow-hidden rounded-2xl border p-6 ${
        isProblem
          ? "border-problem-red/30 bg-problem-red-bg/60"
          : "border-result-green/40 bg-result-green-bg/60"
      }`;

  const titleColor = isProblem
    ? "text-problem-red"
    : "text-result-green";

  const metricColor = isDark
    ? isProblem
      ? "text-problem-red"
      : "text-result-green"
    : "text-text-light";

  const captionColor = isDark ? "text-text-dark-muted" : "text-text-light-muted";
  const pointColor = isDark ? "text-text-dark-muted" : "text-text-light-muted";

  return (
    <motion.div
      animate={
        reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: 0 }
      }
      className={containerClasses}
      initial={
        reduce
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.96, x: isProblem ? -16 : 16 }
      }
      transition={{ delay, duration: 0.6, ease: easeOut }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={
        reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: 0 }
      }
    >
      <p
        className={`font-mono text-xs font-semibold uppercase tracking-[0.22em] ${titleColor}`}
      >
        {title}
      </p>
      <p
        className={`mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl ${metricColor}`}
      >
        {metric}
      </p>
      <p className={`mt-2 text-sm ${captionColor}`}>{caption}</p>

      <div
        aria-hidden="true"
        className={`my-5 h-px w-full ${
          isDark
            ? isProblem
              ? "bg-problem-red/30"
              : "bg-result-green/30"
            : isProblem
              ? "bg-problem-red/30"
              : "bg-result-green/40"
        }`}
      />

      <ul className="grid gap-2.5 text-sm leading-6">
        {points.map((point) => (
          <li className={`flex items-start gap-2 ${pointColor}`} key={point}>
            <span
              aria-hidden="true"
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                isProblem ? "bg-problem-red" : "bg-result-green"
              }`}
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Connector({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      aria-hidden="true"
      className="hidden items-center justify-center sm:flex"
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ delay: 0.45, duration: 0.4, ease: easeOut }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
    >
      <ArrowGlyph />
    </motion.div>
  );
}

function ArrowGlyph(): ReactNode {
  return (
    <svg
      aria-hidden="true"
      className="h-10 w-10 text-accent"
      fill="none"
      viewBox="0 0 40 40"
    >
      <circle
        cx="20"
        cy="20"
        r="19"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <path
        d="M14 20h12m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
