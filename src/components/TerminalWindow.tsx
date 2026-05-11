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
      className={cx(
        "scanlines overflow-hidden rounded-xl border border-[rgba(41,110,214,0.18)] bg-[#0B1020] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className,
      )}
      {...props}
    >
      {/* TITLE BAR — traffic-light controls + center title + tab style */}
      <div className="flex h-9 items-center gap-1.5 border-b border-[rgba(41,110,214,0.15)] bg-gradient-to-b from-[#1E2433] to-[#171C2C] px-3">
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-problem-red/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
        />
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-[#F59E0B]/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
        />
        <span
          aria-hidden="true"
          className="h-3 w-3 rounded-full bg-result-green/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
        />
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-[rgba(255,255,255,0.06)] px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-text-dark/80">
          <span className="text-accent-light">~/</span>
          {title}
          <span className="text-accent-light">.sh</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
          tty
        </span>
      </div>

      <div
        aria-live="polite"
        className="min-h-48 px-4 py-4 font-mono text-[13px] leading-[1.7]"
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
                "flex items-baseline gap-2",
                isActive && "text-accent-light",
                isComplete &&
                  (line.kind === "output"
                    ? "text-text-dark"
                    : "text-text-dark-muted"),
              )}
              key={`${line.text}-${index}`}
            >
              <span aria-hidden="true" className="text-accent/70">
                ›
              </span>
              <span className="min-w-0 break-all">
                {visibleText}
                {isActive ? <TerminalCursor /> : null}
              </span>
            </p>
          );
        })}

        {showReadyPrompt && activeLineIndex >= lines.length ? (
          <p className="flex items-baseline gap-2 text-text-dark">
            <span aria-hidden="true" className="text-accent">
              $
            </span>
            <TerminalCursor />
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
      className="ml-0.5 inline-block w-[8px] animate-[terminal-blink_1s_step-end_infinite] bg-accent-light"
      style={{ height: "1em", verticalAlign: "-2px" }}
    />
  );
}
