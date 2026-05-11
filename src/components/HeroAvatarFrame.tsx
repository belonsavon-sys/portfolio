"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeroAvatarFrameProps = {
  /** Click handler — typically opens the About modal. */
  onClick?: () => void;
  /** Image src for the avatar (square crop). */
  src: string;
};

/**
 * Hero avatar frame — concentric, animated, distinctive.
 *
 * Layers (outer -> inner):
 *  1. Soft conic-gradient halo (via .avatar-ring + .avatar-float CSS).
 *  2. SVG curved-text orbit ring — small uppercase mono text traveling
 *     clockwise around the avatar (decoration, not literal copy).
 *  3. SVG dashed accent stroke ring rotating counter-clockwise.
 *  4. The avatar image itself with a thin accent ring.
 *  5. A green pulsing "available" status dot in the bottom-right.
 *
 * Click opens the About modal. Hover scales the image gently.
 * Reduced-motion users get the static composition with no rotations.
 */
export function HeroAvatarFrame({ onClick, src }: HeroAvatarFrameProps) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      aria-label="Open About — Pierre Belon Savon"
      className="avatar-float avatar-ring group/avatar relative mb-8 inline-flex h-36 w-36 cursor-pointer items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-44 sm:w-44 lg:h-48 lg:w-48"
      onClick={onClick}
      type="button"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* RING 1 — curved orbit text (decorative copy circling the avatar) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 200 200"
      >
        <defs>
          <path
            d="M 100,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
            id="hero-avatar-orbit"
          />
        </defs>
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={
            reduce
              ? undefined
              : { duration: 24, ease: "linear", repeat: Infinity }
          }
        >
          <text
            className="fill-accent/70"
            style={{
              fontFamily:
                "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            <textPath href="#hero-avatar-orbit" startOffset="0">
              Pierre Belon Savon · AI Engineer · Atlas · Pierre Belon Savon · AI
              Engineer · Atlas ·{" "}
            </textPath>
          </text>
        </motion.g>
      </svg>

      {/* RING 2 — dashed accent stroke rotating the other direction */}
      <motion.svg
        aria-hidden="true"
        animate={reduce ? undefined : { rotate: -360 }}
        className="pointer-events-none absolute inset-3"
        transition={
          reduce
            ? undefined
            : { duration: 38, ease: "linear", repeat: Infinity }
        }
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          fill="none"
          r="92"
          stroke="rgba(41,110,214,0.4)"
          strokeDasharray="2 8"
          strokeLinecap="round"
          strokeWidth="1"
        />
        {/* Anchor dot riding the dashed ring */}
        <circle
          cx="100"
          cy="8"
          fill="var(--accent)"
          r="2.5"
        />
      </motion.svg>

      {/* AVATAR — sits inside an inner well */}
      <span className="relative block h-[78%] w-[78%] overflow-hidden rounded-full ring-2 ring-accent/40 shadow-[0_18px_36px_-16px_rgba(15,23,42,0.35)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Pierre Belon Savon"
          className="h-full w-full object-cover object-[50%_20%] transition-transform duration-300 ease-out group-hover/avatar:scale-[1.08]"
          fetchPriority="high"
          loading="eager"
          src={src}
        />
        {/* Subtle inner vignette so the image edge meets the ring cleanly */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_-30px_30px_-30px_rgba(15,23,42,0.5)]"
        />
      </span>

      {/* STATUS — pulsing green "available" dot bottom-right */}
      <span
        aria-hidden="true"
        className="absolute bottom-[6%] right-[6%] inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-bg-light shadow-sm sm:h-5 sm:w-5"
      >
        <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-result-green/70" />
          <span className="relative inline-block h-full w-full rounded-full bg-result-green shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
        </span>
      </span>

      {/* TOOLTIP — about-me discoverability */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full border border-accent/30 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent opacity-0 shadow-[0_6px_16px_-8px_rgba(41,110,214,0.45)] backdrop-blur-md transition-[transform,opacity] duration-300 group-hover/avatar:translate-y-3 group-hover/avatar:opacity-100"
      >
        About me ↗
      </span>
    </motion.button>
  );
}
