"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const routes: Record<string, string> = {
  "1": "/",
  "2": "/ai",
  "3": "/business",
  "4": "/resume",
  "5": "/contact",
  "6": "/now",
  "7": "/uses",
  "8": "/atlas",
  "9": "/colophon",
};

type ChapterShortcut = {
  chapter: string;
  description: string;
  href: string;
  key: string;
  title: string;
};

const CHAPTERS: ChapterShortcut[] = [
  {
    chapter: "01",
    description: "/ · the opener",
    href: "/",
    key: "1",
    title: "Welcome",
  },
  {
    chapter: "02",
    description: "/ai · what I build",
    href: "/ai",
    key: "2",
    title: "AI",
  },
  {
    chapter: "03",
    description: "/business · for operators",
    href: "/business",
    key: "3",
    title: "Business",
  },
  {
    chapter: "04",
    description: "/resume · curriculum",
    href: "/resume",
    key: "4",
    title: "Résumé",
  },
  {
    chapter: "05",
    description: "/contact · open to work",
    href: "/contact",
    key: "5",
    title: "Contact",
  },
  {
    chapter: "06",
    description: "/now · what I'm doing",
    href: "/now",
    key: "6",
    title: "Now",
  },
  {
    chapter: "07",
    description: "/uses · stack with reasons",
    href: "/uses",
    key: "7",
    title: "Uses",
  },
  {
    chapter: "08",
    description: "/atlas · the multi-agent harness",
    href: "/atlas",
    key: "8",
    title: "Atlas",
  },
  {
    chapter: "09",
    description: "/colophon · how this is built",
    href: "/colophon",
    key: "9",
    title: "Colophon",
  },
];

type DeepAnchor = {
  description: string;
  href: string;
  title: string;
};

/**
 * Hand-picked deep links — anchors inside chapters that are
 * worth jumping to directly. Rendered as a second list below
 * the primary 9 chapters in the ⌘K palette, filtered by the
 * same query. No keyboard shortcut on these; click or Enter only.
 */
const DEEP_ANCHORS: DeepAnchor[] = [
  {
    description: "3 live products built end-to-end",
    href: "/atlas#products",
    title: "Atlas products",
  },
  {
    description: "Research · Build · Ship · Govern · Operate · Reuse",
    href: "/atlas#capabilities",
    title: "Capabilities",
  },
  {
    description: "How it ships — brief → spec → build → ship → operate",
    href: "/atlas#workflow",
    title: "Atlas workflow",
  },
  {
    description: "Live commits, what just shipped",
    href: "/now#shipped",
    title: "Recent ships",
  },
  {
    description: "Claude · Codex · Perplexity · MCP",
    href: "/uses#ai-stack",
    title: "AI stack",
  },
  {
    description: "Vercel · GitHub · Supabase",
    href: "/uses#infra",
    title: "Infrastructure",
  },
  {
    description: "Hotel comms · QA system",
    href: "/ai#built-and-shipped",
    title: "Built & shipped",
  },
  {
    description: "Local AI · Atlas runtime",
    href: "/ai#demos",
    title: "Live demos",
  },
  {
    description: "The company behind Atlas",
    href: "/business#blackdoor",
    title: "Blackdoor",
  },
  {
    description: "Chaos → auditable systems",
    href: "/business#process",
    title: "Process design",
  },
  {
    description: "Quick intake form",
    href: "/contact#send",
    title: "Send a message",
  },
  {
    description: "The four cuts behind the build",
    href: "/colophon#principles",
    title: "Principles",
  },
];

