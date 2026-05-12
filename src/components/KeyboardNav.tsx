"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const routes: Record<string, string> = {
  "1": "/",
  "2": "/ai",
  "3": "/business",
  "4": "/resume",
  "5": "/contact",
};

type ChapterShortcut = {
  chapter: string;
  description: string;
  href: string;
  key: string;
  title: string;
};

const CHAPTERS: ChapterShortcut[] = [
  {
    chapter: "01",
    description: "/ · the opener",
    href: "/",
    key: "1",
    title: "Welcome",
  },
  {
    chapter: "02",
    description: "/ai · what I build",
    href: "/ai",
    key: "2",
    title: "AI",
  },
  {
    chapter: "03",
    description: "/business · for operators",
    href: "/business",
    key: "3",
    title: "Business",
  },
  {
    chapter: "04",
    description: "/resume · curriculum",
    href: "/resume",
    key: "4",
    title: "Résumé",
  },
  {
    chapter: "05",
    description: "/contact · open to work",
    href: "/contact",
    key: "5",
    title: "Contact",
  },
];

const META_SHORTCUTS: { key: string; label: string }[] = [
  { key: "T", label: "Scroll to top" },
  { key: "?", label: "Toggle this overlay" },
  { key: "Esc", label: "Dismiss overlay" },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Global keyboard shortcuts:
 *  1-5 → primary nav routes
 *  T   → scroll to top
 *  ?   → toggle command palette overlay
 *  Ignored when typing into form fields.
 */
export function KeyboardNav() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    function isEditable(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return true;
      }
      if (target.isContentEditable) return true;
      return false;
    }

    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;

      if (event.key === "Escape" && helpOpen) {
        event.preventDefault();
        setHelpOpen(false);
        return;
      }
      if (event.key === "?" || (event.shiftKey && event.key === "/")) {
        event.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      const route = routes[event.key];
      if (route) {
        event.preventDefault();
        setHelpOpen(false);
        router.push(route);
        return;
      }
      if (event.key === "t" || event.key === "T") {
        event.preventDefault();
        window.scrollTo({
          behavior: "smooth",
          top: 0,
        });
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, helpOpen]);

  return (
    <AnimatePresence>
      {helpOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/75 p-4 backdrop-blur-md sm:p-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setHelpOpen(false)}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[rgba(91,155,244,0.22)] bg-bg-dark-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.34, ease: easeOut }}
          >
            {/* Corner accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-accent-light/15 blur-3xl"
            />

            {/* TERMINAL HEADER — same ~/slug · meta pattern used in the
                /resume datasheets, /404 diagnostic panel, and SiteFooter
                ~/now spec rail. Reads as one ongoing command line. */}
            <div className="relative flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/command-palette</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
              <button
                aria-label="Close palette"
                className="rounded-md border border-[rgba(91,155,244,0.25)] bg-bg-dark/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:border-accent hover:text-text-dark"
                onClick={() => setHelpOpen(false)}
                type="button"
              >
                Esc
              </button>
            </div>

            {/* HEADLINE STRIP */}
            <div className="relative border-b border-[rgba(91,155,244,0.14)] px-6 py-6 sm:px-8 sm:py-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
                → Now navigating · Press any number
              </p>
              <h2
                className="mt-3 font-semibold tracking-tight text-text-dark"
                style={{
                  fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                Navigate by key
                <span className="text-accent-light">.</span>
              </h2>
            </div>

            {/* CHAPTER CARDS — each route shown as an indexed chapter
                row. Hover gradient hairline matches the editorial
                divided lists used elsewhere on the site. */}
            <ol className="relative grid divide-y divide-[rgba(91,155,244,0.14)]">
              {CHAPTERS.map((chapter) => (
                <li key={chapter.key}>
                  <button
                    className="group relative grid w-full grid-cols-12 items-center gap-x-4 gap-y-1 px-6 py-4 text-left transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] focus-visible:bg-[rgba(91,155,244,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent sm:px-8 sm:py-5"
                    onClick={() => {
                      setHelpOpen(false);
                      router.push(chapter.href);
                    }}
                    type="button"
                  >
                    {/* LEFT — chapter index + title + description */}
                    <span className="col-span-9 flex items-baseline gap-4 sm:col-span-10">
                      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
                        {chapter.chapter}
                      </span>
                      <span
                        className="font-semibold tracking-tight text-text-dark transition-colors duration-200 group-hover:text-accent-light sm:text-lg"
                        style={{
                          fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {chapter.title}
                      </span>
                      <span className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-text-dark-muted sm:inline">
                        {chapter.description}
                      </span>
                    </span>

                    {/* RIGHT — the magic key */}
                    <span className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light/60">
                        Press
                      </span>
                      <kbd className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border border-accent/45 bg-[rgba(41,110,214,0.16)] px-2 font-mono text-base font-semibold text-accent-light shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_8px_18px_-12px_rgba(41,110,214,0.6)] transition-[border-color,background,box-shadow] duration-200 group-hover:border-accent-light group-hover:bg-[rgba(91,155,244,0.24)] group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_10px_22px_-12px_rgba(91,155,244,0.7)]">
                        {chapter.key}
                      </kbd>
                    </span>

                    {/* Hover gradient hairline */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </button>
                </li>
              ))}
            </ol>

            {/* META FOOTER — T / ? / Esc as a single mono line, like a
                terminal status bar. */}
            <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[rgba(91,155,244,0.14)] bg-[rgba(91,155,244,0.04)] px-6 py-4 sm:px-8">
              {META_SHORTCUTS.map((shortcut) => (
                <span
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-dark-muted"
                  key={shortcut.key}
                >
                  <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-[rgba(91,155,244,0.30)] bg-[rgba(41,110,214,0.12)] px-1 font-mono text-[10px] font-semibold text-accent-light">
                    {shortcut.key}
                  </kbd>
                  <span>{shortcut.label}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
