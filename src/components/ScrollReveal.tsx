"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type ScrollRevealProps = {
  as?: "div" | "section" | "article" | "li";
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  distance?: number;
  duration?: number;
  once?: boolean;
};

const offsets: Record<NonNullable<ScrollRevealProps["direction"]>, { x?: number; y?: number }> = {
  fade: {},
  left: { x: -24 },
  right: { x: 24 },
  up: { y: 24 },
};

export function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  direction = "up",
  distance,
  duration = 0.55,
  once = true,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const offset = offsets[direction];
  const initial = reduce
    ? { opacity: 1 }
    : {
        opacity: 0,
        x: distance && direction === "left" ? -distance : distance && direction === "right" ? distance : offset.x,
        y: distance && direction === "up" ? distance : offset.y,
      };

  const MotionTag =
    as === "section"
      ? motion.section
      : as === "article"
        ? motion.article
        : as === "li"
          ? motion.li
          : motion.div;

  return (
    <MotionTag
      className={className}
      initial={initial}
      transition={{
        delay,
        duration,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      }}
      viewport={{ amount: 0.2, once }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
    >
      {children}
    </MotionTag>
  );
}
