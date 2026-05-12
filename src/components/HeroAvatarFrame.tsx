"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeroAvatarFrameProps = {
  /** Click handler — typically opens the About modal. */
  onClick?: () => void;
  /** Image src for the avatar (square crop). */
  src: string;
};

/**
 * Hero avatar — just the picture. No orbital ring, no corner ticks,
 * no status dot, no tooltip. Click still opens the About modal so
 * the existing flow keeps working.
 */
export function HeroAvatarFrame({ onClick, src }: HeroAvatarFrameProps) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      aria-label="Open About — Pierre Belon Savon"
      className="group/avatar relative mb-8 inline-flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-44 sm:w-44 lg:h-48 lg:w-48"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      type="button"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Pierre Belon Savon"
        className="h-full w-full object-cover object-[50%_20%] transition-transform duration-300 ease-out group-hover/avatar:scale-[1.04]"
        fetchPriority="high"
        loading="eager"
        src={src}
      />
    </motion.button>
  );
}
