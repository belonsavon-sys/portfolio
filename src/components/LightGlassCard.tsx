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
        background: "rgba(255, 255, 255, 0.62)",
        border: "1px solid rgba(41, 110, 214, 0.18)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        boxShadow:
          "0 1px 0 0 rgba(255, 255, 255, 0.85) inset, 0 12px 32px -16px rgba(15, 23, 42, 0.18)",
        ...style,
      }}
      title={title}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={
        hoverable
          ? {
              borderColor: "rgba(41, 110, 214, 0.38)",
              boxShadow:
                "0 1px 0 0 rgba(255, 255, 255, 0.9) inset, 0 18px 40px -12px rgba(41, 110, 214, 0.28)",
              y: -2,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
