"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Commit = { sha: string; subject: string; when: string };

/**
 * Stacked-deck commit ticker. The current commit sits on top; the
 * next two peek below it with progressive y-offset, opacity falloff,
 * and scale reduction. Every 4.5 s the deck advances: top card
 * slides up and fades, the deck shifts forward, a new card enters
 * at the back of the visible stack.
 *
 * Hover pauses the auto-advance. Manual ← → chevrons (visible on
 * hover) step through the deck.
 *
 * Reads commits from `NEXT_PUBLIC_BUILD_RECENT_COMMITS` at build
 * time. Falls back to a small "awaiting first ship" pill when no
 * commit data is available (shallow clone, fresh project).
 */
export function CommitTicker() {
  const reduce = useReducedMotion();
  const [commits] = useState<Commit[]>(() => {
    try {
      const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch {
      return [];
    }
  });
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // How many cards are visible at once (top + N peeks).
  const VISIBLE = 3;
  const POSITION_STYLES: { opacity: number; scale: number; y: number }[] = [
    { opacity: 1, scale: 1, y: 0 },
    { opacity: 0.55, scale: 0.96, y: 10 },
    { opacity: 0.28, scale: 0.92, y: 20 },
  ];

  useEffect(() => {
    if (reduce || paused || commits.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % commits.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [commits.length, current, paused, reduce]);

  if (commits.length === 0) {
    return (
      <p className="font-mono text-[13px] text-accent">
        ~/ticker — awaiting first ship
      </p>
    );
  }

  const total = commits.length;

  function goPrev() {
    setCurrent((c) => (c - 1 + total) % total);
  }
  function goNext() {
    setCurrent((c) => (c + 1) % total);
  }

  function deckPosition(commitIndex: number): number {
    const diff = (commitIndex - current + total) % total;
    return diff < VISIBLE ? diff : -1;
  }

  return (
    <div
      className="group/deck relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* TOP STRIP — editorial caption, no caps, no ping */}
      <div className="flex items-center gap-3 px-1 pb-3 font-mono text-[13px] text-accent">
        <span>now shipping</span>
        <span aria-hidden="true" className="not-italic text-text-light-muted/40">
          —
        </span>
        <span className="not-italic tabular-nums text-text-light">
          {String(current + 1).padStart(2, "0")}{" "}
          <span className="text-text-light-muted/60">/</span>{" "}
          {String(total).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="text-text-light-muted">
          {paused ? "paused" : "auto-cycling"}
        </span>
        <span className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover/deck:opacity-100">
          <button
            aria-label="Previous commit"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-accent/25 bg-bg-light text-accent transition-colors duration-150 hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={goPrev}
            type="button"
          >
            <span aria-hidden="true" className="text-sm leading-none">
              ←
            </span>
          </button>
          <button
            aria-label="Next commit"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-accent/25 bg-bg-light text-accent transition-colors duration-150 hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={goNext}
            type="button"
          >
            <span aria-hidden="true" className="text-sm leading-none">
              →
            </span>
          </button>
        </span>
      </div>

      {/* DECK — three absolutely-positioned cards, animated by
          deckPosition. Stable height so the page layout doesn't
          shift between cards. */}
      <div className="relative" style={{ height: 108 }}>
        {commits.map((commit, idx) => {
          const pos = deckPosition(idx);
          const visible = pos >= 0;
          const style = visible ? POSITION_STYLES[pos]! : null;

          return (
            <motion.div
              animate={
                visible
                  ? {
                      opacity: style!.opacity,
                      scale: style!.scale,
                      y: style!.y,
                    }
                  : { opacity: 0, scale: 0.9, y: -36 }
              }
              className="absolute inset-x-0 top-0 origin-top"
              initial={false}
              key={commit.sha}
              style={{ zIndex: visible ? total - pos : 0 }}
              transition={{
                duration: reduce ? 0 : 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="relative overflow-hidden rounded-xl border border-border-light bg-bg-light-2 px-5 py-4 shadow-[0_18px_50px_-22px_rgba(41,110,214,0.22)] sm:px-6 sm:py-5">
                {pos === 0 ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-12 h-40 w-40 rounded-full bg-accent/12 blur-3xl"
                  />
                ) : null}

                <div className="relative flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-base font-semibold tracking-[0.12em] text-accent sm:text-lg">
                      {commit.sha}
                    </span>
                    <span className="font-mono text-[12px] text-text-light-muted">
                      {commit.when}
                    </span>
                  </div>
                  <p
                    className="font-semibold tracking-tight text-text-light"
                    style={{
                      fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                      letterSpacing: "-0.012em",
                      lineHeight: 1.3,
                    }}
                  >
                    {commit.subject}
                  </p>
                </div>

                {pos === 0 && !reduce && total > 1 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
                  >
                    <motion.span
                      animate={{ scaleX: 1 }}
                      className="block h-full origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                      initial={{ scaleX: 0 }}
                      key={`${current}-${paused ? "p" : "r"}`}
                      transition={{
                        duration: paused ? 0 : 4.5,
                        ease: "linear",
                      }}
                    />
                  </span>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
