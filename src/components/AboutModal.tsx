"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";

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

export function AboutModal({
  children,
  onClose,
  open,
  origin = { x: "50%", y: "50%" },
  title,
}: AboutModalProps) {
  const reduce = useReducedMotion();

  // Lock body scroll while open + close on Escape.
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
          {/* BACKDROP — dim + heavy blur, immersive */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-bg-dark/55 backdrop-blur-2xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          />

          {/* AMBIENT GLOW orbs behind the modal */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute bottom-0 right-[10%] h-[420px] w-[420px] rounded-full bg-accent-light/20 blur-3xl" />
          </div>

          {/* CARD */}
          <motion.div
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }
            }
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-accent/30 bg-bg-light/95 p-8 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-10"
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
            {/* Corner accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent/20 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                About me
              </p>
              <button
                aria-label="Close about"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-white/80 text-text-light-muted transition-[color,border-color,transform] duration-200 hover:-rotate-90 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={onClose}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m6 6 12 12M6 18 18 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>

            <h2 className="relative mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-text-light sm:text-4xl">
              {title}
            </h2>

            <div className="relative mt-6 grid gap-4 text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
              {children}
            </div>

            <div className="relative mt-7 flex flex-wrap items-center gap-2">
              {[
                "Trilingual · EN · ES · IT",
                "Ocean Shores, WA",
                "Co-founder · Blackdoor",
              ].map((chip) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-light"
                  key={chip}
                >
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {chip}
                </span>
              ))}
            </div>

            <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light-muted">
              <span className="mr-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-accent/40 bg-[rgba(41,110,214,0.10)] px-1 font-semibold text-accent">
                Esc
              </span>
              to close
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
