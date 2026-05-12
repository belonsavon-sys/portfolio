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
      <ul className="pointer-events-auto relative flex flex-col gap-5">
        {/* Vertical spine — connects the dots */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-border-light"
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
                {/* Inline label — appears on hover or when this section is active */}
                <span
                  className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] transition-[opacity,transform] duration-300 ${
                    isActive
                      ? "translate-x-0 text-accent opacity-100"
                      : "translate-x-1 text-text-light-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="text-text-light-muted/60">{section.index}</span>
                  <span className="ml-1.5">{section.label}</span>
                </span>

                {/* Dot */}
                <motion.span
                  animate={
                    reduce
                      ? undefined
                      : { scale: isActive ? 1.4 : 1 }
                  }
                  aria-hidden="true"
                  className={`relative inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border transition-colors duration-300 ${
                    isActive
                      ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(41,110,214,0.18)]"
                      : "border-border-light bg-bg-light group-hover:border-accent/60"
                  }`}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
