"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { TextScramble } from "./TextScramble";

type AtlasProduct = {
  badge: string;
  buildLog: string[];
  description: string;
  kicker: string;
  link: { href: string; label: string };
  spec: { label: string; value: string }[];
  status: "shipped" | "internal";
  title: string;
};

const products: AtlasProduct[] = [
  {
    badge: "01",
    buildLog: [
      "10:42  brief → routed",
      "11:08  scope locked",
      "13:30  shipped ✓",
    ],
    description:
      "End-to-end mini party game. Atlas built the whole thing — gameplay to scoring — under human PR review.",
    kicker: "Game",
    link: { href: "/lab#demos", label: "play the demo" },
    spec: [
      { label: "kind", value: "Web · client-side" },
      { label: "role", value: "Built end-to-end" },
      { label: "operator", value: "Atlas v3" },
      { label: "shipped", value: "12d ago" },
    ],
    status: "shipped",
    title: "Mini party game.",
  },
  {
    badge: "02",
    buildLog: [
      "09:15  spec drafted",
      "11:50  schema + UI",
      "15:20  shipped ✓",
    ],
    description:
      "Personal finance tracker with an AI advisor that reads transactions and answers questions about spending in plain language.",
    kicker: "Finance",
    link: { href: "/lab#shipping", label: "ship log entry" },
    spec: [
      { label: "kind", value: "Web · single-user" },
      { label: "role", value: "Built end-to-end" },
      { label: "operator", value: "Atlas v3" },
      { label: "shipped", value: "live" },
    ],
    status: "shipped",
    title: "Personal budget.",
  },
  {
    badge: "03",
    buildLog: [
      "08:30  workflow modeled",
      "12:00  agents wired",
      "—      running daily",
    ],
    description:
      "Project management surface where field agents pick up work and file PRs against the board. Currently powering Atlas's own roadmap.",
    kicker: "Project Mgmt",
    link: { href: "/atlas#workflow", label: "the workflow loop" },
    spec: [
      { label: "kind", value: "Internal tool" },
      { label: "role", value: "Self-hosted" },
      { label: "operator", value: "Atlas v3" },
      { label: "shipped", value: "in motion" },
    ],
    status: "internal",
    title: "Agent PM board.",
  },
];

