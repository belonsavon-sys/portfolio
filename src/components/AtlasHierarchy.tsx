"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

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
const VB_H = 860;

const DEPTH_MS = 380;
const PULSE_MS = 760;
const WIRE_DRAW_MS = 520;
const CORNER_R = 9;

const ROW_Y = [80, 230, 410, 590, 750];

// Tuned to give the bipartite c-suite→execution mesh (6 wires) enough
// vertical room for cleanly stacked channels.
const ROW_GEOM = [
  { h: 60, w: 240 }, // 0  founders
  { h: 84, w: 340 }, // 1  engine — the chip
  { h: 64, w: 180 }, // 2  c-suite
  { h: 68, w: 220 }, // 3  execution
  { h: 72, w: 270 }, // 4  products
];

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
  const edges: Edge[] = [];
  for (let depth = 0; depth < layout.length - 1; depth++) {
    const parents = layout[depth]!.nodes;
    const children = layout[depth + 1]!.nodes;
    const parentBottom = parents[0]!.cy + parents[0]!.h / 2;
    const childTop = children[0]!.cy - children[0]!.h / 2;
    const margin = 14;
    const usableTop = parentBottom + margin;
    const usableBottom = childTop - margin;
    const span = Math.max(0, usableBottom - usableTop);

    // Fan-out (1→N) and fan-in (N→1) → all wires share one channel.
    // True bipartite (M×N, both >1) → stagger channels child-major so
    // wires arriving at the same child stack cleanly.
    if (parents.length === 1 || children.length === 1) {
      const sharedY = (parentBottom + childTop) / 2;
      parents.forEach((p, pi) => {
        children.forEach((c, ci) => {
          const from = { x: p.cx, y: parentBottom };
          const to = { x: c.cx, y: childTop };
          edges.push({
            channelY: sharedY,
            childIdx: ci,
            d: orthoPath(from.x, from.y, to.x, to.y, sharedY),
            depth,
            from,
            id: `e${depth}-${pi}-${ci}`,
            parentIdx: pi,
            to,
          });
        });
      });
    } else {
      const wireList: { ci: number; pi: number }[] = [];
      for (let ci = 0; ci < children.length; ci++) {
        for (let pi = 0; pi < parents.length; pi++) {
          wireList.push({ ci, pi });
        }
      }
      const total = wireList.length;
      wireList.forEach((w, idx) => {
        const channelY =
          total > 1 ? usableTop + (idx / (total - 1)) * span : usableTop + span / 2;
        const p = parents[w.pi]!;
        const c = children[w.ci]!;
        const from = { x: p.cx, y: parentBottom };
        const to = { x: c.cx, y: childTop };
        edges.push({
          channelY,
          childIdx: w.ci,
          d: orthoPath(from.x, from.y, to.x, to.y, channelY),
          depth,
          from,
          id: `e${depth}-${w.pi}-${w.ci}`,
          parentIdx: w.pi,
          to,
        });
      });
    }
  }
  return edges;
}

// ─────────────────────────────────────────────────────────────────────
// REFDES — give every node a believable schematic reference designator
// (U1, J1, OUT1 …) so the silkscreen layer reads like a real PCB.
// ─────────────────────────────────────────────────────────────────────

function refdesFor(kind: LayerSignatureKind | undefined, idx: number): string {
  switch (kind) {
    case "founders":
      return `J${idx + 1}`;
    case "engine":
      return `U${idx + 1}`;
    case "csuite":
      return `U${idx + 2}`;
    case "execution":
      return `U${idx + 5}`;
    case "products":
      return `OUT${idx + 1}`;
    default:
      return `N${idx + 1}`;
  }
}

// ─────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────

