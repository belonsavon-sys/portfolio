"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavPill } from "./Button";

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

const contactLinks = [
  {
    Icon: GitHubIcon,
    href: "https://github.com/belonsavon-sys",
    label: "GitHub",
    rel: "noreferrer",
    target: "_blank",
  },
  {
    Icon: PhoneIcon,
    href: "tel:+13606602460",
    label: "Phone",
  },
  {
    Icon: MailIcon,
    href: "mailto:belonsavon@gmail.com",
    label: "Email",
  },
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

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border-light/70 bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-white/0 backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-1 rounded-full border border-border-light bg-white p-1 shadow-sm sm:gap-2 sm:p-2"
        >
          {navItems.map((item) => (
            <NavPill
              active={isActive(pathname, item.href)}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </NavPill>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {contactLinks.map(({ Icon, href, label, rel, target }, index) => (
            <span className="flex items-center gap-2 sm:gap-3" key={label}>
              <a
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-light bg-white text-text-light shadow-sm transition-[border-color,color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-10 sm:w-10"
                href={href}
                rel={rel}
                target={target}
                title={label}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              {index < contactLinks.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-border-light sm:block"
                />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </header>
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
