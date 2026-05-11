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

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["1"], label: "Welcome" },
  { keys: ["2"], label: "AI" },
  { keys: ["3"], label: "Business" },
  { keys: ["4"], label: "Resume" },
  { keys: ["5"], label: "Get in Touch" },
  { keys: ["T"], label: "Scroll to top" },
  { keys: ["?"], label: "Toggle this overlay" },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Global keyboard shortcuts:
 *  1-5 → primary nav routes
 *  T   → scroll to top
 *  ?   → toggle help overlay
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setHelpOpen(false)}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-accent/40 bg-bg-dark-2 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            {/* Corner accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent/30 blur-3xl"
            />
            <div className="relative flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
                Keyboard shortcuts
              </p>
              <button
                aria-label="Close shortcuts"
                className="rounded-full border border-[rgba(41,110,214,0.3)] bg-bg-dark/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:border-accent hover:text-text-dark"
                onClick={() => setHelpOpen(false)}
                type="button"
              >
                Esc
              </button>
            </div>
            <h2 className="relative mt-3 text-2xl font-semibold text-text-dark sm:text-3xl">
              Navigate by key.
            </h2>
            <p className="relative mt-2 text-sm text-text-dark-muted">
              Single-key shortcuts. Press any number to jump pages.
            </p>
            <ul className="relative mt-6 grid gap-2.5">
              {shortcuts.map((s) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-lg border border-[rgba(41,110,214,0.18)] bg-bg-dark/40 px-3 py-2"
                  key={s.label}
                >
                  <span className="text-sm text-text-dark">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-accent/40 bg-[rgba(41,110,214,0.12)] px-1.5 font-mono text-xs font-semibold text-accent-light shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]"
                        key={k}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
