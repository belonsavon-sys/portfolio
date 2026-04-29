# AGENTS.md — AI Agent Instructions

This file governs how AI agents (Claude, Codex, and others) must behave when working in this repository.

---

## Agent Roles

### Claude
- **Responsibilities:** Thinking, architecture, design decisions, copy writing, documentation, planning, research, PR reviews, issue creation, context file management
- **Must NOT:** Write implementation code directly to `src/` without a plan approved in a PR description
- **Branch prefix:** `claude/<description>`

### Codex
- **Responsibilities:** Code implementation only — translating specs and plans into working code
- **Must NOT:** Make design decisions, write copy, or change `context/` files without explicit instruction
- **Must:** Read `context/` files before implementing any feature
- **Branch prefix:** `feat/<description>` or `fix/<description>`

---

## Workflow Rules

### Before Any Work
1. Read `context/project-scope.md` for the full picture
2. Read `context/resume.md` for all personal/professional data
3. Read `context/design.md` for all visual direction
4. Check open GitHub issues for the task you are working on
5. Create or link to an issue before creating a branch

### Branch Rules
- `main` — production only. **No direct pushes. Ever.**
- `develop` — integration. Merge feature branches here first.
- Feature work: `feat/<short-name>`
- Content/copy: `content/<short-name>`
- Bug fixes: `fix/<short-name>`
- Claude planning: `claude/<description>`

### Pull Request Rules
- Every change requires a PR — no exceptions
- PR must include:
  - Clear title (imperative: "Add hero section", "Fix contact form validation")
  - Description of what changed and why
  - At least one label
  - Linked issue (use "Closes #N" or "Refs #N")
- Create as **draft** first → mark ready when complete
- Do not merge your own PRs without review signal from the human

### Commit Message Format
```
type(scope): short description

Longer explanation if needed.
```
Types: `feat`, `fix`, `content`, `design`, `docs`, `chore`, `refactor`

Examples:
- `feat(hero): add floating icon animation`
- `content(resume): add Blackdoor experience entry`
- `design(brandkit): define color tokens for dark mode`

---

## Content Rules
- All page copy lives in `context/copy/` before it goes into code
- All resume data lives in `context/resume.md`
- **Business-first framing always:** describe outcomes, ROI, and efficiency gains — not tech stack
- Only briefly mention technology; never lead with it
- No percentage-bar skill indicators anywhere on the site

---

## Repository Structure
```
portfolio/
├── context/          ← source of truth for all content (populate before coding)
│   ├── resume.md
│   ├── design.md
│   ├── project-scope.md
│   └── copy/
├── src/app/          ← Next.js App Router pages
├── public/           ← static assets
├── AGENTS.md         ← this file
├── CLAUDE.md         ← Claude-specific extended instructions
└── .gitignore
```

---

## Labels to Use on Issues and PRs
| Label | When to use |
|-------|-------------|
| `content` | Resume, copy, context files |
| `design` | UI/UX, brandkit, visual decisions |
| `home-page` | Homepage work |
| `ai-page` | AI page work |
| `business-page` | Business page work |
| `technology-page` | Technology page work |
| `contact-page` | Contact page work |
| `resume` | Resume and cover letter |
| `infrastructure` | gitignore, config, CI/CD, AGENTS.md |
| `demo` | Demo sections and assets |
| `blocked` | Blocked on asset or decision |
| `needs-info` | Waiting for user input |

---

## Milestones
| # | Name | Description |
|---|------|-------------|
| 1 | Phase 1 — Content & Resume | All context files populated; resume finalized |
| 2 | Phase 2 — Design & Brandkit | Color tokens, typography, component specs finalized |
| 3 | Phase 3 — Build | All pages implemented |
| 4 | Phase 4 — Deploy | Vercel deployment, domain, QA |
