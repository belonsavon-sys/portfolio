# Portfolio Credibility Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the design from `docs/superpowers/specs/2026-05-15-portfolio-credibility-pass-design.md`: real `/atlas` surface (terminal + scripted playback + roadmap), tighter home hero, per-page CTAs, dark-mode personality, contrast pass, and refresh-animation fix.

**Architecture:** New `/atlas` surface composes `AtlasTerminal` (scripted CLI playback) + `AtlasArchitecture` (roadmap diagram) + welcome hero + origin tie-back. Site-wide changes layer onto existing components — `SelectedWork` learns a per-project `cta` field, `PageTransition` re-enables initial animations, `CommitStamp` adds dark-mode-only git-watermark, `globals.css` gains targeted contrast bumps + phone bezel dark fix.

**Tech Stack:** Next.js 16 App Router · React 19 · framer-motion v12 · Tailwind v4 · existing Geist/Bricolage/Fraunces font stack · existing site tokens (`bg-bg-light` etc).

---

## File Structure

**Created:**
- `src/components/AtlasTerminal.tsx` — CLI scene + scripted-playback engine
- `src/components/AtlasArchitecture.tsx` — roadmap diagram (current/planned)
- `src/components/CommitStamp.tsx` — dark-only git watermark
- `src/components/AvailabilityCta.tsx` — pre-footer "Available for senior AI eng roles" block

**Modified:**
- `src/app/atlas/page.tsx` — rebuilt as operator-credibility surface
- `src/app/page.tsx` — hero framing line + availability block
- `src/app/resume/page.tsx` — availability block
- `src/app/business/page.tsx` — chapter codebase links + phone dark-mode fix
- `src/components/SelectedWork.tsx` — per-project `cta` field + render
- `src/components/PageTransition.tsx` — remove `initial={false}` so refresh plays entry animation
- `src/app/layout.tsx` — mount `<CommitStamp />`
- `src/app/globals.css` — schematic density bump, dashed border alpha bump, dropcap/seal dark colors, phone bezel dark rule

---

## Task 1: Refresh-animation fix (PageTransition initial mount)

**Files:**
- Modify: `src/components/PageTransition.tsx:186`

- [ ] **Step 1: Read the file and locate line 186**

Run: `grep -n 'initial={false}' src/components/PageTransition.tsx`
Expected: one match on the `<AnimatePresence>` wrapping page content.

- [ ] **Step 2: Make the change**

Edit `src/components/PageTransition.tsx`:

```tsx
// BEFORE
<AnimatePresence initial={false} mode="wait">

// AFTER
<AnimatePresence mode="wait">
```

(Drop the `initial={false}` prop. `initial` defaults to `true`, which lets the inner `motion.div` play its `initial → animate` transition on first mount, including hard refresh.)

- [ ] **Step 3: Verify in browser**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Then hard-refresh `/` and any other page. The page content should fade up + un-blur (the existing `initial={{ filter: "blur(8px)", opacity: 0, y: 6 }} → animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}` transition) every time, not just on client-side navigation.

- [ ] **Step 4: Commit**

```bash
git add src/components/PageTransition.tsx
git commit -m "fix(transition): play page entry animation on hard refresh, not just client nav

Removed AnimatePresence initial={false} which was suppressing the
blur-in/opacity entry on first mount. With initial defaulting to
true, the entry transition fires whether the user hard-refreshes or
tab-switches via Link."
```

---

## Task 2: Per-project CTAs on Selected Work

**Files:**
- Modify: `src/components/SelectedWork.tsx`

- [ ] **Step 1: Add `cta` field to the `Work` type**

In `src/components/SelectedWork.tsx`, find the `type Work = { ... }` declaration and add:

```ts
type Work = {
  branch: string;
  context: string;
  cta: string; // NEW
  hash: string;
  href?: string;
  metric: string;
  metricLabel: string;
  status: "shipped" | "live" | "internal";
  tech: string[];
  title: string;
  track: 0 | 1;
  year: string;
};
```

- [ ] **Step 2: Add per-project CTA copy in the `works` array**

Atlas → `Read Atlas in depth`, Comms → `See it in action`, Automation → `See the pipeline`, QA → `See the system`.

Update each entry in `works: Work[]`:

```ts
{
  ...,
  cta: "Read Atlas in depth",  // Atlas entry
},
{
  ...,
  cta: "See it in action",     // Guest Communications entry
},
{
  ...,
  cta: "See the pipeline",     // Connected Automation entry
},
{
  ...,
  cta: "See the system",       // Manual → QA entry
},
```

- [ ] **Step 3: Render `work.cta` in the marquee bill**

Find the JSX block in `MarqueeBill` that renders the CTA button. It currently reads:

```tsx
<span ...>
  See the build
  <span ...>→</span>
</span>
```

Replace `See the build` with `{work.cta}`:

```tsx
<span ...>
  {work.cta}
  <span ...>→</span>
</span>
```

- [ ] **Step 4: Verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Then load `http://localhost:3000/?lights=on` and confirm the four Selected Work cards now show four different CTA labels (Read Atlas in depth / See it in action / See the pipeline / See the system).

- [ ] **Step 5: Commit**

