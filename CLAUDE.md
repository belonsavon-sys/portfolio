# CLAUDE.md — Claude-Specific Instructions

This file extends AGENTS.md with Claude-specific context.

## Project
Portfolio site for **Pierre Belon Savon**, AI Engineer. Target audience: technical recruiters + hiring managers + potential clients for Blackdoor.

## Primary Rule
**Business-first framing always.** Lead with outcomes (faster responses, lower cost, measurable change), mention technology only to support the business point.

## Content source of truth
- `context/resume.md` — personal + professional data
- `context/design.md` — visual direction and locked component specs
- `context/project-scope.md` — site map, demos, deployment
- `context/copy/*.md` — per-page copy

## Hero subtitle (LOCKED)
> "Engineering intelligent automation and full-stack applications that turn complex business processes into scalable, profitable systems."

Hero eyebrow above the name (LOCKED): `AI for operations-heavy businesses`.

## Locked design decisions
- Light dominant; selective dark sections with `#296ed6` accent + glassmorphism
- Sticky centered nav pill (Welcome · AI · Business · Resume · Get in Touch · `|` · GitHub · LinkedIn · Email · Phone)
- Cycling trilingual greeting: `Hello, I'm` → `Hola, soy` → `Ciao, sono`
- BentoStack: 6 categories, equal heights, real brand SVG logos via `simple-icons`
- Beyond-the-Code section: dark mesh gradient, two photo cards, pull quote
- Demo 1 (Local AI): 5 tabs, BrowserAI-style single content card per tab, "Load Model" CTA, pulsing live status
  - Tabs: Image Classification · LLM Chat · Computer Vision (live webcam zero-shot) · Speech to Text · Semantic Search
- Demo 2 (Atlas): real Anthropic API call with simulated fallback. Server route `/api/atlas/run`, 3 calls/IP/hour rate limit, 800-token cap
- Resume: NO stats band at the top — stats live on the homepage Outcomes section
- Final CTA: full dark band, gradient-text headline, mesh background

## Locked content decisions
- LinkedIn URL: `https://www.linkedin.com/in/pierre-belon-8366b8407` (set; icons render across site)
- Photos still pending background removal. Source files exist with black bars; visitor sees them until Pierre re-runs through remove.bg.
- Testimonial component is wired in `/business` but body is `null`. When Pierre adds a real quote (Ryder, ThePrivateHotels operations lead, etc.), the slot lights up.

## AI tool split (current)
- **Claude**: thinking, design, copy, architecture, **and code** when explicitly directed by Pierre. Pierre overrode the original "Claude does no code" rule starting PR #30 — Claude now ships implementation when asked, with logical commits and clear PR descriptions.
- **Codex**: still a valid contributor for code-only PRs.
- **GitHub**: all work goes through PRs against `main`.

## Operating habits
- Never push directly to `main`.
- Develop on branch `claude/plan-portfolio-website-veieo`.
- Open draft PRs; mark ready for review when verification (typecheck + build) is green.
- Commit in logical chunks within a PR; one PR per major redesign pass.
- After a PR merges, sync local `main` and `claude/plan-portfolio-website-veieo` before the next batch.

## Outstanding follow-ups (Pierre)
- Background-remove photos (5 minutes via remove.bg)
- Source one real testimonial quote
- Set `ANTHROPIC_API_KEY` in Vercel project env vars (live Atlas demo currently falls back to simulation in production until set)
- Decide custom domain
