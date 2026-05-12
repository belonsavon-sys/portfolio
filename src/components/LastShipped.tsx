"use client";

import { useEffect, useState } from "react";

/**
 * "Last shipped: 4 min ago · 8290a5d" pill for the footer.
 * Reads NEXT_PUBLIC_BUILD_TIME + NEXT_PUBLIC_BUILD_SHA captured in
 * next.config.ts at build time. Re-renders the "X ago" string every
 * 30s so the value stays current while the page is open.
 */
export function LastShipped() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev";
  const [now, setNow] = useState<number | null>(null);

  // Defer all relative-time formatting to the client to avoid SSR/CSR
  // mismatch on the "X ago" text.
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!buildTime) return null;

  const buildDate = new Date(buildTime);
  const shortSha =
    buildSha === "dev"
      ? "dev"
      : buildSha.slice(0, 7);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-result-green/30 bg-[rgba(16,185,129,0.08)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-result-green backdrop-blur-md"
      title={`Built ${buildDate.toLocaleString()} · commit ${buildSha}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
        <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-result-green" />
      </span>
      <span>
        Last shipped <span className="text-result-green/70">·</span>{" "}
        {now ? timeAgo(buildDate, now) : "…"}
      </span>
      <span aria-hidden="true" className="text-result-green/40">
        /
      </span>
      <span className="text-result-green/80">{shortSha}</span>
    </span>
  );
}

function timeAgo(then: Date, now: number) {
  const seconds = Math.max(0, Math.round((now - then.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} wk ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.round(days / 365);
  return `${years} yr ago`;
}
