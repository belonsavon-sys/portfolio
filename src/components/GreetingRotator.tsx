"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const greetings = [
  { lang: "en", text: "Hello, I'm" },
  { lang: "es", text: "Hola, soy" },
  { lang: "it", text: "Ciao, sono" },
];

export type GreetingRotatorProps = {
  className?: string;
  intervalMs?: number;
};

export function GreetingRotator({
  className = "",
  intervalMs = 2800,
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
      aria-label={`Hello, I'm Pierre Belon Savon (English, Spanish, Italian)`}
      className={`relative inline-block ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          aria-hidden="true"
          className="inline-block"
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          key={greetings[index].lang}
          lang={greetings[index].lang}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {greetings[index].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
