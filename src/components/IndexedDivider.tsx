"use client";

import { motion, useReducedMotion } from "framer-motion";

export type IndexedDividerProps = {
  className?: string;
  index: string;
  label?: string;
  tone?: "light" | "dark";
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function IndexedDivider({
  className,
  index,
  label,
  tone = "light",
}: IndexedDividerProps) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={cx(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <motion.div
        className="flex items-center gap-4"
        initial={reduce ? false : "hidden"}
        viewport={{ amount: 0.5, once: true }}
        whileInView={reduce ? undefined : "show"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.span
          className={cx(
            "inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.32em]",
            dark
              ? "border-accent-light/40 bg-[rgba(91,155,244,0.10)] text-accent-light"
              : "border-accent/30 bg-[rgba(41,110,214,0.08)] text-accent",
          )}
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
        >
          {index}
        </motion.span>
        {label ? (
          <motion.span
            className={cx(
              "font-mono text-[10px] uppercase tracking-[0.28em]",
              dark ? "text-text-dark-muted" : "text-text-light-muted",
            )}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: easeOut },
              },
            }}
          >
            {label}
          </motion.span>
        ) : null}

        <motion.span
          className={cx(
            "h-px flex-1 origin-left",
            dark ? "bg-accent-light/30" : "bg-border-light",
          )}
          variants={{
            hidden: { scaleX: 0 },
            show: {
              scaleX: 1,
              transition: { duration: 1.1, ease: easeOut },
            },
          }}
        />

        <motion.span
          className={cx(
            "inline-block h-1.5 w-1.5 rounded-full",
            dark ? "bg-accent-light" : "bg-accent",
          )}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            show: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: easeOut },
            },
          }}
        />
      </motion.div>
    </div>
  );
}