const META_SHORTCUTS: { key: string; label: string }[] = [
  { key: "⌘K", label: "Toggle palette" },
  { key: "?", label: "Toggle palette" },
  { key: "T", label: "Scroll to top" },
  { key: "R", label: "Random route" },
  { key: "Esc", label: "Dismiss" },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Global keyboard shortcuts:
 *  ⌘K / ? → toggle command palette
 *  1-7    → primary nav routes (when palette closed)
 *  T      → scroll to top (when palette closed)
 *  Esc    → dismiss palette
 *
 *  When the palette is open, the search input is focused; type to
 *  filter chapters by title/description. Enter navigates to the top
 *  result. Number keys type into the search field instead of navigating.
 */
export function KeyboardNav() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reduce = useReducedMotion();

  // Filter chapters by query. Empty query shows all; otherwise
  // substring match against title + description (case-insensitive).
  const visibleChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHAPTERS;
    return CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.href.toLowerCase().includes(q),
    );
  }, [query]);

  // Same filter against the deep-anchors list. With an empty query
  // the palette shows everything; with a query both lists narrow
  // together so the user can find any section in one keystroke.
  const visibleAnchors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEEP_ANCHORS;
    return DEEP_ANCHORS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.href.toLowerCase().includes(q),
    );
  }, [query]);

  // Reset the query whenever the palette closes so re-opening starts
  // from a clean slate.
  useEffect(() => {
    if (!helpOpen) setQuery("");
  }, [helpOpen]);

  // Autofocus the input when the palette opens (one-shot per open).
  useEffect(() => {
    if (!helpOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [helpOpen]);

  // Letter-sequence Easter egg: typing "pierre" anywhere (outside
  // an editable field) opens the command palette. Buffer resets on
  // any non-matching key or after 1.5s of inactivity.
  const sequenceRef = useRef("");
  const sequenceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    function isEditable(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return true;
      }
      if (target.isContentEditable) return true;
      return false;
    }

    function onKey(event: KeyboardEvent) {
      // ⌘K / Ctrl+K toggles the palette from anywhere (including
      // input fields).
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Escape" && helpOpen) {
        event.preventDefault();
        setHelpOpen(false);
        return;
      }

      // Don't trigger the rest of the shortcuts while typing.
      if (isEditable(event.target)) return;

      if (event.key === "?" || (event.shiftKey && event.key === "/")) {
        event.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      const route = routes[event.key];
      if (route) {
        event.preventDefault();
        setHelpOpen(false);
        router.push(route);
        return;
      }
      if (event.key === "t" || event.key === "T") {
        event.preventDefault();
        window.scrollTo({
          behavior: "smooth",
          top: 0,
        });
        return;
      }

      // R → navigate to a random route (excluding the current page).
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        const allRoutes = Object.values(routes);
        const currentPath = window.location.pathname;
        const others = allRoutes.filter((path) => path !== currentPath);
        const target = others[Math.floor(Math.random() * others.length)];
        if (target) {
          setHelpOpen(false);
          router.push(target);
        }
        return;
      }

      // "pierre" letter-sequence easter egg.
      if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        const target = "pierre";
        sequenceRef.current = (sequenceRef.current + event.key.toLowerCase())
          .slice(-target.length);
        if (sequenceTimerRef.current !== null) {
          window.clearTimeout(sequenceTimerRef.current);
        }
        sequenceTimerRef.current = window.setTimeout(() => {
          sequenceRef.current = "";
        }, 1500);

        if (sequenceRef.current === target) {
          sequenceRef.current = "";
          setHelpOpen(true);
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, helpOpen]);

  function jumpToTopResult() {
    // Prefer a chapter match; fall back to the first deep anchor so
    // queries like "products" or "demos" still jump on Enter.
    const top = visibleChapters[0] ?? visibleAnchors[0];
    if (!top) return;
    setHelpOpen(false);
    router.push(top.href);
  }

  return (
    <AnimatePresence>
      {helpOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/75 p-4 backdrop-blur-md sm:p-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setHelpOpen(false)}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[rgba(91,155,244,0.22)] bg-bg-dark-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.34, ease: easeOut }}
          >
            {/* Corner accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-accent-light/15 blur-3xl"
            />

            {/* TERMINAL HEADER */}
            <div className="relative flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              <span className="inline-flex h-2 w-2 rounded-full bg-result-green" />
              <span>~/command-palette</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
              <button
                aria-label="Close palette"
                className="rounded-md border border-[rgba(91,155,244,0.25)] bg-bg-dark/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:border-accent hover:text-text-dark"
                onClick={() => setHelpOpen(false)}
                type="button"
              >
                Esc
              </button>
            </div>

            {/* SEARCH INPUT — autofocused on open. Caret-style accent
                prefix marks it as a command line. Enter jumps to the
                top result. */}
            <div className="relative flex items-center gap-3 border-b border-[rgba(91,155,244,0.14)] bg-bg-dark/30 px-6 py-4 sm:px-8">
              <span aria-hidden="true" className="font-mono text-base font-semibold text-accent-light">
                &gt;
              </span>
              <input
                aria-label="Search routes"
                autoComplete="off"
                className="flex-1 bg-transparent font-mono text-base text-text-dark placeholder:text-text-dark-muted/60 focus:outline-none sm:text-lg"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    jumpToTopResult();
                  }
                }}
                placeholder="Search routes · type to filter"
                ref={inputRef}
                spellCheck={false}
                type="text"
                value={query}
              />
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted sm:inline">
                {visibleChapters.length + visibleAnchors.length} /{" "}
                {CHAPTERS.length + DEEP_ANCHORS.length}
              </span>
            </div>

            {/* CHAPTER CARDS — filtered by query. Empty state shows
                "no matches" instead of rendering nothing. The empty
                state only fires when BOTH the chapters list and the
                deep-anchors list come up empty — otherwise the deep
                anchors below stand in for the chapter results. */}
            {visibleChapters.length === 0 && visibleAnchors.length === 0 ? (
              <div className="relative px-6 py-10 text-center font-mono text-sm text-text-dark-muted sm:px-8 sm:py-12">
                <p>
                  No routes match{" "}
                  <span className="font-semibold text-text-dark">
                    &quot;{query}&quot;
                  </span>
                  . Try Welcome, AI, Business, Resume, Contact, Now, or
                  Uses.
                </p>
              </div>
            ) : visibleChapters.length === 0 ? null : (
              <ol className="relative grid divide-y divide-[rgba(91,155,244,0.14)]">
                {visibleChapters.map((chapter, index) => (
                  <li key={chapter.key}>
                    <button
                      className={`group relative grid w-full grid-cols-12 items-center gap-x-4 gap-y-1 px-6 py-4 text-left transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] focus-visible:bg-[rgba(91,155,244,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent sm:px-8 sm:py-5 ${index === 0 && query.trim().length > 0 ? "bg-[rgba(91,155,244,0.05)]" : ""}`}
                      onClick={() => {
                        setHelpOpen(false);
                        router.push(chapter.href);
                      }}
                      type="button"
                    >
                      {/* LEFT — chapter index + title + description */}
                      <span className="col-span-9 flex items-baseline gap-4 sm:col-span-10">
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
                          {chapter.chapter}
                        </span>
                        <span
                          className="font-semibold tracking-tight text-text-dark transition-colors duration-200 group-hover:text-accent-light sm:text-lg"
                          style={{
                            fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {chapter.title}
                        </span>
                        <span className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-text-dark-muted sm:inline">
                          {chapter.description}
                        </span>
                      </span>

                      {/* RIGHT — the magic key, or "↵ Enter" for the
                          top result when a query is active. */}
                      <span className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                        {index === 0 && query.trim().length > 0 ? (
                          <>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light/60">
                              Top result
                            </span>
                            <kbd className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border border-accent/45 bg-[rgba(41,110,214,0.16)] px-2 font-mono text-base font-semibold text-accent-light">
                              ↵
                            </kbd>
                          </>
                        ) : (
                          <>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light/60">
                              Press
                            </span>
                            <kbd className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border border-accent/45 bg-[rgba(41,110,214,0.16)] px-2 font-mono text-base font-semibold text-accent-light shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_8px_18px_-12px_rgba(41,110,214,0.6)] transition-[border-color,background,box-shadow] duration-200 group-hover:border-accent-light group-hover:bg-[rgba(91,155,244,0.24)]">
                              {chapter.key}
                            </kbd>
                          </>
                        )}
                      </span>

                      {/* Hover gradient hairline */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                      />
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {/* DEEP LINKS — secondary list of in-page anchors. Same
                filter as the chapter list; rendered with a smaller row
                density and no keyboard shortcut. */}
            {visibleAnchors.length > 0 ? (
              <div className="relative border-t border-[rgba(91,155,244,0.14)]">
                <div className="flex items-center gap-3 bg-[rgba(91,155,244,0.04)] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light sm:px-8">
                  <span aria-hidden="true">↳</span>
                  <span>Deep links</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.16)]" />
                  <span className="text-text-dark-muted">
                    {visibleAnchors.length} / {DEEP_ANCHORS.length}
                  </span>
                </div>
                <ol className="grid divide-y divide-[rgba(91,155,244,0.12)]">
                  {visibleAnchors.map((anchor, index) => (
                    <li key={anchor.href}>
                      <button
                        className={`group relative grid w-full grid-cols-12 items-center gap-x-4 px-6 py-2.5 text-left transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] focus-visible:bg-[rgba(91,155,244,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent sm:px-8 sm:py-3 ${
                          index === 0 &&
                          visibleChapters.length === 0 &&
                          query.trim().length > 0
                            ? "bg-[rgba(91,155,244,0.05)]"
                            : ""
                        }`}
                        onClick={() => {
                          setHelpOpen(false);
                          router.push(anchor.href);
                        }}
                        type="button"
                      >
                        <span className="col-span-9 flex flex-wrap items-baseline gap-x-3 gap-y-0 sm:col-span-10">
                          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light/70">
                            ↳
                          </span>
                          <span className="font-semibold text-text-dark transition-colors duration-200 group-hover:text-accent-light">
                            {anchor.title}
                          </span>
                          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted sm:inline">
                            {anchor.description}
                          </span>
                        </span>
                        <span className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
                            {anchor.href}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {/* META FOOTER */}
            <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[rgba(91,155,244,0.14)] bg-[rgba(91,155,244,0.04)] px-6 py-4 sm:px-8">
              {META_SHORTCUTS.map((shortcut) => (
                <span
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-dark-muted"
                  key={shortcut.key}
                >
                  <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-[rgba(91,155,244,0.30)] bg-[rgba(41,110,214,0.12)] px-1 font-mono text-[10px] font-semibold text-accent-light">
                    {shortcut.key}
                  </kbd>
                  <span>{shortcut.label}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
