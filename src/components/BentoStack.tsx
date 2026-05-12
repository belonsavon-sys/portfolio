"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type StackItem = {
  label: string;
  name: Parameters<typeof BrandLogo>[0]["name"];
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
      { label: "Claude", name: "claude" },
      { label: "Codex", name: "codex" },
      { label: "ChatGPT", name: "chatgpt" },
      { label: "MCP", name: "mcp" },
      { label: "Zapier", name: "zapier" },
      { label: "n8n", name: "n8n" },
    ],
    title: "AI & Automation",
  },
  {
    eyebrow: "02",
    href: "/uses",
    items: [
      { label: "TypeScript", name: "typescript" },
      { label: "React", name: "react" },
      { label: "Next.js", name: "nextjs" },
      { label: "Tailwind", name: "tailwind" },
    ],
    title: "Frontend",
  },
  {
    eyebrow: "03",
    href: "/uses#infra",
    items: [
      { label: "Node.js", name: "node" },
      { label: "Express", name: "express" },
      { label: "Supabase", name: "supabase" },
      { label: "MySQL", name: "mysql" },
    ],
    title: "Backend & DB",
  },
  {
    eyebrow: "04",
    href: "/uses",
    items: [
      { label: "Flutter", name: "flutter" },
      { label: "Kotlin", name: "kotlin" },
    ],
    title: "Mobile",
  },
  {
    eyebrow: "05",
    href: "/uses#infra",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
      { label: "Twilio", name: "twilio" },
    ],
    title: "Infra & APIs",
  },
  {
    eyebrow: "06",
    href: "/uses#editor",
    items: [
      { label: "VS Code", name: "vscode" },
      { label: "Cursor", name: "cursor" },
      { label: "Figma", name: "figma" },
      { label: "Framer", name: "framer" },
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
        aria-label={item.label}
        className="group relative flex h-16 w-16 items-center justify-center rounded-xl border border-border-light bg-white/70 backdrop-blur-md transition-[transform,border-color,box-shadow,background] duration-300 hover:-translate-y-1 hover:border-accent/55 hover:bg-white hover:shadow-[0_18px_36px_-18px_rgba(41,110,214,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-20 sm:w-20"
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        type="button"
      >
        <BrandLogo
          className="text-text-light-muted transition-colors duration-300 group-hover:text-accent"
          name={item.name}
          size={32}
        />
      </button>

      {/* Tooltip — appears above the tile on hover/focus */}
      <motion.span
        animate={{
          opacity: hovered && !reduce ? 1 : 0,
          y: hovered && !reduce ? -6 : 0,
        }}
        className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/30 bg-bg-light px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)]"
        transition={{ duration: 0.2, ease: easeOut }}
      >
        {item.label}
      </motion.span>
    </motion.li>
  );
}
