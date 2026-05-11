"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type TestimonialProps = {
  body: string | null;
  author?: string;
  role?: string;
  org?: string;
  variant?: "light" | "dark";
  className?: string;
  children?: ReactNode;
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Renders a quote card. If `body` is null/empty, the component returns null
 * so a placeholder is never shown to recruiters. Pierre swaps in a real
 * quote when he has one.
 */
export function Testimonial({
  body,
  author,
  role,
  org,
  variant = "light",
  className = "",
  children,
}: TestimonialProps) {
  const reduce = useReducedMotion();
  if (!body || !body.trim()) return null;

  const isDark = variant === "dark";
  const containerStyle = isDark
    ? {
        background: "rgba(41, 110, 214, 0.08)",
        border: "1px solid rgba(41, 110, 214, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 12px 36px -16px rgba(41, 110, 214, 0.4)",
      }
    : {
        background: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(41, 110, 214, 0.2)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        boxShadow:
          "0 1px 0 0 rgba(255, 255, 255, 0.85) inset, 0 14px 36px -18px rgba(15, 23, 42, 0.18)",
      };

  const quoteColor = isDark ? "text-text-dark" : "text-text-light";
  const muted = isDark ? "text-text-dark-muted" : "text-text-light-muted";
  const accentClass = isDark ? "text-accent-light" : "text-accent";
  const ruleClass = isDark
    ? "bg-[rgba(41,110,214,0.3)]"
    : "bg-[rgba(41,110,214,0.25)]";

  return (
    <motion.figure
      animate={reduce ? { opacity: 1 } : undefined}
      className={`relative rounded-3xl p-8 sm:p-12 ${className}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      style={containerStyle}
      transition={{ duration: 0.6, ease: easeOut }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <span
        aria-hidden="true"
        className={`block font-mono text-6xl leading-none ${accentClass} opacity-60`}
      >
        &ldquo;
      </span>
      <blockquote
        className={`mt-2 text-2xl font-medium leading-relaxed ${quoteColor} sm:text-3xl`}
      >
        {body}
      </blockquote>
      <div className={`mt-8 h-px w-12 ${ruleClass}`} aria-hidden="true" />
      <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {author ? (
          <span className={`text-base font-semibold ${quoteColor}`}>
            {author}
          </span>
        ) : null}
        {role || org ? (
          <span
            className={`font-mono text-xs uppercase tracking-[0.18em] ${muted}`}
          >
            {[role, org].filter(Boolean).join(" · ")}
          </span>
        ) : null}
      </figcaption>
      {children}
    </motion.figure>
  );
}
