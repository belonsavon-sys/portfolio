"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Slot = "morning" | "afternoon" | "evening" | "late";

const GREETINGS: Record<Slot, Array<{ lang: string; text: string }>> = {
  afternoon: [
    { lang: "en", text: "Good afternoon, I'm" },
    { lang: "es", text: "Buenas tardes, soy" },
    { lang: "it", text: "Buon pomeriggio, sono" },
  ],
  evening: [
    { lang: "en", text: "Good evening, I'm" },
    { lang: "es", text: "Buenas tardes, soy" },
    { lang: "it", text: "Buonasera, sono" },
  ],
  late: [
    { lang: "en", text: "Working late, I'm" },
    { lang: "es", text: "Trabajando tarde, soy" },
    { lang: "it", text: "A tarda notte, sono" },
  ],
  morning: [
    { lang: "en", text: "Good morning, I'm" },
    { lang: "es", text: "Buenos días, soy" },
    { lang: "it", text: "Buongiorno, sono" },
  ],
};

const FALLBACK: Array<{ lang: string; text: string }> = [
  { lang: "en", text: "Hello, I'm" },
  { lang: "es", text: "Hola, soy" },
  { lang: "it", text: "Ciao, sono" },
];

function slotForHour(hour: number): Slot {
  if (hour < 5) return "late";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 22) return "evening";
  return "late";
}

export type GreetingRotatorProps = {
  className?: string;
  intervalMs?: number;
};

/**
 * Time-of-day-aware greeting rotator. Picks the right slot from
 * the visitor's local clock (Good morning / afternoon / evening /
 * Working late), then cycles through EN · ES · IT every
 * `intervalMs`. Falls back to the generic "Hello, I'm" trio
 * server-side (before hydration), so the SSR markup is neutral.
 */
export function GreetingRotator({
  className = "",
  intervalMs = 2800,
}: GreetingRotatorProps) {
  const [index, setIndex] = useState(0);
  const [variants, setVariants] = useState(FALLBACK);
  const reduce = useReducedMotion();

  // Pick the right slot on mount; re-pick once per hour while the
  // page stays open so the greeting can transition into the next
  // slot if the visitor is around for a while.
  useEffect(() => {
    function pick() {
      const hour = new Date().getHours();
      setVariants(GREETINGS[slotForHour(hour)]);
    }
    pick();
    const id = window.setInterval(pick, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % variants.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduce, variants.length]);

  const current = variants[index] ?? variants[0];

  return (
    <span
      aria-label="Greeting in English, Spanish, or Italian"
      className={`relative inline-block ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          aria-hidden="true"
          className="inline-block"
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: -8, filter: "blur(6px)" }
          }
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: 8, filter: "blur(6px)" }
          }
          key={`${current.lang}-${current.text}`}
          lang={current.lang}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
