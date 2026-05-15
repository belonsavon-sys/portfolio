"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export type StackItem = {
  label: string;
  note?: string;
  primary?: boolean;
  /** Two-letter element symbol — drives the periodic-table cell. */
  symbol: string;
};

export type StackCategory = {
  abbr: string;
  /** Tile background tint + accent color for this category. */
  color: string;
  eyebrow: string;
  frequency: string;
  href?: string;
  items: StackItem[];
  title: string;
};

export const stackCategories: StackCategory[] = [
  {
    abbr: "AI",
    color: "#8b5cf6",
    eyebrow: "01",
    frequency: "Daily · all 6 tools",
    href: "/uses#ai-stack",
    items: [
      { label: "Claude", note: "Daily reasoning + code", primary: true, symbol: "Cl" },
      { label: "Codex", note: "Multi-file edits", symbol: "Cx" },
      { label: "ChatGPT", note: "Utility shots", symbol: "Cg" },
      { label: "MCP", note: "Agent ↔ tool bridge", symbol: "Mc" },
      { label: "Zapier", note: "Hotel ops glue", symbol: "Zp" },
      { label: "n8n", note: "Self-hosted automation", symbol: "N8" },
    ],
    title: "AI & Automation",
  },
  {
    abbr: "FE",
    color: "#0ea5e9",
    eyebrow: "02",
    frequency: "Daily · this site + apps",
    href: "/lab#uses",
    items: [
      { label: "TypeScript", note: "Default · everywhere", symbol: "Ts" },
      { label: "React", note: "UI framework", symbol: "Rc" },
      { label: "Next.js", note: "App router · this site", primary: true, symbol: "Nx" },
      { label: "Tailwind", note: "Atomic styles", symbol: "Tw" },
    ],
    title: "Frontend",
  },
  {
    abbr: "BE",
    color: "#10b981",
    eyebrow: "03",
    frequency: "Weekly · per-app",
    href: "/uses#infra",
    items: [
      { label: "Node.js", note: "API + scripts", symbol: "Nd" },
      { label: "Express", note: "Lightweight servers", symbol: "Ex" },
      { label: "Supabase", note: "Postgres + auth + RLS", primary: true, symbol: "Sb" },
      { label: "MySQL", note: "Legacy reads", symbol: "Sq" },
    ],
    title: "Backend & DB",
  },
  {
    abbr: "MB",
    color: "#f59e0b",
    eyebrow: "04",
    frequency: "Project-based",
    href: "/lab#uses",
    items: [
      { label: "Flutter", note: "Cross-platform mobile", primary: true, symbol: "Fl" },
      { label: "Kotlin", note: "KMP shared logic", symbol: "Kt" },
    ],
    title: "Mobile",
  },
  {
    abbr: "IN",
    color: "#f43f5e",
    eyebrow: "05",
    frequency: "Daily · CI + deploys",
    href: "/uses#infra",
    items: [
      { label: "Vercel", note: "This site lives here", primary: true, symbol: "Vc" },
      { label: "GitHub", note: "PR-driven workflow", symbol: "Gh" },
      { label: "Twilio", note: "SMS for ops", symbol: "Tl" },
    ],
    title: "Infra & APIs",
  },
  {
    abbr: "DT",
    color: "#6366f1",
    eyebrow: "06",
    frequency: "Daily · primary editor",
    href: "/uses#editor",
    items: [
      { label: "VS Code", note: "Daily editor", primary: true, symbol: "Vs" },
      { label: "Cursor", note: "Single-file AI edits", symbol: "Cu" },
      { label: "Figma", note: "Design + tokens", symbol: "Fg" },
      { label: "Framer", note: "Layout prototypes", symbol: "Fr" },
    ],
    title: "Tooling & Design",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Stack rendered as a literal periodic-table grid. Each tool is an
 * element tile: atomic number top-left, group abbreviation
 * top-right, big 2-letter symbol centered, full name below. The
 * tile's top stripe carries the category color so all 23 elements
 * read at a glance — like a chemistry chart for "what runs this
 * site." Rows correspond to categories; tile widths match. */
export function BentoStack() {
  const reduce = useReducedMotion();

  let counter = 0;
  const rows = stackCategories.map((category) => {
    const cells = category.items.map((item) => ({
      atomic: ++counter,
      item,
    }));
    return { category, cells };
  });

  return (
    <div className="relative">
      {/* LEGEND — colored swatches mapping group abbrs to categories */}
      <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-text-light-muted sm:mb-9">
        <span>— groups</span>
        {stackCategories.map((c) => (
          <span className="inline-flex items-center gap-1.5" key={c.abbr}>
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: c.color }}
            />
            <span className="text-text-light">{c.abbr}</span>
            <span className="text-text-light-muted/55">
              {c.title.toLowerCase()}
            </span>
          </span>
        ))}
      </div>

      {/* GRID — one row per category. Tiles share width; each row
          left-aligned so the irregular widths read as periodic gaps. */}
      <div className="grid gap-3 sm:gap-3.5">
        {rows.map(({ category, cells }, ci) => (
          <PeriodicRow
            category={category}
            cells={cells}
            ci={ci}
            key={category.title}
            reduce={!!reduce}
          />
        ))}
      </div>
    </div>
  );
}

