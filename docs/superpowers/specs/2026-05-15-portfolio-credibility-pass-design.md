# Portfolio Credibility Pass — Design

**Date**: 2026-05-15
**Owner**: Pierre Belon Savon
**Status**: Approved for implementation

## Context

Pierre's portfolio currently leads with strong visual identity per page (drafting board, cinematic loops, dark console, editorial profile, marquee/board/periodic table on home). The visual range is an asset. The story it tells is: "designer-engineer with taste."

The intended audience over the next 6 months is hiring managers for **senior AI/engineering roles**, and the intended headline story is **"operator who built AI."** Pierre ran ThePrivateHotels' operations, hit a wall, built AI to solve it, then generalized that work into Atlas — a multi-agent harness that today is a single orchestrator + ad-hoc subagent dispatch, with a tiered build-out planned.

The current site has the raw material for this story but doesn't tell it tightly. Atlas — the strongest single credential — is named on every page and *seen* nowhere. The CTAs are homogeneous in places. Dark mode is more inverted-light than its own thing.

This spec is a focused pass to shift the site from "designer-engineer with taste" → "operator-engineer with product vision who ships." The visual identity stays — taste is the differentiator. We add credibility weight in three places: a real `/atlas` surface, a tighter home hero hook, and a dark-mode personality that reinforces "engineer's working surface."

## Goals

