"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type NowReadingSection = {
  id: string;
  index: string;
  label: string;
};

export type NowReadingProps = {
  sections: NowReadingSection[];
};

/**
 * A small fixed bottom-left card that tracks which page section is in
 * the reader's central viewport via IntersectionObserver. Cross-fades
 * between sections; disappears entirely when none is active (hero,
 * footer, or between-section gaps) — so it reads as a series of
 * appearing/disappearing moments, not a persistent chip.
 */
export function NowReading({ sections }: NowReadingProps) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const visibility = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    function recomputeActive() {
      let best: { id: string; ratio: number } | null = null;
      for (const [id, ratio] of visibility) {
        if (ratio > 0.15 && (!best || ratio > best.ratio)) {
          best = { id, ratio };
        }
      }
      setActive(best?.id ?? null);
    }

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(section.id, entry.intersectionRatio);
          }
          recomputeActive();
        },
        {
          // Shrink the effective viewport to the middle ~40% so a
          // section is "active" only while it's actually the reader's
          // focal area — not the moment its first pixel scrolls in.
          rootMargin: "-30% 0px -30% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [sections]);

  const activeSection = sections.find((s) => s.id === active);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-6 z-40 hidden sm:block"
    >
      <AnimatePresence mode="wait">
        {activeSection ? (
          <motion.div
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-white/85 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-light shadow-[0_8px_24px_-12px_rgba(41,110,214,0.3)] backdrop-blur-md"
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
            key={activeSection.id}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent">{activeSection.index}</span>
            <span aria-hidden="true" className="h-3 w-px bg-border-light" />
            <span>{activeSection.label}</span>
            <span
              aria-hidden="true"
              className="ml-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(41,110,214,0.6)]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