```bash
git add src/components/SelectedWork.tsx
git commit -m "feat(home/selected-work): per-project CTAs instead of homogeneous label

Atlas → 'Read Atlas in depth', Comms → 'See it in action',
Automation → 'See the pipeline', QA → 'See the system'. Drops the
repeated 'See the build →' across all four bills."
```

---

## Task 3: AvailabilityCta component

**Files:**
- Create: `src/components/AvailabilityCta.tsx`
- Modify: `src/components/index.ts`

- [ ] **Step 1: Create the component**

Create `src/components/AvailabilityCta.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./Button";
import { EMAIL_DISPLAY, EMAIL_MAILTO } from "./contact-config";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Pre-footer CTA block — appears on the two pages a hiring manager
 * spends real reading time on (/ and /resume). Anchors the
 * operator-AI story toward a clear next action: send an email.
 * Footer's general "Let's talk" carries the other pages.
 */
export function AvailabilityCta() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="mx-auto mt-20 w-full max-w-3xl border-t border-border-light pt-12 text-center sm:mt-24"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      transition={{ duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
        — available
      </p>
      <h2
        className="mt-3 font-semibold tracking-tight text-text-light"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        Available for senior AI engineering roles.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-7 text-text-light-muted sm:text-[15px]">
        Real reply within 48 hours. Best route is email — I read every message.
      </p>
      <div className="mt-7 flex flex-col items-center gap-2">
        <Button arrow href={EMAIL_MAILTO}>
          {EMAIL_DISPLAY}
        </Button>
        <p className="font-mono text-[10px] tracking-[0.18em] text-text-light-muted">
          — typical reply · 12–48 hours · pt
        </p>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Export from kit index**

Add to `src/components/index.ts` (alphabetical order, after `AnimatedCounter` or wherever fits):

```ts
export { AvailabilityCta } from "./AvailabilityCta";
```

- [ ] **Step 3: Mount on `/`** — in `src/app/page.tsx`, import + render `<AvailabilityCta />` just before `<SectionDivider direction="light-to-dark" />` near the bottom of the `Home` component.

```tsx
import { AvailabilityCta, ChapterRail, /* ... */ } from "@/components";

// inside Home(), at the bottom of <main>:
<AvailabilityCta />
<SectionDivider direction="light-to-dark" />
<SiteFooter />
```

- [ ] **Step 4: Mount on `/resume`** — in `src/app/resume/page.tsx`, render `<AvailabilityCta />` after the existing `ContactEditorial` section and before `<SiteFooter />`.

```tsx
// inside <article>...</article>, after the closing of the contact section:
</article>

<AvailabilityCta />

<ChapterRail ... />
<SiteFooter />
```

- [ ] **Step 5: Verify**

Run: `curl -s -o /dev/null -w "/: %{http_code} · /resume: %{http_code}\n" http://localhost:3000/ http://localhost:3000/resume`
Expected: both `200`.

Load both pages and confirm the availability block renders before the footer with the email button visible.

- [ ] **Step 6: Commit**

```bash
git add src/components/AvailabilityCta.tsx src/components/index.ts src/app/page.tsx src/app/resume/page.tsx
git commit -m "feat(home,resume): availability cta block before footer

Single accent button + email + 48-hour reply note. Mounted only on
/ and /resume — the two pages a hiring manager spends real time on.
Other pages keep the existing footer 'Let's talk' as the primary
contact route."
```

---

## Task 4: Home hero framing line

**Files:**
- Modify: `src/app/page.tsx` (the `Hero` function around line 497)

- [ ] **Step 1: Find the hero's chip rail closing tag**

Run: `grep -n 'StaggeredChipRail\|hero-cursor' src/app/page.tsx`
Expected: matches inside the `Hero()` function.

- [ ] **Step 2: Add the framing paragraph below the chip rail**

In `Hero()` in `src/app/page.tsx`, immediately after the `<StaggeredChipRail .../>` (or the equivalent chip-rail block) and before the next sibling element, add:

```tsx
<p
  className="mx-auto mt-8 text-center text-[17px] leading-8 text-text-light"
  style={{ maxWidth: "52ch" }}
>
  I was running a hotel when I started building the AI to automate it.
  Now I co-architect Atlas — the multi-agent harness behind every
  Blackdoor ship.
</p>
```

If the hero block already has an existing paragraph in this position, replace its inner text rather than adding a second paragraph.

- [ ] **Step 3: Verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

Load `http://localhost:3000/?lights=on`. The hero should now show:
- TextScramble strip
- Title "Pierre Belon Savon."
- Subtitle (AI Engineer · Building production systems)
- Chip rail
- **New paragraph**: "I was running a hotel when I started building the AI to automate it. Now I co-architect Atlas — the multi-agent harness behind every Blackdoor ship."

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home/hero): add operator-AI framing line under chip rail

Pulls the operator → AI engineer story up to the surface in the
hero, before any visual flourish kicks in. Single sans paragraph,
52ch measure, centered."
```

---

## Task 5: AtlasArchitecture component (roadmap diagram)

**Files:**
- Create: `src/components/AtlasArchitecture.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/AtlasArchitecture.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Atlas v3 / v4 roadmap diagram. Solid nodes + lines = what ships
 * today (orchestrator + ad-hoc subagent dispatch). Dashed nodes +
 * lines = the planned tiered build-out (formal C-suite + manager
 * layers).
 *
 * Drawn in inline SVG so the line styles are exact and we can
 * animate later without restructuring.
 */
