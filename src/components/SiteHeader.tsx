"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_TEL,
} from "./contact-config";

const navItems: Array<{ chapter: string; href: string; label: string }> = [
  { chapter: "01", href: "/", label: "Welcome" },
  { chapter: "02", href: "/ai", label: "AI" },
  { chapter: "03", href: "/business", label: "Business" },
  { chapter: "04", href: "/resume", label: "Resume" },
  { chapter: "05", href: "/contact", label: "Get in Touch" },
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
  const navRef = useRef<HTMLElement>(null);

  // Scroll-driven backdrop saturation + blur ramp on the nav pill.
  // Maps scrollY [0, 600] -> blur [4px, 14px] and saturate [1, 1.5].
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const node = navRef.current;
    if (!node || reduce) return;
    const clamped = Math.max(0, Math.min(1, latest / 600));
    const blur = 4 + clamped * 10;
    const sat = 1 + clamped * 0.5;
    node.style.setProperty("--nav-blur", `${blur}px`);
    node.style.setProperty("--nav-sat", `${sat}`);
  });

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
        {/* Header live-shipped mini-pill — pulled to the right
            margin on lg+. Pulls from NEXT_PUBLIC_BUILD_TIME +
            NEXT_PUBLIC_BUILD_SHA so the header carries a small
            "shipped X · sha" pulse on every page. */}
        <HeaderLiveShipped />
        {/* CENTERED NAV PILL — backdrop blur + saturation ramp tied to scrollY */}
        <motion.nav
          aria-label="Primary"
          className={`pointer-events-auto flex flex-wrap items-center gap-1 rounded-full border bg-white/85 p-1.5 transition-shadow duration-300 ${
            scrolled
              ? "border-border-light shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]"
              : "border-border-light/70 shadow-sm"
          }`}
          ref={navRef}
          style={
            reduce
              ? undefined
              : {
                  ["--nav-blur" as string]: "4px",
                  ["--nav-sat" as string]: "1",
                  backdropFilter:
                    "blur(var(--nav-blur)) saturate(var(--nav-sat))",
                  WebkitBackdropFilter:
                    "blur(var(--nav-blur)) saturate(var(--nav-sat))",
                }
          }
        >
          {navItems.map((item) => (
            <NavPillItem
              active={isActive(pathname, item.href)}
              chapter={item.chapter}
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

          {/* ⌘K palette opener — sits at the right end of the nav
              pill. Dispatches a synthetic Cmd+K keydown so the
              global KeyboardNav listener picks it up; no React
              state plumbing needed. */}
          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-border-light sm:inline-block"
          />
          <button
            aria-label="Open command palette"
            className="group/cmdk hidden h-9 items-center gap-1.5 rounded-full border border-accent/30 bg-[rgba(41,110,214,0.06)] px-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-[border-color,background] duration-200 hover:border-accent hover:bg-[rgba(41,110,214,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
            onClick={() => {
              if (typeof window === "undefined") return;
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  bubbles: true,
                  key: "k",
                  metaKey: true,
                }),
              );
            }}
            title="Open command palette (⌘K)"
            type="button"
          >
            <span className="text-base font-semibold leading-none">⌘</span>
            <span>K</span>
          </button>
        </motion.nav>
      </motion.div>
    </header>
  );
}

/**
 * Compact live-shipped mini-pill that sits on the right margin of
 * the header on lg+ breakpoints. Mirrors the home hero badge but
 * tighter — just "shipped X · sha" with the green pulse.
 */
function HeaderLiveShipped() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!buildTime) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [buildTime]);

  if (!buildTime || !buildSha) return null;

  const buildDate = new Date(buildTime);
  const seconds = now
    ? Math.max(0, Math.round((now - buildDate.getTime()) / 1000))
    : 0;
  const relative =
    seconds < 60
      ? "just now"
      : seconds < 3600
        ? `${Math.round(seconds / 60)} min ago`
        : seconds < 86_400
          ? `${Math.round(seconds / 3600)} hr ago`
          : `${Math.round(seconds / 86_400)} d ago`;

  return (
    <span
      aria-label={`Last shipped ${relative}, commit ${buildSha}`}
      className="pointer-events-auto absolute right-0 hidden items-center gap-2 rounded-full border border-result-green/40 bg-white/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-light shadow-sm backdrop-blur-md xl:inline-flex"
      title={`Last shipped ${relative} · commit ${buildSha}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
        <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
      </span>
      <span>
        Shipped <span className="text-text-light-muted">{relative}</span>
      </span>
      <span aria-hidden="true" className="text-text-light-muted/60">·</span>
      <span className="text-accent">{buildSha.slice(0, 7)}</span>
    </span>
  );
}

function NavPillItem({
  active,
  chapter,
  children,
  href,
}: {
  active: boolean;
  chapter?: string;
  children: string;
  href: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="group/nav relative inline-flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
        className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
          active ? "text-white" : "text-text-light hover:text-accent"
        }`}
      >
        {/* Chapter index — only visible when active, gives the
            current route a film-slate confirmation marker. */}
        {chapter && active ? (
          <span
            aria-hidden="true"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65"
          >
            {chapter}
          </span>
        ) : null}
        <span>{children}</span>
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
