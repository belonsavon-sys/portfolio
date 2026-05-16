"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AvailabilityCta,
  Button,
  ChapterRail,
  GlitchTitle,
  HeroSplitTitle,
  ParallaxGhost,
  SiteFooter,
  StaggeredChipRail,
} from "@/components";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/components/contact-config";
// Page content comes from the same module the downloadable PDF
// (/api/resume) consumes — keeps both surfaces in sync.
import {
  education,
  experience,
  languages,
  professionalSummary,
  projects,
  skillGroups,
  type ExperienceEntry,
  type ProjectEntry,
} from "@/data/resume";

/* /resume — long-form editorial profile.
 *
 * Pure white surface. Generous editorial typography. Drop caps on
 * opening paragraphs, Fraunces italic pull quotes, mono dateline
 * strip at the top, sticky section index when scrolled. The hero
 * stays locked to the welcome pattern; GlitchTitle is the section
 * header convention. */

const contactItems = [
  { href: EMAIL_MAILTO, label: "Email", value: EMAIL_DISPLAY },
  { href: PHONE_TEL, label: "Phone", value: PHONE_DISPLAY },
  { href: GITHUB_URL, label: "GitHub", value: "github.com/belonsavon-sys" },
  ...(LINKEDIN_URL
    ? [
        {
          href: LINKEDIN_URL,
          label: "LinkedIn",
          value: LINKEDIN_URL.replace(/^https?:\/\//, ""),
        },
      ]
    : []),
];

const easeOutCurve = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Years building since Pierre's first AI-shipping role. */
function yearsBuilding(): string {
  const start = new Date("2024-04-01T00:00:00Z").getTime();
  const diffYears = (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000);
  return diffYears.toFixed(1);
}

/** Format today as `14 May 2026` for the dateline strip. */
function todayDateline(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Bold-emphasize metric-bearing substrings inside an Experience or
 * Project bullet so the proof scans fast.
 */
function highlightMetrics(text: string): React.ReactNode[] {
  const patterns = [
    /\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|minutes?|mins?|months?|seconds?|secs?|weeks?|days?|years?)\b/gi,
    /\b\d+\+?\s*(?:pages?|staff|products?|properties|reviews?|companies?|projects?|languages?)\b/gi,
    /\b(?:top\s+)?\d+(?:\.\d+)?%|\b\d+-star|\d+\/\d+/gi,
    /\b(?:Airbnb Guest Favorites?|Travelers' Choice(?:\s+Award)?|VRBO Premier(?: Partner)?)\b/g,
    /\bError-free\b/g,
    /\$\d[\d,]*(?:\.\d+)?\b/g,
    /<\s*\d+(?:\.\d+)?\s*(?:hours?|hrs?|minutes?|mins?|s)\b/gi,
  ];
  type Range = { end: number; start: number };
  const ranges: Range[] = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      ranges.push({ end: m.index + m[0].length, start: m.index });
      if (m[0].length === 0) pattern.lastIndex += 1;
    }
  }
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Range[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start < last.end) continue;
    merged.push(r);
  }
  if (merged.length === 0) return [text];
  const out: React.ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < merged.length; i += 1) {
    const range = merged[i];
    if (range.start > cursor) out.push(text.slice(cursor, range.start));
    out.push(
      <strong className="font-semibold text-text-light" key={`m-${range.start}`}>
        {text.slice(range.start, range.end)}
      </strong>,
    );
    cursor = range.end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <ResumeHero />

      <article className="mx-auto w-full max-w-4xl px-4 pb-32 sm:px-6 lg:px-8">
        <Dateline />

        <Section
          id="summary"
          index="00"
          meta="// 6 years building · trilingual"
          title="Summary"
        >
          <SummaryEditorial />
        </Section>

        <Section
          id="experience"
          index="01"
          meta="// 2 roles · both current"
          title="Experience"
        >
          <ExperienceEditorial />
        </Section>

        <Section
          id="projects"
          index="02"
          meta="// 3 active · personal"
          title="Independent Projects"
        >
          <ProjectsEditorial />
        </Section>

        <Section
          id="skills"
          index="03"
          meta="// 4 categories"
          title="Skills"
        >
          <SkillsEditorial />
        </Section>

        <Section
          id="education"
          index="04"
          meta="// IBM cert · in progress"
          title="Education"
        >
          <EducationEditorial />
        </Section>

        <Section
          id="contact"
          index="05"
          meta="// 4 channels · I reply"
          title="Contact"
        >
          <ContactEditorial />
        </Section>
      </article>

      <AvailabilityCta />

      <ChapterRail
        sections={[
          { id: "summary", index: "00", label: "Summary" },
          { id: "experience", index: "01", label: "Experience" },
          { id: "projects", index: "02", label: "Projects" },
          { id: "skills", index: "03", label: "Skills" },
          { id: "education", index: "04", label: "Education" },
          { id: "contact", index: "05", label: "Contact" },
        ]}
      />

      <SiteFooter />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * HERO — locked welcome pattern.
 * ────────────────────────────────────────────────────────────── */

function ResumeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            color: "transparent",
            fontSize: "clamp(6rem, 20vw, 20rem)",
            WebkitTextStroke: "1px rgba(41,110,214,0.10)",
          }}
        >
          RÉSUMÉ
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="flex flex-wrap items-center justify-center gap-3 pb-12">
          <span className="font-mono text-[11px] text-text-light-muted">
            — long-form profile · {todayDateline()}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] text-accent">
            06 sections · ~4 min read
          </span>
        </div>

        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2rem, 7.5vw, 6rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="Pierre Belon Savon." />
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-md"
            />
          </span>
          <span
            aria-hidden="true"
            className="hero-cursor ml-2 -translate-y-[0.1em] align-middle bg-accent"
            style={{
              display: "inline-block",
              height: "0.85em",
              width: "0.08em",
            }}
          />
        </h1>

        <div className="mx-auto mt-10 flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-accent" />
          <p className="font-mono text-xs text-accent sm:text-sm">
            AI Engineer · Building production systems
          </p>
          <span aria-hidden="true" className="h-px w-10 bg-accent" />
        </div>

        <div className="mt-6 flex justify-center">
          <StaggeredChipRail
            baseDelay={0.5}
            chips={["Ocean Shores, WA", "Remote roles", "Freelance projects"]}
            className="flex flex-wrap items-center justify-center gap-2"
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            className="!px-8 !py-4 !text-base"
            download
            downArrow
            href="/api/resume"
          >
            Download my résumé
          </Button>
          <p className="font-mono text-[10px] text-text-light-muted">
            PDF · One page
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * DATELINE — a slim editorial strip under the hero with byline,
 * filing location, date, and reading time.
 * ────────────────────────────────────────────────────────────── */

