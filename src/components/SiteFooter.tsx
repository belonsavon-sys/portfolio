"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { LiveStatusBadge } from "./LiveStatusBadge";
import { ParallaxGhost } from "./ParallaxGhost";
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

export function SiteFooter() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 text-text-dark sm:py-32">

      {/* Giant ghost text "LET'S TALK" — parallax-drifted, opacity-ramped */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 flex justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            WebkitTextStroke: "1.5px rgba(91,155,244,0.28)",
            color: "transparent",
            fontSize: "clamp(5rem, 18vw, 18rem)",
          }}
        >
          LET&apos;S TALK
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <LiveStatusBadge label="Available now · replies in 24 hrs" />

        <h2 className="hero-display-md mt-8 font-semibold">
          <span className="block">Let&apos;s build something</span>
          <span
            className="block bg-gradient-to-r from-text-dark via-accent-light to-accent-light bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text" }}
          >
            that actually works.
          </span>
        </h2>

        <motion.div
          aria-hidden="true"
          animate={{ scaleX: 1 }}
          className="mt-8 h-[3px] w-32 origin-center rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
        />

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
          AI automation, a full-stack build, or an agent harness — available
          for remote roles and freelance projects.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.24em] text-text-dark-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-light" />
            Remote
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-light" />
            EN · ES · IT
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-light" />
            Replies in 24 hrs
          </span>
        </p>
      </div>

      <footer className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-[rgba(41,110,214,0.2)] pt-10 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
              Pierre Belon Savon
            </p>
            <p className="mt-2 text-sm text-text-dark-muted">
              AI Engineer · Ocean Shores, WA
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
              Pages
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm text-text-dark-muted">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
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
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
              Direct
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm text-text-dark-muted">
              {FOOTER_CONTACTS.map((contact) => (
                <li key={contact.label}>
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
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[rgba(41,110,214,0.12)] pt-6 sm:flex-row">
          <p className="text-xs text-text-dark-muted">© 2026 Pierre Belon Savon</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dark-muted">
            Press{" "}
            <kbd className="mx-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-accent/40 bg-[rgba(41,110,214,0.15)] px-1 text-[10px] font-semibold text-accent-light">
              ?
            </kbd>{" "}
            for shortcuts
          </p>
        </div>
      </footer>
    </section>
  );
}
