"use client";

import {
  animate,
  motion,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { useLightSwitch } from "./LightSwitchContext";

const PULL_THRESHOLD = 26; // px from idle that commits the toggle
const PULL_MAX_X = 90; // hard limit on lateral swing
const PULL_MAX_Y = 110; // hard limit on vertical stretch
const IDLE_LENGTH = 50; // cord length at rest
const BEAD_SIZE = 12; // bead diameter in px
const ANCHOR_TOP = 4; // px from button top to where the cord emerges

/**
 * Pull-string light switch — fixed top-left, two-axis pendulum
 * physics. Bulb fixture removed; only the cord + bead + permanent
 * "pull me ↓" tip remain. The cord hangs from a tiny ceiling anchor
 * at the very top of the viewport.
 *
 *   • Drag in any direction → cord bends as a cubic Bezier (control
 *     points bias toward the bead so the top stays vertical and the
 *     curve concentrates near the bottom).
 *   • Release past PULL_THRESHOLD toggles the lights; otherwise the
 *     cord springs back without changing state.
 *   • On release, dragX springs back with low damping (pendulum
 *     swing), dragY with higher damping (quick settle).
 *   • Bead color = state indicator (amber when on, slate when off).
 *   • Keyboard `L` toggles globally (handled in the provider).
 *   • Permanent "pull me ↓" caption next to the bead.
 */
export function LightSwitch() {
  const { isLightsOn, toggleLights } = useLightSwitch();
  const reduce = useReducedMotion();
  const [pulling, setPulling] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const cordPath = useTransform([dragX, dragY], (values: number[]) => {
    const x = values[0] ?? 0;
    const y = Math.max(0, values[1] ?? 0);
    const totalY = IDLE_LENGTH + y;
    const c1x = x * 0.15;
    const c1y = totalY * 0.4;
    const c2x = x * 0.7;
    const c2y = totalY * 0.78;
    return `M 0 0 C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${x.toFixed(2)} ${totalY.toFixed(2)}`;
  });

  const beadTranslateX = useTransform(dragX, (v) => v - BEAD_SIZE / 2);
  const beadTranslateY = useTransform(
    dragY,
    (v) => IDLE_LENGTH + Math.max(0, v) - BEAD_SIZE / 2,
  );

  const draggedRef = useRef(false);

  function handlePanStart() {
    if (reduce) return;
    draggedRef.current = false;
    setPulling(true);
  }

  function handlePan(_event: PointerEvent, info: PanInfo) {
    if (reduce) return;
    const x = Math.max(-PULL_MAX_X, Math.min(PULL_MAX_X, info.offset.x));
    const y = Math.max(-15, Math.min(PULL_MAX_Y, info.offset.y));
    dragX.set(x);
    dragY.set(y);
    if (Math.hypot(info.offset.x, info.offset.y) > 4) {
      draggedRef.current = true;
    }
  }

  function handlePanEnd(_event: PointerEvent, info: PanInfo) {
    if (reduce) {
      toggleLights();
      return;
    }
    const wasDrag = draggedRef.current;
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance > PULL_THRESHOLD || !wasDrag) {
      toggleLights();
    }
    animate(dragX, 0, {
      damping: 6,
      mass: 0.5,
      stiffness: 180,
      type: "spring",
    });
    animate(dragY, 0, {
      damping: 12,
      mass: 0.5,
      stiffness: 280,
      type: "spring",
    });
    window.setTimeout(() => setPulling(false), 1500);
  }

  // Bead materials — only piece of the switch that still flips with state.
  const beadFill = isLightsOn
    ? "radial-gradient(circle at 32% 30%, #fde68a 0%, #d97706 60%, #78350f 100%)"
    : "radial-gradient(circle at 32% 30%, #cbd5e1 0%, #64748b 55%, #1e293b 100%)";
  const beadShadow = isLightsOn
    ? "0 1px 2.5px rgba(0,0,0,0.45), 0 0 10px rgba(217,119,6,0.45), inset 0 -1.5px 2px rgba(0,0,0,0.4), inset 1px 1px 1.5px rgba(255,255,255,0.35)"
    : "0 1px 2.5px rgba(0,0,0,0.45), inset 0 -1.5px 2px rgba(0,0,0,0.5), inset 1px 1px 1.5px rgba(255,255,255,0.25)";

  return (
    <motion.button
      aria-label={isLightsOn ? "Turn off the lights" : "Turn on the lights"}
      aria-pressed={!isLightsOn}
      className="group/cord pointer-events-auto fixed left-5 top-0 z-[55] hidden cursor-grab focus-visible:outline-none active:cursor-grabbing sm:block"
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onPanStart={handlePanStart}
      style={{ height: 90, touchAction: "none", width: 130 }}
      title={
        isLightsOn
          ? "Pull to dim the room (or press L)"
          : "Pull to turn on the lights (or press L)"
      }
      type="button"
    >
      {/* CEILING ANCHOR — tiny stub where the cord emerges from "the
          ceiling". Subtle dark plate so the cord doesn't look like
          it's floating mid-air. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-1 w-3 -translate-x-1/2 rounded-b-sm bg-gradient-to-b from-text-light-muted/85 to-text-light-muted/45 shadow-[0_1px_2px_rgba(15,23,42,0.18)]"
      />

      {/* CORD + BEAD STACK — wrapper rotates for idle pendulum swing
          when not being pulled. Drag offsets translate the bead inside
          via motion values. */}
      <motion.div
        animate={pulling || reduce ? { rotate: 0 } : { rotate: [-0.7, 0.7, -0.7] }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          height: 1,
          top: ANCHOR_TOP,
          transformOrigin: "top center",
          width: 1,
        }}
        transition={
          pulling || reduce
            ? { duration: 0 }
            : { duration: 6.5, ease: "easeInOut", repeat: Infinity }
        }
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="220"
          style={{ left: -140, overflow: "visible", position: "absolute", top: -2 }}
          viewBox="-140 -2 280 220"
          width="280"
        >
          <motion.path
            d={cordPath}
            stroke="rgba(30, 41, 59, 0.92)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <motion.path
            d={cordPath}
            stroke="rgba(255,255,255,0.22)"
            strokeLinecap="round"
            strokeWidth="0.6"
          />
        </svg>

        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-0"
          style={{ x: beadTranslateX, y: beadTranslateY }}
        >
          <div
            className="h-3 w-3 rounded-full transition-transform duration-200 group-hover/cord:scale-110 group-focus-visible/cord:scale-110"
            style={{ background: beadFill, boxShadow: beadShadow }}
          />
        </motion.div>
      </motion.div>

      {/* PERMANENT "PULL ME ↓" TIP — sits next to the bead area, softens
          on hover so it backs off during interaction. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute font-mono text-[9px] text-text-light-muted/75 transition-opacity duration-200 group-hover/cord:opacity-30"
        style={{ left: "calc(50% + 12px)", top: ANCHOR_TOP + IDLE_LENGTH - 6 }}
      >
        pull me ↓
      </span>

      <span className="sr-only">
        {isLightsOn ? "Lights are on" : "Lights are off — cursor is your flashlight"}
      </span>
    </motion.button>
  );
}
