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
      { label: "Supabase", name: "supabase" },
      { label: "MySQL", name: "mysql" },
    ],
    title: "Backend & DB",
  },
  {
    eyebrow: "04",
    items: [
      { label: "Flutter", name: "flutter" },
      { label: "Kotlin", name: "kotlin" },
      { label: "Kotlin Multiplatform", name: "kmp" },
    ],
    title: "Mobile",
  },
  {
    eyebrow: "05",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
      { label: "VS Code", name: "vscode" },
      { label: "Cursor", name: "cursor" },
      { label: "Antigravity", name: "antigravity" },
    ],
    title: "Infra & Tooling",
  },
  {
    eyebrow: "06",
    items: [
      { label: "Figma", name: "figma" },
      { label: "Framer", name: "framer" },
    ],
    title: "Design",
  },
];

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export function BentoStack() {
  const reduce = useReducedMotion();

  return (
    <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-[box-shadow,transform] duration-200"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          key={category.title}
          style={{
            background: category.accent
              ? "linear-gradient(135deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.42) 60%, rgba(41,110,214,0.18) 100%)"
              : "rgba(255,255,255,0.45)",
            borderTop: "1px solid rgba(255,255,255,0.90)",
            borderLeft: "1px solid rgba(255,255,255,0.65)",
            borderRight: "1px solid rgba(41,110,214,0.14)",
            borderBottom: "1px solid rgba(41,110,214,0.14)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.9) inset, " +
              "0 1px 3px rgba(0,0,0,0.06), " +
              "0 8px 24px rgba(15,23,42,0.10), " +
              "0 24px 48px -8px rgba(15,23,42,0.14)",
          }}
          transition={{ delay: index * 0.04, duration: 0.5, ease: easeOut }}
          viewport={{ amount: 0.2, once: true }}
          whileHover={{ y: -3, boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.95) inset, " +
            "0 1px 3px rgba(0,0,0,0.07), " +
            "0 8px 24px rgba(15,23,42,0.12), " +
            "0 24px 48px -8px rgba(15,23,42,0.18), " +
            "0 0 0 1px rgba(41,110,214,0.28), " +
            "0 8px 24px rgba(41,110,214,0.10)" }}
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
