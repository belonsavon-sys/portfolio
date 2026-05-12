"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ParallaxGhost } from "@/components";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/components/contact-config";

type ContactCardConfig = {
  Icon: (props: { className?: string }) => React.ReactNode;
  href: string;
  label: string;
  rel?: string;
  target?: "_blank";
  value: string;
};

const contactLinks: ContactCardConfig[] = [
  {
    Icon: MailIcon,
    href: EMAIL_MAILTO,
    label: "Email",
    value: EMAIL_DISPLAY,
  },
  {
    Icon: PhoneIcon,
    href: PHONE_TEL,
    label: "Phone",
    value: PHONE_DISPLAY,
  },
  {
    Icon: GitHubIcon,
    href: GITHUB_URL,
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
    value: "github.com/belonsavon-sys",
  },
  ...(LINKEDIN_URL
    ? [
        {
          Icon: LinkedInIcon,
          href: LINKEDIN_URL,
          label: "LinkedIn",
          rel: "noreferrer",
          target: "_blank" as const,
          value: LINKEDIN_URL.replace(/^https?:\/\//, ""),
        },
      ]
    : []),
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ContactPage() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduce
      ? { animate: { opacity: 1 }, initial: { opacity: 1 } }
      : {
          animate: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 24 },
          transition: { delay, duration: 0.6, ease: easeOut },
        };

  return (
    <main className="min-h-screen bg-bg-dark text-text-dark">
      {/* HERO — tightened to ~80vh so the page becomes scrollable into
          the contact methods, pipeline, engagements, and availability
          sections that follow. */}
      <section className="relative overflow-hidden">
        {/* Giant ghost watermark — same parallax pattern as other heroes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
        >
          <ParallaxGhost
            className="select-none font-bold leading-[0.85] tracking-tighter text-accent-light/[0.05]"
            style={{
              fontSize: "clamp(6rem, 22vw, 22rem)",
              WebkitTextStroke: "1px rgba(91,155,244,0.10)",
              color: "transparent",
            }}
          >
            HELLO
          </ParallaxGhost>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10 px-4 py-20 sm:px-6 sm:py-24 lg:gap-x-8 lg:py-28">
          {/* TOP STRIP — status pill + chapter mark */}
          <motion.div
            className="col-span-12 flex flex-wrap items-center gap-3 self-start"
            {...fadeUp(0)}
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-result-green/40 bg-[rgba(16,185,129,0.10)] px-4 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-result-green" />
              </span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-result-green">
                /contact · open to work
              </span>
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-dark-muted">
              Chapter 05 · Intake
            </span>
          </motion.div>

          {/* LEFT — massive editorial headline (cols 1–8 lg) */}
          <motion.h1
            className="col-span-12 self-center font-semibold text-text-dark lg:col-span-8"
            style={{
              fontSize: "clamp(3rem, 11vw, 9.5rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
            {...fadeUp(0.08)}
          >
            <span className="block">Ready when</span>
            <span className="gradient-shift-dark block">
              you are<span className="text-accent-light">.</span>
            </span>
          </motion.h1>

          {/* RIGHT — supporting prose + quick stats (cols 9–12 lg) */}
          <motion.div
            className="col-span-12 self-center lg:col-span-4"
            {...fadeUp(0.18)}
          >
            <p className="text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
              Open to remote roles and freelance projects. Replies inside
              24 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
              {["Remote", "EN · ES · IT", "Ocean Shores, WA"].map(
                (stat, index, arr) => (
                  <span
                    className="inline-flex items-center gap-x-6"
                    key={stat}
                  >
                    <motion.span
                      animate={reduce ? undefined : { opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      transition={{
                        delay: 0.24 + index * 0.08,
                        duration: 0.45,
                        ease: easeOut,
                      }}
                    >
                      <span className="text-accent-light">→</span> {stat}
                    </motion.span>
                    {index < arr.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="h-3 w-px bg-[rgba(91,155,244,0.25)]"
                      />
                    ) : null}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* SCROLL CUE — anchors the hero to the methods section below */}
          <motion.a
            aria-label="Scroll to contact methods"
            className="group/cue col-span-12 mt-10 hidden flex-row items-center gap-3 self-end sm:flex"
            href="#methods"
            {...fadeUp(0.34)}
          >
            <span className="relative h-px w-10 overflow-hidden bg-gradient-to-r from-[rgba(91,155,244,0.2)] via-accent-light to-transparent transition-colors duration-200 group-hover/cue:via-accent-light">
              <span className="scroll-cue-dot absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent-light" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dark-muted transition-colors duration-200 group-hover/cue:text-accent-light">
              Reach me
            </span>
          </motion.a>
        </div>
      </section>

      {/* METHODS — temporary placeholder; iter-183 rebuilds this as
          editorial chapter cards. For now we keep the existing
          full-width row pattern but in a dedicated section below the
          hero (no longer crammed into the hero grid). */}
      <section className="relative" id="methods">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              01 · Reach me
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Four ways in.
            </h2>
          </div>

          <motion.div
            className="grid divide-y divide-[rgba(91,155,244,0.20)]"
            {...fadeUp(0)}
          >
            {contactLinks.map(
              ({ Icon, href, label, rel, target, value }, index) => (
                <motion.a
                  aria-label={label}
                  className="group flex items-center gap-4 py-5 transition-[background] duration-200 hover:bg-[rgba(91,155,244,0.06)] sm:gap-6 sm:py-6"
                  href={href}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  key={label}
                  rel={rel}
                  target={target}
                  transition={{
                    delay: 0.12 + index * 0.06,
                    duration: 0.45,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.4, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(91,155,244,0.35)] bg-[rgba(41,110,214,0.10)] text-accent-light transition-[border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-accent-light/70 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="w-24 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
                      {label}
                    </span>
                    <span className="break-all text-lg font-semibold text-text-dark transition-colors duration-200 group-hover:text-accent-light sm:text-xl">
                      {value}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(91,155,244,0.30)] text-accent-light/70 transition-[transform,border-color,background,color] duration-300 group-hover:translate-x-1 group-hover:border-accent-light group-hover:bg-accent-light group-hover:text-bg-dark"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </span>
                </motion.a>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Trailing spacer — iters 184–186 add real content sections
          here (pipeline, engagements, availability). */}
      <div className="h-24" aria-hidden="true" />
    </main>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.62-.2.62-.44v-1.65c-2.54.55-3.07-1.09-3.07-1.09a2.42 2.42 0 0 0-1.01-1.33c-.83-.56.06-.55.06-.55a1.92 1.92 0 0 1 1.4.94 1.95 1.95 0 0 0 2.66.76 1.94 1.94 0 0 1 .58-1.22c-2.03-.23-4.16-1.01-4.16-4.5a3.52 3.52 0 0 1 .94-2.44 3.27 3.27 0 0 1 .09-2.41s.77-.25 2.52.93a8.7 8.7 0 0 1 4.58 0c1.75-1.18 2.52-.93 2.52-.93a3.27 3.27 0 0 1 .09 2.41 3.52 3.52 0 0 1 .94 2.44c0 3.5-2.14 4.27-4.17 4.49a2.18 2.18 0 0 1 .62 1.69v2.44c0 .25.16.53.63.44A9.25 9.25 0 0 0 12 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 4.75 9.4 4a1.7 1.7 0 0 1 2.1.85l1 2.15a1.8 1.8 0 0 1-.42 2.05l-1.1 1.02a10 10 0 0 0 3.95 3.95l1.02-1.1A1.8 1.8 0 0 1 18 12.5l2.15 1a1.7 1.7 0 0 1 .85 2.1l-.75 1.9A3.1 3.1 0 0 1 17.1 19.5 12.6 12.6 0 0 1 4.5 6.9a3.1 3.1 0 0 1 3-2.15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="18"
        x="3"
        y="5"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.99H5.67v8.35h2.67Zm-1.34-9.5a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9.5v-4.57c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.32V9.99h-2.67c.04.75 0 8.35 0 8.35h2.67v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.34.73 1.34 1.79v4.49h2.66Z" />
    </svg>
  );
}
