"use client";

import { BrandLogo } from "./BrandLogo";

type StackItem = { label: string; name: Parameters<typeof BrandLogo>[0]["name"] };

type StackCategory = {
  eyebrow: string;
  items: StackItem[];
  title: string;
};

const categories: StackCategory[] = [
  {
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
    eyebrow: "04",
    items: [
      { label: "Vercel", name: "vercel" },
      { label: "GitHub", name: "github" },
      { label: "VS Code", name: "vscode" },
      { label: "Cursor", name: "cursor" },
    ],
    title: "Infra & Tooling",
  },
];

export function BentoStack() {
  return (
    <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
      {categories.map((category) => (
        <article key={category.title}>
          <div className="flex items-baseline gap-3 border-b border-border-light pb-3">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              {category.eyebrow}
            </span>
            <h3 className="text-lg font-semibold text-text-light">
              {category.title}
            </h3>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {category.items.map((item) => (
              <li
                className="flex items-center gap-2.5 text-text-light"
                key={item.label}
              >
                <span className="shrink-0 text-text-light-muted">
                  <BrandLogo name={item.name} size={20} />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