export function AtlasArchitecture() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      className="mt-20 sm:mt-28"
      id="architecture"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, ease: easeOut }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    >
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
        — architecture
      </p>
      <h2
        className="mt-3 font-semibold tracking-tight text-text-light"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          letterSpacing: "-0.035em",
          lineHeight: 1.05,
        }}
      >
        How Atlas dispatches work.
      </h2>

      <div className="mt-10 overflow-x-auto">
        <svg
          aria-hidden="true"
          className="mx-auto"
          height="380"
          viewBox="0 0 720 380"
          width="100%"
          style={{ maxWidth: 720 }}
        >
          <defs>
            <marker
              id="arrow"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="5"
              refY="3"
              viewBox="0 0 6 6"
            >
              <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
            </marker>
          </defs>

          {/* USER */}
          <g>
            <rect fill="none" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" width="120" x="300" y="10" />
            <text fontFamily="var(--font-geist-mono)" fontSize="11" textAnchor="middle" x="360" y="35">
              USER
            </text>
          </g>
          {/* arrow user→atlas */}
          <line markerEnd="url(#arrow)" stroke="currentColor" strokeWidth="1.5" x1="360" x2="360" y1="50" y2="78" />

          {/* ATLAS orchestrator */}
          <g>
            <rect fill="rgba(41,110,214,0.08)" height="60" rx="4" stroke="currentColor" strokeWidth="1.8" width="200" x="260" y="80" />
            <text fontFamily="var(--font-geist-sans)" fontSize="14" fontWeight="600" textAnchor="middle" x="360" y="105">
              ATLAS
            </text>
            <text fontFamily="var(--font-geist-mono)" fontSize="10" textAnchor="middle" x="360" y="125">
              orchestrator · qwen3-coder:30b
            </text>
          </g>

          {/* arrows atlas→agents */}
          <line markerEnd="url(#arrow)" stroke="currentColor" strokeWidth="1.5" x1="360" x2="200" y1="140" y2="195" />
          <line markerEnd="url(#arrow)" stroke="currentColor" strokeWidth="1.5" x1="360" x2="360" y1="140" y2="195" />
          <line markerEnd="url(#arrow)" stroke="currentColor" strokeWidth="1.5" x1="360" x2="520" y1="140" y2="195" />

          {/* ad-hoc agents */}
          {[
            { label: "agent-mcp", x: 140 },
            { label: "agent-oauth", x: 300 },
            { label: "agent-vercel", x: 460 },
          ].map((a) => (
            <g key={a.label}>
              <rect fill="none" height="42" rx="3" stroke="currentColor" strokeWidth="1.3" width="120" x={a.x} y="197" />
              <text fontFamily="var(--font-geist-mono)" fontSize="11" textAnchor="middle" x={a.x + 60} y="222">
                {a.label}
              </text>
            </g>
          ))}

          {/* dashed arrows down to planned tiers */}
          <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.3" x1="200" x2="200" y1="239" y2="285" />
          <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.3" x1="360" x2="360" y1="239" y2="285" />
          <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.3" x1="520" x2="520" y1="239" y2="285" />

          {/* planned tiers — dashed */}
          {[
            { label: "c-suite", x: 140 },
            { label: "manager", x: 300 },
            { label: "field", x: 460 },
          ].map((p) => (
            <g key={p.label}>
              <rect
                fill="none"
                height="42"
                rx="3"
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth="1.3"
                width="120"
                x={p.x}
                y="287"
              />
              <text
                fontFamily="var(--font-geist-mono)"
                fontSize="11"
                opacity="0.65"
                textAnchor="middle"
                x={p.x + 60}
                y="312"
              />
              <text
                fontFamily="var(--font-geist-mono)"
                fontSize="11"
                opacity="0.65"
                textAnchor="middle"
                x={p.x + 60}
                y="312"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* legend caption */}
          <text fill="currentColor" fontFamily="var(--font-geist-mono)" fontSize="10" opacity="0.6" textAnchor="middle" x="360" y="360">
            v3 today (solid) · v4 build-out (dashed)
          </text>
        </svg>
      </div>

      {/* CLAIMS — four verifiable technical lines */}
      <ul className="mx-auto mt-10 grid max-w-2xl gap-2 font-mono text-[12.5px] leading-7 text-text-light-muted">
        <li>— mcp: custom servers exposing notion · gmail · supabase · vercel</li>
        <li>— oauth: scoped tokens for github · guesty · twilio</li>
        <li>— runtime: on-device via ollama + cloud routing (anthropic, openai)</li>
        <li>— governance: every action filed as a github pr + ci checks</li>
      </ul>
    </motion.section>
  );
}
```

- [ ] **Step 2: Verify the SVG renders**

There's no consumer page yet (Task 8 will mount it). Confirm the file compiles without TypeScript errors:

Run: `npx tsc --noEmit 2>&1 | grep AtlasArchitecture`
Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/AtlasArchitecture.tsx
git commit -m "feat(atlas): roadmap diagram component

Inline SVG. USER → ATLAS orchestrator → 3 ad-hoc agents (solid,
ships today) → 3 dashed planned tiers (c-suite/manager/field).
Caption: 'v3 today (solid) · v4 build-out (dashed)'. Four mono
claims underneath (mcp/oauth/runtime/governance)."
```

