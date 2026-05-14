"use client";

import { useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ChapterRailSection = {
  id: string;
  index: string;
  label: string;
};

export type ChapterRailProps = {
  sections: ChapterRailSection[];
};

/**
 * Floating chapter dock — a vertical pill anchored bottom-right that
 * combines two jobs:
 *
 *   • A `↑` back-to-top button at the top, ringed by a scroll-driven
 *     conic gauge that fills 0° → 360° as the reader moves through
 *     the page.
 *   • A stacked list of section buttons below. The active section
 *     (computed via IntersectionObserver, -30% / -30% rootMargin so
 *     a section counts as "active" only while it's the reader's
 *     focal area) gets a filled accent state; others are quiet.
 *
 * The pill is rendered into `document.body` via React portal so
 * `position: fixed` always anchors to the viewport — bypassing any
 * ancestor with `filter`, `transform`, or `backdrop-filter` that
 * would otherwise create a containing block and trap it.
 *
 * Auto-hides until the reader has scrolled past the hero (≥ 600px),
 * mirroring the old BackToTop behavior so the pill never squats over
 * the hero on first load.
 */
export function ChapterRail({ sections }: ChapterRailProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ringRef = useRef<HTMLSpanElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll-driven progress ring + visibility threshold.
  useEffect(() => {
    function onScroll() {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      setVisible(window.scrollY > 600);
      if (ringRef.current) {
        ringRef.current.style.setProperty(
          "--ring-fill",
          `${Math.round(progress * 360)}deg`,
        );
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Active section observer.
  useEffect(() => {
    const visibility = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    function recompute() {
      let best: { id: string; ratio: number } | null = null;
      for (const [id, ratio] of visibility) {
        if (ratio > 0.15 && (!best || ratio > best.ratio)) {
          best = { id, ratio };
        }
      }
      setActiveId(best?.id ?? null);
    }

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibility.set(section.id, entry.intersectionRatio);
          }
          recompute();
        },
        {
          rootMargin: "-30% 0px -30% 0px",
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [sections]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  function scrollTop() {
    if (reduce) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }
  }

  if (!mounted) return null;

  const dock = (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-6 right-6 z-50 hidden transition-all duration-300 ease-out sm:block ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <nav
        aria-label="Page chapters"
        className="pointer-events-auto flex flex-col gap-1 rounded-2xl border border-accent/30 bg-white/85 p-1.5 shadow-[0_18px_36px_-12px_rgba(41,110,214,0.4),0_1px_0_0_rgba(255,255,255,0.9)_inset] backdrop-blur-md"
      >
        {/* Back-to-top — conic scroll-progress ring + arrow icon */}
        <button
          aria-label="Back to top"
          className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-bg-light text-accent transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-bg-light-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={scrollTop}
          type="button"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            ref={ringRef}
            style={{
              background:
                "conic-gradient(rgba(41,110,214,0.85) 0deg, rgba(41,110,214,0.85) var(--ring-fill, 0deg), rgba(41,110,214,0.12) var(--ring-fill, 0deg), rgba(41,110,214,0.12) 360deg)",
              padding: "1.5px",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              transition: "background 200ms ease",
            }}
          />
          <svg
            aria-hidden="true"
            className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 19V5m0 0-6 6m6-6 6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        {sections.length > 0 ? (
          <Fragment>
            <span
              aria-hidden="true"
              className="mx-2 my-0.5 h-px bg-border-light"
            />

            {/* Section buttons — index-only stack. Compact, same
                vertical run as the labelled version. Active filled
                accent, others quiet. The section name is exposed via
                aria-label + title for hover tooltip. */}
            <ul className="flex flex-col gap-0.5">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
                    <button
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Jump to ${section.label}`}
                      className={`group flex h-9 w-full items-center justify-center rounded-xl font-mono text-[11px] tabular-nums transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive
                          ? "bg-accent text-text-dark"
                          : "text-text-light-muted hover:bg-bg-light-2 hover:text-text-light"
                      }`}
                      onClick={() => scrollTo(section.id)}
                      title={section.label}
                      type="button"
                    >
                      {section.index}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        ) : null}
      </nav>
    </div>
  );

  return createPortal(dock, document.body);
}
