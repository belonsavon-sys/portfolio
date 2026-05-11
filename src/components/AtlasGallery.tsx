"use client";

import { motion, useReducedMotion } from "framer-motion";

type AtlasProduct = {
  description: string;
  gradient: string;
  href?: string;
  imageSrc?: string;
  status: "shipped" | "internal";
  tag: string;
  title: string;
};

const products: AtlasProduct[] = [
  {
    description:
      "End-to-end mini party game. Atlas wrote the gameplay loop, the UI, the scoring system. Co-developed by agents under human review.",
    gradient: "linear-gradient(135deg, #1A4E9C 0%, #5B9BF4 100%)",
    imageSrc: "/atlas-game.png",
    status: "shipped",
    tag: "Game",
    title: "Mini party game",
  },
  {
    description:
      "Personal finance tracker with a built-in AI advisor that reads transactions and answers questions about spending in plain language.",
    gradient: "linear-gradient(135deg, #0F172A 0%, #296ED6 60%, #5B9BF4 100%)",
    imageSrc: "/atlas-budget.png",
    status: "shipped",
    tag: "Budget",
    title: "Personal budgeting app",
  },
  {
    description:
      "Project management surface where field agents pick up work, file PRs, and update the board. Currently powering Atlas's own roadmap.",
    gradient: "linear-gradient(135deg, #111827 0%, #1A4E9C 50%, #296ED6 100%)",
    imageSrc: "/atlas-pm.png",
    status: "internal",
    tag: "Project Mgmt",
    title: "Agent-augmented PM",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function AtlasGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.map((product, index) => (
        <FlatCard delay={index * 0.06} key={product.title} product={product} />
      ))}
    </div>
  );
}

function FlatCard({
  delay,
  product,
}: {
  delay: number;
  product: AtlasProduct;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      animate={reduce ? { opacity: 1 } : undefined}
      className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-light/60 sm:p-7"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5, ease: easeOut }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="relative flex items-center gap-2.5">
        <span className="rounded-md border border-[rgba(91,155,244,0.3)] bg-[rgba(91,155,244,0.10)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
          {product.tag}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(41,110,214,0.25)]" />
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${
            product.status === "shipped"
              ? "text-result-green"
              : "text-text-dark-muted"
          }`}
        >
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
              product.status === "shipped"
                ? "bg-result-green"
                : "bg-text-dark-muted"
            }`}
          />
          {product.status === "shipped" ? "Shipped" : "Internal"}
        </span>
      </div>

      <div className="relative">
        <h3 className="flex items-baseline gap-2 text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl">
          <span className="transition-colors duration-200 group-hover:text-accent-light">
            {product.title}
          </span>
          <span
            aria-hidden="true"
            className="inline-block translate-x-0 text-base text-accent-light opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
          >
            ↗
          </span>
        </h3>
        <p className="mt-3 text-sm leading-6 text-text-dark-muted">
          {product.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(41,110,214,0.18)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light/70">
          Built via Atlas
        </span>
      </div>
    </motion.article>
  );
}
