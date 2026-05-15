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