function PeriodicRow({
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
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="grid grid-cols-[60px_minmax(0,1fr)] items-center gap-x-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-x-6"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      transition={{ delay: ci * 0.05, duration: 0.5, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      {/* Row marker — group abbr + eyebrow + colored bar */}
      <div className="flex flex-col items-end gap-1 self-center text-right">
        <span
          aria-hidden="true"
          className="h-0.5 w-7 sm:w-10"
          style={{ background: category.color }}
        />
        <span
          className="font-mono text-[16px] font-bold tracking-[0.05em] sm:text-[18px]"
          style={{ color: category.color }}
        >
          {category.abbr}
        </span>
        <span className="hidden font-mono text-[9.5px] tracking-[0.18em] text-text-light-muted sm:block">
          {category.eyebrow}
        </span>
      </div>

      {/* Cell row */}
      <ul className="flex flex-wrap gap-2 sm:gap-2.5">
        {cells.map(({ atomic, item }, ii) => (
          <ElementCell
            atomic={atomic}
            category={category}
            delay={ci * 0.04 + ii * 0.025}
            item={item}
            key={item.label}
            reduce={reduce}
          />
        ))}
      </ul>
    </motion.div>
  );
}

function ElementCell({
  atomic,
  category,
  delay,
  item,
  reduce,
}: {
  atomic: number;
  category: StackCategory;
  delay: number;
  item: StackItem;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      className="relative w-[92px] sm:w-[104px] md:w-[112px] lg:w-[120px]"
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
    >
      <button
        aria-label={item.primary ? `${item.label} · primary` : item.label}
        className={`group relative flex aspect-square w-full flex-col overflow-hidden rounded-md border bg-bg-light p-2 text-left transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
          item.primary ? "border-text-light" : "border-border-light"
        }`}
        onBlur={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        style={{
          boxShadow: item.primary
            ? `inset 0 3px 0 ${category.color}`
            : `inset 0 2px 0 ${category.color}55`,
        }}
        type="button"
      >
        {/* Header row — atomic number left, group abbr right */}
        <div className="flex items-baseline justify-between font-mono text-[9px] tabular-nums tracking-[0.05em]">
          <span className="text-text-light-muted/85">
            {String(atomic).padStart(2, "0")}
          </span>
          <span
            className="font-bold tracking-[0.04em]"
            style={{ color: category.color }}
          >
            {category.abbr}
          </span>
        </div>

        {/* BIG SYMBOL — centered, takes most of the cell */}
        <span
          className="flex flex-1 items-center justify-center font-bold tracking-tight text-text-light transition-colors duration-300 group-hover:text-accent-deep"
          style={{
            fontFamily:
              "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {item.symbol}
        </span>

        {/* Label */}
        <span className="block w-full truncate text-center font-mono text-[9.5px] text-text-light-muted">
          {item.label}
        </span>

        {/* Primary indicator — top-right star */}
        {item.primary ? (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full font-mono text-[8.5px] font-bold leading-none"
            style={{ background: category.color, color: "#fff" }}
            title="Primary in this category"
          >
            ★
          </span>
        ) : null}
      </button>

      {/* Tooltip */}
      <motion.span
        animate={{
          opacity: hovered && !reduce ? 1 : 0,
          y: hovered && !reduce ? -6 : 0,
        }}
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 inline-flex max-w-[220px] -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap rounded-md border border-border-light bg-bg-light px-2.5 py-1.5 font-mono text-[10px] text-text-light shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)]"
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