1. Make Atlas *visible* — render it as a credible working product, not a name.
2. Land the operator-AI story in the first 5 seconds on home.
3. Replace homogeneous "See the build →" CTAs with purposeful per-page secondaries.
4. Give dark mode a specific personality (engineer's working surface) instead of inverted-light.
5. Fix concrete dark-mode contrast bugs (`/business` phones disappear, etc.).
6. Fix the hero entry animation not firing on hard refresh.

## Non-goals

- No repivot of the overall visual identity. Per-page aesthetics stay as-is.
- No new hire-me / contact CTA on every page. Footer carries that.
- No literal CEO → C-suite hierarchy claim. Roadmap framing only.
- No live-running Atlas (out of scope for this pass — scripted playback only).
- No site-wide light-mode redesign. Pages already tuned.

## Architecture

### Files created

| Path | Purpose |
|---|---|
| `src/app/atlas/page.tsx` | Replace existing /atlas with new operator-credibility surface |
| `src/components/AtlasTerminal.tsx` | Faithful HTML/SVG recreation of the CLI scene + scripted playback |
| `src/components/AtlasArchitecture.tsx` | Roadmap diagram (solid v3 today / dashed v4 planned) |
| `src/components/CommitStamp.tsx` | Dark-mode-only git stamp watermark |

### Files modified

| Path | Change |
|---|---|
| `src/app/page.tsx` | Add Section 2 hero framing copy; vary Selected Work CTAs per project; add "Available for senior AI engineering roles" block before footer |
| `src/app/resume/page.tsx` | Add same availability block before footer |
| `src/components/SelectedWork.tsx` | Replace single `See the build →` with per-project copy (4 variants) |
| `src/app/business/page.tsx` | Dark-mode fix: phone bezel swaps to cream w/ accent ring on `body.dark` |
| `src/app/globals.css` | Bump schematic atmosphere density in dark; bump muted-text contrast bumps; phone bezel dark-mode rule |
| `src/components/PageTransition.tsx` | Force hero entry animation to fire on every mount (refresh + tab-switch) |

## Designs

### 1. `/atlas` — operator-credibility surface

Replaces the current /atlas page content (the schematic / Atlas Hierarchy components stay available but are no longer the page anchor).

#### 1a. Hero (locked welcome pattern)
- Title: **`Atlas v3.`** in the existing welcome-glitch HeroSplitTitle.
- Subtitle row mono: `— autonomous agent harness · pierre belon savon · co-architect`
- Chip rail + cursor identical to other heroes.

#### 1b. Terminal centerpiece (`AtlasTerminal.tsx`)
A faithful HTML/SVG recreation of Pierre's real CLI screenshot. Rebuilt — not the image.

Static frame:
```
[Last login: Thu May 14 12:17:04 on ttys001
[pierrebelonsavon@MacBook-Pro portfolio % atlas

     [ATLAS ASCII logo — cyan → violet → pink, SVG-recreated]

     ★  ollama / qwen3-coder:30b
     △  ~/Documents/Portfolio
     ↻  resume last session  (1d ago · "what would you recommend me doing next?")

     Try:
         "what changed in this folder recently?"
         "explain this codebase"
         "open a task in my workspace"

     ▌
```

**ASCII logo recreation**: SVG block grid using the same pixel-stair shape. Three gradient stops — `#7be4e4` (top) → `#a78bfa` (mid) → `#ec96b6` (bottom).

**Container**: dark zinc panel (`bg-zinc-950 border-border-light`), monospace inside, rounded corners, subtle drop-shadow. Sized ~max-w-3xl, embedded in the light page like a real terminal screenshot.

#### 1c. Scripted playback (within terminal)
On scroll-into-view, the cursor types a query and Atlas streams a response. Two rotating scripts, swapping every ~30 s. Loops idle between rotations.

**Script A — codebase awareness + PR dispatch**:
```
> what changed in this folder recently?

▸ Inspecting working tree…
▸ Recent commits on main:
    8cc5c77  fix(home/hero): strip avatar chrome
    6a0aecd  feat(home/hero): live commit ticker
    ffe273d  Merge pull request #216 from belonsavon-sys/...
▸ 3 commits in the last 2 hours. Want me to draft a PR summary?

> y

▸ ✓ Drafted PR #218 — https://github.com/belonsavon-sys/Portfolio/pull/218
▸ Awaiting review.
```

**Script B — spawning subagent**:
```
> explain this codebase

▸ Spawning subagent: file-mapper
▸ ↳ Mapping src/ ... 247 files indexed
▸ Architecture summary:
    src/app/        — Next.js App Router (5 routes)
    src/components/ — 38 components (incl. LocalAiDemo, BentoStack)
    src/data/       — resume + stack content modules
    public/         — static assets + résumé PDF
▸ ✓ done in 12.4s
```

**Implementation notes**:
- Use a typewriter effect with `setInterval(fn, 22ms)` per character.
- After each line streams, `setTimeout(40ms)` pause before next line.
- Sub-agent "Spawning…" line gets a brief 350ms "thinking" delay before the next streams.
- `IntersectionObserver` triggers the first script. After completion, wait 4 s, then start the other.
- Honor `prefers-reduced-motion`: render the final state of script A statically.

#### 1d. Architecture diagram (`AtlasArchitecture.tsx`)
Below the terminal. Drawn in the existing schematic-line style (lives in `globals.css` as `.schematic-*` if not present, add).

```
                  ┌──────────────┐
                  │     USER     │  ← solid
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │    ATLAS     │  ← solid (orchestrator)
                  │ (qwen3 32B)  │
                  └──────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
  ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
  │  agent-1  │    │  agent-2  │    │  agent-3  │  ← solid (ad-hoc)
  │   (mcp)   │    │  (oauth)  │    │  (vercel) │
  └───────────┘    └───────────┘    └───────────┘
        ╎                ╎                ╎
  ┌╴╴╴╴╴▼╴╴╴╴╴┐    ┌╴╴╴╴╴▼╴╴╴╴╴┐    ┌╴╴╴╴╴▼╴╴╴╴╴┐
  │ c-suite   │    │ manager   │    │   field   │  ← dashed (v4 build-out)
  └╴╴╴╴╴╴╴╴╴╴╴┘    └╴╴╴╴╴╴╴╴╴╴╴┘    └╴╴╴╴╴╴╴╴╴╴╴┘
```

Caption underneath: `— v3 today (solid) · v4 build-out (dashed)`.

**Below the diagram**: 4 mono claims, one per line. Each verifiable:
- `mcp: custom servers exposing notion, gmail, supabase, vercel`
- `oauth: scoped tokens for github + guesty + twilio`
- `runtime: on-device (ollama) + cloud routing (anthropic, openai)`
- `governance: every action via github pr + ci checks`

#### 1e. Origin tie-back (small section below)
A single block:
> *This started as the auto-replier I built for hotel guest messages — a single Claude call dispatching follow-ups. Atlas is what happened when I generalized that work.*
> 
> **See how it scaled →** /business

### 2. Home hero framing

Insert under the existing chip rail in `<Hero>`. Single paragraph:

> *I was running a hotel when I started building the AI to automate it. Now I co-architect Atlas — the multi-agent harness behind every Blackdoor ship.*

Typography: `text-text-light` sans, 17 px, `max-width: 52ch`, `mt-6` from chip rail, `mb-10` above the Hero ribbon CTA / scroll.

### 3. CTAs strategy

#### 3a. Selected Work — vary per project
Replace the homogeneous `See the build →` on `SelectedWork.tsx` MarqueeBill component. Per-project:

| Project | CTA copy |
|---|---|
| Atlas — Agent Architecture | `Read Atlas in depth →` |
| Guest Communications Chatbot | `See it in action →` |
| Connected Automation Layer | `See the pipeline →` |
| Manual → Auditable QA System | `See the system →` |

#### 3b. Atlas page — internal CTA
Below the terminal scene, before the architecture: `Watch Atlas in your terminal →` — anchors to scroll point of the playback (visual reinforcement, not navigation).

#### 3c. Business chapters — codebase links
Add at the end of each /business chapter, a small mono line:
- Process chapter: `See the codebase →` → `/atlas#architecture`
- Communications chapter: `See the codebase →` → `/atlas#playback`
- Training chapter: `See the system →` → `/resume#experience`
- Finance chapter: `See the ledger →` → `/resume#experience`

#### 3d. Availability block — on `/` and `/resume` only
Pre-footer block on the two pages a hiring manager spends real time on:

> **Available for senior AI engineering roles.** Real reply within 48 hours.
> 
> [`belonsavon@gmail.com →`]

Single accent button. No mid-page repetition on /business, /atlas, /lab — footer's "Let's talk" covers those.

### 4. Dark mode personality — "engineer's working surface"

#### 4a. Commit stamp (`CommitStamp.tsx`)
Dark-mode-only watermark in the top-right corner of every page. Reads from existing `NEXT_PUBLIC_BUILD_RECENT_COMMITS` env var (already populated). Format:

```
$ git log -1 --pretty="%h · %ar"
8cc5c77 · 12m ago
```

Style: `font-mono text-[10px] text-accent-light/55`, fixed `top-3 right-3`, `z-index 40`. Hidden in light mode via `body.dark .commit-stamp { display: block }` (default `display: none`).

#### 4b. Schematic atmosphere — bump density in dark
Currently `PageAtmosphere` renders a faded x-ray schematic in dark. Drop the radial-mask fade by one stop in `globals.css` so it reads denser. No new components.

#### 4c. Contrast pass — audit + fix list

Specific known fixes:

| Location | Issue | Fix |
|---|---|---|
| `/business` phone bezels | `bg-black` (or `border-zinc-900`) doesn't flip in dark mode → phone disappears | In `body.dark`, swap bezel to `bg-bg-light` cream + `1px ring ring-accent/40` |
| `/business` chapter labels | Subtle muted text on dark stages | Bump to `text-text-light` where needed |
| `/resume` wax-seal stamp | Uses `accent-deep` color → too dim on dark | In `body.dark`, switch to `accent-light` |
| `/resume` drop-cap | `accent-deep` color → dim on dark | Same fix |
| Dashed borders | `border-dashed border-border-light` at low alpha → invisible | Bump dash alpha specifically in `body.dark` |

Audit script: load each page in `?lights=off`, walk through every component, capture any element with computed-color contrast < 4.5:1 on body text or < 3:1 on large text. Catalog + fix in one pass.

### 5. Refresh-vs-tab-switch hero animation

**Problem**: hero auto-glitch + cursor entry play correctly on client tab-switch (PageTransition fades + remount). On hard refresh, the hero is already in DOM at first paint, so the CSS keyframes have run before the user looks at the page.

**Fix**: in `PageTransition.tsx` (or a new small wrapper), add a `mounted` state that flips `true` on `useEffect`. The hero entry transform key is bound to that state so it always animates *from* hidden → visible on every mount. Specifically:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// pass `mounted` into Hero as a key or prop so child remounts
```

Trade-off: a single-frame "flash" on hard refresh before the JS hydrates. Acceptable — same pattern the rest of the site uses.

## Open questions / known risks

1. **Atlas terminal playback realism**: if the scripts feel canned in interview demos, lean on "this is what running Atlas on the portfolio repo looks like" — should be defendable. Pierre validates the script content before ship.
2. **Architecture diagram fidelity**: v3-today / v4-planned distinction must hold up under a "show me the v3 code" follow-up. Pierre confirms what files implement the orchestrator + subagent dispatch.
3. **Per-chapter `/business` CTAs**: if /atlas#architecture isn't deep enough to justify the link, fall back to `/lab` or drop the cross-link.
4. **Commit stamp env var**: if `NEXT_PUBLIC_BUILD_RECENT_COMMITS` isn't populated in prod, the stamp falls back to a static "main · live" string rather than disappearing.

## Out-of-scope items (acknowledged but deferred)

- Animation gap on home page light mode (the user wanted to revisit). Tabled: the new `/atlas` terminal animation + dark-mode schematic bump cover most of the perceived gap. If the home page still reads as quiet after this pass, revisit with a slow ambient hero layer in a follow-up.
- Real Atlas demo (server-side execution). Out of scope. Scripted playback only.
- Light-mode personality tuning. Light is already well-tuned across pages.
