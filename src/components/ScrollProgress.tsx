"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    damping: 30,
    restDelta: 0.001,
    stiffness: 200,
  });

  return (
    <>
      {/* Top progress bar — gradient, ambient shadow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-light shadow-[0_0_12px_rgba(41,110,214,0.6)]"
        style={{ scaleX }}
      />
      {/* Trailing dot — sits at the end of the filled portion */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] origin-left"
        style={{ scaleX, width: "100%" }}
      >
        <span
          className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rounded-full bg-accent-light shadow-[0_0_12px_rgba(91,155,244,0.8)]"
        />
      </motion.div>
    </>
  );
}
