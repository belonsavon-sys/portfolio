"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";

type StackItem = { label: string; name: Parameters<typeof BrandLogo>[0]["name"] };

type BentoTile = {
  accent?: boolean;
  eyebrow: string;
  items: StackItem[];
  span?: "sm" | "md" | "lg";
  title: string;
};

const tiles: BentoTile[] = [
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
    span: "lg",
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
    span: "md",
    title: "Frontend",
  },
  {
    eyebrow: "03",
    items: [
      { label: "Node.js", name: "node" },
      { label: "Express.js", name: "express" },
    ],
    span: "sm",
    title: "Backend",
  },
  {
    eyebrow: "04",
    items: [
      { label: "Supabase", name: "supabase" },
      { label: "MySQL", name: "mysql" },
    ],
    span: "sm",
    title: "Database",
  },
  {
    eyebrow: "05",
    items: [
      { label: "Flutter", name: "flutter" },
      { label: "Kotlin", name: "kotlin" },
      { label: "KMP", name: "kmp" },
    ],
    span: "sm",
    title: "Mobile",
  },
  {
    eyebrow: "06",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
    ],
    span: "sm",
    title: "Infra",
  },
  {
    eyebrow: "07",
    items: [
      { label: "Figma", name: "figma" },
      { label: "Framer", name: "framer" },
    ],
    span: "sm",
    title: "Design",
  },
  {
    eyebrow: "08",
    items: [
      { label: "VS Code", name: "vscode" },
      { label: "Antigravity", name: "antigravity" },
      { label: "Cursor", name: "cursor" },
    ],
    span: "sm",
    title: "IDEs",
  },
];

const spanClasses: Record<NonNullable<BentoTile["span"]>, string> = {
  lg: "md:col-span-2 xl:col-span-2 xl:row-span-2",
  md: "md:col-span-2 xl:col-span-2",
  sm: "md:col-span-1 xl:col-span-1",
};

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export function BentoStack() {
  const reduce = useReducedMotion();

  return (
    <div className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile, index) => (
        <motion.article
          animate={reduce ? { opacity: 1 } : undefined}
          className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 ${
            tile.accent
              ? "border-accent/40 bg-gradient-to-br from-white via-white to-[rgba(41,110,214,0.06)]"
              : "border-border-light"
          } ${spanClasses[tile.span ?? "sm"]}`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          key={tile.title}
          transition={{ delay: index * 0.05, duration: 0.5, ease: easeOut }}
          viewport={{ amount: 0.2, once: true }}
          whileHover={{ y: -3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {tile.accent ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-opacity duration-300 group-hover:opacity-150"
            />
          ) : null}

          <div className="relative">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {tile.eyebrow}
              </span>
              <h3 className="text-base font-semibold text-text-light">
                {tile.title}
              </h3>
            </div>

            <div
              className={`mt-5 grid gap-3 ${
                tile.span === "lg" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
              }`}
            >
              {tile.items.map((item) => (
                <div
                  className="group/item flex items-center gap-2 rounded-lg border border-border-light/70 bg-bg-light-2 px-3 py-2 transition-[border-color,background] duration-150 hover:border-accent/40 hover:bg-white"
                  key={item.label}
                >
                  <span className="text-text-light-muted transition-colors duration-150 group-hover/item:text-accent">
                    <BrandLogo name={item.name} size={18} />
                  </span>
                  <span className="truncate text-xs font-medium text-text-light">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
