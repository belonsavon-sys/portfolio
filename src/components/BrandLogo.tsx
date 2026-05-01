"use client";

import {
  siAnthropic,
  siExpress,
  siFigma,
  siFlutter,
  siFramer,
  siGithub,
  siJavascript,
  siKotlin,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siZapier,
  type SimpleIcon,
} from "simple-icons";

type BrandKey =
  // simple-icons-backed
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "tailwind"
  | "flutter"
  | "kotlin"
  | "node"
  | "express"
  | "supabase"
  | "mysql"
  | "vercel"
  | "github"
  | "figma"
  | "framer"
  | "vscode"
  | "chatgpt"
  | "zapier"
  | "n8n"
  | "twilio"
  // custom (no simple-icons coverage)
  | "claude"
  | "codex"
  | "mcp"
  | "guesty"
  | "antigravity"
  | "cursor"
  | "kmp";

const simpleIconRegistry: Record<string, SimpleIcon> = {
  claude: siAnthropic,
  express: siExpress,
  figma: siFigma,
  flutter: siFlutter,
  framer: siFramer,
  github: siGithub,
  javascript: siJavascript,
  kotlin: siKotlin,
  mysql: siMysql,
  n8n: siN8n,
  nextjs: siNextdotjs,
  node: siNodedotjs,
  react: siReact,
  supabase: siSupabase,
  tailwind: siTailwindcss,
  typescript: siTypescript,
  vercel: siVercel,
  zapier: siZapier,
};

const customMarks: Record<string, { color: string; mark: string; title: string }> = {
  antigravity: { color: "#0ea5e9", mark: "AG", title: "Antigravity" },
  chatgpt: { color: "#10A37F", mark: "GPT", title: "ChatGPT" },
  codex: { color: "#0F172A", mark: "Cx", title: "Codex" },
  cursor: { color: "#0F172A", mark: "Cu", title: "Cursor" },
  guesty: { color: "#1F4FFF", mark: "Gy", title: "Guesty" },
  kmp: { color: "#7F52FF", mark: "KMP", title: "Kotlin Multiplatform" },
  mcp: { color: "#0F172A", mark: "MCP", title: "Model Context Protocol" },
  twilio: { color: "#F22F46", mark: "Tw", title: "Twilio" },
  vscode: { color: "#0098FF", mark: "VS", title: "VS Code" },
};

export type BrandLogoProps = {
  className?: string;
  colored?: boolean;
  name: BrandKey;
  size?: number;
};

export function BrandLogo({
  className = "",
  colored = false,
  name,
  size = 22,
}: BrandLogoProps) {
  const icon = simpleIconRegistry[name];

  if (icon) {
    return (
      <svg
        aria-label={icon.title}
        className={className}
        height={size}
        role="img"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{icon.title}</title>
        <path
          d={icon.path}
          fill={colored ? `#${icon.hex}` : "currentColor"}
        />
      </svg>
    );
  }

  const fallback = customMarks[name];
  if (fallback) {
    return (
      <span
        aria-label={fallback.title}
        className={`inline-flex items-center justify-center rounded-md font-mono text-[10px] font-bold uppercase tracking-tight ${className}`}
        role="img"
        style={{
          background: colored ? fallback.color : "transparent",
          border: colored ? "none" : `1px solid ${fallback.color}`,
          color: colored ? "#fff" : fallback.color,
          height: size,
          width: size,
        }}
        title={fallback.title}
      >
        {fallback.mark}
      </span>
    );
  }

  return null;
}
