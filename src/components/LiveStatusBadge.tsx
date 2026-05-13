export type LiveStatusBadgeProps = {
  className?: string;
  label: string;
  tone?: "green" | "accent";
};

/**
 * Editorial status caption. Reads as a byline note, not a badge:
 * lowercase mono, an em-dash divider before the label, status
 * color carried only by the *text* itself — no rounded pill, no
 * ping ring, no border. Replaces the old animated rounded-full chip.
 */
export function LiveStatusBadge({
  className = "",
  label,
  tone = "green",
}: LiveStatusBadgeProps) {
  const toneClass =
    tone === "green" ? "text-result-green" : "text-accent-light";
  const normalized = label.toLowerCase();

  return (
    <span
      className={`inline-flex items-baseline gap-2 font-mono text-[11px] ${toneClass} ${className}`}
    >
      <span aria-hidden="true" className="opacity-70">
        —
      </span>
      <span>{normalized}</span>
    </span>
  );
}
