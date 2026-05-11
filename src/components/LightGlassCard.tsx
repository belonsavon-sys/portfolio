"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

export type LightGlassCardProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  id?: string;
  spotlight?: boolean;
  style?: CSSProperties;
  title?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LightGlassCard({
  children,
  className,
  hoverable = true,
  id,
  // spotlight is opt-in now (default off). Cursor-tracked spotlight on
  // every content card was flagged as a v0-template signal in iter 93's
  // anti-slop research, so callers must explicitly request it.
  spotlight = false,
  style,
  title,
  ...props
}: LightGlassCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!spotlight || reduce) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / rect.width) * 100;
      const my = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--mx", `${mx}%`);
      node.style.setProperty("--my", `${my}%`);
    },
    [spotlight, reduce],
  );

  return (
    <motion.div
      className={cx(
        "rounded-2xl p-6 text-text-light",
        spotlight && "card-spotlight",
        className,
      )}
      id={id}
      onMouseMove={onMouseMove}
      ref={ref}
      style={{
        background: "rgba(255, 255, 255, 0.45)",
        borderTop: "1px solid rgba(255, 255, 255, 0.90)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.65)",
        borderRight: "1px solid rgba(41, 110, 214, 0.14)",
        borderBottom: "1px solid rgba(41, 110, 214, 0.14)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.9) inset, " +
          "0 1px 3px rgba(0,0,0,0.06), " +
          "0 8px 24px rgba(15,23,42,0.10), " +
          "0 24px 48px -8px rgba(15,23,42,0.14)",
        ...style,
      }}
      title={title}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={
        hoverable
          ? {
              borderTopColor: "rgba(255,255,255,0.95)",
              borderLeftColor: "rgba(255,255,255,0.75)",
              borderRightColor: "rgba(41,110,214,0.25)",
              borderBottomColor: "rgba(41,110,214,0.25)",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.95) inset, " +
                "0 1px 3px rgba(0,0,0,0.06), " +
                "0 8px 24px rgba(15,23,42,0.12), " +
                "0 24px 48px -8px rgba(15,23,42,0.18), " +
                "0 0 0 1px rgba(41,110,214,0.28), " +
                "0 8px 24px rgba(41,110,214,0.10)",
              y: -3,
            }
          : undefined
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
