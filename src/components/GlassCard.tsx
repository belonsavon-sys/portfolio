"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export type GlassCardProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  title?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GlassCard({
  children,
  className,
  id,
  style,
  title,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cx("rounded-xl p-6 text-text-dark", className)}
      style={{
        background: "rgba(41, 110, 214, 0.10)",
        border: "1px solid rgba(41, 110, 214, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 24px rgba(41, 110, 214, 0.35)",
        ...style,
      }}
      id={id}
      title={title}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{
        borderColor: "rgba(41, 110, 214, 0.45)",
        boxShadow: "0 0 36px rgba(41, 110, 214, 0.55)",
        scale: 1.02,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
