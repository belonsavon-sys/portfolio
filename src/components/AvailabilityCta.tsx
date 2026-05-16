"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./Button";
import { EMAIL_DISPLAY, EMAIL_MAILTO } from "./contact-config";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Pre-footer CTA block — appears on the two pages a hiring manager
 * spends real reading time on (/ and /resume). Anchors the
 * operator-AI story toward a clear next action: send an email.
 * Footer's general "Let's talk" carries the other pages.
 */
export function AvailabilityCta() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="mx-auto mt-20 w-full max-w-3xl border-t border-border-light pt-12 text-center sm:mt-24"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      transition={{ duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
        — available
      </p>
      <h2
        className="mt-3 font-semibold tracking-tight text-text-light"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        Available for senior AI engineering roles.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-7 text-text-light-muted sm:text-[15px]">
        Real reply within 48 hours. Best route is email — I read every message.
      </p>
      <div className="mt-7 flex flex-col items-center gap-2">
        <Button arrow href={EMAIL_MAILTO}>
          {EMAIL_DISPLAY}
        </Button>
        <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
          — typical reply · 12–48 hours · pt
        </p>
      </div>
    </motion.section>
  );
}
