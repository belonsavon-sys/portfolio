"use client";

import { motion, useReducedMotion } from "framer-motion";

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

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function AtlasManifest() {
  return (
    <div className="relative">
      {/* Top hairline opens the manifest */}
      <div aria-hidden="true" className="h-px w-full bg-border-light" />

      {products.map((product, index) => (
        <Entry index={index} key={product.badge} product={product} />
      ))}

      {/* Bottom hairline closes the manifest */}
      <div aria-hidden="true" className="h-px w-full bg-border-light" />

      {/* Manifest footer — three small data points + total */}
      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[10px] text-text-light-muted">
        <span>— end of manifest</span>
        <span aria-hidden="true" className="h-px w-8 bg-border-light" />
        <span>
          <span className="text-text-light/80 tabular-nums">{products.length}</span>{" "}
          entries
        </span>
        <span>
          <span className="text-result-green tabular-nums">
            {products.filter((p) => p.status === "shipped").length}
          </span>{" "}
          shipped
        </span>
        <span>
          <span className="text-text-light/80 tabular-nums">
            {products.filter((p) => p.status === "internal").length}
          </span>{" "}
          internal
        </span>
      </div>
    </div>
  );
}

function Entry({ index, product }: { index: number; product: AtlasProduct }) {
  const reduce = useReducedMotion();
  const isShipped = product.status === "shipped";

  return (
    <motion.article
      className="group relative grid grid-cols-1 gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-16 lg:py-20"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      transition={{ delay: index * 0.05, duration: 0.7, ease: easeOut }}
      viewport={{ amount: 0.15, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* divider between rows (not above the first) */}
      {index > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-border-light"
        />
      )}

      {/* LEFT — numeral + spec table + cross-link */}
      <div className="flex flex-col gap-8 lg:col-span-5">
        {/* Huge numeral with a status flag inline */}
        <div className="flex items-start justify-between">
          <span
            aria-hidden="true"
            className="block font-semibold tabular-nums text-accent-light/80"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            {product.badge}
          </span>

          <div className="flex flex-col items-end gap-1 pt-3">
            <span className="font-mono text-[10px] text-text-light-muted">
              — {product.kicker.toLowerCase()}
            </span>
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
                style={{
                  boxShadow: isShipped
                    ? "0 0 10px 1px rgba(16, 185, 129, 0.55)"
                    : undefined,
                }}
              />
              {isShipped ? "shipped" : "internal"}
            </span>
          </div>
        </div>

        {/* Spec strip — 2x2 grid, mono labels, tabular values */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border-light pt-6">
          {product.spec.map((field) => (
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

        {/* Cross-link */}
        <a
          className="group/cta inline-flex items-center gap-2 self-start font-mono text-[11px] text-text-light transition-colors duration-200 hover:text-accent-light"
          href={product.link.href}
        >
          <span aria-hidden="true" className="text-accent-light">↳</span>
          <span className="link-underline">{product.link.label}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/cta:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      {/* RIGHT — display headline + description + build log */}
      <div className="flex flex-col gap-8 lg:col-span-7">
        <h3
          className="font-semibold tracking-tight text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          {product.title}
        </h3>

        <p className="max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg sm:leading-8">
          {product.description}
        </p>

        {/* Build log — wow beat: lines flicker in sequentially on viewport enter */}
        <div className="flex flex-col gap-2 border-l-2 border-border-light/80 pl-5">
          <div className="font-mono text-[10px] text-text-light-muted">
            — build log
          </div>
          <ul className="flex flex-col gap-1.5">
            {product.buildLog.map((line, lineIndex) => {
              const isFinal =
                lineIndex === product.buildLog.length - 1 &&
                line.includes("✓");
              return (
                <motion.li
                  className={`font-mono text-[12px] tabular-nums ${
                    isFinal
                      ? "text-result-green"
                      : "text-text-light/85"
                  }`}
                  initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  key={`${product.badge}-${lineIndex}`}
                  style={
                    isFinal
                      ? {
                          textShadow:
                            "0 0 14px rgba(16, 185, 129, 0.45)",
                        }
                      : undefined
                  }
                  transition={{
                    delay: 0.2 + lineIndex * 0.18,
                    duration: 0.45,
                    ease: easeOut,
                  }}
                  viewport={{ amount: 0.4, once: true }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <TextScramble text={line} />
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}
