"use client";

export type GlitchTitleProps = {
  /** Optional chapter index, e.g. "03". Rendered mono-accent on the left. */
  chapter?: string;
  /** Optional eyebrow label, e.g. "Uses". Joined to the chapter with a `·`. */
  eyebrow?: string;
  /** The visible section title. Always rendered — never hidden by the animation. */
  title: string;
  /** Meta caption that flashes in during the glitch beat (every ~5s).
   * Convention: prefix with `// ` so it reads as a code comment. */
  meta?: string;
  /** Optional anchor id for scroll-to. */
  id?: string;
  /** Background tone — flips the line + text colors for dark sections. */
  tone?: "light" | "dark";
  /** Extra classes on the outer row. */
  className?: string;
};

/**
 * Section header rendered as a hairline that the title sits on. The
 * title stays readable at all times; the line jitters every 5s, the
 * title gets a brief chromatic-aberration flicker, and the meta
 * caption slides in from the right, pushing the line shorter for ~1s
 * before snapping back.
 *
 * Keyframes live in globals.css (`.glitch-title-*`). The reduced-motion
 * fallback freezes everything and hides the meta entirely.
 */
export function GlitchTitle({
  chapter,
  eyebrow,
  title,
  meta,
  id,
  tone = "light",
  className = "",
}: GlitchTitleProps) {
  const dark = tone === "dark";
  return (
    <div className={`glitch-title-row ${className}`} id={id}>
      {chapter ? (
        <span className="glitch-title-chapter">
          {chapter}
          {eyebrow ? ` · ${eyebrow}` : ""}
        </span>
      ) : null}
      <h2
        className={`glitch-title-text ${dark ? "glitch-title-text-dark" : ""}`}
      >
        {title}
      </h2>
      <span
        aria-hidden="true"
        className={`glitch-title-line ${dark ? "glitch-title-line-dark" : ""}`}
      />
      {meta ? (
        <span
          aria-hidden="true"
          className={`glitch-title-meta ${dark ? "glitch-title-meta-dark" : ""}`}
        >
          {meta}
        </span>
      ) : null}
    </div>
  );
}