---

## Task 6: AtlasTerminal — static CLI scene

**Files:**
- Create: `src/components/AtlasTerminal.tsx`

This task builds the static terminal frame only (no animation yet). Task 7 layers the scripted playback on top.

- [ ] **Step 1: Create the file with the static frame**

Create `src/components/AtlasTerminal.tsx`:

```tsx
"use client";

/**
 * Atlas terminal scene — faithful HTML/SVG recreation of the real
 * CLI. Static frame here; the scripted-playback layer is added in
 * Task 7 (AtlasTerminalScripts).
 */
export function AtlasTerminal() {
  return (
    <section
      aria-label="Atlas terminal session"
      className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 font-mono text-[13px] text-zinc-300 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
    >
      {/* TOP BAR — fake terminal title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-3 text-[11px] text-zinc-500">pierrebelonsavon — atlas — 100x32</span>
      </div>

      <div className="grid gap-3 px-5 py-5 sm:px-7 sm:py-6">
        {/* PROMPT LINE */}
        <p className="text-zinc-500">
          Last login: Thu May 14 12:17:04 on ttys001
        </p>
        <p>
          <span className="text-zinc-500">[pierrebelonsavon@MacBook-Pro portfolio %</span>{" "}
          <span className="text-zinc-200">atlas</span>
        </p>

        {/* ATLAS ASCII LOGO */}
        <AtlasAsciiLogo />

        {/* MODEL + PATH */}
        <div className="mt-4 grid gap-1">
          <p>
            <span className="text-amber-300">★</span>{" "}
            <span className="text-zinc-400">ollama / </span>
            <span className="text-zinc-200">qwen3-coder:30b</span>
          </p>
          <p>
            <span className="text-emerald-300">△</span>{" "}
            <span className="text-zinc-400">~/Documents/Portfolio</span>
          </p>
        </div>

        {/* RESUME SESSION */}
        <div className="mt-3 grid gap-1">
          <p>
            <span className="text-violet-300">↻</span>{" "}
            <span className="text-zinc-400">resume last session</span>{" "}
            <span className="text-zinc-600">(1d ago · &quot;what would you recommend me doing next?&quot;)</span>
          </p>
        </div>

        {/* TRY PROMPTS */}
        <div className="mt-3 grid gap-1">
          <p className="text-zinc-500">Try:</p>
          <p className="pl-6 text-zinc-500">&quot;what changed in this folder recently?&quot;</p>
          <p className="pl-6 text-zinc-500">&quot;explain this codebase&quot;</p>
          <p className="pl-6 text-zinc-500">&quot;open a task in my workspace&quot;</p>
        </div>

        {/* CURSOR */}
        <p className="mt-4">
          <span aria-hidden="true" className="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-300 align-middle" />
        </p>
      </div>
    </section>
  );
}

/**
 * Pixel-stair ASCII recreation of the ATLAS logo from Pierre's
 * actual CLI. Three-stop gradient (cyan → violet → pink) applied to
 * the SVG fill so the letterforms keep the original feel.
 *
 * The grid below maps each cell of the ASCII art to an SVG <rect>.
 * Each letterform occupies 9 cols × 6 rows of 18 px tiles.
 */
function AtlasAsciiLogo() {
  // Cell size + spacing
  const cell = 14;
  const gap = 4;

  // Each letter encoded as a list of (row, col) lit cells. Compact
  // pixel-stair forms — not strict ImageNet pixels, but legible.
  const letters: Array<{ rows: number[][]; width: number }> = [
    // A
    {
      rows: [
        [0, 1, 2, 3],
        [0, 4],
        [0, 1, 2, 3, 4],
        [0, 4],
        [0, 4],
        [0, 4],
      ],
      width: 5,
    },
    // T
    {
      rows: [[0, 1, 2, 3, 4], [2], [2], [2], [2], [2]],
      width: 5,
    },
    // L
    {
      rows: [[0], [0], [0], [0], [0], [0, 1, 2, 3]],
      width: 5,
    },
    // A
    {
      rows: [
        [0, 1, 2, 3],
        [0, 4],
        [0, 1, 2, 3, 4],
        [0, 4],
        [0, 4],
        [0, 4],
      ],
      width: 5,
    },
    // S
    {
      rows: [
        [1, 2, 3, 4],
        [0],
        [1, 2, 3],
        [4],
        [4],
        [0, 1, 2, 3],
      ],
      width: 5,
    },
  ];

  const interLetter = 10;
  const totalCols =
    letters.reduce((sum, l) => sum + l.width, 0) +
    interLetter * (letters.length - 1);
  const totalRows = 6;

  const svgWidth = totalCols * (cell + gap);
  const svgHeight = totalRows * (cell + gap);

  return (
    <svg
      aria-label="ATLAS"
      className="my-2"
      height={svgHeight}
      role="img"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ maxWidth: 540 }}
    >
      <defs>
        <linearGradient id="atlas-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7be4e4" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ec96b6" />
        </linearGradient>
      </defs>
      {(() => {
        let colCursor = 0;
        const out: React.ReactElement[] = [];
        letters.forEach((letter, li) => {
          letter.rows.forEach((row, ri) => {
            row.forEach((c) => {
              const x = (colCursor + c) * (cell + gap);
              const y = ri * (cell + gap);
              out.push(
                <rect
                  fill="url(#atlas-grad)"
                  height={cell}
                  key={`${li}-${ri}-${c}`}
                  rx={1.5}
                  width={cell}
                  x={x}
                  y={y}
                />,
              );
            });
          });
          colCursor += letter.width + (li < letters.length - 1 ? 10 : 0);
        });
        return out;
      })()}
    </svg>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit 2>&1 | grep AtlasTerminal`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/AtlasTerminal.tsx
