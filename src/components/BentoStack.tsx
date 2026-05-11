"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";

type StackItem = { label: string; name: Parameters<typeof BrandLogo>[0]["name"] };

type StackCategory = {
  accent: string;
  eyebrow: string;
  items: StackItem[];
  title: string;
};

const categories: StackCategory[] = [
  {
    accent: "from-accent-deep via-accent to-accent-light",
    eyebrow: "01",
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
    accent: "from-accent to-accent-light",
    eyebrow: "02",
    items: [
      { label: "TypeScript", name: "typescript" },
      { label: "React", name: "react" },
      { label: "Next.js", name: "nextjs" },
      { label: "Tailwind", name: "tailwind" },
    ],
    title: "Frontend",
  },
  {
    accent: "from-accent-deep to-accent",
    eyebrow: "03",
    items: [
      { label: "Node.js", name: "node" },
      { label: "Express", name: "express" },
      { label: "Supabase", name: "supabase" },
      { label: "MySQL", name: "mysql" },
    ],
    title: "Backend & DB",
  },
  {
    accent: "from-accent-light to-accent",
    eyebrow: "04",
    items: [
      { label: "Flutter", name: "flutter" },
      { label: "Kotlin", name: "kotlin" },
    ],
    title: "Mobile",
  },
  {
    accent: "from-accent to-accent-deep",
    eyebrow: "05",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
      { label: "Twilio", name: "twilio" },
    ],
    title: "Infra & APIs",
  },
  {
    accent: "from-accent-light to-accent-deep",
    eyebrow: "06",
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

export function BentoStack() {
  const reduce = useReducedMotion();

  // Magazine-style asymmetric grid for 6 categories on a 12-col base.
  // AI hero card spans wide; mobile is compact; design closes the spread.
  const spans = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-4",
    "lg:col-span-3",
    "lg:col-span-5",
    "lg:col-span-12",
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
      {categories.map((category, categoryIndex) => (
        <motion.article
          className={`group/cat relative overflow-hidden rounded-3xl border border-border-light bg-white/70 p-7 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[0_24px_48px_-20px_rgba(41,110,214,0.25)] sm:p-8 ${
            spans[categoryIndex] ?? ""
          }`}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          key={category.title}
          transition={{
            delay: categoryIndex * 0.06,
            duration: 0.7,
            ease: easeOut,
          }}
          viewport={{ amount: 0.3, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          {/* Numbered eyebrow row */}
          <div className="relative flex items-baseline justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {category.eyebrow} /  stack
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-light-muted">
              {category.items.length}{" "}
              {category.items.length === 1 ? "tool" : "tools"}
            </span>
          </div>

          {/* Display title */}
          <h3
            className="relative mt-3 font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {category.title}
          </h3>

          <motion.span
            aria-hidden="true"
            className={`relative mt-5 block h-px origin-left bg-gradient-to-r ${category.accent}`}
            initial={reduce ? false : { scaleX: 0 }}
            transition={{
              delay: categoryIndex * 0.06 + 0.25,
              duration: 0.9,
              ease: easeOut,
            }}
            viewport={{ amount: 0.4, once: true }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            style={{ width: "60%" }}
          />

          <ul className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {category.items.map((item, itemIndex) => (
              <motion.li
                className="group/item flex items-center gap-2 text-text-light"
                initial={reduce ? false : { opacity: 0, x: -6 }}
                key={item.label}
                transition={{
                  delay: categoryIndex * 0.06 + 0.35 + itemIndex * 0.04,
                  duration: 0.5,
                  ease: easeOut,
                }}
                viewport={{ amount: 0.3, once: true }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              >
                <span className="shrink-0 text-text-light-muted/70 transition-[transform,color] duration-300 group-hover/item:scale-110 group-hover/item:text-accent">
                  <BrandLogo name={item.name} size={22} />
                </span>
                <span className="text-sm font-medium transition-colors duration-200 group-hover/item:text-accent-deep">
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}
