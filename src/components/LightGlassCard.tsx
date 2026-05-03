"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export type LightGlassCardProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  id?: string;
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
  style,
  title,
  ...props
}: LightGlassCardProps) {
  return (
    <motion.div
      className={cx("rounded-2xl p-6 text-text-light", className)}
      id={id}
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
      {children}
    </motion.div>
  );
}
