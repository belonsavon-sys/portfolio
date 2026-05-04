"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export type ParallaxBackdropProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function ParallaxBackdrop({
  children,
  className = "pointer-events-none absolute inset-0 -z-10",
  speed = 1,
}: ParallaxBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const range = reduce ? 0 : 200 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <div className={className} ref={ref}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
