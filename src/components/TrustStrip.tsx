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

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export type TrustStripProps = {
  className?: string;
  label?: string;
};

export function TrustStrip({
  className = "",
  label = "Tools I've integrated with in production",
}: TrustStripProps) {
  const reduce = useReducedMotion();
  const loop = [...integratedWith, ...integratedWith];

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      transition={{ staggerChildren: 0.04 }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={reduce ? undefined : "show"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04 } },
      }}
    >
      <motion.p
        className="text-center font-mono text-xs uppercase tracking-[0.22em] text-text-light-muted"
        variants={{
          hidden: { opacity: 0, y: 6 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
        }}
      >
        {label}
      </motion.p>

      <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5rem,black_calc(100%-5rem),transparent)]">
        <ul className="marquee-track flex w-max items-center gap-x-12 text-text-light/70">
          {loop.map((item, index) => (
            <motion.li
              aria-hidden={index >= integratedWith.length}
              className="flex shrink-0 items-center gap-2 transition-colors duration-200 hover:text-accent"
              key={`${item.label}-${index}`}
              variants={
                index < integratedWith.length
                  ? {
                      hidden: { opacity: 0, y: 8 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45, ease: easeOut },
                      },
                    }
                  : undefined
              }
            >
              <BrandLogo name={item.name} size={20} />
              <span className="whitespace-nowrap text-sm font-medium">
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
