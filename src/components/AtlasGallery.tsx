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

const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

export function AtlasGallery() {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.map((product, index) => (
        <motion.article
          animate={reduce ? { opacity: 1 } : undefined}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2/80 backdrop-blur-md"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          key={product.title}
          transition={{ delay: index * 0.06, duration: 0.5, ease: easeOut }}
          viewport={{ amount: 0.3, once: true }}
          whileHover={{ y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div
            className="relative aspect-[16/10] w-full overflow-hidden"
            style={{ background: product.gradient }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 60%)",
              }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(0,0,0,0.4)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark backdrop-blur-md">
                {product.tag}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dark/80">
                Pending screenshot
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
                Built via Atlas
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(41,110,214,0.25)]" />
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                  product.status === "shipped"
                    ? "text-result-green"
                    : "text-text-dark-muted"
                }`}
              >
                {product.status === "shipped" ? "● Shipped" : "● Internal"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-text-dark">
              {product.title}
            </h3>
            <p className="text-sm leading-6 text-text-dark-muted">
              {product.description}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
