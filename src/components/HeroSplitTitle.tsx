"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export type HeroSplitTitleProps = {
  /**
   * The visible string. Animated in by GSAP on mount.
   */
  text: string;
  /**
   * Optional starting delay for the reveal (seconds).
   */
  delay?: number;
};

/**
 * Hero title with a GSAP-driven left-to-right `clip-path` reveal,
 * landing on the `.gradient-shift` color sweep. The reveal pairs
 * with a tiny upward slide + blur clear; once it lands the title
 * sits in the resting gradient state.
 *
 * Two design constraints that ruled out a per-character cascade
 * here:
 *
 *   1. `background-clip: text` doesn't propagate through
 *      `display: inline-block` descendants, so per-char spans break
 *      the gradient continuity.
 *   2. Applying the gradient per-char makes each char run its own
 *      local sweep — the accent flashes in every character
 *      simultaneously instead of travelling across the whole word.
 *
 * A single-element `clip-path` reveal keeps the gradient continuous
 * AND lets GSAP own the entrance.
 *
 * The hover-glitch chromatic aberration is supplied by the outer
 * `.auto-glitch` class on the `<h1>` ancestor — unchanged.
 *
 * Reduced-motion users skip the animation entirely and see the
 * resting state immediately.
 */
export function HeroSplitTitle({ text, delay = 0 }: HeroSplitTitleProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined") return;
    // `?frozen=1` forces the resting state for screenshot capture /
    // social previews — same effect as prefers-reduced-motion. Both
    // skip the GSAP tween entirely so the element stays at its
    // natural CSS rest, fully visible.
    const frozen =
      new URLSearchParams(window.location.search).get("frozen") === "1";
    if (
      frozen ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.set(el, {
      clipPath: "inset(0 100% 0 0)",
      filter: "blur(8px)",
      y: 14,
    });

    const tween = gsap.to(el, {
      clipPath: "inset(0 0% 0 0)",
      delay,
      duration: 1.2,
      ease: "power3.out",
      filter: "blur(0px)",
      y: 0,
    });

    return () => {
      tween.kill();
    };
  }, [delay, text]);

  return (
    <span
      aria-label={text}
      className="gradient-shift inline-block whitespace-pre will-change-[clip-path,transform,filter]"
      ref={ref}
    >
      {text}
    </span>
  );
}