function Dateline() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-border-light py-3 font-mono text-[11px] tracking-[0.16em] text-text-light-muted"
      initial={reduce ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.5, ease: easeOutCurve }}
    >
      <span>— by P. Belon Savon</span>
      <span>· Ocean Shores, WA</span>
      <span>· {todayDateline()}</span>
      <span className="ml-auto text-accent">06 sections</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * SECTION — editorial wrapper. GlitchTitle row + a giant stroked
 * numeral on the right margin + the section body + a small end mark.
 * ────────────────────────────────────────────────────────────── */

function Section({
  children,
  id,
  index,
  meta,
  title,
}: {
  children: ReactNode;
  id: string;
  index: string;
  meta?: string;
  title: string;
}) {
  return (
    <section
      className="relative mt-20 scroll-mt-28 first:mt-12 sm:mt-24"
      id={id}
    >
      {/* DECORATIVE NUMERAL — sits in the upper-right margin */}
      <span
        aria-hidden="true"
        className="editorial-numeral pointer-events-none absolute right-0 -top-4 select-none"
        style={{ fontSize: "clamp(5rem, 12vw, 12rem)" }}
      >
        {index}
      </span>

      <GlitchTitle chapter={index} meta={meta} title={title} />

      <div className="mt-10">{children}</div>

      <SectionEndMark />
    </section>
  );
}

function SectionEndMark() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-12 flex justify-center" ref={ref}>
      <span
        aria-hidden="true"
        className={`editorial-mark ${on ? "editorial-mark-on" : ""}`}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 00 SUMMARY
 * ────────────────────────────────────────────────────────────── */