// Each entry holds the slot for TICK_S seconds, then the conveyor advances.
const TICK_S = 7;
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function AtlasManifest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % products.length);
    }, TICK_S * 1000);
    return () => window.clearInterval(id);
  }, [reduce]);

  const active = products[activeIndex];
  const next = products[(activeIndex + 1) % products.length];
  const isShipped = active.status === "shipped";

  return (
    <div className="relative">
      {/* HEADER BAND — what's currently in the slot, what's next */}
      <div className="flex flex-col gap-3 border-y border-border-light py-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden="true"
            className="inline-block h-[10px] w-[10px] bg-accent-light"
            style={{
              boxShadow: "0 0 14px 1px rgba(91, 155, 244, 0.55)",
            }}
          />
          <span className="font-mono text-[10px] tracking-[0.32em] text-text-light">
            NOW SHIPPING
          </span>
          <span className="font-mono text-[10px] tabular-nums text-text-light-muted">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(products.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
            up next →
          </span>
          <span className="font-mono text-[11px] text-text-light">
            {next.title.replace(/\.$/, "")}
          </span>
        </div>
      </div>

      {/* CONVEYOR SLOT — the big title plate slides in from the right;
          progress bar at the bottom fills over TICK_S then resets */}
      <div className="relative overflow-hidden py-14 sm:py-20">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex items-baseline gap-6 sm:gap-10"
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: "-12%" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: "18%" }}
            key={active.badge}
            transition={{ duration: 1, ease: easeOut }}
          >
            <span
              aria-hidden="true"
              className="font-semibold tabular-nums text-accent-light/80"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              {active.badge}
            </span>
            <h3
              className="font-semibold tracking-tight text-text-light"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 7.5rem)",
                letterSpacing: "-0.045em",
                lineHeight: 0.95,
              }}
            >
              {active.title}
            </h3>
            <span
              aria-hidden="true"
              className="inline-block h-[14px] w-[14px] self-center"
              style={{
                background: isShipped
                  ? "var(--result-green)"
                  : "color-mix(in srgb, var(--text-light) 35%, transparent)",
                boxShadow: isShipped
                  ? "0 0 18px 2px rgba(16, 185, 129, 0.55)"
                  : "none",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slot rails — thin top + bottom hairlines to frame the conveyor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-light"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-border-light"
        >
          {!reduce && (
            <motion.span
              animate={{ width: "100%" }}
              className="block h-full bg-accent-light"
              initial={{ width: "0%" }}
              key={`pb-${activeIndex}`}
              transition={{ duration: TICK_S, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* INSPECTOR — editorial body, keyed by active so build-log re-flickers */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-16"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
        key={`inspector-${activeIndex}`}
        transition={{ delay: 0.25, duration: 0.55, ease: easeOut }}
      >
        {/* LEFT — kicker + description + cross-link */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-text-light-muted">
              — kind
            </span>
            <span className="font-mono text-[12px] text-text-light">
              {active.kicker}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span
              className={`flex items-center gap-2 font-mono text-[10px] ${
                isShipped ? "text-result-green" : "text-text-light-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] ${
                  isShipped ? "bg-result-green" : "bg-text-light-muted/70"
                }`}
              />
              {isShipped ? "shipped" : "internal"}
            </span>
          </div>

          <p className="max-w-md text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
            {active.description}
          </p>

          <a
            className="group/cta inline-flex items-center gap-2 self-start font-mono text-[11px] text-text-light transition-colors duration-200 hover:text-accent-light"
            href={active.link.href}
          >
            <span aria-hidden="true" className="text-accent-light">
              ↳
            </span>
            <span className="link-underline">{active.link.label}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/cta:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        {/* RIGHT — spec grid + build log */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border-light pt-6 sm:grid-cols-4">
            {active.spec.map((field) => (
              <div className="flex flex-col gap-1" key={field.label}>
                <dt className="font-mono text-[10px] text-text-light-muted">
                  — {field.label}
                </dt>
                <dd className="font-mono text-[12px] tabular-nums text-text-light">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-2 border-l-2 border-border-light/80 pl-5">
            <div className="font-mono text-[10px] text-text-light-muted">
              — build log
            </div>
            <ul className="flex flex-col gap-1.5">
              {active.buildLog.map((line, lineIndex) => {
                const isFinal =
                  lineIndex === active.buildLog.length - 1 &&
                  line.includes("✓");
                return (
                  <li
                    className={`font-mono text-[12px] tabular-nums ${
                      isFinal ? "text-result-green" : "text-text-light/85"
                    }`}
                    key={`${active.badge}-log-${lineIndex}`}
                    style={
                      isFinal
                        ? {
                            textShadow:
                              "0 0 14px rgba(16, 185, 129, 0.45)",
                          }
                        : undefined
                    }
                  >
                    <TextScramble text={line} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* MANIFEST INDEX — three-column manual selector, full width */}
      <div className="mt-10 grid grid-cols-1 border-y border-border-light sm:mt-14 sm:grid-cols-3">
        {products.map((p, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              aria-current={isActive ? "true" : undefined}
              aria-label={`Show ${p.title.replace(/\.$/, "")}`}
              className={`group/idx relative flex flex-col gap-2 border-border-light px-5 py-5 text-left transition-colors duration-300 sm:border-l first:sm:border-l-0 not-first:border-t sm:not-first:border-t-0 ${
                isActive
                  ? "bg-accent-light/[0.06] text-text-light"
                  : "text-text-light-muted hover:bg-bg-light-2/40 hover:text-text-light"
              }`}
              key={p.badge}
              onClick={() => setActiveIndex(i)}
              type="button"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] tabular-nums text-accent-light">
                  {p.badge}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-[7px] w-[7px] transition-opacity duration-300 ${
                    p.status === "shipped"
                      ? "bg-result-green"
                      : "bg-text-light-muted/60"
                  } ${isActive ? "opacity-100" : "opacity-50"}`}
                />
              </div>
              <span className="font-mono text-[13px] tabular-nums">
                {p.title.replace(/\.$/, "")}
              </span>
              {/* Active underline */}
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-5 bottom-0 h-[2px] bg-accent-light"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
