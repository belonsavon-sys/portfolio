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

const statusDot: Record<DemoLoadStatus, { color: string; label: string }> = {
  error: { color: "bg-problem-red", label: "Error" },
  idle: { color: "bg-text-dark-muted", label: "Not loaded" },
  loading: { color: "animate-pulse bg-accent-light", label: "Loading" },
  ready: { color: "bg-result-green", label: "Loaded" },
};

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
  const dot = statusDot[loadStatus];

  return (
    <motion.div
      animate={reduce ? { opacity: 1 } : undefined}
      className="rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2/85 backdrop-blur-md"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(41,110,214,0.18)] p-6 sm:p-8">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-dark-muted">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-text-dark">
            {badge}
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot.color}`} />
            {dot.label}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {loadStatus === "idle" ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-4">
            <button
              className="group inline-flex items-center gap-2 rounded-lg border border-[rgba(41,110,214,0.4)] bg-bg-dark/60 px-6 py-3 text-sm font-semibold text-text-dark transition-[border-color,background,transform] duration-150 hover:-translate-y-0.5 hover:border-accent hover:bg-bg-dark"
              onClick={onLoad}
              type="button"
            >
              <DownloadIcon className="h-4 w-4 text-accent-light transition-transform duration-150 group-hover:translate-y-0.5" />
              Load Model
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dark-muted">
              Model downloads on first run, then cached
            </p>
          </div>
        ) : null}

        {loadStatus === "loading" ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-4">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-light">
                  Downloading model
                </span>
                <span className="font-mono text-xs text-text-dark">
                  {Math.round((loadProgress ?? 0))}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-[width] duration-300"
                  style={{ width: `${loadProgress ?? 0}%` }}
                />
              </div>
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
            className="flex w-full items-center justify-between p-4 px-6 text-left text-sm text-text-dark-muted transition-colors hover:text-text-dark sm:px-8"
            onClick={() => setHowItWorksOpen((v) => !v)}
            type="button"
          >
            <span className="flex items-center gap-2">
              <ChevronIcon
                className={`h-4 w-4 transition-transform ${
                  howItWorksOpen ? "rotate-180" : ""
                }`}
              />
              How it works
            </span>
          </button>
          {howItWorksOpen ? (
            <div className="border-t border-[rgba(41,110,214,0.12)] p-6 text-sm leading-6 text-text-dark-muted sm:px-8">
              {howItWorks}
            </div>
          ) : null}
        </div>
      ) : null}
    </motion.div>
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
