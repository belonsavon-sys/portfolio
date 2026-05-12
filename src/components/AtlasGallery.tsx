"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      "End-to-end mini party game. Atlas built the whole thing — gameplay to scoring — under human review.",
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
      "Project management surface where field agents pick up work and file PRs against the board. Currently powering Atlas's own roadmap.",
    gradient: "linear-gradient(135deg, #111827 0%, #1A4E9C 50%, #296ED6 100%)",
    imageSrc: "/atlas-pm.png",
    status: "internal",
    tag: "Project Mgmt",
    title: "Agent-augmented PM",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function AtlasGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      if (cards.length === 0) return;
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < cards.length; i += 1) {
        const r = cards[i].getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const d = Math.abs(cardCenter - center);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      setActiveIndex(nearest);
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToCard(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    card.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  return (
    <div className="relative">
      {/* TRACK — horizontal-scrolling tiles with scroll-snap */}
      <div
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
      >
        {products.map((product, index) => (
          <Tile
            active={index === activeIndex}
            delay={index * 0.08}
            index={index}
            key={product.title}
            product={product}
            total={products.length}
          />
        ))}
      </div>

      {/* PROGRESS RAIL — chapter indicator + clickable dots */}
      <div className="mt-8 flex items-center gap-4">
        <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.28em] text-accent-light">
          {`0${activeIndex + 1}`} / {`0${products.length}`}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.18)]">
          <motion.span
            animate={{
              width: `${((activeIndex + 1) / products.length) * 100}%`,
            }}
            className="block h-full bg-accent-light"
            transition={{ duration: 0.4, ease: easeOut }}
          />
        </span>
        <div className="flex items-center gap-2">
          {products.map((p, index) => (
            <button
              aria-label={`Go to ${p.title}`}
              className="group inline-flex h-6 w-6 items-center justify-center"
              key={p.title}
              onClick={() => scrollToCard(index)}
              type="button"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-accent-light"
                    : "w-2 bg-[rgba(91,155,244,0.35)] group-hover:bg-accent-light/70"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* SWIPE HINT — appears only when the first tile is active */}
      <motion.p
        animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
        className="pointer-events-none absolute right-4 top-4 hidden font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light/70 sm:right-6 sm:block lg:right-8"
        transition={{ duration: 0.4, ease: easeOut }}
      >
        Swipe →
      </motion.p>
    </div>
  );
}

function Tile({
  active,
  delay,
  index,
  product,
  total,
}: {
  active: boolean;
  delay: number;
  index: number;
  product: AtlasProduct;
  total: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={`group relative flex w-[88vw] shrink-0 snap-start flex-col gap-8 overflow-hidden rounded-3xl border bg-bg-dark-2 p-8 transition-[border-color,transform] duration-500 sm:w-[78vw] sm:p-10 lg:w-[68vw] lg:p-12 ${
        active
          ? "border-accent-light/55 shadow-[0_36px_72px_-30px_rgba(91,155,244,0.45)]"
          : "border-[rgba(41,110,214,0.25)]"
      }`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Ambient gradient washing the inside of the tile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-65"
        style={{ background: product.gradient }}
      />
      {/* Vignette to keep text readable over the gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bg-dark/70 via-bg-dark/35 to-bg-dark/85"
      />

      {/* TOP META row — chapter index · tag · status */}
      <div className="relative z-10 flex items-center gap-3 text-text-dark">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
          {`0${index + 1}`} / {`0${total}`}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.30)]" />
        <span className="rounded-md border border-[rgba(91,155,244,0.40)] bg-[rgba(91,155,244,0.10)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
          {product.tag}
        </span>
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

      {/* HEADLINE — oversized for tile presence */}
      <div className="relative z-10">
        <h3
          className="font-semibold tracking-tight text-text-dark"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          {product.title}
        </h3>
        <p className="mt-6 max-w-2xl text-base leading-7 text-text-dark-muted sm:text-lg sm:leading-8">
          {product.description}
        </p>
      </div>

      {/* BOTTOM FOOTER — built-via stamp anchored to the tile bottom */}
      <div className="relative z-10 mt-auto flex items-center gap-3">
        <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.25)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light/80">
          Built end-to-end by Atlas
        </span>
      </div>
    </motion.article>
  );
}
