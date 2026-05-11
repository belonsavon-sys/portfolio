"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

export type AtlasHierarchyLayer = {
  badge: string;
  items: string[];
  title: string;
};

export type AtlasHierarchyProps = {
  layers: AtlasHierarchyLayer[];
};

/**
 * The Atlas 5-layer hierarchy with a scroll-driven scrubber: as the
 * user scrolls through the list, a sticky indicator at the top of the
 * column shows the active layer name and a 5-segment fill bar
 * progresses left-to-right.
 *
 * scrollYProgress is scoped to the list's own ref (offset
 * ["start 75%", "end 25%"]) so the bar starts filling when the list
 * is about a quarter into view from the bottom and completes when
 * it's a quarter out the top.
 */
export function AtlasHierarchy({ layers }: AtlasHierarchyProps) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    offset: ["start 75%", "end 25%"],
    target: listRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduce) return;
    // Map 0..1 → 0..layers.length-1, clamped.
    const idx = Math.min(
      layers.length - 1,
      Math.max(0, Math.floor(latest * layers.length)),
    );
    setActiveIndex(idx);
  });

  return (
    <div>
      {/* Section eyebrow header */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-[rgba(41,110,214,0.10)]"
        >
          <span className="h-2 w-2 rounded-sm bg-accent" />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          Atlas · the engine
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
      </div>

      {/* SCROLL SCRUBBER — sticky strip showing active layer + progress bar */}
      <div className="sticky top-24 z-10 mt-5 -mx-2 rounded-xl border border-border-light bg-bg-light/85 px-3 py-2.5 backdrop-blur-md sm:mx-0 sm:px-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            {layers[activeIndex]?.badge ?? "00"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
            /
          </span>
          <motion.span
            animate={{ opacity: 1 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-light"
            initial={{ opacity: 0.6 }}
            key={layers[activeIndex]?.title}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {layers[activeIndex]?.title}
          </motion.span>
          <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
            {String(activeIndex + 1).padStart(2, "0")} / {String(layers.length).padStart(2, "0")}
          </span>
        </div>
        {/* Segmented progress rail */}
        <div className="mt-2 flex gap-1">
          {layers.map((_, i) => (
            <span
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i <= activeIndex
                  ? "bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                  : "bg-[rgba(41,110,214,0.18)]"
              }`}
              key={i}
            />
          ))}
        </div>
      </div>

      {/* The hierarchy list itself */}
      <ul className="relative mt-5 grid gap-3" ref={listRef}>
        {/* Subtle vertical thread connecting the hierarchy levels */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-accent/60 via-accent/25 to-transparent"
        />
        {layers.map((layer, index) => {
          const active = index === activeIndex;
          return (
            <ScrollReveal delay={index * 0.06} direction="left" key={layer.title}>
              <li
                className={`group relative rounded-xl border bg-bg-light-2 p-5 transition-[border-color,box-shadow,transform] duration-300 ${
                  active && !reduce
                    ? "border-accent/45 shadow-[0_8px_24px_-12px_rgba(41,110,214,0.25)]"
                    : "border-border-light hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_8px_24px_-12px_rgba(41,110,214,0.25)]"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-semibold tracking-tight transition-colors duration-300 ${
                      active && !reduce
                        ? "border-accent bg-accent text-white"
                        : "border-accent/40 bg-bg-light text-accent"
                    }`}
                  >
                    {layer.badge}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted transition-colors duration-200 group-hover:text-text-light">
                    {layer.title}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      className="inline-flex items-center rounded-md border border-accent/30 bg-[rgba(41,110,214,0.08)] px-2.5 py-1 text-sm font-medium text-text-light"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </li>
            </ScrollReveal>
          );
        })}
      </ul>
    </div>
  );
}
