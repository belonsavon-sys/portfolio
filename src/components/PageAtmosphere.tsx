"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";
import { useLightSwitch } from "./LightSwitchContext";

/**
 * Global background atmosphere — three layers stacked for depth:
 *
 *   1. Gradient mesh   — absolute, full body height, scrolls with the
 *                        page so each section sits in its own tonal
 *                        zone (cool blue → indigo → violet → fuchsia →
 *                        sky → deep accent, top to bottom).
 *   2. Cursor spotlight — fixed, viewport-relative. A dim overlay
 *                        with a transparent "hole" tracking the
 *                        cursor — the page is held in shadow except
 *                        wherever the reader is looking. Multiply
 *                        blend so the dimming applies to whatever
 *                        section is below.
 *   3. Cursor glow      — fixed, viewport-relative. A soft accent
 *                        radial centered on the cursor, screen blend
 *                        so it brightens whatever it crosses. Pairs
 *                        with the spotlight to give a real
 *                        light-source feel.
 *
 * Both cursor layers are framer-motion springs (damping 32, stiffness
 * 180) so the light has gentle inertia rather than locking 1:1 to the
 * pointer — that's what makes it feel "alive" instead of mechanical.
 *
 * Reduced-motion users get the mesh alone (frozen hue, no cursor
 * layers) so the page still feels considered without any motion.
 */
export function PageAtmosphere() {
  const reduce = useReducedMotion();
  const { isLightsOn } = useLightSwitch();

  // Initialise off-viewport so first paint doesn't flash a spotlight
  // at (0,0). The effect snaps to the actual viewport center on
  // mount, then to the cursor on first move.
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, {
    damping: 32,
    mass: 0.6,
    stiffness: 180,
  });
  const springY = useSpring(mouseY, {
    damping: 32,
    mass: 0.6,
    stiffness: 180,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    function onMove(event: MouseEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // Spotlight: small bright "hole" at the cursor, hard falloff into a
  // dark surround. Higher max-darkness + tighter falloff gives the
  // flashlight a real edge instead of a gentle dim. Multiply blend so
  // the darkening applies to whatever section is under it.
  const spotlight = useMotionTemplate`radial-gradient(circle 480px at ${springX}px ${springY}px, transparent 0%, transparent 18%, rgba(15,23,42,0.48) 58%, rgba(15,23,42,0.62) 100%)`;
  // Glow: tighter, brighter accent bloom centered on the cursor. Screen
  // blend so it lifts whatever sits underneath. Pairs with the
  // spotlight for the "bright spot in a dark room" feel.
  const glow = useMotionTemplate`radial-gradient(circle 320px at ${springX}px ${springY}px, rgba(91,155,244,0.45) 0%, rgba(91,155,244,0.18) 35%, transparent 72%)`;

  // Lights on — page is fully bright. No mesh, no spotlight, no glow.
  // Hooks above still run unconditionally; we just don't render the
  // atmosphere DOM.
  if (isLightsOn) return null;

  return (
    <>
      {/* LAYER 1 — gradient mesh. Absolute-positioned inside body so it
          spans the entire scrollable page; the reader scrolls through
          tonal zones rather than seeing a fixed wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          animation: reduce
            ? undefined
            : "atmosphere-hue 75s ease-in-out infinite",
          background: [
            "radial-gradient(ellipse 70vw 38vh at 10% 4%, rgba(91,155,244,0.22), transparent 70%)",
            "radial-gradient(ellipse 60vw 32vh at 82% 11%, rgba(56,189,248,0.18), transparent 70%)",
            "radial-gradient(ellipse 75vw 38vh at 22% 24%, rgba(129,140,248,0.20), transparent 68%)",
            "radial-gradient(ellipse 65vw 35vh at 78% 36%, rgba(167,139,250,0.18), transparent 70%)",
            "radial-gradient(ellipse 70vw 35vh at 14% 48%, rgba(192,132,252,0.16), transparent 68%)",
            "radial-gradient(ellipse 60vw 32vh at 84% 58%, rgba(244,114,182,0.13), transparent 70%)",
            "radial-gradient(ellipse 75vw 38vh at 22% 70%, rgba(96,165,250,0.18), transparent 68%)",
            "radial-gradient(ellipse 65vw 38vh at 78% 82%, rgba(56,189,248,0.20), transparent 68%)",
            "radial-gradient(ellipse 70vw 38vh at 18% 92%, rgba(41,110,214,0.22), transparent 70%)",
          ].join(", "),
          mixBlendMode: "multiply",
        }}
      />

      {reduce ? null : (
        <>
          {/* LAYER 2 — cursor spotlight. Dim field with a bright "hole"
              at the pointer. Multiply blend so the darkening passes
              through every section background. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[2]"
            style={{
              background: spotlight,
              mixBlendMode: "multiply",
            }}
          />

          {/* LAYER 3 — cursor accent glow. Accent-tinted radial centered
              on the pointer, screen blend so it lifts whatever sits
              under it. Pairs with the spotlight for the light-source
              feel. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[2]"
            style={{
              background: glow,
              mixBlendMode: "screen",
            }}
          />
        </>
      )}
    </>
  );
}
