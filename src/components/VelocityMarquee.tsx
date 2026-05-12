"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useEffect, useRef } from "react";

export type VelocityMarqueeProps = {
  baseDurationSec?: number;
  className?: string;
  items: string[];
  tone?: "light" | "dark";
};

/**
 * A scroll-driven word strip: words drift at a constant base speed and
 * subtly skew (and accelerate) with scroll velocity. Edges fade so the
 * line "appears and disappears" instead of hard-cutting. Honors
 * useReducedMotion (renders a static strip).
 */
export function VelocityMarquee({
  baseDurationSec = 28,
  className = "",
  items,
  tone = "light",
}: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Map velocity to a small skew angle. Clamp via clamp option on
  // useTransform's input range so wild flicks don't tilt the strip
  // off-axis.
  const skew = useTransform(
    smoothVelocity,
    [-2400, 0, 2400],
    [-6, 0, 6],
    { clamp: true },
  );

  // Translate-X for the inner track, driven by a base loop plus a small
  // velocity-tied offset. We animate x manually on a motion value so
  // velocity can additively nudge it.
  const baseX = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let prev = performance.now();
    const pxPerMs = 1000 / (baseDurationSec * 1000);
    const TRACK_FRACTION = 50; // duplicate copies → 50% offset = one full loop

    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      // Move left at base speed (negative direction).
      const next = baseX.get() - pxPerMs * dt * TRACK_FRACTION;
      // Loop back when we've drifted one full copy.
      baseX.set(next <= -TRACK_FRACTION ? next + TRACK_FRACTION : next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseDurationSec, baseX, reduce]);

  const x = useTransform(baseX, (v) => `${v}%`);

  const dark = tone === "dark";
  const loop = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border-y py-8 sm:py-10 ${
        dark
          ? "border-accent-light/15 bg-bg-dark text-text-dark"
          : "border-border-light bg-bg-light-2 text-text-light"
      } ${className}`}
      ref={wrapperRef}
    >
      <motion.div
        className="flex w-max items-center font-semibold uppercase will-change-transform"
        style={{
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          letterSpacing: "-0.02em",
          skewX: reduce ? 0 : skew,
          x: reduce ? "0%" : x,
        }}
      >
        {loop.map((item, index) => (
          <span
            className="flex shrink-0 items-center whitespace-nowrap"
            key={`${item}-${index}`}
          >
            <span
              className={
                dark
                  ? "bg-gradient-to-r from-text-dark via-accent-light to-text-dark bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-text-light via-accent to-text-light bg-clip-text text-transparent"
              }
            >
              {item}
            </span>
            <span
              className={`mx-8 inline-block h-3 w-3 rotate-45 ${
                dark ? "bg-accent-light/70" : "bg-accent"
              }`}
            />
          </span>
        ))}
      </motion.div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-32 ${
          dark
            ? "bg-gradient-to-r from-bg-dark to-transparent"
            : "bg-gradient-to-r from-bg-light-2 to-transparent"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-32 ${
          dark
            ? "bg-gradient-to-l from-bg-dark to-transparent"
            : "bg-gradient-to-l from-bg-light-2 to-transparent"
        }`}
      />
    </div>
  );
}
