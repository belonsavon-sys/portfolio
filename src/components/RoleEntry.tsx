"use client";

import { motion, useReducedMotion } from "framer-motion";

export type RoleEntryProps = {
  bullets: string[];
  featured?: boolean;
  meta: string;
  role: string;
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * One résumé experience or project block. Bullets stagger in
 * left-to-right as the entry scrolls past the viewport's center —
 * a quiet appearing moment that signals "this is a measured list,
 * not a wall of text".
 */
export function RoleEntry({ bullets, featured, meta, role }: RoleEntryProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className="group relative border-l-2 border-border-light pl-6 transition-[border-color] duration-300 hover:border-accent"
    >
      {/* Timeline dot */}
      <span
        aria-hidden="true"
        className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
          featured
            ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(41,110,214,0.15)]"
            : "border-border-light bg-bg-light group-hover:border-accent group-hover:bg-accent"
        }`}
      />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold tracking-tight transition-colors duration-200 group-hover:text-accent-deep">
            {role}
          </h3>
          {featured ? (
            <span className="inline-flex items-baseline gap-1.5 font-mono text-[12px] text-accent">
              <span aria-hidden="true" className="text-accent/60">—</span>
              featured
            </span>
          ) : null}
        </div>
        <p className="shrink-0 font-mono text-[12px] text-text-light-muted sm:text-right">
          {meta}
        </p>
      </div>
      <motion.ul
        className="mt-4 grid gap-2.5 text-sm leading-6 text-text-light-muted"
        initial={reduce ? false : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        viewport={{ amount: 0.2, once: true }}
        whileInView={reduce ? undefined : "show"}
      >
        {bullets.map((bullet) => (
          <motion.li
            className="flex items-start gap-2.5"
            key={bullet}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.45, ease: easeOut },
              },
            }}
          >
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60"
            />
            <span>{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
