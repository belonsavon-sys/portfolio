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

  const palette =
    tone === "green"
      ? {
          border: "border-result-green/40",
          bg: "bg-[rgba(16,185,129,0.10)]",
          dot: "bg-result-green",
          ring: "bg-result-green/60",
          text: "text-result-green",
        }
      : {
          border: "border-accent-light/40",
          bg: "bg-[rgba(91,155,244,0.10)]",
          dot: "bg-accent-light",
          ring: "bg-accent-light/60",
          text: "text-accent-light",
        };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${palette.border} ${palette.bg} px-3 py-1 backdrop-blur-md ${className}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-2 w-2">
        {!reduce ? (
          <motion.span
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.4, 1] }}
            className={`absolute inset-0 rounded-full ${palette.ring}`}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
          />
        ) : null}
        <span
          className={`relative inline-block h-2 w-2 rounded-full ${palette.dot} ring-4 ${palette.ring} ring-offset-0`}
          style={{ boxShadow: `0 0 8px ${tone === "green" ? "rgba(16,185,129,0.6)" : "rgba(91,155,244,0.6)"}` }}
        />
      </span>
      <span
        className={`font-mono text-[11px] font-medium uppercase tracking-[0.24em] ${palette.text}`}
      >
        {label}
      </span>
    </span>
  );
}
