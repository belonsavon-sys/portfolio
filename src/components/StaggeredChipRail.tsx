"use client";

import { motion, useReducedMotion } from "framer-motion";

export type StaggeredChipRailProps = {
  baseDelay?: number;
  chips: string[];
  className?: string;
  /** Per-chip stagger gap, seconds. */
  stagger?: number;
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * A row of pill chips that fade in left-to-right on mount. Matches the
 * staggered hero chip rail on /. Each chip has a tiny accent dot before
 * its label.
 */
export function StaggeredChipRail({
  baseDelay = 0,
  chips,
  className = "mt-8 flex flex-wrap justify-center gap-2",
  stagger = 0.08,
}: StaggeredChipRailProps) {
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      {chips.map((chip, index) => (
        <motion.span
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/60 px-3.5 py-1.5 font-mono text-[11px] text-text-light backdrop-blur-md transition-[border-color,background] duration-200 hover:border-accent hover:bg-white/85"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          key={chip}
          transition={{
            delay: baseDelay + index * stagger,
            duration: 0.55,
            ease: easeOut,
          }}
        >
          <span className="h-1 w-1 rounded-full bg-accent" />
          {chip}
        </motion.span>
      ))}
    </div>
  );
}
