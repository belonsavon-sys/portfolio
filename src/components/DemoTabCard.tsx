"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

export type DemoLoadStatus = "idle" | "loading" | "ready" | "error";
export type DemoRunStatus = "idle" | "running" | "complete";

export type DemoTabCardProps = {
  badge: string;
  children: ReactNode;
  description: string;
  howItWorks?: ReactNode;
  loadProgress?: number;
  loadStatus: DemoLoadStatus;
  onLoad: () => void;
  runStatus?: DemoRunStatus;
  title: string;
};

const statusMeta: Record<
  DemoLoadStatus,
  { color: string; dotPulse?: boolean; label: string; ring: string }
> = {
  error: {
    color: "bg-problem-red",
    label: "Error",
    ring: "ring-problem-red/30",
  },
  idle: {
    color: "bg-text-dark-muted",
    label: "Idle · awaiting load",
    ring: "ring-text-dark-muted/20",
  },
  loading: {
    color: "bg-accent-light",
    dotPulse: true,
    label: "Loading model",
    ring: "ring-accent-light/30",
  },
  ready: {
    color: "bg-result-green",
    dotPulse: true,
    label: "Ready · running locally",
    ring: "ring-result-green/30",
  },
};

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function DemoTabCard({
  badge,
  children,
  description,
  howItWorks,
  loadProgress,
  loadStatus,
  onLoad,
  title,
}: DemoTabCardProps) {
  const reduce = useReducedMotion();
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const meta = statusMeta[loadStatus];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[rgba(41,110,214,0.22)] bg-bg-dark-2/85 backdrop-blur-md"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      {/* Ambient accent glow in the top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />

      {/* HEADER — title on left, meta strip on right */}
      <div className="relative grid gap-6 border-b border-[rgba(41,110,214,0.18)] p-6 sm:grid-cols-[1fr_auto] sm:p-9">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
            Local AI · running on {badge.split(" · ").pop()?.toLowerCase()}
          </p>
          <h3 className="display-text mt-3 max-w-3xl text-text-dark">
            {title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-dark-muted sm:text-base">
            {description}
          </p>
        </div>

        {/* META RAIL */}
        <div className="grid gap-3 sm:min-w-[240px] sm:border-l sm:border-[rgba(41,110,214,0.2)] sm:pl-6">
          {(() => {
            const parts = badge.split(" · ");
            // Expect: [model, size?, runtime]
            const model = parts[0] ?? "—";
            const runtime = parts[parts.length - 1] ?? "—";
            const size = parts.length >= 3 ? parts[parts.length - 2] : null;
            return (
              <>
                <MetaRow label="Model" value={model} />
                {size ? <MetaRow label="Size" value={size} /> : null}
                <MetaRow label="Runtime" value={runtime} />
              </>
            );
          })()}
          <div className="mt-1 flex items-center gap-2.5 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark/50 px-3 py-2.5">
            <span className="relative inline-flex h-2.5 w-2.5">
              {meta.dotPulse ? (
                <span
                  className={`absolute inset-0 animate-ping rounded-full ${meta.color} opacity-60`}
                />
              ) : null}
              <span
                className={`relative inline-block h-2.5 w-2.5 rounded-full ${meta.color} ring-4 ${meta.ring}`}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dark">
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="relative p-6 sm:p-9">
        {loadStatus === "idle" ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-5">
            <motion.button
              animate={
                reduce
                  ? undefined
                  : { boxShadow: [
                      "0 0 0 0 rgba(41,110,214,0.0)",
                      "0 0 0 14px rgba(41,110,214,0.0)",
                    ] }
              }
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-accent/40 bg-gradient-to-br from-accent to-accent-deep px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(41,110,214,0.6)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-18px_rgba(41,110,214,0.8)]"
              onClick={onLoad}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
              type="button"
            >
              {/* Sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <DownloadIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
              <span className="relative">Load Model</span>
              <span
                aria-hidden="true"
                className="relative font-mono text-xs font-normal uppercase tracking-[0.22em] text-white/70"
              >
                ↩
              </span>
            </motion.button>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted">
              First download is cached · subsequent runs are instant
            </p>
          </div>
        ) : null}

        {loadStatus === "loading" ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-5">
            <div className="w-full max-w-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
                  Downloading model
                </span>
                <span className="font-mono text-sm font-semibold text-text-dark">
                  {Math.round(loadProgress ?? 0)}%
                </span>
              </div>
              <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                <motion.div
                  animate={{ width: `${loadProgress ?? 0}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                  initial={false}
                  transition={{ duration: 0.4, ease: easeOut }}
                />
                {/* Indeterminate sheen on top of the determinate bar */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full animate-[marquee_1.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
                Streaming directly from the model registry to your browser cache
              </p>
            </div>
          </div>
        ) : null}

        {loadStatus === "ready" || loadStatus === "error" ? (
          <div>{children}</div>
        ) : null}
      </div>

      {howItWorks ? (
        <div className="border-t border-[rgba(41,110,214,0.18)]">
          <button
            aria-expanded={howItWorksOpen}
            className="group flex w-full items-center justify-between gap-4 p-5 px-6 text-left transition-colors hover:bg-[rgba(41,110,214,0.06)] sm:px-9"
            onClick={() => setHowItWorksOpen((v) => !v)}
            type="button"
          >
            <span className="flex items-center gap-3">
              <ChevronIcon
                className={`h-4 w-4 text-accent-light transition-transform duration-300 ${
                  howItWorksOpen ? "rotate-180" : ""
                }`}
              />
              <span className="font-mono text-xs uppercase tracking-[0.28em] text-text-dark-muted group-hover:text-text-dark">
                How it works
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
              {howItWorksOpen ? "Hide" : "Expand"}
            </span>
          </button>
          {howItWorksOpen ? (
            <div className="border-t border-[rgba(41,110,214,0.12)] p-6 text-sm leading-7 text-text-dark-muted sm:px-9">
              {howItWorks}
            </div>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dark-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-text-dark">
        {value}
      </p>
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
