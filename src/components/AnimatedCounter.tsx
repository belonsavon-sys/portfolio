"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

export type AnimatedCounterProps = {
  className?: string;
  delay?: number;
  duration?: number;
  format?: (value: number) => string;
  from?: number;
  prefix?: string;
  suffix?: string;
  to: number;
};

export function AnimatedCounter({
  className = "",
  delay = 0,
  duration = 1.4,
  format = (value) => Math.round(value).toLocaleString(),
  from = 0,
  prefix = "",
  suffix = "",
  to,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const reduce = useReducedMotion();
  const value = useMotionValue(from);
  const spring = useSpring(value, {
    damping: 30,
    duration: duration * 1000,
    stiffness: 200,
  });
  const display = useTransform(spring, (latest) => `${prefix}${format(latest)}${suffix}`);

  useEffect(() => {
    if (reduce) {
      value.set(to);
      return;
    }
    if (!inView) return;
    const id = window.setTimeout(() => value.set(to), delay * 1000);
    return () => window.clearTimeout(id);
  }, [delay, inView, reduce, to, value]);

  return <motion.span className={className} ref={ref}>{display}</motion.span>;
}
