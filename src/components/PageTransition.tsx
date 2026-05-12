"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
const curtainEase = [0.85, 0, 0.15, 1] as [number, number, number, number];

/**
 * Per-route metadata flashed inside the curtain on every navigation.
 * Each entry mirrors the chapter language used by SiteHeader, the
 * SiteFooter outro, and the editorial top-strip on every page hero.
 */
type RouteMeta = {
  chapter: string;
  subtitle: string;
  title: string;
};

const ROUTES: Record<string, RouteMeta> = {
  "/": { chapter: "01", subtitle: "/ · welcome", title: "Welcome" },
  "/ai": { chapter: "02", subtitle: "/ai · what I build", title: "AI" },
  "/business": {
    chapter: "03",
    subtitle: "/business · for operators",
    title: "Business",
  },
  "/resume": {
    chapter: "04",
    subtitle: "/resume · curriculum",
    title: "Résumé",
  },
  "/contact": {
    chapter: "05",
    subtitle: "/contact · open to work",
    title: "Contact",
  },
};

const FALLBACK_META: RouteMeta = {
  chapter: "404",
  subtitle: "/ · not found",
  title: "Off-route",
};

function metaFor(pathname: string): RouteMeta {
  if (pathname in ROUTES) return ROUTES[pathname];
  for (const route of Object.keys(ROUTES)) {
    if (route !== "/" && pathname.startsWith(`${route}/`)) {
      return ROUTES[route];
    }
  }
  return FALLBACK_META;
}

/**
 * Cinematic page transition. On every pathname change a dark accent
 * curtain sweeps up from the bottom of the viewport, briefly displays
 * a chapter slate (chapter mark + title + subtitle), and retracts off
 * the top — covering the actual React swap so the new page never
 * appears mid-render. The first page-load never plays the curtain
 * (only subsequent client-side navigations do).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Track the previous pathname so we can detect a real route change
  // (vs. the initial mount).
  const previousPathname = useRef(pathname);
  // Curtain renders only while `slate` is set. Each slate gets a unique
  // key so consecutive navigations re-mount the curtain and re-play
  // the sweep cleanly.
  const [slate, setSlate] = useState<{
    key: string;
    meta: RouteMeta;
  } | null>(null);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (reduce) return;
    setSlate({
      key: `curtain-${pathname}-${Date.now()}`,
      meta: metaFor(pathname),
    });
  }, [pathname, reduce]);

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <>
      {/* CURTAIN — the chapter slate. Re-mounts on every pathname
          change. Covers the viewport during the React swap, then
          retracts off the top. */}
      <AnimatePresence>
        {slate ? (
          <motion.div
            aria-hidden="true"
            animate={{ y: ["100%", "0%", "0%", "-100%"] }}
            className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
            initial={{ y: "100%" }}
            key={slate.key}
            onAnimationComplete={() => setSlate(null)}
            transition={{
              duration: 0.95,
              ease: curtainEase,
              times: [0, 0.32, 0.55, 1],
            }}
          >
            {/* Solid dark fill — the curtain itself */}
            <div className="absolute inset-0 bg-bg-dark" />

            {/* Top accent seam — a thin glowing accent line that follows
                the curtain's leading edge. Reads like a film slate. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-accent shadow-[0_0_28px_rgba(91,155,244,0.6)]"
            />

            {/* Bottom accent seam — symmetrical, reinforces the curtain
                edges as it sweeps through. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-accent/60"
            />

            {/* Chapter slate — editorial typographic block centered in
                the curtain. Fades in slightly after the curtain has
                covered, then fades out as the curtain begins retracting. */}
            <motion.div
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center text-text-dark"
              initial={{ opacity: 0 }}
              transition={{
                duration: 0.95,
                ease: "linear",
                times: [0, 0.3, 0.42, 0.58, 0.72],
              }}
            >
              {/* TOP — mono eyebrow */}
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
                <span aria-hidden="true" className="text-accent">
                  →
                </span>{" "}
                Now loading · Chapter {slate.meta.chapter}
              </p>

              {/* MASSIVE chapter title */}
              <h2
                className="mt-6 font-semibold tracking-tight text-text-dark"
                style={{
                  fontSize: "clamp(3rem, 12vw, 9rem)",
                  letterSpacing: "-0.055em",
                  lineHeight: 0.88,
                }}
              >
                <span className="gradient-shift-dark">{slate.meta.title}</span>
                <span className="text-accent-light">.</span>
              </h2>

              {/* BOTTOM — mono subtitle + chapter index rail */}
              <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-text-dark-muted">
                <span aria-hidden="true" className="h-px w-10 bg-accent-light" />
                <span className="text-accent-light">
                  {slate.meta.subtitle}
                </span>
                <span aria-hidden="true" className="h-px w-10 bg-accent-light" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* PAGE CONTENT — exit/enter under the curtain's cover.
          mode="wait" + delayed entry gives a clean swap behind the
          chapter slate so the user never sees a raw transition. */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          exit={{ filter: "blur(8px)", opacity: 0, y: -6 }}
          initial={{ filter: "blur(8px)", opacity: 0, y: 6 }}
          key={pathname}
          transition={{ delay: 0.32, duration: 0.42, ease: easeOut }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
