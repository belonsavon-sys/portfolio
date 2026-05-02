# CLAUDE.md — Claude-Specific Instructions

This file extends AGENTS.md with Claude-specific context and instructions.

---

## Project
Portfolio website for Pierre Belon Savon, AI Engineer.
Target roles: AI Engineer. Target audience: technical recruiters + business decision-makers.

## Primary Rule
**Business-first framing always.** Frame everything in terms of business outcomes, efficiency gains, cost savings, and measurable results. Mention technology briefly and only to support the business point — never lead with it.

## Content Source of Truth
- `context/resume.md` — all personal and professional data
- `context/design.md` — all visual direction and brand decisions
- `context/project-scope.md` — full project scope and site map
- `context/copy/` — page-by-page copy (populate before any implementation)

## Interview Progress
Claude is currently conducting a structured interview with Pierre to populate all content files before any code is written. Checkpoint every 10 questions: commit context updates, open/update GitHub issues, and update the PR.

## Hero Description (LOCKED)
> "Engineering intelligent automation and full-stack applications that turn complex business processes into scalable, profitable systems."

## Key Design Decisions (LOCKED)
- Light + dark mode: light is dominant; dark used selectively with blue/cyan terminal aesthetic
- No brand name, no logo, no name in navbar
- Sticky left sidebar (homepage only): photo, bio, contact icons
- Floating tool icons in hero: GitHub, Zapier, React, MySQL, Next.js, Express.js, JavaScript
- No percentage skill bars anywhere
- Glassmorphism in dark sections
- Typing animation in terminal sections only (not hero)

## Current Blockers (assets needed)
- Photos selected (3 chosen — see design.md). Pierre to save to `public/` and run Photo 3 through remove.bg.
- LinkedIn profile (not yet created)
- University name + dates for civil engineering
- Quantified metrics from hotel work
- Demo content (3 demos planned for Technology/AI pages)
- Cover letter

## AI Tool Split
- Claude: thinking, design, copy, architecture, docs
- Codex: code implementation only
- Do not conflate these roles

## GitHub Instructions
- Repo: belonsavon-sys/portfolio
- Dev branch: claude/plan-portfolio-website-veieo
- All work via PRs — never push directly to main
- Create issues for all work items with appropriate labels and milestones


## Locked Decisions (2026-05-02)
- Local AI demo follows BrowserAI-style single-card tab UX
- Atlas demo uses real Anthropic API when available with simulated fallback
- Testimonial component renders only when real quote body exists
- LinkedIn remains blocked until profile URL is provided
- Hero/background-removed photo assets still pending cleanup
