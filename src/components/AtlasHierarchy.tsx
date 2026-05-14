"use client";

import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";

// Register the ScrollTrigger plugin once at module load. The SSR
// guard prevents the registration from running during static build,
// where `window` is undefined and the plugin's setup would throw.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type LayerSignatureKind =
  | "founders"
  | "engine"
  | "csuite"
  | "execution"
  | "products";

export type AtlasHierarchyLayer = {
  badge: string;
  description?: string;
  items: string[];
  signature?: LayerSignatureKind;
  title: string;
};

export type AtlasHierarchyProps = {
  layers: AtlasHierarchyLayer[];
};

// ─────────────────────────────────────────────────────────────────────
// SCHEMATIC LAYOUT — measurements are in viewBox units. The canvas is
// 1100×860; the SVG scales to its container so all geometry below is
// stable and the wire-routing math doesn't depend on screen pixels.
// ─────────────────────────────────────────────────────────────────────
const VB_W = 1100;
const VB_H = 900;

const DEPTH_MS = 380;
const CORNER_R = 9;

// Sequential cascade — each depth gets its own 1s window inside a
// 4.5s loop. depth 0 fires alone, arrives at engine, engine "splits"
// into depth 1's three trails, etc. Pulse travels its wire in ~0.81s
// (keyTime 0.04 → 0.22 of the cycle), then waits at the end for the
// other depths to take their turn before the cascade restarts.
const CYCLE_S = 4.5;
const PER_DEPTH_S = 1.0;
const PULSE_END_KT = 0.22;

const ROW_Y = [80, 220, 440, 620, 790];

// Engine is intentionally larger — it is the visual focal point and
// hosts an internal silkscreen, LED bank, and live activity ticker.
// The non-engine rows are sized to comfortably hold a primary label
// plus a meta line and (where relevant) a small status indicator.
const ROW_GEOM = [
  { h: 76, w: 260 }, // 0  founders
  { h: 124, w: 420 }, // 1  engine — the chip
  { h: 72, w: 190 }, // 2  c-suite
  { h: 76, w: 230 }, // 3  execution
  { h: 84, w: 280 }, // 4  products
];

// Continuously scrolling "harness activity log" inside the engine
// chip. Each line is a believable agent-system event; the marquee
// loops it so the chip always feels live.
const ENGINE_TICKER =
  "→ route ceo · brief #2104    → spec ready · #2105    → manager picked up #2103    → field merge · #2102 ok    → cfo scope · 2h    → audit flush ok    → pr open · #2107    → tests passed · #2107    ";

function fanCols(n: number): number[] {
  switch (n) {
    case 1:
      return [610];
    case 2:
      return [410, 810];
    case 3:
      return [270, 610, 950];
    case 4:
      return [220, 480, 740, 1000];
    default:
      return Array.from({ length: n }, (_, i) => 270 + (i * 680) / (n - 1));
  }
}

type NodePos = {
  cx: number;
  cy: number;
  h: number;
  label: string;
  w: number;
};

type LayerLayout = {
  badge: string;
  description?: string;
  kind?: LayerSignatureKind;
  nodes: NodePos[];
  title: string;
};

