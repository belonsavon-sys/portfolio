"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { LiveStatusBadge } from "./LiveStatusBadge";
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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/18 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-10%] h-[420px] w-[420px] rounded-full bg-accent-light/14 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <LiveStatusBadge label="Available now · 3 min reply average" />

        <h2 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
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
          Whether you need AI automation, a full-stack product, or a system that
          runs itself — I&apos;m available for remote roles and projects.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact">Contact Me →</Button>
          <Button href="/resume" variant="ghostDark">
            View Resume
          </Button>
        </div>

        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
          <span>Remote</span>
          <span aria-hidden="true" className="text-accent">·</span>
          <span>Trilingual</span>
          <span aria-hidden="true" className="text-accent">·</span>
          <span>Replies in 24 hrs</span>
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
                    className="transition-colors hover:text-text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
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
                    className="break-words transition-colors hover:text-text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
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
            Built business-first
          </p>
        </div>
      </footer>
    </section>
  );
}
