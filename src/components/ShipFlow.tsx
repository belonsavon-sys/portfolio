"use client";

import { useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────────────
// SHIP CODE — async script of how a brief becomes shipped code.
// `c` codes: k = keyword (accent), m = comment (muted), g = human
// gate marker (result-green). Spaces baked into segments so the
// trailing `// comment` for each line aligns at column 50.
// ─────────────────────────────────────────────────────────────────────

type ShipSeg = { c?: "k" | "m" | "g"; t: string };

const SHIP_CODE: ShipSeg[][] = [
  [{ c: "m", t: "// ~/atlas/main.ts · how a brief becomes shipped code" }],
  [],
  [
    { c: "k", t: "const" },
    { t: " brief    = " },
    { c: "k", t: "await" },
    { t: " pierre.drop()              " },
    { c: "m", t: "// ~10 min" },
  ],
  [
    { c: "k", t: "const" },
    { t: " route    = " },
    { c: "k", t: "await" },
    { t: " ceo.route(brief)           " },
    { c: "m", t: "//   → cfo · scope" },
  ],
  [
    { t: "                                                  " },
    { c: "m", t: "//   → cmo · voice" },
  ],
  [
    { c: "k", t: "const" },
    { t: " spec     = " },
    { c: "k", t: "await" },
    { t: " csuite.draft(route)        " },
    { c: "m", t: "// ~1 day" },
  ],
  [
    { c: "k", t: "await" },
    { t: " pierre.approve(spec)                        " },
    { c: "g", t: "// ← human gate" },
  ],
  [],
  [
    { c: "k", t: "const" },
    { t: " tickets  = " },
    { c: "k", t: "await" },
    { t: " manager.split(spec)        " },
    { c: "m", t: "// per ticket" },
  ],
  [
    { c: "k", t: "for" },
    { t: " (" },
    { c: "k", t: "const" },
    { t: " ticket " },
    { c: "k", t: "of" },
    { t: " tickets) {" },
  ],
  [
    { t: "  " },
    { c: "k", t: "const" },
    { t: " pr   = " },
    { c: "k", t: "await" },
    { t: " field.implement(ticket)      " },
    { c: "m", t: "//   code · tests · PR" },
  ],
  [
    { t: "  " },
    { c: "k", t: "await" },
    { t: " pierre.merge(pr)                          " },
    { c: "g", t: "// ← human gate" },
  ],
  [{ t: "}" }],
  [],
  [
    { c: "k", t: "await" },
    { t: " atlas.watch(prod)                           " },
    { c: "m", t: "// always on" },
  ],
  [{ c: "m", t: "// incidents → new tickets → loop" }],
];

// ─────────────────────────────────────────────────────────────────────
// SHIP STEPS — the five stages a brief moves through, used by the
// `flow` view. Gates fire after the indexed step ("spec" → before
// build, "ship" → before operate) — matching the two `← human gate`
// comments in the code view.
// ─────────────────────────────────────────────────────────────────────

type ShipStep = { actor: string; name: string; timing: string };

const SHIP_STEPS: ShipStep[] = [
  { actor: "pierre.drop()", name: "brief", timing: "~10 min" },
  { actor: "csuite.draft(route)", name: "spec", timing: "~1 day" },
  { actor: "field.implement()", name: "build", timing: "per ticket" },
  { actor: "pr filed · merged", name: "ship", timing: "per PR" },
  { actor: "atlas.watch(prod)", name: "operate", timing: "always on" },
];

// Human gates fire AFTER these step indices (spec, ship).
const GATES = new Set([1, 3]);

type View = "code" | "flow";

export function ShipFlow() {
  const [view, setView] = useState<View>("flow");

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-bg-light-2">
      {/* Header strip — file path + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border-light px-5 py-3 sm:px-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px]">
          <span className="text-accent">— ~/atlas/main.ts</span>
          <span aria-hidden="true" className="text-text-light-muted">
            ·
          </span>
          <span className="text-text-light-muted">
            {view === "flow"
              ? "brief → spec → build → ship → operate"
              : "how a brief becomes shipped code"}
          </span>
        </div>

        {/* Toggle — two-button segmented control. Flow first so the
            diagram lands as the default, code second as the reveal
            for anyone who wants to read the harness. */}
        <div
          aria-label="Workflow view"
          className="flex shrink-0 rounded-full border border-border-light bg-bg-light p-0.5"
          role="tablist"
        >
          {(["flow", "code"] as View[]).map((v) => (
            <button
              aria-pressed={view === v}
              aria-selected={view === v}
              className={`rounded-full px-3 py-1 font-mono text-[10.5px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                view === v
                  ? "bg-accent text-text-dark"
                  : "text-text-light-muted hover:text-text-light"
              }`}
              key={v}
              onClick={() => setView(v)}
              role="tab"
              type="button"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Body — flow or code */}
      {view === "flow" ? <FlowViewPerimeter /> : <CodeView />}
    </div>
  );
}

function CodeView() {
  return (
    <pre className="overflow-x-auto px-5 py-7 font-mono text-[12.5px] leading-[1.85] text-text-light sm:px-7 sm:py-9 sm:text-[14px] sm:leading-[2]">
      {SHIP_CODE.map((line, i) => (
        <div className="whitespace-pre" key={i}>
          {line.length === 0
            ? " "
            : line.map((seg, j) => {
                const cls =
                  seg.c === "k"
                    ? "text-accent"
                    : seg.c === "m"
                      ? "text-text-light-muted"
                      : seg.c === "g"
                        ? "text-result-green"
                        : undefined;
                return (
                  <span className={cls} key={j}>
                    {seg.t}
                  </span>
                );
              })}
        </div>
      ))}
    </pre>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FLOW VIEW (LANES) — vertical lane-swim sequence diagram. Five
// participants run as vertical lanes (you / engine / c-suite /
// execution / prod). Time flows top→bottom; messages are horizontal
// arrows that cross between lanes at successive rows. The active
// message highlights bright green, past messages dim, future
// messages are invisible until their turn. A faint horizontal "time
// cursor" band follows the active row.
//
// To revert to the perimeter-trace flow, swap `<FlowView />` for
// `<FlowViewPerimeter />` inside `ShipFlow.tsx`.
// ─────────────────────────────────────────────────────────────────────

const LANE_X = [80, 240, 400, 560, 720] as const;

const PARTICIPANTS = [
  { id: "you", label: "you" },
  { id: "engine", label: "engine" },
  { id: "csuite", label: "c-suite" },
  { id: "execution", label: "execution" },
  { id: "prod", label: "prod" },
] as const;
type Participant = (typeof PARTICIPANTS)[number]["id"];
const PIDX: Record<Participant, number> = {
  csuite: 2,
  engine: 1,
  execution: 3,
  prod: 4,
  you: 0,
};

type LaneMessage = {
  from: Participant;
  gated?: boolean;
  label: string;
  to: Participant;
};

const LANE_MESSAGES: LaneMessage[] = [
  { from: "you", label: "brief #2104", to: "engine" },
  { from: "engine", label: "route · cmo + cfo", to: "csuite" },
  { from: "csuite", label: "spec for review", to: "you" },
  { from: "you", gated: true, label: "approved · build it", to: "execution" },
  { from: "execution", label: "PR filed · tests green", to: "you" },
  { from: "you", gated: true, label: "merge · ship", to: "prod" },
  { from: "prod", label: "incidents → next brief", to: "engine" },
];

const LANE_MESSAGE_Y = [78, 122, 166, 210, 254, 298, 342];
const LANE_TICK_MS = 1400;
const LANE_DRAW_MS = 500;

function FlowView() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % LANE_MESSAGES.length);
    }, LANE_TICK_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div>
      <div className="overflow-x-auto px-5 py-8 sm:px-7 sm:py-10">
        <svg
          aria-hidden="true"
          className="block"
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: "100%",
            minWidth: "720px",
            width: "100%",
          }}
          viewBox="0 0 800 380"
        >
          {/* Time-cursor band — faint green row highlight that follows
              the active message vertically. */}
          {!reduce ? (
            <rect
              fill="rgba(16,185,129,0.06)"
              height="40"
              style={{ transition: "y 0.4s ease" }}
              width="800"
              x="0"
              y={(LANE_MESSAGE_Y[activeIdx] ?? 0) - 20}
            />
          ) : null}

          {/* Lifelines — vertical dashed lines descending from each
              participant header. */}
          {PARTICIPANTS.map((p, i) => (
            <line
              key={`lifeline-${p.id}`}
              stroke="rgba(41,110,214,0.18)"
              strokeDasharray="3 4"
              strokeWidth="1"
              x1={LANE_X[i]}
              x2={LANE_X[i]}
              y1="44"
              y2="368"
            />
          ))}

          {/* Lane headers — participant labels in pill boxes at top. */}
          {PARTICIPANTS.map((p, i) => (
            <g key={`header-${p.id}`}>
              <rect
                fill="rgb(255,255,255)"
                height="30"
                rx="6"
                stroke="rgba(41,110,214,0.45)"
                strokeWidth="1.2"
                width="112"
                x={LANE_X[i] - 56}
                y="10"
              />
              <text
                fill="rgb(15,23,42)"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
                x={LANE_X[i]}
                y="30"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Message arrows — one per row, with label above and gate
              badge below for gated messages. */}
          {LANE_MESSAGES.map((m, i) => {
            const y = LANE_MESSAGE_Y[i]!;
            const fromX = LANE_X[PIDX[m.from]];
            const toX = LANE_X[PIDX[m.to]];
            const goingRight = toX > fromX;
            const ahx = goingRight ? toX - 8 : toX + 8;
            const isActive = !reduce && i === activeIdx;
            const isPast = !reduce && i < activeIdx;
            const drawn = reduce || isActive || isPast;
            const color = isActive
              ? "rgb(16,185,129)"
              : "rgb(100,116,139)";
            const sw = isActive ? 2.2 : 1.4;
            const op = reduce ? 1 : isActive ? 1 : isPast ? 0.55 : 0.18;
            return (
              <g
                key={i}
                opacity={op}
                style={{ transition: "opacity 0.4s ease" }}
              >
                <line
                  pathLength={100}
                  stroke={color}
                  strokeDasharray="100"
                  strokeDashoffset={drawn ? 0 : 100}
                  strokeLinecap="round"
                  strokeWidth={sw}
                  style={{
                    transition: `stroke-dashoffset ${LANE_DRAW_MS}ms linear, stroke 0.4s ease, stroke-width 0.4s ease`,
                  }}
                  x1={fromX}
                  x2={toX}
                  y1={y}
                  y2={y}
                />
                <path
                  d={`M ${ahx} ${y - 5} L ${toX} ${y} L ${ahx} ${y + 5}`}
                  fill="none"
                  opacity={drawn ? 1 : 0}
                  stroke={color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={sw}
                  style={{
                    transition: drawn
                      ? `opacity 0.15s linear ${LANE_DRAW_MS - 50}ms, stroke 0.4s ease`
                      : "opacity 0.15s linear, stroke 0.4s ease",
                  }}
                />
                <text
                  fill={color}
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  fontSize="11"
                  fontWeight={isActive ? 600 : 500}
                  style={{ transition: "fill 0.4s ease" }}
                  textAnchor="middle"
                  x={(fromX + toX) / 2}
                  y={y - 10}
                >
                  {m.label}
                </text>
                {m.gated ? (
                  <g>
                    <rect
                      fill={
                        isActive
                          ? "rgba(16,185,129,0.18)"
                          : "rgba(16,185,129,0.08)"
                      }
                      height="16"
                      rx="8"
                      stroke="rgb(16, 185, 129)"
                      strokeWidth={isActive ? 1.2 : 0.8}
                      style={{ transition: "all 0.4s ease" }}
                      width="76"
                      x={(fromX + toX) / 2 - 38}
                      y={y + 8}
                    />
                    <text
                      fill="rgb(16, 185, 129)"
                      fontFamily="ui-monospace, SFMono-Regular, monospace"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      x={(fromX + toX) / 2}
                      y={y + 19}
                    >
                      human gate
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Loop indicator */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-light px-5 py-3 font-mono text-[11px] sm:px-7">
        <span aria-hidden="true" className="text-accent">
          ↻
        </span>
        <span className="text-text-light-muted">
          time flows down · loop continues forever
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FLOW VIEW (PERIMETER) — option a, kept for easy reversion. Wires
// the light around each card's perimeter (split top + bottom halves
// meeting at the right edge), then continues into the next arrow.
// Re-enable by swapping `<FlowView />` for `<FlowViewPerimeter />` in
// the ShipFlow body.
// ─────────────────────────────────────────────────────────────────────

const TOTAL_PHASES = SHIP_STEPS.length * 2 - 1; // 9 for 5 steps
const CARD_PHASE_MS = 1100; // perimeter trace duration
const ARROW_PHASE_MS = 600; // arrow draw duration

function FlowViewPerimeter() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);

  // Phase ticker — card phases hold longer than arrow phases, so the
  // perimeter trace has room to breathe. Recomputes its own timeout
  // each tick (instead of a uniform interval) so card / arrow can
  // have independent durations.
  useEffect(() => {
    if (reduce) return;
    const dur = phase % 2 === 0 ? CARD_PHASE_MS : ARROW_PHASE_MS;
    const id = window.setTimeout(() => {
      setPhase((p) => (p + 1) % TOTAL_PHASES);
    }, dur);
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex w-max items-stretch px-6 py-12 sm:px-8 sm:py-14">
          {SHIP_STEPS.map((step, i) => (
            <Fragment key={step.name}>
              <StepCard
                active={!reduce && phase === i * 2}
                index={i + 1}
                step={step}
              />
              {i < SHIP_STEPS.length - 1 ? (
                <FlowArrow
                  active={!reduce && phase === i * 2 + 1}
                  gated={GATES.has(i)}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Operating-loop indicator */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-light px-5 py-3 font-mono text-[11px] sm:px-7">
        <span aria-hidden="true" className="text-accent">
          ↻
        </span>
        <span className="text-text-light-muted">
          operate → incidents → new briefs · the loop continues
        </span>
      </div>
    </div>
  );
}

type StepCardProps = {
  active: boolean;
  index: number;
  step: ShipStep;
};

function StepCard({ active, index, step }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState<{ h: number; w: number }>({ h: 0, w: 0 });

  // Measure card on mount + resize so the perimeter SVG paths line
  // up exactly with the card's actual border (rounded corners, real
  // width/height — not normalised viewBox guesses).
  useEffect(() => {
    function measure() {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setDims({ h: r.height, w: r.width });
    }
    measure();
    const t = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      className="relative flex min-w-[160px] flex-col items-start rounded-xl border border-accent/35 bg-bg-light px-4 py-4"
      ref={cardRef}
    >
      <div className="font-mono text-[10px] text-accent">
        {String(index).padStart(2, "0")} · step
      </div>
      <div className="mt-2 font-mono text-[16px] font-semibold text-text-light">
        {step.name}
      </div>
      <div className="mt-1 font-mono text-[10px] text-text-light-muted">
        {step.timing}
      </div>
      <div className="mt-3 w-full border-t border-border-light pt-2 font-mono text-[9.5px] text-text-light-muted/85">
        {step.actor}
      </div>

      {/* Perimeter trace — two SVG paths overlay the card's border.
          When active, both `dashoffset` animate from full → 0 over
          the card phase duration, drawing top-half (left→top→right)
          and bottom-half (left→bottom→right) at the same time. The
          two strokes meet at the right edge and the next phase picks
          up at the arrow. */}
      <PerimeterTrace active={active} h={dims.h} w={dims.w} />
    </div>
  );
}

function PerimeterTrace({
  active,
  h,
  w,
}: {
  active: boolean;
  h: number;
  w: number;
}) {
  if (w < 1 || h < 1) return null;
  const R = 12; // matches rounded-xl
  const my = h / 2;
  // Top half — left-middle → up → top-left corner → top edge → top-
  // right corner → right-middle.
  const topD = [
    `M 0 ${my}`,
    `L 0 ${R}`,
    `A ${R} ${R} 0 0 1 ${R} 0`,
    `L ${w - R} 0`,
    `A ${R} ${R} 0 0 1 ${w} ${R}`,
    `L ${w} ${my}`,
  ].join(" ");
  // Bottom half — same shape, mirrored across the horizontal axis.
  const bottomD = [
    `M 0 ${my}`,
    `L 0 ${h - R}`,
    `A ${R} ${R} 0 0 0 ${R} ${h}`,
    `L ${w - R} ${h}`,
    `A ${R} ${R} 0 0 0 ${w} ${h - R}`,
    `L ${w} ${my}`,
  ].join(" ");

  const stroke = "rgb(16, 185, 129)";
  const widthPx = 2.2;
  // pathLength="100" normalises both halves so dasharray="100" +
  // dashoffset 100 → 0 fills each half regardless of perimeter.
  const dashStyle: CSSProperties = {
    transition: active
      ? `stroke-dashoffset ${CARD_PHASE_MS - 100}ms linear`
      : `stroke-dashoffset 0ms`,
  };
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      height={h}
      style={{
        filter: active
          ? "drop-shadow(0 0 6px rgba(16,185,129,0.65))"
          : "none",
      }}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
    >
      <path
        d={topD}
        fill="none"
        pathLength={100}
        stroke={stroke}
        strokeDasharray="100"
        strokeDashoffset={active ? 0 : 100}
        strokeLinecap="round"
        strokeWidth={widthPx}
        style={dashStyle}
      />
      <path
        d={bottomD}
        fill="none"
        pathLength={100}
        stroke={stroke}
        strokeDasharray="100"
        strokeDashoffset={active ? 0 : 100}
        strokeLinecap="round"
        strokeWidth={widthPx}
        style={dashStyle}
      />
    </svg>
  );
}

function FlowArrow({
  active,
  gated,
}: {
  active: boolean;
  gated: boolean;
}) {
  return (
    <div className="relative mx-2 flex items-center sm:mx-3">
      {/* Single SVG carrying BOTH the resting gray stroke and the
          active green stroke. Both layers share the same coordinate
          space (viewBox 0 0 64 14), so the green stroke draws
          directly on top of the gray one — no flex/absolute layout
          gap that would push the active layer above the resting one. */}
      <svg
        aria-hidden="true"
        className="block"
        height="14"
        viewBox="0 0 64 14"
        width="64"
      >
        {/* Resting layer — gray, always visible */}
        <line
          stroke="rgb(226, 232, 240)"
          strokeLinecap="round"
          strokeWidth="1.6"
          x1="0"
          x2="56"
          y1="7"
          y2="7"
        />
        <path
          d="M 54 3 L 62 7 L 54 11"
          fill="none"
          stroke="rgb(226, 232, 240)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />

        {/* Active overlay — green, draws in via stroke-dashoffset
            during the arrow phase. Sits exactly on top of the gray
            stroke because it's in the same SVG. */}
        <g
          style={{
            filter: active
              ? "drop-shadow(0 0 5px rgba(16,185,129,0.7))"
              : "none",
          }}
        >
          <line
            pathLength={100}
            stroke="rgb(16, 185, 129)"
            strokeDasharray="100"
            strokeDashoffset={active ? 0 : 100}
            strokeLinecap="round"
            strokeWidth="2"
            style={{
              transition: active
                ? `stroke-dashoffset ${ARROW_PHASE_MS - 50}ms linear`
                : `stroke-dashoffset 0ms`,
            }}
            x1="0"
            x2="56"
            y1="7"
            y2="7"
          />
          <path
            d="M 54 3 L 62 7 L 54 11"
            fill="none"
            stroke="rgb(16, 185, 129)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            style={{
              opacity: active ? 1 : 0,
              transition: active
                ? `opacity 80ms linear ${ARROW_PHASE_MS - 120}ms`
                : "opacity 0ms",
            }}
          />
        </g>
      </svg>

      {/* Gate badge — sits above the arrow, only when this transition
          requires a human review/merge. Bursts when the trace is
          drawing through. */}
      {gated ? (
        <div
          className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium transition-all duration-200 ${
            active
              ? "border-result-green bg-result-green/15 text-result-green shadow-[0_0_0_3px_rgba(16,185,129,0.18),0_0_16px_rgba(16,185,129,0.55)]"
              : "border-result-green/45 bg-bg-light text-result-green"
          }`}
        >
          human gate
        </div>
      ) : null}
    </div>
  );
}
