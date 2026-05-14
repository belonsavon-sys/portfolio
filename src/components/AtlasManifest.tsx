"use client";

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

// Total marquee cycle in seconds. Each product occupies marqueeS/total of the
// loop — rotate the inspector to match.
const MARQUEE_S = 24;
const TICK_MS = (MARQUEE_S / products.length) * 1000;

export function AtlasManifest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  // Honor prefers-reduced-motion. When reduced, the marquee freezes and the
  // user advances entries manually via the row of tiny badges below.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % products.length);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const active = products[activeIndex];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top hairline */}
      <div aria-hidden="true" className="h-px w-full bg-border-light" />

      {/* MARQUEE — oversized titles passing horizontally on an infinite loop */}
      <div className="relative overflow-hidden py-10 sm:py-14">
        <div
          className="flex items-baseline whitespace-nowrap will-change-transform"
          style={{
            animation: reduce
              ? "none"
              : `hero-ticker ${MARQUEE_S}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {/* doubled list for seamless loop */}
          {[...products, ...products].map((p, i) => (
            <MarqueeItem
              active={i % products.length === activeIndex}
              key={`${p.badge}-${i}`}
              product={p}
            />
          ))}
        </div>

        {/* Edge fades — frame the marquee like a film gate */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32"
          style={{
            background:
              "linear-gradient(to right, var(--bg-light) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32"
          style={{
            background:
              "linear-gradient(to left, var(--bg-light) 0%, transparent 100%)",
          }}
        />

        {/* Center inspector mark — a vertical hairline + reticle that frames
            the focal point of the marquee */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-1/2 hidden -translate-x-1/2 sm:flex sm:flex-col sm:items-center sm:justify-between"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] text-accent-light/70">
            ◇
          </span>
          <span className="block h-full w-px bg-accent-light/15" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-accent-light/70">
            ◇
          </span>
        </div>
      </div>

      {/* Bottom hairline */}
      <div aria-hidden="true" className="h-px w-full bg-border-light" />

      {/* INSPECTOR — fixed editorial card, swaps content as the active index
          rotates. Whole block is keyed by activeIndex so React remounts the
          TextScramble lines and each entry gets a fresh flicker. */}
      <div
        className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-16"
        key={activeIndex}
      >
        {/* LEFT — inspector tag + description + cross-link */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-text-light-muted">
              — currently inspecting
            </span>
            <span className="font-mono text-[12px] tabular-nums text-accent-light">
              {active.badge}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
            <span
              className={`flex items-center gap-2 font-mono text-[10px] ${
                active.status === "shipped"
                  ? "text-result-green"
                  : "text-text-light-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] ${
                  active.status === "shipped"
                    ? "bg-result-green"
                    : "bg-text-light-muted/70"
                }`}
                style={
                  active.status === "shipped"
                    ? { boxShadow: "0 0 10px 1px rgba(16, 185, 129, 0.55)" }
                    : undefined
                }
              />
              {active.status === "shipped" ? "shipped" : "internal"}
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
                            textShadow: "0 0 14px rgba(16, 185, 129, 0.45)",
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
      </div>

      {/* MANIFEST FOOTER — pause hint + manual selector + tallies */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] text-text-light-muted">
        <span>
          —{" "}
          {reduce
            ? "reduced motion · select an entry"
            : paused
              ? "paused · move away to resume"
              : "hover to pause"}
        </span>

        {/* manual selector — small numeric pills, mainly for accessibility +
            reduced-motion users. Square edges (no rounded-full chrome). */}
        <span aria-hidden="true" className="h-px w-8 bg-border-light" />
        <div className="flex items-center gap-2">
          {products.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={`Inspect ${p.title.replace(/\.$/, "")}`}
                className={`px-2 py-1 font-mono text-[10px] tabular-nums transition-colors duration-200 ${
                  isActive
                    ? "bg-accent-light/15 text-accent-light"
                    : "text-text-light-muted hover:text-text-light"
                }`}
                key={p.badge}
                onClick={() => {
                  setPaused(true);
                  setActiveIndex(i);
                }}
                type="button"
              >
                {p.badge}
              </button>
            );
          })}
        </div>

        <span aria-hidden="true" className="h-px w-8 bg-border-light" />
        <span>
          <span className="text-text-light/80 tabular-nums">
            {products.length}
          </span>{" "}
          entries
        </span>
        <span>
          <span className="text-result-green tabular-nums">
            {products.filter((p) => p.status === "shipped").length}
          </span>{" "}
          shipped
        </span>
      </div>
    </div>
  );
}

function MarqueeItem({
  active,
  product,
}: {
  active: boolean;
  product: AtlasProduct;
}) {
  return (
    <div className="flex shrink-0 items-baseline gap-6 pr-16 sm:gap-8 sm:pr-24">
      <span className="font-mono text-[11px] tabular-nums text-accent-light/70">
        {product.badge}
      </span>
      <h3
        className="font-semibold tracking-tight transition-[color,opacity] duration-700 ease-out"
        style={{
          color: active
            ? "var(--text-light)"
            : "color-mix(in srgb, var(--text-light) 25%, transparent)",
          fontSize: "clamp(3rem, 9vw, 7.5rem)",
          letterSpacing: "-0.045em",
          lineHeight: 1,
        }}
      >
        {product.title}
      </h3>
      <span
        aria-hidden="true"
        className="inline-block h-[10px] w-[10px] transition-opacity duration-700"
        style={{
          background:
            product.status === "shipped"
              ? "var(--result-green)"
              : "color-mix(in srgb, var(--text-light) 35%, transparent)",
          boxShadow:
            active && product.status === "shipped"
              ? "0 0 16px 2px rgba(16, 185, 129, 0.5)"
              : "none",
          opacity: active ? 1 : 0.4,
        }}
      />
      <span className="font-mono text-[14px] text-text-light-muted/60">◇</span>
    </div>
  );
}
