"use client";

import { motion, useReducedMotion } from "framer-motion";

export type LiveStatusBadgeProps = {
  className?: string;
  label: string;
  tone?: "green" | "accent";
};

export function LiveStatusBadge({
  className = "",
  label,
  tone = "green",
}: LiveStatusBadgeProps) {
  const reduce = useReducedMotion();

  const dotColor = tone === "green" ? "bg-result-green" : "bg-accent-light";
  const textColor =
    tone === "green" ? "text-result-green" : "text-accent-light";

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] ${textColor} ${className}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-2 w-2">
        {!reduce ? (
          <motion.span
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.4, 1] }}
            className={`absolute inset-0 rounded-full ${dotColor}`}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
          />
        ) : null}
        <span className={`relative inline-block h-2 w-2 rounded-full ${dotColor}`} />
      </span>
      {label}
    </span>
  );
}
