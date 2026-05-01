"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";

type StackItem = { label: string; name: Parameters<typeof BrandLogo>[0]["name"] };

type StackCategory = {
  accent?: boolean;
  eyebrow: string;
  items: StackItem[];
  title: string;
};

const categories: StackCategory[] = [
  {
    accent: true,
    eyebrow: "01",
    items: [
      { label: "Claude", name: "claude" },
      { label: "Codex", name: "codex" },
      { label: "ChatGPT", name: "chatgpt" },
      { label: "MCP", name: "mcp" },
      { label: "Zapier", name: "zapier" },
      { label: "n8n", name: "n8n" },
      { label: "Twilio", name: "twilio" },
      { label: "Guesty", name: "guesty" },
    ],
    title: "AI & Automation",
  },
  {
    eyebrow: "02",
    items: [
      { label: "JavaScript", name: "javascript" },
      { label: "TypeScript", name: "typescript" },
      { label: "React", name: "react" },
      { label: "Next.js", name: "nextjs" },
      { label: "Tailwind CSS", name: "tailwind" },
    ],
    title: "Frontend",
  },
  {
    eyebrow: "03",
    items: [
      { label: "Node.js", name: "node" },
      { label: "Express.js", name: "express" },
    ],
    title: "Backend",
  },
  {
    eyebrow: "04",
    items: [
      { label: "Supabase", name: "supabase" },
      { label: "MySQL", name: "mysql" },
    ],
    title: "Database",
  },
  {
    eyebrow: "05",
    items: [
      { label: "Flutter", name: "flutter" },
      { label: "Kotlin", name: "kotlin" },
      { label: "Kotlin Multiplatform", name: "kmp" },
    ],
    title: "Mobile",
  },
  {
    eyebrow: "06",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
    ],
    title: "Infra",
  },
  {
    eyebrow: "07",
    items: [
      { label: "Figma", name: "figma" },
      { label: "Framer", name: "framer" },
    ],
    title: "Design",
  },
  {
    eyebrow: "08",
    items: [
      { label: "VS Code", name: "vscode" },
      { label: "Antigravity", name: "antigravity" },
      { label: "Cursor", name: "cursor" },
    ],
    title: "IDEs",
  },
];

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export function BentoStack() {
  const reduce = useReducedMotion();

  return (
    <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category, index) => (
        <motion.article
          animate={reduce ? { opacity: 1 } : undefined}
          className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 ${
            category.accent
              ? "border-accent/40 bg-gradient-to-br from-white via-white to-[rgba(41,110,214,0.08)]"
              : "border-border-light"
          }`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          key={category.title}
          transition={{ delay: index * 0.04, duration: 0.5, ease: easeOut }}
          viewport={{ amount: 0.2, once: true }}
          whileHover={{ y: -3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {category.accent ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/10 blur-3xl"
            />
          ) : null}

          <div className="relative flex items-baseline gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              {category.eyebrow}
            </span>
            <h3 className="text-base font-semibold text-text-light">
              {category.title}
            </h3>
          </div>

          <ul className="relative mt-5 grid flex-1 grid-cols-1 gap-2 self-start">
            {category.items.map((item) => (
              <li
                className="group/item flex items-center gap-3 rounded-lg border border-border-light/70 bg-bg-light-2 px-3 py-2 transition-[border-color,background] duration-150 hover:border-accent/40 hover:bg-white"
                key={item.label}
              >
                <span className="shrink-0 text-text-light-muted transition-colors duration-150 group-hover/item:text-accent">
                  <BrandLogo name={item.name} size={18} />
                </span>
                <span className="text-sm font-medium text-text-light">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}
