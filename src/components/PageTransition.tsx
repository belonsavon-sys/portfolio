"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
        initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
        key={pathname}
        transition={{ duration: 0.42, ease: easeOut }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