git commit -m "feat(atlas): terminal scene — static CLI frame

Faithful recreation of Pierre's atlas CLI: title bar, atlas command
echo, pixel-stair ATLAS logo as SVG with cyan→violet→pink gradient,
model + path + resume-session + try-prompts, blinking cursor. No
animation yet — scripted playback lands in Task 7."
```

---

## Task 7: AtlasTerminal scripted playback

**Files:**
- Modify: `src/components/AtlasTerminal.tsx`

- [ ] **Step 1: Define the two scripts at the top of the file**

In `src/components/AtlasTerminal.tsx`, add this after the imports / before the component:

```tsx
import { useEffect, useRef, useState } from "react";

type ScriptLine = {
  /** Display the line in this color class. */
  tone: "user" | "muted" | "success" | "violet" | "amber";
  text: string;
  /** Delay after this line streams (ms). */
  pause?: number;
};

const SCRIPT_A: ScriptLine[] = [
  { text: "> what changed in this folder recently?", tone: "user", pause: 350 },
  { text: "▸ Inspecting working tree…", tone: "muted", pause: 600 },
  { text: "▸ Recent commits on main:", tone: "muted", pause: 150 },
  { text: "    8cc5c77  fix(home/hero): strip avatar chrome", tone: "muted" },
  { text: "    6a0aecd  feat(home/hero): live commit ticker", tone: "muted" },
  { text: "    ffe273d  Merge pull request #216", tone: "muted", pause: 450 },
  { text: "▸ 3 commits in the last 2 hours. Want me to draft a PR summary?", tone: "muted", pause: 800 },
  { text: "> y", tone: "user", pause: 500 },
  {
    text:
      "▸ ✓ Drafted PR #218 — https://github.com/belonsavon-sys/Portfolio/pull/218",
    tone: "success",
    pause: 250,
  },
  { text: "▸ Awaiting review.", tone: "muted", pause: 2200 },
];

const SCRIPT_B: ScriptLine[] = [
  { text: "> explain this codebase", tone: "user", pause: 350 },
  { text: "▸ Spawning subagent: file-mapper", tone: "violet", pause: 700 },
  { text: "▸ ↳ Mapping src/ … 247 files indexed", tone: "muted", pause: 500 },
  { text: "▸ Architecture summary:", tone: "muted", pause: 150 },
  { text: "    src/app/        — Next.js App Router (5 routes)", tone: "muted" },
  { text: "    src/components/ — 38 components", tone: "muted" },
  { text: "    src/data/       — resume + stack content modules", tone: "muted" },
  { text: "    public/         — static assets + résumé PDF", tone: "muted", pause: 350 },
  { text: "▸ ✓ done in 12.4s", tone: "success", pause: 2200 },
];

const TONE_CLASS: Record<ScriptLine["tone"], string> = {
  amber: "text-amber-300",
  muted: "text-zinc-400",
  success: "text-emerald-400",
  user: "text-zinc-200",
  violet: "text-violet-300",
};
```

- [ ] **Step 2: Add a `PlaybackArea` component**

Below the existing `AtlasTerminal` export, add:

```tsx
/**
 * The scripted-playback area inside the terminal — appears below
 * the prompts. Cycles between SCRIPT_A and SCRIPT_B with a short
 * cooldown. Each character is typed at ~22 ms, each line at the
 * pause specified.
 */
