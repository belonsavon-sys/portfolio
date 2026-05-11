"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { SplitText } from "./SplitText";

export type SectionHeaderProps = {
  align?: "left" | "center";
  badge?: ReactNode;
  className?: string;
  description?: string;
  eyebrow: string;
  /** "word" (default, every section gets word-stagger) or "char" for char mask reveal. */
  reveal?: "word" | "char";
  size?: "md" | "lg";
  title: string;
  tone?: "light" | "dark";
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
const viewport = { amount: 0.4, once: true } as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeader({
  align = "left",
  badge,
  className,
  description,
  eyebrow,
  reveal = "word",
  size = "lg",
  title,
  tone = "light",
}: SectionHeaderProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  const centered = align === "center";
  const dark = tone === "dark";

  // Display sizes live on the CSS class itself — no Tailwind text-* needed.
  const titleSize = size === "lg" ? "display-text-tight" : "display-text";

  const eyebrowColor = dark ? "text-accent-light" : "text-accent";
  const titleColor = dark ? "text-text-dark" : "text-text-light";
  const descriptionColor = dark ? "text-text-dark-muted" : "text-text-light-muted";
  const ruleColor = dark ? "bg-accent-light/50" : "bg-accent/60";

  return (
    <div className={cx(centered && "mx-auto text-center", className)}>
      <motion.div
        className={cx(
          "flex items-center gap-3",
          centered && "justify-center",
        )}
        initial={reduce ? false : "hidden"}
        viewport={viewport}
        whileInView={reduce ? undefined : "show"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {centered ? (
          <motion.span
            aria-hidden="true"
            className={cx("h-px w-10 origin-right", ruleColor)}
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 0.7, ease: easeOut } },
            }}
          />
        ) : null}

        <motion.p
          className={cx(
            "font-mono text-xs font-medium uppercase tracking-[0.24em] sm:text-sm",
            eyebrowColor,
          )}
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
          }}
        >
          {eyebrow}
        </motion.p>

        <motion.span
          aria-hidden="true"
          className={cx(
            "h-px origin-left",
            centered ? "w-10" : "w-12",
            ruleColor,
          )}
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1, transition: { duration: 0.7, ease: easeOut } },
          }}
        />

        {badge ? (
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
            }}
          >
            {badge}
          </motion.span>
        ) : null}
      </motion.div>

      <h2
        className={cx(
          "mt-6 max-w-5xl",
          centered && "mx-auto",
          titleSize,
          titleColor,
        )}
      >
        {reduce ? (
          title
        ) : reveal === "char" ? (
          <SplitText
            charDelay={0.018}
            delay={0.1}
            duration={0.75}
            trigger="scroll"
            viewportAmount={0.35}
          >
            {title}
          </SplitText>
        ) : (
          words.map((word, index) => (
            <span
              className="inline-block overflow-hidden align-top"
              key={`${word}-${index}`}
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                transition={{
                  delay: 0.08 + index * 0.035,
                  duration: 0.7,
                  ease: easeOut,
                }}
                viewport={viewport}
                whileInView={{ y: 0 }}
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))
        )}
      </h2>

      {description ? (
        <motion.p
          className={cx(
            "mt-5 max-w-3xl text-lg leading-8",
            centered && "mx-auto",
            descriptionColor,
          )}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}
          viewport={viewport}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
