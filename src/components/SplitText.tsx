"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

export type SplitTextProps = {
  /** The text to split. Whitespace separates words and is preserved. */
  children: string;
  /** Stagger delay between characters (seconds). */
  charDelay?: number;
  /** Optional className applied to the wrapping span. */
  className?: string;
  /** Overall delay before the first char animates (seconds). */
  delay?: number;
  /** Duration per character (seconds). */
  duration?: number;
  /** Trigger mode: "load" (animate once on mount) or "scroll" (on inView). */
  trigger?: "load" | "scroll";
  /** Amount of element in viewport before scroll trigger fires (0–1). */
  viewportAmount?: number;
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Letter-by-letter mask reveal — each character sits inside an
 * overflow-hidden mask and slides up from 110% to 0 with stagger.
 *
 * Characters are grouped into word-spans (display: inline-block) so a
 * word never breaks across a line mid-character. Spaces between words
 * are rendered as separate inline tokens that the browser can break on.
 */
export function SplitText({
  children,
  charDelay = 0.025,
  className,
  delay = 0,
  duration = 0.7,
  trigger = "load",
  viewportAmount = 0.4,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const id = useId();

  if (reduce) {
    return (
      <span aria-label={children} className={className}>
        {children}
      </span>
    );
  }

  const words = splitIntoWords(children);

  const charVariants = {
    hidden: { y: "110%" },
    show: { y: 0 },
  };

  const triggerProps =
    trigger === "scroll"
      ? ({
          initial: "hidden",
          viewport: { amount: viewportAmount, once: true },
          whileInView: "show",
        } as const)
      : ({
          animate: "show",
          initial: "hidden",
        } as const);

  let charIndex = 0;

  return (
    <span aria-label={children} className={className}>
      <motion.span
        aria-hidden="true"
        className="inline-block"
        {...triggerProps}
      >
        {words.map((token, tokenIndex) => {
          if (token.kind === "space") {
            // Preserve a real space character (browser may break here).
            return (
              <span
                aria-hidden="true"
                key={`${id}-sp-${tokenIndex}`}
              >
                {" "}
              </span>
            );
          }
          // Word: render chars side-by-side inside an inline-block span
          // so the word cannot break mid-character.
          const chars = Array.from(token.text);
          return (
            <span
              className="inline-block whitespace-nowrap align-top"
              key={`${id}-w-${tokenIndex}`}
            >
              {chars.map((char) => {
                const ci = charIndex++;
                return (
                  <span
                    className="inline-block overflow-hidden align-top"
                    key={`${id}-c-${ci}`}
                  >
                    <motion.span
                      className="inline-block"
                      transition={{
                        delay: delay + ci * charDelay,
                        duration,
                        ease: easeOut,
                      }}
                      variants={charVariants}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}

type Token =
  | { kind: "word"; text: string }
  | { kind: "space" };

function splitIntoWords(text: string): Token[] {
  const tokens: Token[] = [];
  let current = "";
  for (const char of text) {
    if (char === " " || char === "\t" || char === "\n") {
      if (current) {
        tokens.push({ kind: "word", text: current });
        current = "";
      }
      tokens.push({ kind: "space" });
    } else {
      current += char;
    }
  }
  if (current) tokens.push({ kind: "word", text: current });
  return tokens;
}
