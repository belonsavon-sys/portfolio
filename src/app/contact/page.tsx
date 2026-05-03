"use client";

import { motion, useReducedMotion } from "framer-motion";
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {contactLinks.map(
                ({ Icon, href, label, rel, target, value }, index) => (
                  <motion.a
                    aria-label={label}
                    className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-[rgba(41,110,214,0.25)] bg-[rgba(255,255,255,0.04)] p-5 text-left transition-colors duration-200 hover:border-accent-light/60 hover:bg-[rgba(41,110,214,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
                    href={href}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    key={label}
                    rel={rel}
                    target={target}
                    transition={{
                      delay: 0.4 + index * 0.05,
                      duration: 0.5,
                      ease: easeOut,
                    }}
                    viewport={{ amount: 0.4, once: true }}
                    whileHover={{ y: -3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(41,110,214,0.35)] bg-[rgba(41,110,214,0.10)] text-accent-light">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-light">
                        {label}
                      </p>
                      <p className="mt-1.5 break-all text-base font-semibold text-text-dark">
                        {value}
                      </p>
                    </div>
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