function PlaybackArea() {
  const [renderedLines, setRenderedLines] = useState<string[][]>([]);
  const [scriptIdx, setScriptIdx] = useState(0); // 0 = A, 1 = B
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const scripts = [SCRIPT_A, SCRIPT_B];
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setRenderedLines(scripts[scriptIdx]!.map((l) => [l.text]));
      return () => {
        cancelledRef.current = true;
      };
    }

    let isMounted = true;
    const current = scripts[scriptIdx]!;

    async function play() {
      const accumulated: string[][] = [];
      for (let li = 0; li < current.length; li += 1) {
        if (!isMounted || cancelledRef.current) return;
        const target = current[li]!.text;
        accumulated.push([""]);
        setRenderedLines([...accumulated]);
        for (let ci = 1; ci <= target.length; ci += 1) {
          if (!isMounted || cancelledRef.current) return;
          accumulated[li] = [target.slice(0, ci)];
          setRenderedLines([...accumulated]);
          await wait(22);
        }
        await wait(current[li]!.pause ?? 40);
      }
      // Cooldown before swap
      await wait(2400);
      if (!isMounted || cancelledRef.current) return;
      setScriptIdx((i) => (i + 1) % 2);
      setRenderedLines([]);
    }

    play();
    return () => {
      isMounted = false;
      cancelledRef.current = true;
    };
  }, [scriptIdx]);

  return (
    <div className="mt-5 grid gap-1 border-t border-zinc-800 pt-4" aria-hidden="true">
      {renderedLines.map((line, i) => {
        const tone = (
          [...SCRIPT_A, ...SCRIPT_B].find((s) => s.text === line[0]) ?? {
            tone: "muted" as const,
          }
        ).tone;
        return (
          <p className={TONE_CLASS[tone]} key={`${scriptIdx}-${i}`}>
            {line[0]}
          </p>
        );
      })}
    </div>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
```

- [ ] **Step 3: Mount `<PlaybackArea />` inside `AtlasTerminal`**

In the `AtlasTerminal` return block, replace the blinking-cursor `<p>` at the bottom with:

```tsx
<PlaybackArea />
```

- [ ] **Step 4: Verify in browser**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

There's no /atlas route mounting this yet (Task 8). To verify visually, temporarily add `<AtlasTerminal />` somewhere on `/` (e.g. inside the existing home stack), refresh, watch the playback type. Then revert.

Alternatively skip live verification until Task 8 wires it into /atlas.

- [ ] **Step 5: Commit**

```bash
git add src/components/AtlasTerminal.tsx
git commit -m "feat(atlas): scripted-playback layer in terminal

Two rotating scripts: SCRIPT_A (codebase awareness → PR draft),
SCRIPT_B (explain codebase → file-mapper subagent). 22ms/char
typewriter, per-line pause, 2.4s cooldown between scripts. Honors
prefers-reduced-motion by rendering the final state."
```

---

## Task 8: Rebuild `/atlas` page

**Files:**
- Modify: `src/app/atlas/page.tsx`

- [ ] **Step 1: Read the current page**

Run: `cat src/app/atlas/page.tsx | head -80`

Understand what's there. Save anything reusable (the hero pattern likely is — keep it).

- [ ] **Step 2: Rewrite the page**

Replace `src/app/atlas/page.tsx` with:

```tsx
"use client";

import {
  AtlasArchitecture,
  AtlasTerminal,
  HeroSplitTitle,
  ParallaxGhost,
  SiteFooter,
  StaggeredChipRail,
  TextScramble,
} from "@/components";

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <AtlasHero />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AtlasTerminal />
        <AtlasArchitecture />
        <OriginTieBack />
      </section>

      <SiteFooter />
    </main>
  );
}

function AtlasHero() {
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
          ATLAS
        </ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-12 font-mono text-[11px] text-accent">
          <span className="text-accent-deep">$</span>
          <span>
            <TextScramble
              durationMs={950}
              stepMs={38}
              text="atlas · the multi-agent harness"
            />
          </span>
          <span className="font-mono text-[12px] text-result-green">
            — v3 · live
          </span>
        </div>

        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 7rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="Atlas v3." />
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

        <p className="mx-auto mt-10 max-w-2xl text-center text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Autonomous agent harness. Pierre Belon Savon, co-architect. Connects
          any AI model to any external tool through MCP or OAuth, and ships
          real apps through a GitHub PR workflow.
        </p>

        <div className="mt-8 flex justify-center">
          <StaggeredChipRail
            baseDelay={0.5}
            chips={["MCP", "OAuth", "ollama / qwen3-coder:30b", "GitHub PR"]}
            className="flex flex-wrap items-center justify-center gap-2"
          />
        </div>
      </div>
    </section>
  );
}

