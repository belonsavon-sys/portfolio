"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const greetings = [
  { lang: "en", text: "Hello," },
  { lang: "es", text: "Hola," },
  { lang: "it", text: "Ciao," },
];

export type GreetingRotatorProps = {
  className?: string;
  intervalMs?: number;
};

export function GreetingRotator({
  className = "",
  intervalMs = 2400,
}: GreetingRotatorProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % greetings.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduce]);

  return (
    <span
      aria-label={`Hello in three languages: ${greetings.map((g) => g.text).join(" ")}`}
      className={`relative inline-block ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          aria-hidden="true"
          className="inline-block"
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          key={greetings[index].lang}
          lang={greetings[index].lang}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {greetings[index].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
