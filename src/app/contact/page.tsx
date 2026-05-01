"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components";

const contactLinks = [
  {
    Icon: GitHubIcon,
    description: "Code and projects",
    href: "https://github.com/belonsavon-sys",
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
    value: "github.com/belonsavon-sys",
  },
  {
    Icon: PhoneIcon,
    description: "PST · text first",
    href: "tel:+13606602460",
    label: "Phone",
    value: "360-660-2460",
  },
  {
    Icon: MailIcon,
    description: "Best for new opportunities",
    href: "mailto:belonsavon@gmail.com",
    label: "Email",
    value: "belonsavon@gmail.com",
  },
];

export default function ContactPage() {
  const reduce = useReducedMotion();
  const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent-light/10 blur-3xl" />
          <div className="absolute -bottom-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <motion.p
            className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light"
            {...fadeUp(0)}
          >
            /contact
          </motion.p>

          <motion.h1
            className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-text-dark sm:text-7xl lg:text-[7rem]"
            {...fadeUp(0.08)}
          >
            Ready when
            <br />
            you are.
          </motion.h1>

          <motion.div
            aria-hidden="true"
            animate={{ scaleX: 1 }}
            className="mt-8 h-[3px] w-24 origin-center rounded-full bg-accent"
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.55, duration: 0.55, ease: "easeOut" }}
          />

          <motion.p
            className="mt-8 max-w-2xl text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9"
            {...fadeUp(0.18)}
          >
            Currently open to the right opportunity. Remote roles and freelance
            projects welcome.
            <span className="ml-2 inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-result-green"
              />
              <span className="font-mono text-sm uppercase tracking-[0.18em] text-result-green">
                Replies in 24 hrs
              </span>
            </span>
          </motion.p>

          <motion.div className="mt-16 w-full" {...fadeUp(0.3)}>
            <div className="grid gap-4 sm:grid-cols-3">
              {contactLinks.map(
                ({ Icon, description, href, label, rel, target, value }, index) => (
                  <motion.a
                    aria-label={label}
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
                    href={href}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    key={label}
                    rel={rel}
                    target={target}
                    transition={{
                      delay: 0.4 + index * 0.06,
                      duration: 0.5,
                      ease: easeOut,
                    }}
                    viewport={{ amount: 0.4, once: true }}
                    whileHover={{ y: -4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard className="h-full p-6 text-left">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(41,110,214,0.35)] bg-[rgba(41,110,214,0.10)] text-accent-light">
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                        {label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-text-dark">
                        {value}
                      </p>
                      <p className="mt-2 text-sm text-text-dark-muted">
                        {description}
                      </p>
                    </GlassCard>
                  </motion.a>
                ),
              )}
            </div>
          </motion.div>

          <motion.p
            className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-text-dark-muted"
            {...fadeUp(0.6)}
          >
            Ocean Shores, WA · Trilingual EN · ES · IT
          </motion.p>
        </div>
      </section>
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

