# Pierre Belon Savon — Portfolio 

AI engineer portfolio focused on measurable business outcomes.

## Live Preview
- OG preview image: `public/og-preview.png` (or generated OpenGraph route)

## Quick Start
```bash
npm install
npm run dev
```

## Site Map
| Page | Route | Description | Status |
|---|---|---|---|
| Home | `/` | Hero, Outcomes, About, Beyond the Code, Stack, CTA | ✅ |
| AI | `/ai` | Services, case studies, Atlas gallery, Local AI demo, Atlas runtime demo | ✅ |
| Business | `/business` | Blackdoor-led narrative + operations outcomes | ✅ |
| Resume | `/resume` | ATS-friendly resume view + PDF download | ✅ |
| Contact | `/contact` | Direct contact links, no form | ✅ |

## Tech Stack
| Group | Tools |
|---|---|
| Framework | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS, custom design tokens |
| Animation | Framer Motion |
| AI Runtime | Transformers.js (local), Anthropic SDK (server route) |
| Deployment | Vercel |

## Workflow
Build copy in `context/` first, then implement in `src/`, then validate with TypeScript/lint/build before merge.

```mermaid
flowchart LR
  A[Context updates] --> B[Implementation]
  B --> C[Validation]
  C --> D[PR + Review]
  style A fill:#eef6ff,stroke:#296ed6,rx:8,ry:8
  style B fill:#eef6ff,stroke:#296ed6,rx:8,ry:8
  style C fill:#eef6ff,stroke:#296ed6,rx:8,ry:8
  style D fill:#e8fff4,stroke:#10b981,rx:8,ry:8
```

## Project Structure
- `context/` source-of-truth content and design direction
- `src/app/` routes/pages
- `src/components/` reusable UI and demo primitives
- `public/` static assets
