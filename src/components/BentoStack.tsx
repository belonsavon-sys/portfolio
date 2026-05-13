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
  frequency: string;
  href?: string;
  items: StackItem[];
  title: string;
};

const categories: StackCategory[] = [
  {
    eyebrow: "01",
    frequency: "Daily · all 6 tools",
    href: "/uses#ai-stack",
    items: [
      {
        label: "Claude",
        name: "claude",
        note: "Daily reasoning + code",
        primary: true,
      },
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
    frequency: "Daily · this site + apps",
    href: "/lab#uses",
    items: [
      {
        label: "TypeScript",
        name: "typescript",
        note: "Default · everywhere",
      },
      { label: "React", name: "react", note: "UI framework" },
      {
        label: "Next.js",
        name: "nextjs",
        note: "App router · this site",
        primary: true,
      },
      { label: "Tailwind", name: "tailwind", note: "Atomic styles" },
    ],
    title: "Frontend",
  },
  {
    eyebrow: "03",
    frequency: "Weekly · per-app",
    href: "/uses#infra",
    items: [
      { label: "Node.js", name: "node", note: "API + scripts" },
      { label: "Express", name: "express", note: "Lightweight servers" },
      {
        label: "Supabase",
        name: "supabase",
        note: "Postgres + auth + RLS",
        primary: true,
      },
      { label: "MySQL", name: "mysql", note: "Legacy reads" },
    ],
    title: "Backend & DB",
  },
  {
    eyebrow: "04",
    frequency: "Project-based",
    href: "/lab#uses",
    items: [
      {
        label: "Flutter",
        name: "flutter",
        note: "Cross-platform mobile",
        primary: true,
      },
      { label: "Kotlin", name: "kotlin", note: "KMP shared logic" },
    ],
    title: "Mobile",
  },
  {
    eyebrow: "05",
    frequency: "Daily · CI + deploys",
    href: "/uses#infra",
    items: [
      {
        label: "Vercel",
        name: "vercel",
        note: "This site lives here",
        primary: true,
      },
      { label: "GitHub", name: "github", note: "PR-driven workflow" },
      { label: "Twilio", name: "twilio", note: "SMS for ops" },
    ],
    title: "Infra & APIs",
  },
  {
    eyebrow: "06",
    frequency: "Daily · primary editor",
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
 * Periodic-table-style element grid. Each tool is a square cell with
 * an atomic number (top-left), the brand logo (center), the tool
 * label (bottom), and a primary-star indicator (top-right corner)
 * where applicable. Categories are rendered as labeled rows above
 * their cell clusters. Replaces the prior text-heavy 4/8 split (left
 * spec lines + right logo wall), which read as engineering chrome.
 */
export function BentoStack() {
  const reduce = useReducedMotion();

  // Pre-compute running atomic numbers across all categories so each
  // element has a unique 01..N identifier.
  let counter = 0;
  const rows = categories.map((category) => {
    const cells = category.items.map((item) => ({
      atomic: ++counter,
      item,
    }));
    return { category, cells };
  });

  return (
    <div className="relative space-y-9 sm:space-y-11">
      {rows.map(({ category, cells }, ci) => (
        <CategoryGroup
          category={category}
          cells={cells}
          ci={ci}
          key={category.title}
          reduce={!!reduce}
        />
      ))}
    </div>
  );
}

function CategoryGroup({
  category,
  cells,
  ci,
  reduce,
}: {
  category: StackCategory;
  cells: { atomic: number; item: StackItem }[];
  ci: number;
  reduce: boolean;
}) {
  const primaryLabel = category.items.find((i) => i.primary)?.label;

  return (
    <motion.section
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      transition={{ delay: ci * 0.05, duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      {/* Caption line — editorial, no caps tracking, no ping */}
      <div className="mb-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[12px] text-text-light-muted sm:mb-4">
        <span className="not-italic tabular-nums text-accent">
          {category.eyebrow}
        </span>
        <span
          aria-hidden="true"
          className="hidden h-px w-6 bg-accent/30 sm:inline-block"
        />
        <span className="font-semibold text-text-light">
          {category.title}
        </span>
        <span aria-hidden="true" className="text-text-light-muted/40">
          —
        </span>
        <span>{category.frequency}</span>
        {primaryLabel ? (
          <>
            <span aria-hidden="true" className="text-text-light-muted/40">
              ·
            </span>
            <span>
              primary <span className="text-accent">{primaryLabel}</span>
            </span>
          </>
        ) : null}
        {category.href ? (
          <a
            className="group/cat ml-auto inline-flex items-baseline gap-1.5 text-accent transition-colors duration-200 hover:text-accent-deep"
            href={category.href}
          >
            <span aria-hidden="true" className="not-italic text-accent/70">
              ↳
            </span>
            <span className="link-underline">why these</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/cat:translate-x-0.5"
            >
              →
            </span>
          </a>
        ) : null}
      </div>

      {/* Element cells — flex-wrap so rows pack left without empty
          grid tracks when an item count doesn't divide evenly. */}
      <ul className="flex flex-wrap gap-2 sm:gap-2.5">
        {cells.map(({ atomic, item }, ii) => (
          <ElementCell
            atomic={atomic}
            delay={ci * 0.05 + ii * 0.03}
            item={item}
            key={item.label}
            reduce={reduce}
          />
        ))}
      </ul>
    </motion.section>
  );
}

function ElementCell({
  atomic,
  delay,
  item,
  reduce,
}: {
  atomic: number;
  delay: number;
  item: StackItem;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      className="relative w-[104px] sm:w-[120px] md:w-[128px] lg:w-[136px]"
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ delay, duration: 0.45, ease: easeOut }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
    >
      <button
        aria-label={item.primary ? `${item.label} · primary` : item.label}
        className={`group relative flex aspect-square w-full flex-col justify-between rounded-lg border bg-white/70 p-2 backdrop-blur-md transition-[transform,border-color,box-shadow,background] duration-300 hover:-translate-y-1 hover:border-accent/55 hover:bg-white hover:shadow-[0_18px_36px_-18px_rgba(41,110,214,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-2.5 ${
          item.primary
            ? "border-accent/45 shadow-[0_10px_28px_-14px_rgba(41,110,214,0.35)]"
            : "border-border-light"
        }`}
        onBlur={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        type="button"
      >
        {/* atomic number */}
        <span className="self-start font-mono text-[9px] tabular-nums text-text-light-muted/85">
          {String(atomic).padStart(2, "0")}
        </span>

        {/* logo */}
        <span className="flex flex-1 items-center justify-center">
          <BrandLogo
            className={`transition-colors duration-300 group-hover:text-accent ${
              item.primary ? "text-accent" : "text-text-light-muted"
            }`}
            name={item.name}
            size={34}
          />
        </span>

        {/* element label */}
        <span className="block w-full truncate text-center font-mono text-[9.5px] text-text-light-muted">
          {item.label}
        </span>

        {/* primary indicator — top-right star */}
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

      {/* Tooltip — surfaces the usage note on hover/focus. */}
      <motion.span
        animate={{
          opacity: hovered && !reduce ? 1 : 0,
          y: hovered && !reduce ? -6 : 0,
        }}
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 inline-flex max-w-[220px] -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap rounded-md border border-accent/30 bg-bg-light px-2.5 py-1.5 font-mono text-[10px] text-text-light shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)]"
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
