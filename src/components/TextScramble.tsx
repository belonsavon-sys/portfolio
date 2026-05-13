"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type TextScrambleProps = {
  /** Final text — always visible from mount on. */
  text: string;
  /** Legacy prop, ignored. Kept so existing call sites compile. */
  durationMs?: number;
  /** Legacy prop, ignored. Kept so existing call sites compile. */
  stepMs?: number;
  /** Optional class name on the wrapping span. */
  className?: string;
  /** Optional inline style. */
  style?: CSSProperties;
  /** Trigger a burst of simultaneous flashes on hover. Default true. */
  rerunOnHover?: boolean;
};

type Glitch =
  | { mode: "normal" }
  | { mode: "flash" }
  | { mode: "rgb" };

/**
 * Live-glitch text — the final string is always rendered and fully
 * readable. Continuously, every 1.5–3s, a random non-space character
 * briefly flashes (200ms) with a green text-shadow glow and accent
 * color. Less frequently (every 5–8s), one character gets a stronger
 * RGB-shift slice (red/cyan offset).
 *
 * Layout is fixed — no characters are swapped or resized, only
 * color and text-shadow change. The title is rock-stable.
 *
 * On hover, fires a burst of 4 simultaneous flashes for extra
 * presence. Reduced-motion users get plain static text.
 */
export function TextScramble({
  className = "",
  rerunOnHover = true,
  style,
  text,
}: TextScrambleProps) {
  const finalChars = Array.from(text);
  const [glitches, setGlitches] = useState<Glitch[]>(() =>
    finalChars.map(() => ({ mode: "normal" })),
  );
  const flashTimerRef = useRef<number | null>(null);
  const rgbTimerRef = useRef<number | null>(null);
  const reduceRef = useRef<boolean>(false);

  function nonSpaceIndexes(): number[] {
    return finalChars
      .map((c, i) => (c === " " ? -1 : i))
      .filter((i) => i >= 0);
  }

  function flashOne(mode: "flash" | "rgb" = "flash", duration = 220) {
    const candidates = nonSpaceIndexes();
    if (candidates.length === 0) return;
    const idx = candidates[Math.floor(Math.random() * candidates.length)]!;
    setGlitches((prev) => {
      const next = prev.slice();
      next[idx] = { mode };
      return next;
    });
    window.setTimeout(() => {
      setGlitches((prev) => {
        const next = prev.slice();
        if (next[idx]?.mode === mode) next[idx] = { mode: "normal" };
        return next;
      });
    }, duration);
  }

  function burst(count = 4) {
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(
        () => flashOne(Math.random() > 0.7 ? "rgb" : "flash", 280),
        i * 40,
      );
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceRef.current) return;

    // Schedule recurring single-char flashes at variable intervals.
    const scheduleFlash = () => {
      flashOne("flash");
      flashTimerRef.current = window.setTimeout(
        scheduleFlash,
        1500 + Math.random() * 1500,
      );
    };
    flashTimerRef.current = window.setTimeout(
      scheduleFlash,
      800 + Math.random() * 800,
    );

    // Less frequent RGB-slice flash for heavier glitch beats.
    const scheduleRgb = () => {
      flashOne("rgb", 320);
      rgbTimerRef.current = window.setTimeout(
        scheduleRgb,
        5000 + Math.random() * 3000,
      );
    };
    rgbTimerRef.current = window.setTimeout(
      scheduleRgb,
      3000 + Math.random() * 2000,
    );

    return () => {
      if (flashTimerRef.current !== null)
        window.clearTimeout(flashTimerRef.current);
      if (rgbTimerRef.current !== null)
        window.clearTimeout(rgbTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onHover() {
    if (!rerunOnHover || reduceRef.current) return;
    burst(5);
  }

  return (
    <span
      aria-label={text}
      className={className}
      onMouseEnter={onHover}
      style={style}
    >
      {finalChars.map((ch, i) => {
        const g = glitches[i] ?? { mode: "normal" };
        if (g.mode === "flash") {
          return (
            <span
              aria-hidden="true"
              className="text-result-green"
              key={i}
              style={{
                textShadow:
                  "0 0 10px rgba(16,185,129,0.85), 0 0 2px rgba(16,185,129,0.95)",
              }}
            >
              {ch}
            </span>
          );
        }
        if (g.mode === "rgb") {
          return (
            <span
              aria-hidden="true"
              key={i}
              style={{
                textShadow:
                  "2px 0 0 rgba(239,68,68,0.85), -2px 0 0 rgba(91,155,244,0.85)",
              }}
            >
              {ch}
            </span>
          );
        }
        return (
          <span aria-hidden="true" key={i}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