export function AtlasHierarchy({ layers }: AtlasHierarchyProps) {
  const reduce = useReducedMotion();
  const [traceKey, setTraceKey] = useState(0);
  const [tracing, setTracing] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tracedOnce = useRef(false);
  const tracingTimer = useRef<number | null>(null);

  const layout = useMemo(() => buildLayout(layers), [layers]);
  const edges = useMemo(() => buildEdges(layout), [layout]);
  const maxDepth = Math.max(0, layout.length - 1);

  function runTrace() {
    if (tracing || reduce) return;
    setTracing(true);
    setTraceKey((k) => k + 1);
    if (tracingTimer.current !== null) {
      window.clearTimeout(tracingTimer.current);
    }
    const totalMs = maxDepth * DEPTH_MS + PULSE_MS + 400;
    tracingTimer.current = window.setTimeout(
      () => setTracing(false),
      totalMs,
    );
  }

  useEffect(() => {
    if (reduce) return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !tracedOnce.current) {
            tracedOnce.current = true;
            window.setTimeout(runTrace, 300);
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (tracingTimer.current !== null) {
        window.clearTimeout(tracingTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef}>
      {/* HEADER STRIP — silkscreen-style mono path label and the manual
          pulse trigger. Lowercase mono with em-dash prefix per house
          style. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-[11px] text-accent">
          — atlas/sheet-1
        </span>
        <span className="font-mono text-[11px] text-text-light-muted">
          rev 3 · {layout.length} layers · {edges.length} nets
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <button
          aria-label={
            tracing
              ? "Pulsing signal through atlas"
              : "Pulse signal through atlas"
          }
          className="inline-flex items-center gap-2 font-mono text-[11px] text-accent transition-colors duration-200 hover:text-accent-deep disabled:opacity-60"
          disabled={tracing}
          onClick={runTrace}
          type="button"
        >
          <span aria-hidden="true">{tracing ? "▮" : "↳"}</span>
          {tracing ? "pulsing…" : "pulse signal ↓"}
        </button>
      </div>

      {/* SCHEMATIC CANVAS */}
      <div className="relative mt-6 overflow-x-auto rounded-2xl border border-border-light bg-[#fbfcfe]">
        {/* Corner registration marks (mono labels at sheet corners) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-start justify-between px-4 pt-3 font-mono text-[10px] text-text-light-muted">
          <span>sheet 01/01</span>
          <span>rev 3</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between px-4 pb-3 font-mono text-[10px] text-text-light-muted">
          <span>atlas · harness</span>
          <span>5 layers · top → bottom</span>
        </div>

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
          <g key={`wires-${traceKey}`}>
            {edges.map((edge) => {
              const isActive =
                activeRow === edge.depth || activeRow === edge.depth + 1;
              const dimmed = activeRow !== null && !isActive;
              return (
                <Wire
                  delay={edge.depth * (DEPTH_MS / 1000)}
                  dimmed={dimmed}
                  edge={edge}
                  highlighted={isActive}
                  key={edge.id}
                  reduce={reduce}
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
                  key={`n-${rowIdx}-${nodeIdx}-${traceKey}`}
                  kind={row.kind}
                  node={node}
                  reduce={reduce}
                  refdes={refdesFor(row.kind, nodeIdx)}
                />
              )),
            )}
          </g>
        </svg>
      </div>

      {/* DATASHEET — pin-table for the schematic above. Hovering a row
          highlights the matching wires + nodes in the SVG. */}
      <ol className="mt-6 overflow-hidden rounded-2xl border border-border-light">
        {/* Column header */}
        <li
          aria-hidden="true"
          className="grid grid-cols-12 gap-x-4 border-b border-border-light bg-bg-light-2 px-4 py-3 font-mono text-[10px] text-text-light-muted sm:px-6"
        >
          <span className="col-span-3">refdes · function</span>
          <span className="col-span-6 hidden sm:inline">
            role in the harness
          </span>
          <span className="col-span-12 sm:col-span-3 sm:text-right">
            nodes
          </span>
        </li>
        {layout.map((row, i) => {
          const isActive = activeRow === i;
          return (
            <li
              className={`grid cursor-default grid-cols-12 gap-x-4 gap-y-2 border-border-light px-4 py-5 transition-colors duration-200 sm:px-6 sm:py-6 ${
                i > 0 ? "border-t" : ""
              } ${isActive ? "bg-bg-light-2" : "hover:bg-bg-light-2"}`}
              key={row.badge}
              onMouseEnter={() => setActiveRow(i)}
              onMouseLeave={() => setActiveRow(null)}
            >
              <div className="col-span-12 flex items-center gap-3 sm:col-span-3">
                <span className="font-mono text-[11px] text-accent">
                  [{row.badge}]
                </span>
                <span aria-hidden="true" className="h-px w-4 bg-border-light" />
                <span className="font-mono text-[12px] text-text-light">
                  {row.title.toLowerCase()}
                </span>
              </div>
              <p className="col-span-12 text-sm leading-6 text-text-light-muted sm:col-span-6 sm:text-base sm:leading-7">
                {row.description}
              </p>
              <div className="col-span-12 flex flex-wrap items-center gap-1.5 sm:col-span-3 sm:justify-end">
                {row.nodes.map((node, j) => (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-bg-light px-2 py-1 font-mono text-[11px] text-text-light"
                    key={node.label}
                  >
                    <span className="text-accent">
                      {refdesFor(row.kind, j)}
                    </span>
                    <span className="text-border-light">·</span>
                    <span>{node.label}</span>
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BACKGROUND — graph-paper grid + left rail with refdes column.
// ─────────────────────────────────────────────────────────────────────

function SchematicBackground({ layout }: { layout: LayerLayout[] }) {
  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          height="40"
          id="grid-minor"
          patternUnits="userSpaceOnUse"
          width="40"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(41,110,214,0.07)"
            strokeWidth="0.6"
          />
        </pattern>
        <pattern
          height="200"
          id="grid-major"
          patternUnits="userSpaceOnUse"
          width="200"
        >
          <path
            d="M 200 0 L 0 0 0 200"
            fill="none"
            stroke="rgba(41,110,214,0.16)"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="rail-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(41,110,214,0.55)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.55)" />
        </linearGradient>
        <radialGradient id="engine-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(16,185,129,0.20)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
      </defs>

      <rect fill="url(#grid-minor)" height={VB_H} width={VB_W} />
      <rect fill="url(#grid-major)" height={VB_H} width={VB_W} />

      {/* LEFT RAIL — reference column with badge + layer name */}
      <line
        stroke="url(#rail-gradient)"
        strokeDasharray="3 5"
        strokeWidth="1.2"
        x1="100"
        x2="100"
        y1="40"
        y2={VB_H - 40}
      />
      {layout.map((row) => {
        const yMid = row.nodes[0]!.cy;
        return (
          <g key={`rail-${row.badge}`}>
            <line
              stroke="rgba(41,110,214,0.55)"
              strokeWidth="1.3"
              x1="100"
              x2="124"
              y1={yMid}
              y2={yMid}
            />
            <circle
              cx="100"
              cy={yMid}
              fill="rgb(16,185,129)"
              r="3"
              stroke="rgba(255,255,255,1)"
              strokeWidth="1.5"
            />
            <text
              fill="rgb(41, 110, 214)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="12"
              fontWeight={600}
              x="30"
              y={yMid - 4}
            >
              [{row.badge}]
            </text>
            <text
              fill="rgb(100, 116, 139)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="10"
              x="30"
              y={yMid + 12}
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
  reduce,
}: {
  delay: number;
  dimmed: boolean;
  edge: Edge;
  highlighted: boolean;
  reduce: boolean | null;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[] | null>(
    null,
  );

  useEffect(() => {
    if (!pathRef.current || reduce) return;
    const N = 48;
    const len = pathRef.current.getTotalLength();
    const pts = Array.from({ length: N }, (_, i) => {
      const p = pathRef.current!.getPointAtLength((i / (N - 1)) * len);
      return { x: p.x, y: p.y };
    });
    setPoints(pts);
  }, [edge.d, reduce]);

  const baseOpacity = dimmed ? 0.1 : 1;
  const baseColor = highlighted ? "rgb(16, 185, 129)" : "rgb(41, 110, 214)";
  const baseStrokeWidth = highlighted ? 2.2 : 1.6;

  return (
    <g style={{ opacity: baseOpacity, transition: "opacity 220ms ease" }}>
      {/* Resting ambient trace — always visible */}
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
          transition: "stroke 220ms ease, stroke-width 220ms ease, filter 220ms ease",
        }}
      />

      {/* Animated draw-in stroke fires on each trace */}
      <motion.path
        animate={
          reduce
            ? undefined
            : {
                opacity: [0, 1, 0],
                pathLength: [0, 1, 1],
              }
        }
        d={edge.d}
        fill="none"
        initial={reduce ? { opacity: 0, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        ref={pathRef}
        stroke="rgb(16, 185, 129)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.4}
        style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.75))" }}
        transition={{
          delay,
          duration: WIRE_DRAW_MS / 1000,
          ease: "easeOut",
          times: [0, 0.6, 1],
        }}
      />

      {/* Via pads at each endpoint — copper-pad / solder-joint feel */}
      <ViaPad cx={edge.from.x} cy={edge.from.y} />
      <ViaPad cx={edge.to.x} cy={edge.to.y} />

      {/* Pulse dot — rides the path on each cascade */}
      {points && !reduce ? (
        <motion.circle
          animate={{
            cx: points.map((p) => p.x),
            cy: points.map((p) => p.y),
            opacity: [0, 1, 1, 0],
          }}
          fill="rgb(16, 185, 129)"
          initial={{ cx: points[0]!.x, cy: points[0]!.y, opacity: 0 }}
          r={4.5}
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(16,185,129,0.85)) drop-shadow(0 0 22px rgba(16,185,129,0.4))",
          }}
          transition={{
            delay: delay + WIRE_DRAW_MS / 1000 / 2,
            duration: PULSE_MS / 1000,
            ease: "linear",
            opacity: { times: [0, 0.1, 0.9, 1] },
          }}
        />
      ) : null}
    </g>
  );
}

function ViaPad({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} fill="rgba(41,110,214,0.18)" r={5} />
      <circle
        cx={cx}
        cy={cy}
        fill="rgb(255,255,255)"
        r={3}
        stroke="rgb(41,110,214)"
        strokeWidth={1.3}
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// NODE — refdes + name + sub-name. The engine row gets dark-chip
// treatment (the "U1" of the schematic — the focal point).
// ─────────────────────────────────────────────────────────────────────

function Node({
  active,
  delay,
  kind,
  node,
  reduce,
  refdes,
}: {
  active: boolean;
  delay: number;
  kind: LayerSignatureKind | undefined;
  node: NodePos;
  reduce: boolean | null;
  refdes: string;
}) {
  const x = node.cx - node.w / 2;
  const y = node.cy - node.h / 2;
  const isEngine = kind === "engine";
  const isProducts = kind === "products";
  const isFounders = kind === "founders";

  // Split label on " · " into primary name + descriptor suffix, but
  // only when there's exactly one separator. Lists like "Game · Budget
  // · PM" stay intact as the primary.
  const parts = node.label.split(" · ");
  const primary = parts.length === 2 ? parts[0]! : node.label;
  const secondary = parts.length === 2 ? parts[1]! : "";

  const primarySize = isEngine ? 18 : isProducts || isFounders ? 14 : 13;
  const secondarySize = isEngine ? 11 : 10;

  // Pin notches — small ticks on top + bottom edges, centered on the
  // node's cx. Wires terminate at the notch's outer end.
  const notchH = 7;
  const notchW = 14;

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

      {/* Pin notches — top + bottom, centered on cx */}
      <rect
        fill={isEngine ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)"}
        height={notchH}
        stroke={
          active
            ? "rgb(16,185,129)"
            : isEngine
              ? "rgb(15, 23, 42)"
              : "rgba(41,110,214,0.65)"
        }
        strokeWidth={1.2}
        width={notchW}
        x={node.cx - notchW / 2}
        y={y - notchH}
      />
      <rect
        fill={isEngine ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)"}
        height={notchH}
        stroke={
          active
            ? "rgb(16,185,129)"
            : isEngine
              ? "rgb(15, 23, 42)"
              : "rgba(41,110,214,0.65)"
        }
        strokeWidth={1.2}
        width={notchW}
        x={node.cx - notchW / 2}
        y={y + node.h}
      />

      {/* Card body */}
      <rect
        fill={
          isEngine
            ? "rgb(15, 23, 42)"
            : isProducts
              ? "rgb(255, 255, 255)"
              : "rgb(255, 255, 255)"
        }
        height={node.h}
        rx={isEngine ? 6 : 8}
        stroke={
          active
            ? "rgb(16, 185, 129)"
            : isEngine
              ? "rgb(15, 23, 42)"
              : isProducts
                ? "rgba(16, 185, 129, 0.55)"
                : "rgba(41, 110, 214, 0.55)"
        }
        strokeWidth={isEngine ? 1.6 : 1.4}
        style={{
          filter: isEngine
            ? "drop-shadow(0 6px 18px rgba(15, 23, 42, 0.18))"
            : "drop-shadow(0 2px 6px rgba(15, 23, 42, 0.05))",
          transition: "stroke 220ms ease",
        }}
        width={node.w}
        x={x}
        y={y}
      />

      {/* DIP-style indentation marker on the engine — top-left semi-
          circle that real ICs have to mark pin 1 orientation. */}
      {isEngine ? (
        <circle
          cx={x + 12}
          cy={y + node.h / 2}
          fill="rgb(248, 250, 252)"
          opacity={0.18}
          r={4.5}
        />
      ) : null}

      {/* Engine internal accent rail — looks like the die/heart of
          the chip. Continuously pulses to signal the system is live. */}
      {isEngine && !reduce ? (
        <motion.circle
          animate={{
            opacity: [0.55, 1, 0.55],
            r: [3.5, 5, 3.5],
          }}
          cx={x + node.w - 16}
          cy={y + 12}
          fill="rgb(16, 185, 129)"
          initial={{ opacity: 0.55, r: 3.5 }}
          style={{
            filter:
              "drop-shadow(0 0 6px rgba(16,185,129,0.9)) drop-shadow(0 0 14px rgba(16,185,129,0.4))",
          }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ) : isEngine ? (
        <circle
          cx={x + node.w - 16}
          cy={y + 12}
          fill="rgb(16, 185, 129)"
          r={4}
        />
      ) : null}

      {/* Refdes (silkscreen) — small uppercase label at top-left */}
      <text
        fill={isEngine ? "rgb(148, 163, 184)" : "rgb(41, 110, 214)"}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={10}
        fontWeight={600}
        x={x + 10}
        y={y + 14}
      >
        {refdes}
      </text>

      {/* Primary label — node's actual name */}
      <text
        fill={isEngine ? "rgb(248, 250, 252)" : "rgb(15, 23, 42)"}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={primarySize}
        fontWeight={isEngine ? 700 : 600}
        textAnchor="middle"
        x={node.cx}
        y={secondary ? node.cy : node.cy + 5}
      >
        {primary}
      </text>

      {/* Secondary suffix (after the bullet in original label) */}
      {secondary ? (
        <text
          fill={isEngine ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize={secondarySize}
          textAnchor="middle"
          x={node.cx}
          y={node.cy + primarySize * 0.85}
        >
          · {secondary}
        </text>
      ) : null}
    </motion.g>
  );
}