function SummaryEditorial() {
  return (
    <div className="grid gap-8">
      <p className="editorial-dropcap text-lg leading-9 text-text-light sm:text-xl sm:leading-10">
        {professionalSummary}
      </p>

      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-border-light pt-6 font-mono text-[11px] tracking-[0.16em] text-text-light-muted">
        <span>— building since</span>
        <span>
          <span className="font-semibold text-text-light tabular-nums">
            {yearsBuilding()}
          </span>{" "}
          yrs · apr 2024
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span>{languages.map((l) => l).join(" · ")}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 01 EXPERIENCE
 *
 * Each role is rendered as an editorial mini-article:
 *   • huge company name (Geist semibold display)
 *   • mono caps-tracked dateline (PERIOD · LOCATION · ROLE)
 *   • Fraunces italic pull-quote summary
 *   • drop-cap-opening body via bulleted spec list
 *   • "FILED" receipts link
 *   • hover-tracked accent rail on the left margin
 * ────────────────────────────────────────────────────────────── */

function ExperienceEditorial() {
  return (
    <ol className="grid gap-24">
      {experience.map((entry, i) => (
        <RoleEntry entry={entry} index={i} key={entry.company} />
      ))}
    </ol>
  );
}

function RoleEntry({
  entry,
  index,
}: {
  entry: ExperienceEntry;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="group relative grid grid-cols-[8px_minmax(0,1fr)] gap-x-6 sm:grid-cols-[12px_minmax(0,1fr)]"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: easeOutCurve }}
      viewport={{ amount: 0.15, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      {/* LEFT RAIL — quiet hairline that brightens to accent on hover */}
      <span
        aria-hidden="true"
        className="h-full w-px self-stretch justify-self-end bg-border-light transition-colors duration-300 group-hover:bg-accent"
      />

      <div className="min-w-0">
        {/* DATELINE */}
        <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
          — role {String(index + 1).padStart(2, "0")}
          {entry.featured ? (
            <>
              {" · "}
              <span className="text-result-green">now · active</span>
            </>
          ) : null}
        </p>

        {/* COMPANY DISPLAY */}
        <h3
          className="mt-3 font-semibold tracking-tight text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          {entry.company}
          <span className="text-accent">.</span>
        </h3>

        {/* MONO META ROW */}
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-text-light-muted">
          <span className="text-accent">{entry.role}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.period}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.location}</span>
        </p>

        {/* PULL QUOTE */}
        <p
          className="editorial-pull-quote mt-7 text-text-light"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
        >
          &ldquo;{entry.summary}&rdquo;
        </p>

        {/* BODY SPEC LIST */}
        <ul className="mt-8 grid gap-3 border-t border-border-light pt-6">
          {entry.bullets.map((bullet) => (
            <li
              className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-3 text-[14.5px] leading-7 text-text-light-muted sm:text-[15px] sm:leading-8"
              key={bullet}
            >
              <span aria-hidden="true" className="mt-3 h-px bg-accent/50" />
              <span>{highlightMetrics(bullet)}</span>
            </li>
          ))}
        </ul>

        {/* FILED RECEIPTS */}
        {entry.receipts ? (
          <p className="mt-7 font-mono text-[11px] tracking-[0.16em] text-text-light-muted">
            — filed ↗{" "}
            <a
              className="text-text-light underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              href={entry.receipts.href}
            >
              {entry.receipts.label}
            </a>
          </p>
        ) : null}
      </div>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 02 PROJECTS
 *
 * Three editorial mini-entries, each with a Geist-display name +
 * mono SHIPPED · STATUS row + body paragraph + stack as small
 * lower-case mono chips.
 * ────────────────────────────────────────────────────────────── */

function ProjectsEditorial() {
  return (
    <ol className="grid gap-14">
      {projects.map((entry, i) => (
        <ProjectEntry entry={entry} index={i} key={entry.name} />
      ))}
    </ol>
  );
}

function ProjectEntry({
  entry,
  index,
}: {
  entry: ProjectEntry;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="grid gap-3"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: easeOutCurve }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
        — project {String(index + 1).padStart(2, "0")} · personal
      </p>
      <h3
        className="font-semibold tracking-tight text-text-light"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}
      >
        {entry.name}
        <span className="text-accent">.</span>
      </h3>
      <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text-light-muted">
        <span className="inline-flex items-center gap-1.5">
          {entry.status === "active" ? (
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-result-green"
            />
          ) : (
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-text-light-muted"
            />
          )}
          {entry.status === "active" ? "Active" : "Archived"}
        </span>
        <span aria-hidden="true">·</span>
        <span>Shipped {entry.shipped}</span>
        <span aria-hidden="true">·</span>
        <span>{entry.scope}</span>
      </p>
      {entry.bullets.map((bullet) => (
        <p
          className="text-[14.5px] leading-7 text-text-light-muted sm:text-[15px] sm:leading-8"
          key={bullet}
        >
          {bullet}
        </p>
      ))}
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.14em] text-text-light-muted">
        {entry.stack.map((tech, j) => (
          <li className="inline-flex items-baseline gap-2" key={tech}>
            <span>{tech.toLowerCase()}</span>
            {j < entry.stack.length - 1 ? (
              <span aria-hidden="true" className="text-text-light-muted/40">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 03 SKILLS
 *
 * 4 groups, rendered as editorial subsections with a numbered title
 * + a single comma-separated paragraph (not a list — reads more
 * like prose). Mono labels above.
 * ────────────────────────────────────────────────────────────── */

function SkillsEditorial() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {skillGroups.map((group, i) => (
        <div className="grid gap-3" key={group.title}>
          <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
            — group {String(i + 1).padStart(2, "0")}
          </p>
          <h3
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            {group.title}
          </h3>
          <ul className="grid gap-2 pt-1">
            {group.items.map((item) => (
              <li
                className="grid grid-cols-[16px_minmax(0,1fr)] items-baseline gap-3 text-[14px] leading-7 text-text-light-muted"
                key={item}
              >
                <span aria-hidden="true" className="font-mono text-accent">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 04 EDUCATION
 *
 * Two entries, clean editorial style. No more wax-seal stamps. Big
 * program name, mono meta row underneath.
 * ────────────────────────────────────────────────────────────── */

function EducationEditorial() {
  return (
    <ol className="grid gap-10">
      {education.map((entry, i) => (
        <li className="grid gap-2" key={entry.program}>
          <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
            — entry {String(i + 1).padStart(2, "0")} ·{" "}
            <span
              className={
                entry.status === "In progress"
                  ? "text-result-green"
                  : "text-text-light-muted"
              }
            >
              {entry.status.toLowerCase()}
            </span>
          </p>
          <h3
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            {entry.program}
          </h3>
          <p className="text-[14.5px] leading-7 text-text-light-muted sm:text-[15px]">
            {entry.issuer}
          </p>
          <p className="font-mono text-[11px] tracking-[0.16em] text-text-light-muted">
            {entry.meta}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 05 CONTACT
 *
 * A short editorial blurb followed by 4 large-display channels.
 * Each channel is a clean editorial link with a mono label above.
 * ────────────────────────────────────────────────────────────── */

function ContactEditorial() {
  return (
    <div className="grid gap-10">
      <p className="text-lg leading-9 text-text-light sm:text-xl sm:leading-10">
        Open to AI engineering roles, co-founding conversations, and advisory
        engagements. Best route is email — every message gets a real reply
        within 48 hours.
      </p>

      <ol className="grid divide-y divide-border-light border-y border-border-light">
        {contactItems.map((item, i) => (
          <li className="group/c" key={item.label}>
            <a
              className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 sm:py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href={item.href}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              target={item.href.startsWith("http") ? "_blank" : undefined}
            >
              <span className="col-span-2 flex items-baseline gap-2 sm:col-span-1">
                <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="col-span-10 flex items-baseline gap-3 sm:col-span-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
                  — {item.label.toLowerCase()}
                </span>
              </span>
              <span className="col-span-12 sm:col-span-8">
                <span
                  className="block font-semibold tracking-tight text-text-light transition-colors duration-200 group-hover/c:text-accent"
                  style={{
                    fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                  }}
                >
                  {item.value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="font-mono text-[11px] leading-7 text-text-light-muted">
        // based in Washington · open to remote and relocation · timezone PT
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          className="!px-6 !py-3 !text-sm"
          download
          downArrow
          href="/api/resume"
        >
          Download my résumé
        </Button>
        <span className="font-mono text-[11px] tracking-[0.16em] text-text-light-muted">
          — PDF · one page · recruiter-ready
        </span>
      </div>
    </div>
  );
}
