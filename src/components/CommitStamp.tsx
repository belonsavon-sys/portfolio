"use client";

/**
 * Dark-mode-only git watermark, fixed top-right. Reads from the
 * same NEXT_PUBLIC_BUILD_RECENT_COMMITS env the CommitTicker uses;
 * falls back to a static "main · live" if not populated.
 *
 * Visibility is driven entirely by CSS — see .commit-stamp rules
 * in globals.css. The element renders at all times; .commit-stamp
 * has `display: none` by default and `display: block` under
 * body.dark.
 */
export function CommitStamp() {
  let label = "main · live";
  try {
    const raw = process.env.NEXT_PUBLIC_BUILD_RECENT_COMMITS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0] as { sha?: string; when?: string };
        if (first.sha && first.when) {
          label = `${first.sha} · ${first.when}`;
        }
      }
    }
  } catch {
    // ignore — fall back to static label
  }

  return (
    <span
      aria-hidden="true"
      className="commit-stamp pointer-events-none fixed right-3 top-3 z-40 font-mono text-[10px] tracking-[0.06em] text-accent-light/55"
    >
      <span className="text-accent-light/40">$ git log -1 · </span>
      {label}
    </span>
  );
}
