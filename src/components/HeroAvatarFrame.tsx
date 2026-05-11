"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeroAvatarFrameProps = {
  /** Click handler — typically opens the About modal. */
  onClick?: () => void;
  /** Image src for the avatar (square crop). */
  src: string;
};

/**
 * Hero avatar frame — solid border + a single bright "comet" arc that
 * travels around a faint dashed orbital ring. No blur, no halo.
 *
 * Layers (outer → inner):
 *  1. Faint dashed SVG circle (the orbital "rail").
 *  2. A bright accent arc (stroke-dasharray short visible / long
 *     invisible) sharing the same circle path; animated via continuous
 *     rotation so the bright segment travels around the rail like a
 *     comet.
 *  3. Four corner bracket marks at 12 / 3 / 6 / 9 o'clock positions
 *     just outside the photo — fixed registration ticks (like a camera
 *     viewfinder).
 *  4. The avatar image with a solid 2px accent border + soft inset
 *     vignette (shadow, not blur).
 *  5. A small status node at 4 o'clock with a pulsing "available" dot.
 *
 * Click opens the About modal. Hover scales the image gently and
 * accelerates the comet rotation.
 * Reduced-motion users get the static composition.
 */
export function HeroAvatarFrame({ onClick, src }: HeroAvatarFrameProps) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      aria-label="Open About — Pierre Belon Savon"
      className="group/avatar relative mb-8 inline-flex h-36 w-36 cursor-pointer items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-44 sm:w-44 lg:h-48 lg:w-48"
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      type="button"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ORBITAL RAIL — faint dashed ring + bright comet arc that rotates */}
      <motion.svg
        aria-hidden="true"
        animate={reduce ? undefined : { rotate: 360 }}
        className="pointer-events-none absolute inset-0 transition-[animation-duration] duration-300"
        transition={
          reduce
            ? undefined
            : { duration: 22, ease: "linear", repeat: Infinity }
        }
        viewBox="0 0 200 200"
      >
        {/* The static dashed rail */}
        <circle
          cx="100"
          cy="100"
          fill="none"
          r="94"
          stroke="rgba(41,110,214,0.28)"
          strokeDasharray="1 7"
          strokeLinecap="round"
          strokeWidth="2"
        />
        {/* The bright comet segment — sits on the same circle but its
            dasharray makes only a short arc visible. Because the parent
            <svg> is rotating, the visible arc travels around the rail. */}
        <circle
          cx="100"
          cy="100"
          fill="none"
          pathLength="100"
          r="94"
          stroke="url(#hero-avatar-comet-gradient)"
          strokeDasharray="14 86"
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <defs>
          <linearGradient id="hero-avatar-comet-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-deep)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-light)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* CORNER REGISTRATION TICKS — 12/3/6/9 o'clock around the photo.
          Solid 1px ticks, no blur, signal "this is a deliberate crop". */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1 h-2 w-px -translate-x-1/2 bg-accent/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-1/2 h-2 w-px -translate-x-1/2 bg-accent/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1/2 h-px w-2 -translate-y-1/2 bg-accent/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 h-px w-2 -translate-y-1/2 bg-accent/55"
      />

      {/* AVATAR — solid border, inset vignette via shadow (not blur) */}
      <span className="relative block h-[82%] w-[82%] overflow-hidden rounded-full shadow-[0_0_0_2px_var(--accent),0_18px_36px_-18px_rgba(15,23,42,0.4)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Pierre Belon Savon"
          className="h-full w-full object-cover object-[50%_20%] transition-transform duration-300 ease-out group-hover/avatar:scale-[1.08]"
          fetchPriority="high"
          loading="eager"
          src={src}
        />
        {/* Soft inset vignette — shadow only, no blur filter */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),inset_0_-26px_30px_-28px_rgba(15,23,42,0.5)]"
        />
      </span>

      {/* STATUS — bottom-right "available" dot */}
      <span
        aria-hidden="true"
        className="absolute bottom-[8%] right-[8%] inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg-light bg-bg-light sm:h-5 sm:w-5"
      >
        <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/70" />
          <span className="relative inline-block h-full w-full rounded-full bg-result-green" />
        </span>
      </span>

      {/* TOOLTIP — about-me discoverability */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full border border-accent/30 bg-bg-light px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent opacity-0 shadow-[0_6px_16px_-8px_rgba(41,110,214,0.45)] transition-[transform,opacity] duration-300 group-hover/avatar:translate-y-3 group-hover/avatar:opacity-100"
      >
        About me ↗
      </span>
    </motion.button>
  );
}
