"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";

const integratedWith = [
  { label: "GitHub", name: "github" as const },
  { label: "Vercel", name: "vercel" as const },
  { label: "Supabase", name: "supabase" as const },
  { label: "Twilio", name: "twilio" as const },
  { label: "Zapier", name: "zapier" as const },
  { label: "n8n", name: "n8n" as const },
  { label: "Claude", name: "claude" as const },
  { label: "ChatGPT", name: "chatgpt" as const },
  { label: "Cursor", name: "cursor" as const },
  { label: "MCP", name: "mcp" as const },
];

export type TrustStripProps = {
  className?: string;
  label?: string;
};

export function TrustStrip({
  className = "",
  label = "Tools I've integrated with in production",
}: TrustStripProps) {
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-text-light-muted">
        {label}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-text-light/70">
        {integratedWith.map((item, index) => (
          <motion.div
            animate={reduce ? { opacity: 0.7 } : undefined}
            className="flex items-center gap-2 transition-colors duration-200 hover:text-accent"
            initial={reduce ? { opacity: 0.7 } : { opacity: 0, y: 8 }}
            key={item.label}
            transition={{
              delay: index * 0.04,
              duration: 0.4,
              ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
            }}
            viewport={{ amount: 0.4, once: true }}
            whileInView={{ opacity: 0.7, y: 0 }}
          >
            <BrandLogo name={item.name} size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
