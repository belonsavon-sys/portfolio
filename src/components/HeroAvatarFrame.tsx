"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeroAvatarFrameProps = {
  /** Image src for the portrait. */
  src: string;
};

/**
 * Hero portrait — simple circular icon frame. Small round photo with
 * a thin accent hairline border. No halo, no sheen, no corner tick.
 */
export function HeroAvatarFrame({ src }: HeroAvatarFrameProps) {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className="relative block h-24 w-24 overflow-hidden rounded-full ring-1 ring-accent/50 sm:h-28 sm:w-28"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Pierre Belon Savon"
          className="h-full w-full object-cover object-[50%_22%]"
          fetchPriority="high"
          loading="eager"
          src={src}
        />
      </span>
    </motion.figure>
  );
}
