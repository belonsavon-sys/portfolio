"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type AtlasHierarchyLayer = {
  badge: string;
  description?: string;
  items: string[];
  title: string;
};

export type AtlasHierarchyProps = {
  layers: AtlasHierarchyLayer[];
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Interactive Atlas hierarchy. Left column is a stack of 5 clickable
 * node-rows for the layers (Founders → Engine → C-suite → Execution →
 * Shipped). Right column is a sticky detail panel that cross-fades as
 * the active layer changes.
 *
 * Selection model: hover provides a transient preview; click pins the
 * selection. mouseleave on the column reverts to the pinned index.
 */
export function AtlasHierarchy({ layers }: AtlasHierarchyProps) {
  const reduce = useReducedMotion();
  const [pinnedIndex, setPinnedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [traceIndex, setTraceIndex] = useState<number | null>(null);
  const [tracing, setTracing] = useState(false);
  const traceTimeouts = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tracedOnce = useRef(false);
  // Trace overrides hover overrides pinned — the auto-tour wins
  // visually while it's running.
  const activeIndex = traceIndex ?? hoverIndex ?? pinnedIndex;
  const activeLayer = layers[activeIndex];

  // Run a one-shot trace sequence: each layer activates in turn over
  // ~2s total, then the trace clears and hover/pin resume control.
  function runTrace() {
    if (tracing || reduce) return;
    setTracing(true);
    traceTimeouts.current.forEach((id) => window.clearTimeout(id));
    traceTimeouts.current = [];
    const stepMs = 360;
    layers.forEach((_, i) => {
      const id = window.setTimeout(() => {
        setTraceIndex(i);
      }, i * stepMs);
      traceTimeouts.current.push(id);
    });
    const endId = window.setTimeout(
      () => {
        setTraceIndex(null);
        setTracing(false);
      },
      layers.length * stepMs + 600,
    );
    traceTimeouts.current.push(endId);
  }

  // Auto-trace on first viewport-enter — gives the visitor a free
  // "demo" of the Atlas flow before they even hover.
  useEffect(() => {
    if (reduce) return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !tracedOnce.current) {
            tracedOnce.current = true;
            // Small lead-in so the trace doesn't fire while the
            // section is still mid-scroll-in.
            const id = window.setTimeout(() => runTrace(), 350);
            traceTimeouts.current.push(id);
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      traceTimeouts.current.forEach((id) => window.clearTimeout(id));
      traceTimeouts.current = [];
    };
    // We only want this to wire once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef}>
      {/* Section eyebrow header */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-[rgba(41,110,214,0.10)]"
        >
          <span className="h-2 w-2 rounded-sm bg-accent" />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          Atlas · the engine
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        {/* Trace control — manual re-run after the auto-tour finishes */}
        <button
          aria-label={tracing ? "Tracing request through Atlas" : "Trace a request through Atlas"}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[rgba(41,110,214,0.06)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-[border-color,background] duration-200 hover:border-accent hover:bg-[rgba(41,110,214,0.12)] disabled:opacity-60"
          disabled={tracing}
          onClick={runTrace}
          type="button"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span
              className={`absolute inset-0 rounded-full bg-accent ${tracing ? "animate-ping" : ""}`}
            />
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {tracing ? "Tracing…" : "Trace a request ↓"}
        </button>
      </div>

      <div
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* LEFT — clickable / hoverable node stack */}
        <ul className="relative grid gap-2">
          {/* Vertical thread connecting the layers */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[1.125rem] top-3 bottom-3 w-px bg-gradient-to-b from-accent/55 via-accent/25 to-transparent"
          />
          {layers.map((layer, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={layer.title}>
                <button
                  aria-current={index === pinnedIndex ? "true" : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-xl border bg-bg-light-2 p-4 text-left transition-[border-color,background,box-shadow,transform] duration-300 ${
                    isActive
                      ? "border-accent bg-[rgba(41,110,214,0.06)] shadow-[0_12px_28px_-16px_rgba(41,110,214,0.4)]"
                      : "border-border-light hover:border-accent/45"
                  }`}
                  onClick={() => setPinnedIndex(index)}
                  onFocus={() => setHoverIndex(index)}
                  onMouseEnter={() => setHoverIndex(index)}
                  type="button"
                >
                  {/* Node circle */}
                  <span
                    className={`relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold tracking-tight transition-colors duration-300 ${
                      isActive
                        ? "border-accent bg-accent text-white shadow-[0_0_0_4px_rgba(41,110,214,0.15)]"
                        : "border-accent/40 bg-bg-light text-accent"
                    }`}
                  >
                    {layer.badge}
                  </span>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <span
                      className={`font-mono text-xs uppercase tracking-[0.22em] transition-colors duration-200 ${
                        isActive
                          ? "text-text-light"
                          : "text-text-light-muted group-hover:text-text-light"
                      }`}
                    >
                      {layer.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 ${
                        index === pinnedIndex
                          ? "text-accent"
                          : "text-text-light-muted/60"
                      }`}
                    >
                      {index === pinnedIndex ? "Pinned" : `0${index + 1}`}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* RIGHT — sticky detail panel, cross-fades on active change */}
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-2xl border border-border-light bg-bg-light p-6 shadow-[0_18px_36px_-22px_rgba(41,110,214,0.18)]">
            <AnimatePresence mode="wait">
              <motion.div
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                key={activeLayer.title}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent bg-accent text-[11px] font-mono font-semibold text-white">
                    {activeLayer.badge}
                  </span>
                  <h4 className="text-xl font-semibold tracking-tight text-text-light">
                    {activeLayer.title}
                  </h4>
                </div>

                {activeLayer.description ? (
                  <p className="mt-4 text-sm leading-6 text-text-light-muted">
                    {activeLayer.description}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {activeLayer.items.map((item) => (
                    <span
                      className="inline-flex items-center rounded-md border border-accent/30 bg-[rgba(41,110,214,0.08)] px-2.5 py-1 text-sm font-medium text-text-light"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Footer rail: position indicator */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                    Layer {activeIndex + 1} / {layers.length}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-border-light">
                    <motion.span
                      animate={{
                        width: `${((activeIndex + 1) / layers.length) * 100}%`,
                      }}
                      className="block h-full bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                      transition={{ duration: 0.4, ease: easeOut }}
                    />
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}
