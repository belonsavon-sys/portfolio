"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { LastShipped } from "./LastShipped";
import { LiveStatusBadge } from "./LiveStatusBadge";
import { ParallaxGhost } from "./ParallaxGhost";
import { SplitText } from "./SplitText";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "./contact-config";

const FOOTER_LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

const FOOTER_CONTACTS = [
  { href: EMAIL_MAILTO, label: EMAIL_DISPLAY },
  { href: PHONE_TEL, label: PHONE_DISPLAY },
  { href: GITHUB_URL, label: "GitHub", external: true },
  ...(LINKEDIN_URL ? [{ href: LINKEDIN_URL, label: "LinkedIn", external: true }] : []),
];

// Spec rail — replaces the centered dot-prefixed chip row with a mono
// datasheet that mirrors the rest of the site's editorial language.
const SPEC_ROWS: Array<{ label: string; value: string }> = [
  { label: "Now", value: "Available · Replies in 24 hrs" },
  { label: "Mode", value: "Remote · Freelance + Roles" },
  { label: "Voice", value: "EN · ES · IT" },
  { label: "Region", value: "Ocean Shores, WA" },
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
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-28">
      {/* Giant ghost "LET'S TALK" — same parallax treatment as before,
          but moved off-center so the editorial grid breathes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 flex justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            WebkitTextStroke: "1.5px rgba(91,155,244,0.22)",
            color: "transparent",
            fontSize: "clamp(5rem, 18vw, 18rem)",
          }}
        >
          LET&apos;S TALK
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-12 px-4 sm:px-6 lg:gap-x-8 lg:px-8">
        {/* TOP STRIP — status pill + chapter mark.
            Mirrors the editorial top-strip used across every page. */}
        <motion.div
          className="col-span-12 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: easeOut }}
          viewport={{ amount: 0.4, once: true }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          <LiveStatusBadge label="Available now · replies in 24 hrs" />
          <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-dark-muted">
            06 / Outro
          </span>
        </motion.div>

        {/* LEFT — stacked massive headline (cols 1–8 lg).
            Each line breaks intentionally, mirroring the home hero
            name treatment. Last line catches the gradient sweep. */}
        <motion.div className="col-span-12 lg:col-span-8" {...fadeUp(0.08)}>
          <h2
            className="font-semibold tracking-tight text-text-dark"
            style={{
              fontSize: "clamp(2.75rem, 10vw, 8.5rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
          >
            <span className="block">
              <SplitText charDelay={0.025} delay={0.18} duration={0.85}>
                {"Let's build"}
              </SplitText>
            </span>
            <span className="block">
              <SplitText charDelay={0.025} delay={0.36} duration={0.85}>
                something
              </SplitText>
            </span>
            <span className="gradient-shift-dark block">
              <SplitText charDelay={0.025} delay={0.52} duration={0.85}>
                that ships.
              </SplitText>
            </span>
          </h2>

          {/* Sub kicker — mono accent rule + accent text */}
          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent-light" />
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent-light sm:text-sm">
              Closing frame · let&apos;s talk
            </p>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
            AI automation, a full-stack build, or an agent harness —
            available for remote roles and freelance projects.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button arrow className="!px-8 !py-4 !text-base" href="/contact">
              Get in Touch
            </Button>
            <Button
              className="!px-8 !py-4 !text-base"
              href="/resume"
              variant="ghostDark"
            >
              View Resume
            </Button>
          </div>
        </motion.div>

        {/* RIGHT — mono spec datasheet (cols 9–12 lg). Mirrors the
            ~/now-style datasheets used on /resume. */}
        <motion.div
          className="col-span-12 self-end lg:col-span-4"
          {...fadeUp(0.18)}
        >
          <div className="overflow-hidden rounded-xl border border-[rgba(91,155,244,0.20)] bg-[rgba(15,23,42,0.55)] backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/now</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
              <span className="text-text-dark-muted">
                {SPEC_ROWS.length} signals
              </span>
            </div>
            <ul className="grid">
              {SPEC_ROWS.map((row, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-[rgba(91,155,244,0.12)] px-5 py-3 first:border-t-0"
                  key={row.label}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                    <span className="text-text-dark-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {row.label}
                  </span>
                  <span className="text-right font-mono text-[12.5px] leading-6 text-text-dark">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* BOTTOM STRIP — full-width editorial footer.
            Four columns of editorial signal: Name / Pages / Direct /
            Last shipped. Replaces the generic 3-col centered footer. */}
        <motion.footer
          aria-label="Footer"
          className="col-span-12 mt-8 border-t border-[rgba(91,155,244,0.20)] pt-10"
          {...fadeUp(0.28)}
        >
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-8">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                Identity
              </p>
              <p className="mt-3 font-semibold tracking-tight text-text-dark">
                Pierre Belon Savon
              </p>
              <p className="mt-1 text-sm text-text-dark-muted">
                AI Engineer · Ocean Shores, WA
              </p>
            </div>

            <nav
              aria-label="Footer pages"
              className="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                Pages
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-text-dark-muted">
                {FOOTER_LINKS.map((link, index) => (
                  <li className="flex items-baseline gap-2" key={link.href}>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-[10px] text-accent-light/60 tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link
                      className="link-underline inline-block transition-colors hover:text-text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                Direct
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-text-dark-muted">
                {FOOTER_CONTACTS.map((contact) => (
                  <li className="flex items-baseline gap-2" key={contact.label}>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-accent-light/70"
                    >
                      &gt;
                    </span>
                    <a
                      className="link-underline inline-block break-words transition-colors hover:text-text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
                      href={contact.href}
                      rel={contact.external ? "noreferrer" : undefined}
                      target={contact.external ? "_blank" : undefined}
                    >
                      {contact.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                <span className="text-text-dark-muted/60">// </span>
                Last shipped
              </p>
              <div className="mt-3">
                <LastShipped />
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dark-muted">
                Press{" "}
                <kbd className="mx-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-accent/40 bg-[rgba(41,110,214,0.15)] px-1 text-[10px] font-semibold text-accent-light">
                  ?
                </kbd>{" "}
                for shortcuts
              </p>
            </div>
          </div>

          {/* CREDITS ROLL — final cinematic seam. A thin accent rule with
              centered "© 2026 · END" marker, the seam the eye lands on
              before the page truly ends. */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(91,155,244,0.12)] pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dark-muted">
              © 2026 Pierre Belon Savon
            </p>
            <div
              aria-hidden="true"
              className="hidden flex-1 items-center gap-3 sm:flex"
            >
              <span className="h-px flex-1 bg-[rgba(91,155,244,0.12)]" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              <span className="text-text-dark-muted/60">// </span>
              End of feed
            </p>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
