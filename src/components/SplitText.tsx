"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

export type SplitTextProps = {
  /** The text to split. Spaces between words are preserved. */
  children: string;
  /** Stagger delay between characters (seconds). */
  charDelay?: number;
  /** Optional className applied to the wrapping span. */
  className?: string;
  /** Overall delay before the first char animates (seconds). */
  delay?: number;
  /** Duration per character (seconds). */
  duration?: number;
  /** Trigger mode: "load" (animate once on mount) or "scroll" (on inView). */
  trigger?: "load" | "scroll";
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Letter-by-letter mask reveal — each character sits inside an
 * overflow-hidden mask and slides up from 100% to 0 with stagger.
 * Spaces are preserved as non-animating spans for layout fidelity.
 */
export function SplitText({
  children,
  charDelay = 0.025,
  className,
  delay = 0,
  duration = 0.7,
  trigger = "load",
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const id = useId();

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  const chars = Array.from(children);

  const charVariants = {
    hidden: { y: "110%" },
    show: { y: 0 },
  };

  const transitionProps =
    trigger === "scroll"
      ? {
          initial: "hidden" as const,
          viewport: { amount: 0.4, once: true } as const,
          whileInView: "show" as const,
        }
      : {
          animate: "show" as const,
          initial: "hidden" as const,
        };

  return (
    <span className={className} aria-label={children}>
      <motion.span
        aria-hidden="true"
        className="inline-block"
        {...transitionProps}
      >
        {chars.map((char, index) => {
          const isSpace = char === " ";
          return (
            <span
              className="inline-block overflow-hidden align-top"
              key={`${id}-${index}`}
              // Preserve word-break opportunities at spaces.
              style={isSpace ? { width: "0.27em" } : undefined}
            >
              <motion.span
                className="inline-block"
                transition={{
                  delay: delay + index * charDelay,
                  duration,
                  ease: easeOut,
                }}
                variants={charVariants}
              >
                {isSpace ? " " : char}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}
