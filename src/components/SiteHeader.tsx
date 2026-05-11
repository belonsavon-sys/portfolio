"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_TEL,
} from "./contact-config";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

type HeaderLink = {
  Icon: (props: { className?: string }) => React.ReactNode;
  href: string;
  label: string;
  rel?: string;
  target?: "_blank";
};

const contactLinks: HeaderLink[] = [
  {
    Icon: GitHubIcon,
    href: GITHUB_URL,
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
  },
  ...(LINKEDIN_URL
    ? [
        {
          Icon: LinkedInIcon,
          href: LINKEDIN_URL,
          label: "LinkedIn",
          rel: "noreferrer",
          target: "_blank" as const,
        },
      ]
    : []),
  { Icon: MailIcon, href: EMAIL_MAILTO, label: "Email" },
  { Icon: PhoneIcon, href: PHONE_TEL, label: "Phone" },
];

function isActive(currentPath: string, navHref: string) {
  if (navHref === "/") {
    return currentPath === "/";
  }
  return currentPath === navHref || currentPath.startsWith(`${navHref}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/80 via-white/40 to-transparent backdrop-blur-[2px]" />

      <motion.div
        className="relative mx-auto flex w-full max-w-7xl items-center justify-center gap-3"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* CENTERED NAV PILL */}
        <motion.nav
          aria-label="Primary"
          className={`pointer-events-auto flex flex-wrap items-center gap-1 rounded-full border bg-white/95 p-1.5 transition-shadow duration-300 ${
            scrolled
              ? "border-border-light shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]"
              : "border-border-light/70 shadow-sm"
          }`}
        >
          {navItems.map((item) => (
            <NavPillItem
              active={isActive(pathname, item.href)}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </NavPillItem>
          ))}

          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-border-light sm:inline-block"
          />

          <div className="flex items-center gap-0.5">
            {contactLinks.map(({ Icon, href, label, rel, target }) => (
              <a
                aria-label={label}
                className="group/icon inline-flex h-9 w-9 items-center justify-center rounded-full text-text-light-muted transition-[background,color] duration-200 hover:bg-bg-light-2 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                href={href}
                key={label}
                rel={rel}
                target={target}
                title={label}
              >
                <Icon className="h-4 w-4 transition-transform duration-200 ease-out group-hover/icon:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </motion.nav>
      </motion.div>
    </header>
  );
}

function NavPillItem({
  active,
  children,
  href,
}: {
  active: boolean;
  children: string;
  href: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="relative inline-flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      href={href}
    >
      {active ? (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent shadow-[0_4px_14px_-4px_rgba(41,110,214,0.55),0_1px_0_0_rgba(255,255,255,0.4)_inset]"
          layoutId="active-nav-pill"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
      <span
        className={`relative px-4 py-2 text-sm font-medium transition-colors duration-150 ${
          active ? "text-white" : "text-text-light hover:text-accent"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.62-.2.62-.44v-1.65c-2.54.55-3.07-1.09-3.07-1.09a2.42 2.42 0 0 0-1.01-1.33c-.83-.56.06-.55.06-.55a1.92 1.92 0 0 1 1.4.94 1.95 1.95 0 0 0 2.66.76 1.94 1.94 0 0 1 .58-1.22c-2.03-.23-4.16-1.01-4.16-4.5a3.52 3.52 0 0 1 .94-2.44 3.27 3.27 0 0 1 .09-2.41s.77-.25 2.52.93a8.7 8.7 0 0 1 4.58 0c1.75-1.18 2.52-.93 2.52-.93a3.27 3.27 0 0 1 .09 2.41 3.52 3.52 0 0 1 .94 2.44c0 3.5-2.14 4.27-4.17 4.49a2.18 2.18 0 0 1 .62 1.69v2.44c0 .25.16.53.63.44A9.25 9.25 0 0 0 12 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        x="3"
        y="5"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M7.5 4.75 9.4 4a1.7 1.7 0 0 1 2.1.85l1 2.15a1.8 1.8 0 0 1-.42 2.05l-1.1 1.02a10 10 0 0 0 3.95 3.95l1.02-1.1A1.8 1.8 0 0 1 18 12.5l2.15 1a1.7 1.7 0 0 1 .85 2.1l-.75 1.9A3.1 3.1 0 0 1 17.1 19.5 12.6 12.6 0 0 1 4.5 6.9a3.1 3.1 0 0 1 3-2.15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.99H5.67v8.35h2.67Zm-1.34-9.5a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9.5v-4.57c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.32V9.99h-2.67c.04.75 0 8.35 0 8.35h2.67v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.34.73 1.34 1.79v4.49h2.66Z" />
    </svg>
  );
}