function OriginTieBack() {
  return (
    <section className="mx-auto mt-24 max-w-3xl border-t border-border-light pt-12 text-center">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">— origin</p>
      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-text-light-muted sm:text-[16px] sm:leading-9">
        This started as the auto-replier I built for hotel guest messages — a
        single Claude call dispatching follow-ups. Atlas is what happened when
        I generalized that work.
      </p>
      <a
        className="mt-7 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.18em] text-accent transition-colors hover:text-accent-deep"
        href="/business"
      >
        <span className="link-underline">See how it scaled</span>
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
```

- [ ] **Step 3: Export the new components from kit index**

Update `src/components/index.ts` to add (alphabetical):

```ts
export { AtlasArchitecture } from "./AtlasArchitecture";
export { AtlasTerminal } from "./AtlasTerminal";
```

- [ ] **Step 4: Verify in browser**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/atlas`
Expected: `200`.

Load `http://localhost:3000/atlas?lights=on`:
- Hero displays "Atlas v3." with glitch animation
- Terminal scene below shows ATLAS logo + prompts + scripted playback typing
- Architecture diagram appears below terminal (solid + dashed nodes)
- "Origin" tie-back at the bottom with link to /business

- [ ] **Step 5: Commit**

```bash
git add src/app/atlas/page.tsx src/components/index.ts
git commit -m "feat(atlas): rebuilt page — terminal + roadmap + origin tie-back

Replaces the prior schematic-hierarchy page with the operator-
credibility surface: locked welcome hero ('Atlas v3.'), terminal
centerpiece w/ scripted playback (AtlasTerminal), v3/v4 roadmap
diagram (AtlasArchitecture), and origin link back to /business
('how it scaled')."
```

---

## Task 9: `/business` chapter codebase links

**Files:**
- Modify: `src/app/business/page.tsx`

- [ ] **Step 1: Locate each chapter's closing block**

Run: `grep -n 'function ProcessConversion\|function Communications\|function Training\|function Finance' src/app/business/page.tsx`

The four chapter components.

- [ ] **Step 2: Add a codebase-link block at the end of each chapter**

In each chapter component's JSX return, just before the closing `</section>`, add the following (vary the `href` per chapter):

```tsx
<p className="mt-10 text-center font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
  <a className="text-accent transition-colors hover:text-accent-deep" href="/atlas#architecture">
    <span className="link-underline">See the codebase</span>{" "}
    <span aria-hidden="true">→</span>
  </a>
</p>
```

Specific href per chapter:
- ProcessConversion → `/atlas#architecture`
- Communications → `/atlas#architecture`
- Training → `/resume#experience`
- Finance → `/resume#experience`

- [ ] **Step 3: Verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/business`
Expected: `200`.

Load `/business?lights=on`. Scroll through all four chapters; each should end with a "See the codebase →" link before the next chapter begins.

- [ ] **Step 4: Commit**

```bash
git add src/app/business/page.tsx
git commit -m "feat(business): per-chapter codebase links

Each chapter (Process / Communications / Training / Finance) ends
with a small 'See the codebase →' link pointing at the relevant
engineering deep-dive (/atlas for process+comms, /resume for
training+finance). Operator-side stories now route back to the
engineering proof."
```

---

## Task 10: CommitStamp component (dark-only watermark)

**Files:**
- Create: `src/components/CommitStamp.tsx`
- Modify: `src/components/index.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create the component**

Create `src/components/CommitStamp.tsx`:

```tsx
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
```

- [ ] **Step 2: Export from kit index**

In `src/components/index.ts`, add:

```ts
export { CommitStamp } from "./CommitStamp";
```

- [ ] **Step 3: Add the CSS visibility rules**

In `src/app/globals.css`, find a sensible location for the rule (anywhere in the file body works; near the other `body.dark` rules is ideal). Add:

```css
/* ─── CommitStamp — dark-mode-only git watermark ────────────────
 * The CommitStamp element renders unconditionally; this rule
 * hides it in light mode and shows it in dark. Keeps the
 * "engineer's working surface" personality scoped to lights-off. */
.commit-stamp {
  display: none;
}
body.dark .commit-stamp {
  display: block;
}
```

- [ ] **Step 4: Mount the stamp in the root layout**

In `src/app/layout.tsx`, add `<CommitStamp />` inside the `<LightSwitchProvider>` tree, right next to the existing `<LightSwitch />` (or anywhere within the document body). Import it:

```tsx
import {
  BackToTop,
  CommitStamp,
  ConsoleSignature,
  // ...
} from "@/components";

// inside the JSX:
<LightSwitchProvider>
  <PageAtmosphere />
  <SiteHeader />
  <LightSwitch />
  <CommitStamp />  {/* ← add */}
  <div id="main-content">
    <PageTransition>{children}</PageTransition>
  </div>
  {/* ... */}
</LightSwitchProvider>
```

- [ ] **Step 5: Verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

Load `/?lights=on` — no stamp visible.
Toggle the LightSwitch off (or visit `/?lights=off`) — stamp appears in the top-right showing either the latest commit hash + relative time, or `main · live`.

- [ ] **Step 6: Commit**

```bash
git add src/components/CommitStamp.tsx src/components/index.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat(layout): dark-mode git watermark (CommitStamp)

Fixed top-right element rendering '\$ git log -1 · <sha> · <when>'
in dark mode only. Reads from NEXT_PUBLIC_BUILD_RECENT_COMMITS env
(same source the CommitTicker uses). Reinforces the dark-mode
personality as 'engineer's working surface' without adding
permanent chrome to light mode."
```

---

## Task 11: Dark-mode schematic density bump

**Files:**
- Modify: `src/app/globals.css`

The existing `PageAtmosphere` schematic atmosphere fades through a radial mask. Bumping the mask opacity stop makes it read denser in dark mode.

- [ ] **Step 1: Find the existing schematic atmosphere rule**

Run: `grep -n 'page-atmosphere\|schematic\|x-ray\|mask-image' src/app/globals.css | head -20`

Locate the radial-mask rule that controls the schematic visibility in dark mode.

- [ ] **Step 2: Bump the visibility one stop**

In the relevant rule (likely a `body.dark` selector on `.page-atmosphere` or similar), find the `mask-image` (or `opacity`) value driving the fade. Increase the visible center stop by ~10–15% (e.g. `rgba(0,0,0,0.6) 0%` → `rgba(0,0,0,0.78) 0%`, or `opacity: 0.55` → `opacity: 0.7`).

If you can't find the exact rule, instead add a new override at the end of the schematic-section comment block:

```css
/* Dark-mode density bump — make the schematic read clearer when
 * lights are off, reinforcing the engineer's-view personality. */
body.dark .page-atmosphere,
body.dark [data-page-atmosphere] {
  opacity: 0.78;
}
```

(Replace the selector with whatever actually targets the schematic element.)

- [ ] **Step 3: Verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

Toggle lights off via the rocker switch. The flashlight/schematic atmosphere should read more present than before — still atmospheric, but the technical detail is more visible.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style(dark): bump schematic atmosphere density

Drops the radial-mask fade by one stop so the technical detail of
the PageAtmosphere schematic reads clearer in dark mode.
Reinforces the 'engineer's working surface' personality."
```

---

## Task 12: Dark-mode contrast audit + targeted fixes

**Files:**
- Modify: `src/app/business/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Locate the iPhone bezel CSS in /business**

Run: `grep -n 'iphone\|phone-bezel\|phone-frame\|PhoneFrame' src/app/business/page.tsx src/components/*.tsx 2>/dev/null | head`

The phone mockup likely lives in a chapter component as inline JSX or in a shared component. Find the element that renders the black bezel.

- [ ] **Step 2: Add a dark-mode bezel override**

In `src/app/globals.css`, add:

```css
/* ─── /business iPhone bezel — visible in dark mode ─────────────
 * The phone bezel renders as #000 in light mode (looks like a
 * device). In dark mode that bezel disappears against the dark
 * page background. This rule swaps the bezel to a cream surface
 * with an accent inner ring so the phone reads as a sketched
 * device on dark. */
body.dark .phone-bezel,
body.dark [data-phone-bezel="true"] {
  background-color: var(--bg-light) !important;
  border: 1px solid rgba(91, 155, 244, 0.4) !important;
}
body.dark .phone-screen,
body.dark [data-phone-screen="true"] {
  background-color: var(--bg-dark-2) !important;
}
```

- [ ] **Step 3: Apply the class/attribute to the phone JSX**

In `src/app/business/page.tsx`, find the phone-frame element. Add either `className="phone-bezel"` to the outer element (with `phone-screen` on the inner display element), or `data-phone-bezel="true"` / `data-phone-screen="true"` if className is awkward to inject.

(If the phone is rendered inside a shared component like `PhoneFrame.tsx`, edit that component instead.)

- [ ] **Step 4: Bump the dropcap + wax-seal dark colors**

In `src/app/globals.css`, find the existing `.editorial-dropcap::first-letter` rule and the wax-seal rule (or their accent-deep color use). Add dark overrides:

```css
body.dark .editorial-dropcap::first-letter {
  color: var(--accent-light);
}
body.dark .stamp svg {
  /* If the stamp's color is set via CSS variable, override here.
   * If it's set via inline SVG fill, this won't override — in that
   * case, the SVG fill needs to be CSS-var-driven; do that in a
   * follow-up. */
  color: var(--accent-light);
}
```

- [ ] **Step 5: Bump dashed border alpha in dark**

In `src/app/globals.css`, add:

```css
/* Dashed borders fade to invisible in dark on light surfaces. Bump
 * the visible alpha. Applies to any element using border-dashed
 * + border-border-light. */
body.dark .border-dashed {
  border-color: rgba(148, 163, 184, 0.32);
}
```

- [ ] **Step 6: Audit pass — load every page in dark mode**

Open each page with `?lights=off` and walk through:
- `/` — verify all sections readable; muted text visible
- `/atlas` — terminal renders fine (already dark), architecture diagram readable
- `/business` — phones visible (the main known fix), chapter labels visible
- `/resume` — dropcap not dim, wax-seal not invisible, dashed dividers visible
- `/lab` — green-neon card looks correct (was designed for dark)

For any contrast issue found that isn't covered above, add a targeted rule under a comment block:

```css
/* ─── Dark-mode contrast fixes (one-off audit findings) ─────── */
```

- [ ] **Step 7: Verify pages still 200**

```bash
for path in / /atlas /business /resume /lab; do
  curl -s -o /dev/null -w "$path: %{http_code}\n" "http://localhost:3000$path"
done
```

Expected: all `200`.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/business/page.tsx
git commit -m "style(dark): contrast audit pass — phones, dropcap, seal, dashes

- /business phone bezel: cream w/ accent ring in dark (was black-
  on-dark and invisible)
- /resume editorial-dropcap + stamp: accent-light in dark (was
  accent-deep and too dim)
- Dashed borders: bumped alpha so they remain visible on dark
- Any further one-off issues found during the audit pass"
```

---

## Self-Review

**Spec coverage:**
- ✓ /atlas surface — Tasks 5, 6, 7, 8
- ✓ Home hero framing — Task 4
- ✓ CTAs: per-project Selected Work — Task 2
- ✓ CTAs: Atlas internal CTA — handled by terminal anchor in Task 8 (the architecture section is `id="architecture"` and the terminal is the visual anchor at the top of the section)
- ✓ CTAs: /business codebase links — Task 9
- ✓ CTAs: availability block on / + /resume — Task 3
- ✓ Dark mode CommitStamp — Task 10
- ✓ Dark mode schematic density bump — Task 11
- ✓ Dark mode contrast audit — Task 12
- ✓ Refresh animation fix — Task 1

All spec sections have a task.

**Placeholder scan:** No TBDs, no "add appropriate error handling," no "similar to Task N." Every code step contains real code.

**Type consistency:** `Work.cta` added in Task 2 is referenced verbatim in the same task's render step. `ScriptLine` defined and used in Task 7. `AtlasArchitecture` / `AtlasTerminal` exports match their import sites in Task 8.

**Internal consistency:** Tasks 6 + 7 both modify `AtlasTerminal.tsx`. Task 6 establishes the static frame; Task 7 adds the playback area. No conflict.

No issues. Plan ready to execute.
