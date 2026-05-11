"use client";

import type { ReactNode } from "react";

export type MarqueeBandProps = {
  className?: string;
  items: string[];
  separator?: ReactNode;
  speed?: number;
  tone?: "light" | "dark";
};

const defaultSeparator = (
  <span
    aria-hidden="true"
    className="mx-8 inline-block h-2 w-2 rotate-45 bg-accent"
  />
);

export function MarqueeBand({
  className = "",
  items,
  separator = defaultSeparator,
  speed = 36,
  tone = "light",
}: MarqueeBandProps) {
  const dark = tone === "dark";
  const loop = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border-y py-7 ${
        dark
          ? "border-accent-light/15 bg-bg-dark text-text-dark"
          : "border-border-light bg-bg-light-2 text-text-light"
      } ${className}`}
    >
      <ul
        className="marquee-track flex w-max items-center font-semibold uppercase tracking-tight"
        style={{
          animationDuration: `${speed}s`,
          fontSize: "clamp(1.5rem, 4vw, 3.25rem)",
          letterSpacing: "-0.02em",
        }}
      >
        {loop.map((item, index) => (
          <li
            className="flex shrink-0 items-center whitespace-nowrap"
            key={`${item}-${index}`}
          >
            <span>{item}</span>
            {separator}
          </li>
        ))}
      </ul>
      {/* Edge fades */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-24 ${
          dark
            ? "bg-gradient-to-r from-bg-dark to-transparent"
            : "bg-gradient-to-r from-bg-light-2 to-transparent"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-24 ${
          dark
            ? "bg-gradient-to-l from-bg-dark to-transparent"
            : "bg-gradient-to-l from-bg-light-2 to-transparent"
        }`}
      />
    </div>
  );
}
