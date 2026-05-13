<div align="center">

# Pierre Belon Savon — Portfolio

**AI Engineer · Ocean Shores, WA · Trilingual EN / ES / IT**

I build AI for businesses that have to actually run. Most of it I shipped while running one.

[**Live site →**](https://portfolio-psi-six-hz0jclbxci.vercel.app)

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## Preview

<p align="center">
  <img src="./docs/screenshot.png" alt="Portfolio home — Pierre Belon Savon hero" width="100%" />
</p>

<p align="center">
  <img src="./docs/screenshot-atlas.png" alt="/atlas — A harness that ships." width="49%" />
  <img src="./docs/screenshot-business.png" alt="/business — I ship AI." width="49%" />
</p>

<p align="center">
  <img src="./docs/screenshot-lab.png" alt="/lab — The Lab" width="49%" />
  <img src="./docs/screenshot-resume.png" alt="/resume — Pierre Belon Savon resume" width="49%" />
</p>

---

## Site map

| Route | Purpose | Highlights |
|------|---------|------------|
| `/` | Welcome | GlitchTitle hero, last-shipped ticker, commit ticker, hero avatar |
| `/atlas` | Atlas deep-dive | Multi-agent harness — five layers, three products live, live Anthropic demo |
| `/business` | Business case | Bento grid of operator-facing capabilities, before/after diagrams, finance precision card |
| `/resume` | Resume | Full resume on-page, `Download my résumé ↓` PDF, B&W print stylesheet |
| `/lab` | The Lab | What I'm shipping right now, demos in-browser, tools I pay for, how I built this site — one scroll instead of four routes |

---

## Live AI demos

Both demos surface on `/atlas`.

**Demo 1 — five tasks running on your device, zero cloud:**

| Tab | Model | Task |
|-----|-------|------|
| Image Classification | MobileNet v4 | Top-5 ImageNet classification |
| LLM Chat | SmolLM2-135M | On-device text generation |
| Computer Vision | CLIP ViT-B/16 | Live webcam zero-shot gesture classification |
| Speech to Text | Whisper Tiny.en | Audio file → transcript |
| Semantic Search | mxbai-embed-xsmall | Embeddings + cosine ranking |

Models load via `@huggingface/transformers`, run on WebGPU when available, fall back to WASM on machines without WebGPU.

**Demo 2 — Atlas multi-agent harness:** sends your prompt to a Node API route at `/api/atlas/run` which calls `claude-haiku-4-5` with a system prompt that returns structured agent-routing JSON. The 3-pane UI plays back the live response (terminal stream · DB rows · task board). Falls back to a scripted simulation if the API is unavailable, rate-limited, or no `ANTHROPIC_API_KEY` is set.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 + CSS variables for design tokens |
| Animation | Framer Motion + custom CSS keyframes (glitch, scramble, page-atmosphere, light-switch) |
| Local AI | `@huggingface/transformers` (WebGPU + WASM fallback) |
| Live AI | `@anthropic-ai/sdk` (Atlas demo only, server route) |
| Brand logos | `simple-icons` |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` |
| Deployment | Vercel (Fluid Compute) |
| Source of truth for content | `context/*.md` |

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

To run the live Atlas demo locally:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local
npm run dev
```

Without an API key, the Atlas demo falls back to its scripted simulation.

---

## Design notes

The site has a single visual signature:

- **GlitchTitle** — section headers sit dark, flicker subtly at rest, and pop deep-emerald x-ray on a 5s heartbeat. All four animations share 71→72 on / 87→88 off keyframes.
- **PageAtmosphere** — a soft radial glow behind every page, drifting on a slow loop.
- **TextScramble + cursor** — hero copy scrambles in on first paint.
- **LightSwitch** — top-right toggle that swaps the atmosphere palette.

Each route adds one per-page wow beat on top of the shared layer.

---

## Workflow

```mermaid
flowchart LR
  Pierre[Pierre]
  Claude[Claude<br/>thinking + code]
  Codex[Codex<br/>code]
  PR[Draft PR]
  Main[main branch]
  Vercel[Vercel build]
  Live[Live site]

  Pierre --> Claude
  Pierre --> Codex
  Claude --> PR
  Codex --> PR
  PR --> Main
  Main --> Vercel --> Live

  style Pierre fill:#fef3c7,stroke:#f59e0b,color:#0f172a
  style Claude fill:#fef3c7,stroke:#f59e0b,color:#0f172a
  style Codex fill:#dbeafe,stroke:#3b82f6,color:#0f172a
  style PR fill:#e0f7ff,stroke:#296ed6,color:#0f172a,stroke-width:2px
  style Main fill:#ffffff,stroke:#296ed6,color:#0f172a,stroke-width:2px
  style Vercel fill:#0a0e1a,stroke:#5b9bf4,color:#f8fafc
  style Live fill:#d1fae5,stroke:#10b981,color:#0f172a,stroke-width:2px
```

All work goes through pull requests against `main`. Vercel deploys on merge.

---

## Project structure

```
portfolio/
├── context/                        # source of truth for content
│   ├── resume.md
│   ├── design.md
│   ├── project-scope.md
│   └── copy/                       # per-page copy
├── docs/                           # README screenshots
├── public/                         # photos, resume PDF, OG-relevant assets
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/atlas/run/          # Anthropic API route (live Atlas demo)
│   │   ├── atlas/                  # Atlas deep-dive
│   │   ├── business/
│   │   ├── resume/
│   │   ├── lab/                    # The Lab
│   │   ├── page.tsx                # home
│   │   ├── layout.tsx              # root + SiteHeader + Analytics + PageAtmosphere
│   │   ├── globals.css
│   │   ├── icon.tsx                # generated favicon
│   │   ├── opengraph-image.tsx     # generated OG card
│   │   └── not-found.tsx
│   └── components/                 # shared primitives (GlitchTitle, TextScramble, CommitTicker, …)
├── AGENTS.md                       # AI agent rules
├── CLAUDE.md                       # Claude-specific instructions
└── README.md
```

---

## Key documents

- [`context/resume.md`](./context/resume.md)
- [`context/design.md`](./context/design.md)
- [`context/project-scope.md`](./context/project-scope.md)
- [`AGENTS.md`](./AGENTS.md)
- [`CLAUDE.md`](./CLAUDE.md)

---

## Contact

**Pierre Belon Savon** — AI Engineer

[belonsavon@gmail.com](mailto:belonsavon@gmail.com) · 360-660-2460
[github.com/belonsavon-sys](https://github.com/belonsavon-sys) · [linkedin.com/in/pierre-belon-8366b8407](https://www.linkedin.com/in/pierre-belon-8366b8407)
