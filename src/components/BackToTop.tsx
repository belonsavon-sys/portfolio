"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Pages where `ChapterRail` is rendered. On those pages the chapter
// dock carries its own back-to-top button (with the same scroll-
// progress ring), so the global BackToTop would just be a duplicate
// floating chip. Suppress here.
const SUPPRESSED_PATHS = new Set(["/", "/atlas", "/business", "/resume"]);

/**
 * Back-to-top button. The conic ring around the button is now
 * SCROLL-DRIVEN — fills from 0° to 360° as the user scrolls the
 * page. Reads as "you are X% through" while serving its primary
 * job (scroll to top).
 *
 * Suppressed on pages that render `ChapterRail` (which now contains
 * its own back-to-top button at the top of its dock).
 */
export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<HTMLSpanElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      setVisible(window.scrollY > 1200);
      if (ringRef.current) {
        ringRef.current.style.setProperty(
          "--ring-fill",
          `${Math.round(progress * 360)}deg`,
        );
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollTop() {
    if (reduce) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  }

  if (SUPPRESSED_PATHS.has(pathname ?? "")) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="Back to top"
          className="group fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-white/80 text-accent shadow-[0_18px_36px_-12px_rgba(41,110,214,0.4),0_1px_0_0_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          onClick={scrollTop}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          type="button"
        >
          {/* Scroll-progress ring — conic gradient fills clockwise
              from 0° to <ring-fill>°, where <ring-fill> tracks the
              user's scroll position on the page. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            ref={ringRef}
            style={{
              background:
                "conic-gradient(rgba(41,110,214,0.85) 0deg, rgba(41,110,214,0.85) var(--ring-fill, 0deg), rgba(41,110,214,0.12) var(--ring-fill, 0deg), rgba(41,110,214,0.12) 360deg)",
              padding: "1.5px",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              transition: "background 200ms ease",
            }}
          />
          <svg
            aria-hidden="true"
            className="relative h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 19V5m0 0-6 6m6-6 6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
