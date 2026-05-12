"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

export type ParallaxGhostProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wraps a giant ghost-text watermark in a scroll-driven parallax + opacity
 * ramp. Used for "LET'S TALK", "AI", "HELLO", "RÉSUMÉ"-style massive
 * background letters that should breathe with the page instead of
 * sitting fully static. Honors useReducedMotion.
 *
 * Reveal curve (vs section's scrollYProgress 0 → 1):
 *  - y:       +60px → 0 → −60px (drifts up as you pass it)
 *  - opacity: 0.4 → 1 → 1 → 0.5 (brighten on entry, dim on exit)
 */
export function ParallaxGhost({
  children,
  className = "",
  style,
}: ParallaxGhostProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.4, 1, 1, 0.5],
  );

  return (
    <motion.span
      className={className}
      ref={ref}
      style={reduce ? style : { ...style, opacity, y }}
    >
      {children}
    </motion.span>
  );
}