function buildLayout(layers: AtlasHierarchyLayer[]): LayerLayout[] {
  return layers.map((layer, i) => {
    const y = ROW_Y[i] ?? 80 + i * 160;
    const geom = ROW_GEOM[i] ?? { h: 60, w: 200 };
    const cols = fanCols(layer.items.length);
    return {
      badge: layer.badge,
      description: layer.description,
      kind: layer.signature,
      nodes: layer.items.map((label, j) => ({
        cx: cols[j] ?? cols[0]!,
        cy: y + geom.h / 2,
        h: geom.h,
        label,
        w: geom.w,
      })),
      title: layer.title,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────
// WIRE ROUTING — orthogonal traces with rounded corners. Bipartite
// gaps get channel-staggered Ys so the horizontal segments don't
// overlap; fan-out / fan-in gaps share a single channel.
// ─────────────────────────────────────────────────────────────────────

type Edge = {
  channelY: number;
  childIdx: number;
  d: string;
  depth: number;
  from: { x: number; y: number };
  id: string;
  parentIdx: number;
  to: { x: number; y: number };
};

function orthoPath(
  px: number,
  py: number,
  cx: number,
  cy: number,
  channelY: number,
): string {
  if (Math.abs(px - cx) < 0.5) {
    return `M ${px} ${py} L ${cx} ${cy}`;
  }
  const r = CORNER_R;
  const dx = Math.sign(cx - px);
  return [
    `M ${px} ${py}`,
    `L ${px} ${channelY - r}`,
    `Q ${px} ${channelY} ${px + dx * r} ${channelY}`,
    `L ${cx - dx * r} ${channelY}`,
    `Q ${cx} ${channelY} ${cx} ${channelY + r}`,
    `L ${cx} ${cy}`,
  ].join(" ");
}

function buildEdges(layout: LayerLayout[]): Edge[] {
  // Every layer-pair shares ONE bus at the gap's vertical midpoint.
  // All wires drop to the bus, run horizontally, and drop into their
  // child. Where multiple wires share a horizontal segment they
  // overlap exactly — visually a single system bus, semantically
  // still N×M connections.
  const edges: Edge[] = [];
  for (let depth = 0; depth < layout.length - 1; depth++) {
    const parents = layout[depth]!.nodes;
    const children = layout[depth + 1]!.nodes;
    const parentBottom = parents[0]!.cy + parents[0]!.h / 2;
    const childTop = children[0]!.cy - children[0]!.h / 2;
    const busY = (parentBottom + childTop) / 2;
    parents.forEach((p, pi) => {
      children.forEach((c, ci) => {
        const from = { x: p.cx, y: parentBottom };
        const to = { x: c.cx, y: childTop };
        edges.push({
          channelY: busY,
          childIdx: ci,
          d: orthoPath(from.x, from.y, to.x, to.y, busY),
          depth,
          from,
          id: `e${depth}-${pi}-${ci}`,
          parentIdx: pi,
          to,
        });
      });
    });
  }
  return edges;
}

// ─────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────

export function AtlasHierarchy({ layers }: AtlasHierarchyProps) {
  const reduce = useReducedMotion();
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const layout = useMemo(() => buildLayout(layers), [layers]);
  const edges = useMemo(() => buildEdges(layout), [layout]);

  // Datasheet rows scroll-cascade. Each <li> below the schematic
  // assembles itself when it enters the viewport:
  //
  //   1. The refdes strip fades + slides up (lightest beat)
  //   2. The title clip-paths in from the left and clears a blur —
  //      mirrors the hero title's GSAP reveal pattern so the section
  //      reads as one continuous design language.
  //   3. The body paragraph fades up
  //   4. The three KPI tiles stagger in
  //
  // Timeline beats overlap with negative offsets so the cascade feels
  // brisk, not slideshow-y. `toggleActions: play none none reverse`
  // lets the reveal play forward on scroll-down, snap back on
  // scroll-up — so the rows greet the reader each time, instead of
  // baking in once and staying flat for the rest of the session.
  const datasheetRef = useRef<HTMLOListElement | null>(null);
  useEffect(() => {
    if (reduce) return;
    const ol = datasheetRef.current;
    if (!ol) return;

    const ctx = gsap.context(() => {
      const rows = Array.from(
        ol.querySelectorAll<HTMLLIElement>("li[data-datasheet-row]"),
      );

      rows.forEach((row) => {
        const strip = row.querySelector('[data-row-anim="strip"]');
        const title = row.querySelector('[data-row-anim="title"]');
        const body = row.querySelector('[data-row-anim="body"]');
        const kpis = row.querySelectorAll('[data-row-anim="kpi"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            start: "top 82%",
            toggleActions: "play none none reverse",
            trigger: row,
          },
        });

        if (strip) {
          tl.fromTo(
            strip,
            { opacity: 0, y: 8 },
            { duration: 0.5, ease: "power3.out", opacity: 1, y: 0 },
          );
        }
        if (title) {
          tl.fromTo(
            title,
            {
              clipPath: "inset(0 100% 0 0)",
              filter: "blur(6px)",
              y: 12,
            },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.95,
              ease: "power3.out",
              filter: "blur(0px)",
              y: 0,
            },
            "-=0.3",
          );
        }
        if (body) {
          tl.fromTo(
            body,
            { opacity: 0, y: 16 },
            { duration: 0.7, ease: "power2.out", opacity: 1, y: 0 },
            "-=0.55",
          );
        }
        if (kpis.length > 0) {
          tl.fromTo(
            kpis,
            { opacity: 0, y: 18 },
            {
              duration: 0.55,
              ease: "power2.out",
              opacity: 1,
              stagger: 0.08,
              y: 0,
            },
            "-=0.45",
          );
        }
      });
    }, datasheetRef);

    return () => ctx.revert();
  }, [reduce, layout]);

  return (
    <div>
      {/* HEADER STRIP — minimal silkscreen */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-[11px] text-text-light-muted">
          — {layout.length} layers · brief flows top → bottom
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-2 font-mono text-[11px] text-accent"
        >
          <span aria-hidden="true">↳</span>
          live signal
        </span>
      </div>

      {/* CANVAS */}
      <div className="relative mt-6 overflow-x-auto rounded-2xl border border-border-light bg-bg-light-2">
        <svg
          aria-hidden="true"
          className="block w-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: "900px" }}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
        >
          <SchematicBackground layout={layout} />

          {/* WIRES — rendered before nodes so node bodies cover the
              very last few pixels of each trace neatly. */}
          <g>
            {edges.map((edge) => {
              const isActive =
                activeRow === edge.depth || activeRow === edge.depth + 1;
              const dimmed = activeRow !== null && !isActive;
              return (
                <Wire
                  delay={edge.depth * PER_DEPTH_S}
                  dimmed={dimmed}
                  edge={edge}
                  highlighted={isActive}
                  key={edge.id}
                />
              );
            })}
          </g>

          {/* NODES */}
          <g>
            {layout.map((row, rowIdx) =>
              row.nodes.map((node, nodeIdx) => (
                <Node
                  active={activeRow === rowIdx}
                  delay={rowIdx * (DEPTH_MS / 1000)}
                  key={`n-${rowIdx}-${nodeIdx}`}
                  kind={row.kind}
                  node={node}
                  nodeIdx={nodeIdx}
                  reduce={reduce}
                  rowIdx={rowIdx}
                />
              )),
            )}
          </g>
        </svg>
      </div>

      {/* Section caption — engineering datasheet header. Two mono
          strips: title + sheet metadata. Matches the schematic's
          silkscreen vocabulary. */}
      <div className="mt-16 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] text-text-light-muted">
          <span>
            <span className="text-accent">—</span> atlas · datasheet ·
            layers
          </span>
          <span>sheets 01–05 / rev a · hover → highlight ↑</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
          <span
            className="font-semibold tracking-tight text-text-light"
            style={{
              fontFamily:
                "ui-monospace, var(--font-geist-mono), monospace",
              fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            the layers<span className="text-accent">.</span>
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        </div>
      </div>

      {/* Layer datasheet — each row is a spec-sheet entry for one
          layer. Top strip carries the refdes that links it back to
          the schematic. Title in mono lowercase like the engine
          chip's `Atlas v3`. Description on the left in body sans for
          readability. Right pane is a quiet 3-cell stat block: big
          mono values + tiny mono labels, no live framing. */}
      <ol className="border-y border-border-light" ref={datasheetRef}>
        {layout.map((row, i) => {
          const isActive = activeRow === i;
          const telemetry = LAYER_TELEMETRY[i];
          const refdes = LAYER_REFDES[i] ?? row.badge;
          return (
            <li
              className={`relative cursor-default border-b border-border-light px-2 py-10 transition-colors duration-300 last:border-b-0 sm:px-4 sm:py-12 ${
                isActive ? "bg-bg-light-2/70" : "hover:bg-bg-light-2/40"
              }`}
              data-datasheet-row
              key={row.badge}
              onMouseEnter={() => setActiveRow(i)}
              onMouseLeave={() => setActiveRow(null)}
            >
              {/* TOP STRIP — refdes only. */}
              <div
                className="font-mono text-[11px]"
                data-row-anim="strip"
              >
                <span className="text-accent">
                  <span className="text-text-light-muted">[</span>
                  {row.badge.padStart(2, "0")}
                  <span className="text-text-light-muted"> · </span>
                  {refdes}
                  <span className="text-text-light-muted">]</span>
                </span>
              </div>

              {/* TITLE — mono lowercase, big. Matches the engine
                  chip's typography so the datasheet reads as a series
                  of "chip pages." */}
              <h4
                className="mt-4 font-semibold tracking-tight text-text-light"
                data-row-anim="title"
                style={{
                  fontFamily:
                    "ui-monospace, var(--font-geist-mono), monospace",
                  fontSize: "clamp(1.875rem, 3.6vw, 3rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                }}
              >
                {row.title.toLowerCase()}
                <span className="text-accent">.</span>
              </h4>

              <div className="mt-6 grid grid-cols-12 gap-x-8 gap-y-6">
                {/* LEFT — body description in sans (readability) */}
                <p
                  className="col-span-12 text-[15px] leading-[1.7] text-text-light-muted sm:col-span-7 sm:text-[16px] sm:leading-[1.65]"
                  data-row-anim="body"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans), system-ui, sans-serif",
                  }}
                >
                  {row.description}
                </p>

                {/* RIGHT — at-a-glance numbers panel. Three tiles
                    divided by hairlines: big mono value + a tiny mono
                    label below. No status header, no dashboard
                    framing — just a quiet stat block grounding each
                    layer with concrete numbers. */}
                {telemetry ? (
                  <div className="col-span-12 sm:col-span-5">
                    <div className="grid grid-cols-3 divide-x divide-border-light border-y border-border-light">
                      {telemetry.kpis.map((kpi) => (
                        <div
                          className="px-3 py-4"
                          data-row-anim="kpi"
                          key={kpi.label}
                        >
                          <div
                            className="font-bold tracking-tight text-text-light"
                            style={{
                              fontFamily:
                                "ui-monospace, var(--font-geist-mono), monospace",
                              fontSize: "clamp(1.25rem, 1.8vw, 1.75rem)",
                              letterSpacing: "-0.02em",
                              lineHeight: 1,
                            }}
                          >
                            {kpi.value}
                          </div>
                          <div className="mt-2 font-mono text-[9.5px] leading-snug text-text-light-muted">
                            {kpi.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BACKGROUND — quiet left rail with index + lowercase layer name.
// ─────────────────────────────────────────────────────────────────────

function SchematicBackground({ layout }: { layout: LayerLayout[] }) {
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id="engine-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(16,185,129,0.22)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
        {/* Subtle silicon-die tint on the engine chip body */}
        <linearGradient id="engine-die" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(91,155,244,0.14)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </linearGradient>
        {/* Faint CRT scanlines for the activity-ticker "screen" */}
        <pattern
          height="3"
          id="engine-scanlines"
          patternUnits="userSpaceOnUse"
          width="3"
        >
          <line
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
            x1="0"
            x2="3"
            y1="1.5"
            y2="1.5"
          />
        </pattern>
      </defs>

      {/* LEFT RAIL — just the index + lowercase layer name, no rail
          line, no dots. Quiet but legible. */}
      {layout.map((row) => {
        const yMid = row.nodes[0]!.cy;
        return (
          <g key={`rail-${row.badge}`}>
            <text
              fill="rgb(41, 110, 214)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="13"
              fontWeight={600}
              x="36"
              y={yMid - 4}
            >
              {row.badge}
            </text>
            <text
              fill="rgb(100, 116, 139)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="11"
              x="36"
              y={yMid + 14}
            >
              {row.title.toLowerCase().split(" ")[0]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// WIRE — orthogonal trace with a green pulse riding the path.
// ─────────────────────────────────────────────────────────────────────

function Wire({
  delay,
  dimmed,
  edge,
  highlighted,
}: {
  delay: number;
  dimmed: boolean;
  edge: Edge;
  highlighted: boolean;
}) {
  const baseOpacity = dimmed ? 0.1 : 1;
  const baseColor = highlighted ? "rgb(16, 185, 129)" : "rgb(41, 110, 214)";
  const baseStrokeWidth = highlighted ? 2.2 : 1.6;

  return (
    <g style={{ opacity: baseOpacity, transition: "opacity 220ms ease" }}>
      {/* Resting trace — always visible. The wire itself. */}
      <path
        d={edge.d}
        fill="none"
        stroke={baseColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={baseStrokeWidth}
        style={{
          filter: highlighted
            ? "drop-shadow(0 0 4px rgba(16,185,129,0.55))"
            : "none",
          transition:
            "stroke 220ms ease, stroke-width 220ms ease, filter 220ms ease",
        }}
      />

      {/* Pulse trail — a bright green 18-unit segment (path normalized
          to length 100) glides along the wire. Reads like a comet of
          light rather than a single dot. Cycle: CYCLE_S; delay sets
          the depth offset so the cascade visibly travels 01 → 05. */}
      <path
        d={edge.d}
        fill="none"
        opacity={0}
        pathLength={100}
        stroke="rgb(16, 185, 129)"
        strokeDasharray="18 9999"
        strokeLinecap="round"
        strokeWidth={3.4}
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(16,185,129,0.95)) drop-shadow(0 0 20px rgba(16,185,129,0.5))",
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          begin={`${delay}s`}
          dur={`${CYCLE_S}s`}
          keyTimes="0;0.04;0.22;1"
          repeatCount="indefinite"
          values="0;0;-118;-118"
        />
        <animate
          attributeName="opacity"
          begin={`${delay}s`}
          dur={`${CYCLE_S}s`}
          keyTimes="0;0.04;0.20;0.25;1"
          repeatCount="indefinite"
          values="0;1;1;0;0"
        />
      </path>
    </g>
  );
}

function primaryFor(
  kind: LayerSignatureKind | undefined,
  label: string,
): string {
  // Strip a trailing " · descriptor" suffix when there's exactly one
  // separator — the descriptor moves to the meta line below. Lists
  // like "Game · Budget · PM" (3 parts) stay intact.
  void kind;
  const parts = label.split(" · ");
  if (parts.length === 2) return parts[0]!;
  return label;
}

// Per-layer designator that gets stamped on the datasheet row's top
// silkscreen strip. Mirrors the engineering vocabulary the schematic
// uses for its components (J = connector / jack, U = chip, OUT =
// output rail). Founders are the "input connector" to the harness;
// engine is the main IC; c-suite/execution are auxiliary chips; the
// products are the output rails.
const LAYER_REFDES: Record<number, string> = {
  0: "J1",
  1: "U1",
  2: "U2..U4",
  3: "U5..U6",
  4: "OUT1..4",
};

// ─────────────────────────────────────────────────────────────────────
// LAYER STATS — three at-a-glance numbers per layer. No "live" framing
// and no dashboard chrome — these are concrete facts about each layer
// of the harness, presented as a small spec block.
// ─────────────────────────────────────────────────────────────────────

type LayerKpi = { label: string; value: string };
type LayerTelemetry = {
  kpis: LayerKpi[];
};

const LAYER_TELEMETRY: Record<number, LayerTelemetry> = {
  0: {
    kpis: [
      { label: "humans on staff", value: "2" },
      { label: "employees", value: "0" },
      { label: "roles", value: "2" },
    ],
  },
  1: {
    kpis: [
      { label: "version", value: "v3" },
      { label: "layers managed", value: "5" },
      { label: "products powered", value: "3" },
    ],
  },
  2: {
    kpis: [
      { label: "agents", value: "3" },
      { label: "tier", value: "strategic" },
      { label: "audit log", value: "all" },
    ],
  },
  3: {
    kpis: [
      { label: "tiers", value: "2" },
      { label: "PR gate", value: "human-reviewed" },
      { label: "test coverage", value: "100%" },
    ],
  },
  4: {
    kpis: [
      { label: "apps shipped", value: "4" },
      { label: "client-facing", value: "4 / 4" },
      { label: "deployments", value: "per PR" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────
// NODE — clean rounded card with name + meta line. Non-engine kinds
// also get small status / live indicators that match what they do.
// ─────────────────────────────────────────────────────────────────────

function Node({
  active,
  delay,
  kind,
  node,
  nodeIdx,
  reduce,
  rowIdx,
}: {
  active: boolean;
  delay: number;
  kind: LayerSignatureKind | undefined;
  node: NodePos;
  nodeIdx: number;
  reduce: boolean | null;
  rowIdx: number;
}) {
  const x = node.cx - node.w / 2;
  const y = node.cy - node.h / 2;
  const isEngine = kind === "engine";
  // Arrival flash: this node receives pulses from layer (rowIdx - 1).
  // The wires there fire at begin = (rowIdx - 1) * PER_DEPTH_S and
  // their pulses reach the node at PULSE_END_KT * CYCLE_S into the
  // cycle. So the flash cycle starts at that begin and the flash
  // peaks at PULSE_END_KT. rowIdx 0 (founders) has no incoming wire.
  const arrivalDelay = rowIdx > 0 ? (rowIdx - 1) * PER_DEPTH_S : null;

  const primary = primaryFor(kind, node.label);
  const primarySize = isEngine ? 18 : 14;
  const hasLive = kind === "products";
  const hasStatus = !isEngine && (kind === "csuite" || kind === "execution");
  void nodeIdx;

  return (
    <motion.g
      animate={reduce ? undefined : { opacity: [0, 1, 1] }}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 0.6, 1],
      }}
    >
      {/* Halo pulse — fires once with the cascade arrival */}
      {!reduce ? (
        <motion.rect
          animate={{ opacity: [0, 0.9, 0] }}
          fill="none"
          height={node.h + 16}
          initial={{ opacity: 0 }}
          rx={12}
          stroke="rgba(16,185,129,0.95)"
          strokeWidth={2.4}
          transition={{
            delay: delay + 0.05,
            duration: 0.95,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.3, 1],
          }}
          width={node.w + 16}
          x={x - 8}
          y={y - 8}
        />
      ) : null}

      {/* Engine ambient glow disc — behind the chip */}
      {isEngine ? (
        <ellipse
          cx={node.cx}
          cy={node.cy}
          fill="url(#engine-glow)"
          rx={node.w * 0.85}
          ry={node.h * 1.6}
        />
      ) : null}

      {/* Card body */}
      <rect
        fill={isEngine ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)"}
        height={node.h}
        rx={isEngine ? 10 : 10}
        stroke={
          active
            ? "rgb(16, 185, 129)"
            : isEngine
              ? "rgb(15, 23, 42)"
              : "rgba(41, 110, 214, 0.45)"
        }
        strokeWidth={isEngine ? 1.6 : 1.2}
        style={{
          filter: isEngine
            ? "drop-shadow(0 12px 30px rgba(15, 23, 42, 0.26))"
            : "drop-shadow(0 1px 3px rgba(15, 23, 42, 0.04))",
          transition: "stroke 220ms ease",
        }}
        width={node.w}
        x={x}
        y={y}
      />

      {/* Arrival flash — bright green outline that briefly overlays
          the resting border the moment the incoming pulse arrives,
          making the cascade's split moment visible. SMIL, so it loops
          with the wire pulse cycle automatically. */}
      {!reduce && arrivalDelay !== null ? (
        <rect
          fill="none"
          height={node.h + 4}
          opacity={0}
          rx={isEngine ? 12 : 12}
          stroke="rgb(16, 185, 129)"
          strokeWidth={2.2}
          style={{
            filter: "drop-shadow(0 0 8px rgba(16,185,129,0.85))",
          }}
          width={node.w + 4}
          x={x - 2}
          y={y - 2}
        >
          <animate
            attributeName="opacity"
            begin={`${arrivalDelay}s`}
            dur={`${CYCLE_S}s`}
            keyTimes={`0;${PULSE_END_KT - 0.02};${PULSE_END_KT};${PULSE_END_KT + 0.05};${PULSE_END_KT + 0.10};1`}
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
        </rect>
      ) : null}

      {isEngine ? (
        <EngineChip
          active={active}
          node={node}
          primary={primary}
          reduce={reduce}
          x={x}
          y={y}
        />
      ) : kind === "founders" ? (
        <FoundersCard node={node} primary={primary} x={x} y={y} />
      ) : (
        <>
          {/* Status dot — SMIL-synced to the cascade. The dot rests at
              a quieter state and briefly pulses big + bright when the
              wire pulse arrives at this layer. Products also get a
              "LIVE" silkscreen badge. */}
          {hasLive ? (
            <CascadeDot
              arrivalDelay={arrivalDelay ?? 0}
              cx={x + 12}
              cy={y + 12}
              peakR={6.5}
              reduce={reduce}
              restR={3.2}
            />
          ) : hasStatus ? (
            <CascadeDot
              arrivalDelay={arrivalDelay ?? 0}
              cx={x + 12}
              cy={y + 12}
              peakR={5}
              reduce={reduce}
              restR={2.5}
            />
          ) : null}
          {hasLive ? (
            <text
              fill="rgb(16, 185, 129)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize={9}
              fontWeight={700}
              letterSpacing="0.08em"
              x={x + 24}
              y={y + 16}
            >
              LIVE
            </text>
          ) : null}

          {/* Primary name — centered in the card */}
          <text
            fill="rgb(15, 23, 42)"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize={primarySize}
            fontWeight={600}
            textAnchor="middle"
            x={node.cx}
            y={node.cy + 5}
          >
            {primary}
          </text>
        </>
      )}
    </motion.g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ENGINE CHIP — internal composition rendered inside the engine node.
// Acts like a dev-board chip with a status LED bank, silkscreen part
// number, and a live scrolling activity ticker.
// ─────────────────────────────────────────────────────────────────────

function EngineChip({
  active,
  node,
  primary,
  reduce,
  x,
  y,
}: {
  active: boolean;
  node: NodePos;
  primary: string;
  reduce: boolean | null;
  x: number;
  y: number;
}) {
  const w = node.w;
  const h = node.h;

  // LED bank — 4 dots horizontally arranged at the top-right of the
  // chip. The rightmost is the heartbeat (continuously animated); the
  // rest are static status LEDs in muted accent colors.
  const ledCY = y + 22;
  const ledRX = x + w - 18;
  const ledSpacing = 14;
  const leds = [
    { cx: ledRX - ledSpacing * 3, color: "rgba(16,185,129,0.4)" }, // dim green
    { cx: ledRX - ledSpacing * 2, color: "rgba(91,155,244,0.65)" }, // blue
    { cx: ledRX - ledSpacing * 1, color: "rgba(91,155,244,0.9)" }, // brighter blue
  ];

  return (
    <g>
      {/* Silicon-die gradient overlay — gives the dark body a sense of
          depth without changing its color. */}
      <rect
        fill="url(#engine-die)"
        height={h}
        pointerEvents="none"
        rx={10}
        width={w}
        x={x}
        y={y}
      />

      {/* Inner bezel hairline — 5px inset, suggests a recessed die */}
      <rect
        fill="none"
        height={h - 10}
        pointerEvents="none"
        rx={6}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={0.7}
        width={w - 10}
        x={x + 5}
        y={y + 5}
      />

      {/* DIP pin-1 orientation marker — small light dot on left edge,
          vertically centered on the chip. Universal IC convention. */}
      <circle
        cx={x + 11}
        cy={node.cy}
        fill="rgba(255,255,255,0.05)"
        r={5}
      />
      <circle
        cx={x + 11}
        cy={node.cy}
        fill="none"
        r={3.5}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={0.8}
      />

      {/* Top strip — part-number silkscreen on the left */}
      <text
        fill="rgb(148, 163, 184)"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={9.5}
        fontWeight={500}
        letterSpacing="0.04em"
        x={x + 22}
        y={y + 26}
      >
        atlas-mk3 · v3.0.4
      </text>

      {/* Top strip — LED bank on the right (3 static + 1 heartbeat) */}
      {leds.map((led, i) => (
        <g key={`led-${i}`}>
          <circle
            cx={led.cx}
            cy={ledCY}
            fill={led.color}
            r={2.4}
            style={{
              filter: `drop-shadow(0 0 4px ${led.color})`,
            }}
          />
        </g>
      ))}
      {/* Heartbeat LED — continuously pulsing via CSS */}
      <circle
        className="atlas-engine-heartbeat"
        cx={ledRX}
        cy={ledCY}
        fill="rgb(16, 185, 129)"
        r={3.6}
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(16,185,129,0.95)) drop-shadow(0 0 16px rgba(16,185,129,0.5))",
        }}
      />


      {/* Title — Atlas v3, big and bold. Vertically centered in the
          space between the top silkscreen strip and the bottom ticker. */}
      <text
        fill="rgb(248, 250, 252)"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={26}
        fontWeight={700}
        letterSpacing="-0.01em"
        textAnchor="middle"
        x={node.cx}
        y={y + 72}
      >
        {primary}
      </text>

      {/* Live activity ticker — clipped HTML inside foreignObject so we
          get a real marquee. Reads like a real chip's OLED display. */}
      <foreignObject
        height={22}
        width={w - 32}
        x={x + 16}
        y={y + h - 30}
      >
        <div
          style={{
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(91, 155, 244, 0.14)",
            borderRadius: "4px",
            color: "rgb(16, 185, 129)",
            display: "flex",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "10px",
            height: "100%",
            letterSpacing: "0.02em",
            overflow: "hidden",
            textShadow: "0 0 4px rgba(16, 185, 129, 0.55)",
            width: "100%",
          }}
        >
          {/* "LIVE" indicator chip on the left, fixed */}
          <span
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.16)",
              borderRadius: "2px",
              color: "rgb(248, 113, 113)",
              flexShrink: 0,
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginLeft: "8px",
              marginRight: "10px",
              padding: "1px 4px",
            }}
          >
            LIVE
          </span>
          {/* Marquee track — duplicate content for a seamless loop */}
          <div
            className="marquee-track"
            style={{
              animationDuration: "26s",
              display: "inline-flex",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ paddingRight: "40px" }}>{ENGINE_TICKER}</span>
            <span style={{ paddingRight: "40px" }}>{ENGINE_TICKER}</span>
          </div>
        </div>
      </foreignObject>

      {/* CRT scanlines overlaying the ticker — very faint, sells the
          "small chip OLED" look. */}
      <rect
        fill="url(#engine-scanlines)"
        height={22}
        opacity={0.7}
        pointerEvents="none"
        rx={4}
        width={w - 32}
        x={x + 16}
        y={y + h - 30}
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FOUNDERS — two co-founders rendered as a "team" card: monogram
// avatars with names beside them, a hairline divider between the two
// to emphasise that this layer is the only human pair in the system.
// ─────────────────────────────────────────────────────────────────────

function FoundersCard({
  node,
  primary,
  x,
  y,
}: {
  node: NodePos;
  primary: string;
  x: number;
  y: number;
}) {
  const names = primary.split(/\s*\+\s*/);
  const slotW = node.w / names.length;
  const cy = node.cy;

  return (
    <g>
      {names.map((name, i) => {
        // Avatar + name unit, centered in the slot.
        const slotCenter = x + slotW * (i + 0.5);
        const unitOffset = 36;
        const avatarCx = slotCenter - unitOffset;
        const nameX = slotCenter - unitOffset + 22;
        return (
          <g key={name}>
            {/* Soft halo behind the avatar */}
            <circle
              cx={avatarCx}
              cy={cy}
              fill="rgba(41, 110, 214, 0.10)"
              r={18}
            />
            {/* Avatar disc */}
            <circle
              cx={avatarCx}
              cy={cy}
              fill="rgb(15, 23, 42)"
              r={15}
              stroke="rgba(41, 110, 214, 0.45)"
              strokeWidth={1.2}
              style={{
                filter: "drop-shadow(0 2px 6px rgba(15, 23, 42, 0.18))",
              }}
            />
            {/* Monogram */}
            <text
              fill="rgb(248, 250, 252)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize={14}
              fontWeight={700}
              letterSpacing="0.02em"
              textAnchor="middle"
              x={avatarCx}
              y={cy + 5}
            >
              {name.charAt(0)}
            </text>
            {/* Name */}
            <text
              fill="rgb(15, 23, 42)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize={14}
              fontWeight={600}
              x={nameX}
              y={cy + 5}
            >
              {name}
            </text>
          </g>
        );
      })}

      {/* Hairline divider between the two founders */}
      {names.length >= 2 ? (
        <line
          stroke="rgba(15, 23, 42, 0.10)"
          strokeWidth={1}
          x1={x + node.w / 2}
          x2={x + node.w / 2}
          y1={y + 16}
          y2={y + node.h - 16}
        />
      ) : null}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CASCADE DOT — green status indicator on a non-engine card. Rests
// quietly and pulses big + bright when the wire pulse arrives at the
// host layer, so the "their turn of work" moment is visible on every
// status indicator in the schematic.
// ─────────────────────────────────────────────────────────────────────

function CascadeDot({
  arrivalDelay,
  cx,
  cy,
  peakR,
  reduce,
  restR,
}: {
  arrivalDelay: number;
  cx: number;
  cy: number;
  peakR: number;
  reduce: boolean | null;
  restR: number;
}) {
  // KeyTimes around the wire arrival moment (PULSE_END_KT). Dot grows
  // and brightens at peak, then settles back to rest.
  const before = PULSE_END_KT - 0.04;
  const peak = PULSE_END_KT;
  const peakOut = PULSE_END_KT + 0.06;
  const fade = PULSE_END_KT + 0.16;
  return (
    <circle
      cx={cx}
      cy={cy}
      fill="rgb(16, 185, 129)"
      opacity={0.55}
      r={restR}
      style={{
        filter: "drop-shadow(0 0 4px rgba(16,185,129,0.7))",
      }}
    >
      {!reduce ? (
        <>
          <animate
            attributeName="r"
            begin={`${arrivalDelay}s`}
            dur={`${CYCLE_S}s`}
            keyTimes={`0;${before};${peak};${peakOut};${fade};1`}
            repeatCount="indefinite"
            values={`${restR};${restR};${peakR};${peakR};${restR};${restR}`}
          />
          <animate
            attributeName="opacity"
            begin={`${arrivalDelay}s`}
            dur={`${CYCLE_S}s`}
            keyTimes={`0;${before};${peak};${peakOut};${fade};1`}
            repeatCount="indefinite"
            values="0.55;0.55;1;1;0.55;0.55"
          />
        </>
      ) : null}
    </circle>
  );
}

