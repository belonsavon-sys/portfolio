import { NavPill } from "@/components";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

const contactLinks = [
  {
    href: "https://github.com/belonsavon-sys",
    Icon: GitBranchIcon,
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
  },
  {
    href: "tel:+13606602460",
    Icon: PhoneIcon,
    label: "Phone",
  },
  {
    href: "mailto:belonsavon@gmail.com",
    Icon: MailIcon,
    label: "Email",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <LightSection className="pb-20 pt-6 sm:pb-24">
        <SiteNav />

        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-accent">/contact</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-normal sm:text-7xl">
            Ready when you are.
            <span
              aria-hidden="true"
              className="ml-2 inline-block text-accent [animation:terminal-blink_1.1s_step-end_infinite]"
            >
              |
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
            Currently open to the right opportunity. Remote roles and freelance
            projects welcome. I reply within 24 hours.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {contactLinks.map(({ Icon, href, label, rel, target }) => (
              <a
                aria-label={label}
                className="group flex h-16 w-16 items-center justify-center rounded-lg border border-border-light bg-white text-text-light shadow-sm transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                href={href}
                key={label}
                rel={rel}
                target={target}
                title={label}
              >
                <Icon className="h-7 w-7" />
              </a>
            ))}
          </div>
        </div>
      </LightSection>
    </main>
  );
}

function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-border-light bg-white p-2 shadow-sm"
    >
      {navItems.map((item) => (
        <NavPill
          active={item.href === "/contact"}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </NavPill>
      ))}
    </nav>
  );
}

function LightSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}

function GitBranchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4v10a3 3 0 1 0 3 3h4a4 4 0 0 0 4-4V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15 4h6v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 9.5 21 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
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
