"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { LastShipped } from "./LastShipped";
import { ParallaxGhost } from "./ParallaxGhost";
import { TextScramble } from "./TextScramble";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "./contact-config";

const FOOTER_LINKS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Welcome" },
  { href: "/atlas", label: "Atlas" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/lab", label: "The Lab" },
];

const FOOTER_CONTACTS: Array<{
  external?: boolean;
  href: string;
  kind: string;
  label: string;
}> = [
  { href: EMAIL_MAILTO, kind: "Email", label: EMAIL_DISPLAY },
  { href: PHONE_TEL, kind: "Phone", label: PHONE_DISPLAY },
  { external: true, href: GITHUB_URL, kind: "GitHub", label: "belonsavon-sys" },
  ...(LINKEDIN_URL
    ? [
        {
          external: true,
          href: LINKEDIN_URL,
          kind: "LinkedIn",
          label: "Pierre Belon Savon",
        },
      ]
    : []),
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function SiteFooter() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.6, ease: easeOut },
          viewport: { amount: 0.3, once: true },
          whileInView: { opacity: 1, y: 0 },
        };

  return (
    <footer
      className="relative overflow-hidden bg-bg-dark py-16 text-text-dark sm:py-20"
    >
      {/* Slow VHS-style scan line for ambient life */}
      <span aria-hidden="true" className="glitch-bar" />

      {/* Big ghost watermark — TALK in stroked outline behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-0 flex justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            color: "transparent",
            fontSize: "clamp(5rem, 18vw, 16rem)",
            WebkitTextStroke: "1.5px rgba(91,155,244,0.18)",
          }}
        >
          TALK.
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* LIVE STATUS LINE — editorial byline, no pulse */}
        <motion.div
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[13px] text-accent-light"
          {...fadeUp(0)}
        >
          <span className="text-result-green">online</span>
          <span aria-hidden="true" className="text-text-dark-muted/60">—</span>
          <FooterLocalClock />
          <span aria-hidden="true" className="text-text-dark-muted/60">—</span>
          <span>open to work</span>
        </motion.div>

        {/* HEADLINE — scramble + auto-glitch, big and present */}
        <motion.h2
          className="auto-glitch font-semibold tracking-tight text-text-dark"
          style={{
            fontFamily:
              "var(--font-display), var(--font-geist-sans), system-ui, sans-serif",
            fontSize: "clamp(2.75rem, 9vw, 6.5rem)",
            fontVariationSettings: '"wdth" 90, "opsz" 96',
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.94,
          }}
          {...fadeUp(0.06)}
        >
          <TextScramble
            durationMs={1300}
            stepMs={50}
            text="Let's build something."
          />
        </motion.h2>

        {/* CTA pair — btn-techy adds breathing glow + hover scanline */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          {...fadeUp(0.12)}
        >
          <Button
            arrow
            className="btn-techy !px-6 !py-3 !text-sm"
            href="/resume#contact"
          >
            Let&apos;s talk
          </Button>
          <Button
            className="btn-techy !px-6 !py-3 !text-sm"
            href="/resume"
            variant="ghostDark"
          >
            Read my résumé
          </Button>
        </motion.div>

        {/* DIRECT CONTACT GRID — 2×2 chunky contact cards. Replaces the
            prior compact pill row so each method gets a real moment. */}
        <motion.div
          className="grid gap-3 border-t border-[rgba(91,155,244,0.18)] pt-7 sm:grid-cols-2"
          {...fadeUp(0.18)}
        >
          {FOOTER_CONTACTS.map((contact) => (
            <a
              aria-label={`${contact.kind} — ${contact.label}`}
              className="group/c flex items-center justify-between gap-4 rounded-lg border border-[rgba(91,155,244,0.22)] bg-[rgba(15,23,42,0.4)] px-5 py-4 transition-[border-color,background,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-light/55 hover:bg-[rgba(91,155,244,0.12)] hover:shadow-[0_0_0_1px_rgba(91,155,244,0.35),0_22px_44px_-20px_rgba(91,155,244,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light"
              href={contact.href}
              key={contact.kind}
              rel={contact.external ? "noreferrer" : undefined}
              target={contact.external ? "_blank" : undefined}
            >
              <div className="min-w-0">
                <p className="font-mono text-[12px] text-accent-light/85">
                  {contact.kind.toLowerCase()}
                </p>
                <p className="mt-2 truncate font-mono text-sm text-text-dark sm:text-[15px]">
                  {contact.label}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-base text-accent-light/70 transition-transform duration-200 group-hover/c:translate-x-1"
              >
                {contact.external ? "↗" : "→"}
              </span>
            </a>
          ))}
        </motion.div>

        {/* PAGES — single-line link row, editorial */}
        <motion.nav
          aria-label="Footer pages"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] text-text-dark-muted"
          {...fadeUp(0.24)}
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              className="transition-colors hover:text-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>

        {/* COPYRIGHT + Last shipped */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[rgba(91,155,244,0.12)] pt-6"
          {...fadeUp(0.3)}
        >
          <p className="font-mono text-[12px] text-text-dark-muted">
            © 2026 Pierre Belon Savon
          </p>
          <LastShipped />
        </motion.div>
      </div>
    </footer>
  );
}

/**
 * Live local clock in the footer — Pacific time, updates every 30s.
 * Returns a static "Pacific time" until mount to avoid SSR mismatch.
 */
function FooterLocalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const label = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
      }).format(now) + " PT"
    : "Pacific time";

  return <span className="text-accent-light">{label}</span>;
}
