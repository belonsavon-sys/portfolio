"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";

export type AboutModalProps = {
  /** Modal body content (paragraphs). */
  children: ReactNode;
  /** Origin point (% from left, top) for the spring-from-avatar effect. */
  origin?: { x: string; y: string };
  open: boolean;
  onClose: () => void;
  /** Big headline shown at the top of the modal. */
  title: string;
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ABOUT_SPEC = [
  { label: "Role", value: "AI Engineer · Co-founder" },
  { label: "At", value: "Blackdoor + ThePrivateHotels" },
  { label: "Voice", value: "EN · ES · IT" },
  { label: "Base", value: "Ocean Shores, WA · Remote" },
];

/**
 * About card. Editorial datasheet treatment — terminal header,
 * mono spec rows, paragraphs as supporting prose, and two CTAs at
 * the bottom. Spring-from-avatar entrance + heavy-blur backdrop.
 * Mirrors the ~/slug · meta datasheet pattern used across the
 * site (footer ~/now, /resume ~/contact, /now ~/snapshot).
 */
export function AboutModal({
  children,
  onClose,
  open,
  origin = { x: "50%", y: "50%" },
  title,
}: AboutModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-modal="true"
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          transition={{ duration: 0.35 }}
        >
          {/* BACKDROP */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-bg-dark/55 backdrop-blur-2xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          />

          {/* Ambient accent orbs behind the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute bottom-0 right-[10%] h-[420px] w-[420px] rounded-full bg-accent-light/20 blur-3xl" />
          </div>

          {/* CARD — editorial datasheet shell */}
          <motion.div
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border-light bg-bg-light shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)]"
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.92,
                    y: 8,
                    transformOrigin: `${origin.x} ${origin.y}`,
                  }
            }
            initial={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.85,
                    y: 12,
                    transformOrigin: `${origin.x} ${origin.y}`,
                  }
            }
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            {/* TERMINAL HEADER — same ~/slug · meta pattern */}
            <div className="flex items-center gap-3 border-b border-border-light bg-[rgba(41,110,214,0.05)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/about</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
              <button
                aria-label="Close about"
                className="rounded-md border border-border-light bg-bg-light/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted transition-colors hover:border-accent hover:text-accent"
                onClick={onClose}
                type="button"
              >
                Esc
              </button>
            </div>

            {/* HEADLINE STRIP */}
            <div className="border-b border-border-light px-7 py-7 sm:px-8 sm:py-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                Pierre · in his own words
              </p>
              <h2
                className="mt-3 font-semibold tracking-tight text-text-light"
                style={{
                  fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                }}
              >
                {title}
              </h2>
            </div>

            {/* SPEC ROWS — 4 mono datasheet rows */}
            <ul className="grid border-b border-border-light">
              {ABOUT_SPEC.map((row, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-border-light px-7 py-3 first:border-t-0 sm:px-8"
                  key={row.label}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    <span className="text-text-light-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {row.label}
                  </span>
                  <span className="text-right font-mono text-[12.5px] leading-6 text-text-light">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>

            {/* BODY PROSE — paragraphs as supporting copy. First
                paragraph reads bold as a thesis statement; the rest
                are normal weight. */}
            <div className="grid gap-4 px-7 py-7 text-base leading-7 text-text-light-muted sm:px-8 sm:py-8 sm:text-lg sm:leading-8 [&>p:first-child]:text-lg [&>p:first-child]:font-medium [&>p:first-child]:text-text-light sm:[&>p:first-child]:text-xl">
              {children}
            </div>

            {/* CTAs — push to /ai (work) or /contact (talk) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-light bg-bg-light-2/60 px-7 py-5 sm:px-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
                Want to dig deeper?
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button arrow href="/ai" onClick={onClose}>
                  See the work
                </Button>
                <Button href="/contact" onClick={onClose} variant="ghost">
                  Get in Touch
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
