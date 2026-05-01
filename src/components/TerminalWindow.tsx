"use client";

import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";

export type TerminalLine = {
  kind?: "command" | "output";
  text: string;
};

export type TerminalWindowProps = HTMLAttributes<HTMLDivElement> & {
  linePauseMs?: number;
  lines: TerminalLine[];
  showReadyPrompt?: boolean;
  title?: string;
  typingSpeedMs?: number;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TerminalWindow({
  className,
  linePauseMs = 350,
  lines,
  showReadyPrompt = true,
  title = "atlas",
  typingSpeedMs = 28,
  ...props
}: TerminalWindowProps) {
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [activeText, setActiveText] = useState("");

  useEffect(() => {
    const activeLine = lines[activeLineIndex];

    if (!activeLine) {
      return;
    }

    if (activeText.length < activeLine.text.length) {
      const timeout = window.setTimeout(() => {
        setActiveText(activeLine.text.slice(0, activeText.length + 1));
      }, typingSpeedMs);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setActiveLineIndex((index) => index + 1);
      setActiveText("");
    }, linePauseMs);

    return () => window.clearTimeout(timeout);
  }, [activeLineIndex, activeText, linePauseMs, lines, typingSpeedMs]);

  return (
    <div
      className={cx("overflow-hidden rounded-xl bg-bg-dark-2", className)}
      {...props}
    >
      <div className="flex h-9 items-center gap-1.5 bg-[#1E2433] px-3">
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-problem-red"
        />
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-[#F59E0B]"
        />
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-result-green"
        />
        <span className="ml-auto font-mono text-xs text-text-dark-muted">
          {title}
        </span>
      </div>

      <div
        aria-live="polite"
        className="min-h-48 p-4 font-mono text-sm leading-[1.6]"
        role="log"
      >
        {lines.map((line, index) => {
          const isComplete = index < activeLineIndex;
          const isActive = index === activeLineIndex;
          const visibleText = isActive ? activeText : isComplete ? line.text : "";

          if (!visibleText && !isActive) {
            return null;
          }

          return (
            <p
              className={cx(
                isActive && "text-accent",
                isComplete &&
                  (line.kind === "output"
                    ? "text-text-dark"
                    : "text-text-dark-muted"),
              )}
              key={`${line.text}-${index}`}
            >
              {visibleText}
              {isActive ? <TerminalCursor /> : null}
            </p>
          );
        })}

        {showReadyPrompt && activeLineIndex >= lines.length ? (
          <p className="text-text-dark">
            $ <TerminalCursor />
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TerminalCursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block animate-[terminal-blink_1s_step-end_infinite]"
    >
      █
    </span>
  );
}
