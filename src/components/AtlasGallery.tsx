"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useRef } from "react";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

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
    <div className="grid gap-4 md:grid-cols-3" style={{ perspective: "1200px" }}>
      {products.map((product, index) => (
        <TiltCard delay={index * 0.06} key={product.title} product={product} />
      ))}
    </div>
  );
}

function TiltCard({
  delay,
  product,
}: {
  delay: number;
  product: AtlasProduct;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotX = useSpring(useTransform(mvY, [-0.5, 0.5], ["7deg", "-7deg"]), {
    damping: 22,
    stiffness: 180,
  });
  const rotY = useSpring(useTransform(mvX, [-0.5, 0.5], ["-7deg", "7deg"]), {
    damping: 22,
    stiffness: 180,
  });

  const onMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (reduce) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      mvX.set((event.clientX - rect.left) / rect.width - 0.5);
      mvY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mvX, mvY, reduce],
  );

  const onLeave = useCallback(() => {
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  return (
    <motion.article
      animate={reduce ? { opacity: 1 } : undefined}
      className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-gradient-to-br from-bg-dark-2 to-bg-dark p-6 backdrop-blur-md transition-colors duration-300 hover:border-accent-light/70 sm:p-7"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      ref={ref as RefObject<HTMLElement>}
      style={
        reduce
          ? undefined
          : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
      }
      transition={{ delay, duration: 0.5, ease: easeOut }}
      viewport={{ amount: 0.3, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Ambient corner glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
      />

      {/* META — tag, divider, status */}
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
          >
            {product.status === "shipped" ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
            ) : null}
          </span>
          {product.status === "shipped" ? "Shipped" : "Internal"}
        </span>
      </div>

      {/* TITLE — display-class with arrow that slides in on hover */}
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

      {/* FOOTER — Built via Atlas tag (kept as small attribution chip) */}
      <div className="relative mt-auto flex items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(41,110,214,0.18)]" />
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light/70">
          <span className="h-1 w-1 rounded-full bg-accent-light" />
          Built via Atlas
        </span>
      </div>
    </motion.article>
  );
}
