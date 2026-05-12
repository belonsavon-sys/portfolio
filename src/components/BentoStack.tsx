"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type StackItem = {
  label: string;
  name: Parameters<typeof BrandLogo>[0]["name"];
  note?: string;
  primary?: boolean;
};

type StackCategory = {
  eyebrow: string;
  href?: string;
  items: StackItem[];
  title: string;
};

const categories: StackCategory[] = [
  {
    eyebrow: "01",
    href: "/uses#ai-stack",
    items: [
      { label: "Claude", name: "claude", note: "Daily reasoning + code", primary: true },
      { label: "Codex", name: "codex", note: "Multi-file edits" },
      { label: "ChatGPT", name: "chatgpt", note: "Utility shots" },
      { label: "MCP", name: "mcp", note: "Agent ↔ tool bridge" },
      { label: "Zapier", name: "zapier", note: "Hotel ops glue" },
      { label: "n8n", name: "n8n", note: "Self-hosted automation" },
    ],
    title: "AI & Automation",
  },
  {
    eyebrow: "02",
    href: "/uses",
    items: [
      { label: "TypeScript", name: "typescript", note: "Default · everywhere" },
      { label: "React", name: "react", note: "UI framework" },
      { label: "Next.js", name: "nextjs", note: "App router · this site", primary: true },
      { label: "Tailwind", name: "tailwind", note: "Atomic styles" },
    ],
    title: "Frontend",
  },
  {
    eyebrow: "03",
    href: "/uses#infra",
    items: [
      { label: "Node.js", name: "node", note: "API + scripts" },
      { label: "Express", name: "express", note: "Lightweight servers" },
      { label: "Supabase", name: "supabase", note: "Postgres + auth + RLS", primary: true },
      { label: "MySQL", name: "mysql", note: "Legacy reads" },
    ],
    title: "Backend & DB",
  },
  {
    eyebrow: "04",
    href: "/uses",
    items: [
      { label: "Flutter", name: "flutter", note: "Cross-platform mobile", primary: true },
      { label: "Kotlin", name: "kotlin", note: "KMP shared logic" },
    ],
    title: "Mobile",
  },
  {
    eyebrow: "05",
    href: "/uses#infra",
    items: [
      { label: "Vercel", name: "vercel", note: "This site lives here", primary: true },
      { label: "GitHub", name: "github", note: "PR-driven workflow" },
      { label: "Twilio", name: "twilio", note: "SMS for ops" },
    ],
    title: "Infra & APIs",
  },
  {
    eyebrow: "06",
    href: "/uses#editor",
    items: [
      { label: "VS Code", name: "vscode", note: "Daily editor", primary: true },
      { label: "Cursor", name: "cursor", note: "Single-file AI edits" },
      { label: "Figma", name: "figma", note: "Design + tokens" },
      { label: "Framer", name: "framer", note: "Layout prototypes" },
    ],
    title: "Tooling & Design",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Tool wall — each category is a horizontal row: editorial label on
 * the left, large interactive brand-logo grid on the right. Hovering
 * a logo enlarges it and surfaces its name in an inline tooltip.
 *
 * Replaces the previous bento-grid magazine cards. Reads as one
 * cohesive spec sheet rather than six decorative cards.
 */
export function BentoStack() {
  const reduce = useReducedMotion();

  return (
    <div className="grid divide-y divide-border-light border-y border-border-light">
      {categories.map((category, categoryIndex) => (
        <motion.div
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="grid grid-cols-12 items-baseline gap-x-6 gap-y-6 py-10 sm:py-12"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          key={category.title}
          transition={{
            delay: categoryIndex * 0.04,
            duration: 0.55,
            ease: easeOut,
          }}
          viewport={{ amount: 0.25, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          {/* LEFT — editorial label */}
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {category.eyebrow}
            </p>
            <h3
              className="mt-2 font-semibold tracking-tight text-text-light"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              {category.title}
            </h3>
            <p className="mt-2 font-mono text-[10px] tabular-nums uppercase tracking-[0.22em] text-text-light-muted">
              {category.items.length}{" "}
              {category.items.length === 1 ? "tool" : "tools"}
            </p>
            {category.href ? (
              <a
                className="group/cat mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors duration-200 hover:text-accent-deep"
                href={category.href}
              >
                <span aria-hidden="true" className="text-accent/70">↳</span>
                <span className="link-underline">Why these</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/cat:translate-x-0.5"
                >
                  →
                </span>
              </a>
            ) : null}
          </div>

          {/* RIGHT — logo wall */}
          <ul className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-8 lg:justify-end">
            {category.items.map((item, itemIndex) => (
              <ToolTile
                delay={categoryIndex * 0.04 + itemIndex * 0.03}
                item={item}
                key={item.label}
                reduce={!!reduce}
              />
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

function ToolTile({
  delay,
  item,
  reduce,
}: {
  delay: number;
  item: StackItem;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      className="relative"
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ delay, duration: 0.5, ease: easeOut }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
    >
      <button
        aria-label={item.primary ? `${item.label} · primary` : item.label}
        className={`group relative flex h-16 w-16 items-center justify-center rounded-xl border bg-white/70 backdrop-blur-md transition-[transform,border-color,box-shadow,background] duration-300 hover:-translate-y-1 hover:border-accent/55 hover:bg-white hover:shadow-[0_18px_36px_-18px_rgba(41,110,214,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-20 sm:w-20 ${
          item.primary
            ? "border-accent/45 shadow-[0_8px_24px_-12px_rgba(41,110,214,0.35)]"
            : "border-border-light"
        }`}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        type="button"
      >
        <BrandLogo
          className={`transition-colors duration-300 group-hover:text-accent ${
            item.primary ? "text-accent" : "text-text-light-muted"
          }`}
          name={item.name}
          size={32}
        />
        {item.primary ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-accent bg-bg-light font-mono text-[10px] font-semibold text-accent shadow-[0_2px_6px_-2px_rgba(41,110,214,0.55)]"
            title="Primary in this category"
          >
            ★
          </span>
        ) : null}
      </button>

      {/* Tooltip — appears above the tile on hover/focus.
          Carries the tool's usage note when present (iter-268). */}
      <motion.span
        animate={{
          opacity: hovered && !reduce ? 1 : 0,
          y: hovered && !reduce ? -6 : 0,
        }}
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 inline-flex max-w-[220px] -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap rounded-md border border-accent/30 bg-bg-light px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)]"
        transition={{ duration: 0.2, ease: easeOut }}
      >
        <span className="font-semibold">{item.label}</span>
        {item.note ? (
          <span className="font-normal tracking-[0.18em] text-text-light-muted">
            {item.note}
          </span>
        ) : null}
      </motion.span>
    </motion.li>
  );
}
