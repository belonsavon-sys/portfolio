"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 1200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    if (reduce) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  }

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
          {/* Spinning ring */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from var(--ring-angle, 0deg), rgba(41,110,214,0.3), transparent 40%, rgba(41,110,214,0.6) 100%)",
              animation: "ring-rotate 8s linear infinite",
              padding: "1px",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
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
