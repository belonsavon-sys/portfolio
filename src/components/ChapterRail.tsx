"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type ChapterRailSection = {
  id: string;
  index: string;
  label: string;
};

export type ChapterRailProps = {
  sections: ChapterRailSection[];
};

/**
 * Vertical chapter rail anchored to the right margin (lg+). Each
 * section gets a small dot; the active section enlarges + reveals its
 * label inline. A thin connecting line behind the dots reads as the
 * spine of the page. Clicking a dot smoothly scrolls to that section.
 *
 * Active section computed via IntersectionObserver with a -30% / -30%
 * rootMargin so a section is "active" only when it's the reader's
 * focal area — outside the chapters (hero / footer / between-section
 * gaps) the rail fades to a quiet inactive state.
 */
export function ChapterRail({ sections }: ChapterRailProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const visibility = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    function recompute() {
      let best: { id: string; ratio: number } | null = null;
      for (const [id, ratio] of visibility) {
        if (ratio > 0.15 && (!best || ratio > best.ratio)) {
          best = { id, ratio };
        }
      }
      setActiveId(best?.id ?? null);
    }

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(section.id, entry.intersectionRatio);
          }
          recompute();
        },
        {
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

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="Page chapters"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto relative flex flex-col gap-4">
        {/* Vertical spine — gradient-fade ends so the rail reads as a
            station line rather than a hard rule. Centered on the dots. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-transparent via-border-light to-transparent"
        />
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li className="flex items-center justify-end" key={section.id}>
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={`Jump to ${section.label}`}
                className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                onClick={() => scrollTo(section.id)}
                type="button"
              >
                {/* Inline label — bracket-framed when active, muted on
                    hover when inactive. */}
                <span
                  className={`whitespace-nowrap font-mono text-[12px] transition-[opacity,transform] duration-300 ${
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {isActive ? (
                    <span className="font-semibold text-text-light">
                      — {section.label.toLowerCase()}
                    </span>
                  ) : (
                    <span className="text-text-light-muted">
                      {section.label.toLowerCase()}
                    </span>
                  )}
                </span>

                {/* Station — numbered circular badge. Index lives inside
                    the dot like atomic numbers on the Stack section. */}
                <motion.span
                  animate={reduce ? undefined : { scale: isActive ? 1.08 : 1 }}
                  aria-hidden="true"
                  className={`relative inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border font-mono text-[9.5px] font-semibold tabular-nums tracking-tighter transition-colors duration-300 ${
                    isActive
                      ? "border-accent bg-accent text-text-dark shadow-[0_0_0_4px_rgba(41,110,214,0.18),0_0_22px_-2px_rgba(41,110,214,0.55)]"
                      : "border-border-light bg-bg-light text-text-light-muted/85 group-hover:border-accent/55 group-hover:text-accent"
                  }`}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="relative">{section.index}</span>
                </motion.span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
