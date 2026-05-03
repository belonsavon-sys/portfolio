"use client";

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
        kind="before"
        metric={before.metric}
        points={before.points}
      />

      <Connector />

      <SideColumn
        caption={after.caption}
        kind="after"
        metric={after.metric}
        points={after.points}
      />
    </div>
  );
}

function SideColumn({
  caption,
  kind,
  metric,
  points,
}: {
  caption: string;
  kind: "before" | "after";
  metric: string;
  points: string[];
}) {
  const isAfter = kind === "after";
  const labelText = isAfter ? "After" : "Before";

  // Neutral by default; only the After metric uses accent.
  const metricClass = isAfter
    ? "text-accent"
    : "text-text-light/55";

  return (
    <div
      className={`flex flex-col border-l ${
        isAfter ? "border-accent/40" : "border-border-light"
      } pl-5 sm:pl-6`}
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-text-light-muted">
        {labelText}
      </p>
      <p
        className={`mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl ${metricClass}`}
      >
        {metric}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-light-muted">{caption}</p>

      <ul className="mt-6 grid gap-2 text-sm leading-6 text-text-light-muted">
        {points.map((point) => (
          <li className="flex items-start gap-2" key={point}>
            <span
              aria-hidden="true"
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                isAfter ? "bg-accent" : "bg-text-light-muted/50"
              }`}
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Connector(): ReactNode {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <svg
        aria-hidden="true"
        className="h-8 w-8 text-accent"
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          d="M6 16h20m0 0-6-6m6 6-6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  );
}
