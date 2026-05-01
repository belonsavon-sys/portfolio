# Pierre Belon Savon — AI Engineer Portfolio

> Engineering intelligent automation and full-stack applications that turn complex business processes into scalable, profitable systems.

A Next.js (App Router) portfolio site for **Pierre Belon Savon**, AI Engineer. Built business-first: every page leads with outcomes, not technology. Deployed on Vercel.

---

## Architecture

```mermaid
flowchart TB
    subgraph Content["📚 Content Layer (source of truth)"]
        Resume[resume.md]
        Design[design.md]
        Scope[project-scope.md]
        Copy[copy/*.md]
        Cover[cover-letter.md]
    end

    subgraph App["🖥️ App Layer (Next.js App Router)"]
        Layout[layout.tsx]
        Welcome["/ — Welcome"]
        AI["/ai — AI"]
        Business["/business — Business"]
        Resume2["/resume — Resume"]
        Contact["/contact — Get in Touch"]
    end

    subgraph Infra["☁️ Infrastructure"]
        GH[GitHub PRs]
        Vercel[Vercel Deploy]
        Domain[Production Domain]
    end

    Content -.feeds copy.-> App
    App --> GH
    GH --> Vercel
    Vercel --> Domain

    style Content fill:#e0f7ff,stroke:#00d4ff
    style App fill:#fff,stroke:#333
    style Infra fill:#f5f5f5,stroke:#666
```

---

## Site Map

```mermaid
flowchart LR
    Nav((Pill Nav))
    Welcome["/ Welcome<br/>Hero · Sidebar · About · Stack · Metrics"]
    AI["/ai AI<br/>Services · Case Studies · Demo 1 · Demo 2"]
    Business["/business Business<br/>'I ship AI' · 5 ordered sections"]
    Resume["/resume Resume<br/>Full resume · PDF download"]
    Contact["/contact Get in Touch<br/>'Ready when you are.'"]

    Nav --> Welcome
    Nav --> AI
    Nav --> Business
    Nav --> Resume
    Nav --> Contact

    style Welcome fill:#fff,stroke:#333
    style AI fill:#e0f7ff,stroke:#00d4ff
    style Business fill:#fff,stroke:#333
    style Resume fill:#fff,stroke:#333
    style Contact fill:#fff,stroke:#333
```

---

## AI-Driven Workflow

```mermaid
flowchart LR
    Pierre((Pierre))
    Claude[🧠 Claude<br/>Thinking · Design · Copy · Docs]
    Codex[⚙️ Codex<br/>Code Implementation Only]
    PR[GitHub PR]
    Main[main branch]
    Vercel[Vercel]
    Live[🌐 Live Site]

    Pierre <--> Claude
    Pierre <--> Codex
    Claude --> PR
    Codex --> PR
    PR -->|review + merge| Main
    Main --> Vercel
    Vercel --> Live

    style Claude fill:#fef3c7,stroke:#f59e0b
    style Codex fill:#dbeafe,stroke:#3b82f6
    style Live fill:#d1fae5,stroke:#10b981
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables |
| Animation | Framer Motion |
| Database | Supabase (if needed) |
| Demos (Demo 1) | WebGPU + Transformers.js — local AI in browser |
| Demos (Demo 2) | Simulated 3-pane Atlas walkthrough |
| Deploy | Vercel |
| Source of truth | `/context/*.md` (flat content files) |

---

## Repository Structure

```
portfolio/
├── context/                  ← All content lives here. Source of truth.
│   ├── resume.md             ← Full resume data
│   ├── design.md             ← Visual direction + brandkit
│   ├── project-scope.md      ← Site map, demos, workflow
│   ├── cover-letter.md       ← Cover letter draft
│   └── copy/
│       ├── home.md           ← Welcome page copy
│       ├── ai.md             ← AI page copy
│       ├── business.md       ← Business page copy
│       └── contact.md        ← Get in Touch page copy
├── src/app/                  ← Next.js App Router (TBD)
├── public/                   ← Static assets
├── AGENTS.md                 ← AI agent rules and workflow
├── CLAUDE.md                 ← Claude-specific instructions
└── .gitignore
```

---

## Status

| Phase | Status |
|-------|--------|
| Phase 1 — Content & Resume | ✅ Complete |
| Phase 2 — Design & Brandkit | 🟡 In progress |
| Phase 3 — Build (Next.js) | ⬜ Not started |
| Phase 4 — Deploy | ⬜ Not started |

**Open blockers:** Hero photo · LinkedIn profile · Domain name · Demo asset production

---

## Key Documents

- [`context/resume.md`](./context/resume.md) — Resume source
- [`context/design.md`](./context/design.md) — Design direction
- [`context/project-scope.md`](./context/project-scope.md) — Full project scope
- [`AGENTS.md`](./AGENTS.md) — AI agent workflow rules
- [`CLAUDE.md`](./CLAUDE.md) — Claude-specific instructions

---

## Contact

**Pierre Belon Savon**
AI Engineer · Ocean Shores, WA · Trilingual (EN / ES / IT)
[belonsavon@gmail.com](mailto:belonsavon@gmail.com) · 360-660-2460 · [github.com/belonsavon-sys](https://github.com/belonsavon-sys)
