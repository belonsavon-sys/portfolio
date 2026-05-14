"use client";

import { useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";
import { useLightSwitch } from "./LightSwitchContext";

/**
 * PCB rocker switch — fixed top-left power toggle that replaces the
 * old pull-cord. Styled like a real panel-mount rocker switch you'd
 * find on a dev-board PSU: light mounting plate with four corner
 * pads, a dark recessed rocker that tilts on click, a green LED at
 * the top that lights when ON, and a `PWR` silkscreen at the bottom.
 *
 *   • Click → toggles lights (no drag needed)
 *   • Rocker tilts via 3D rotateX with perspective, so the depressed
 *     half visibly sits lower than the raised half
 *   • LED transitions with a soft glow halo when on
 *   • Keyboard `L` shortcut handled in the provider (unchanged)
 */
export function LightSwitch() {
  const { isLightsOn, toggleLights } = useLightSwitch();
  const reduce = useReducedMotion();

  // Capture the rocker's viewport center so the dark-mode view
  // transition can clip-reveal outward from it like an aperture.
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleLights({
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      aria-label={isLightsOn ? "Turn off the lights" : "Turn on the lights"}
      aria-pressed={!isLightsOn}
      className="pointer-events-auto fixed left-5 top-5 z-[55] hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light sm:block"
      onClick={handleClick}
      title={
        isLightsOn
          ? "Click to dim the room (or press L)"
          : "Click to turn on the lights (or press L)"
      }
      type="button"
    >
      {/* MOUNTING PLATE — light gray PCB-style backing */}
      <div
        className="relative h-[96px] w-[64px] rounded-md border border-border-light bg-bg-light-2"
        style={{
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.04), 0 6px 14px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Corner mounting pads — tiny decorative screws */}
        <span
          aria-hidden="true"
          className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full border border-border-light bg-bg-light"
        />
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full border border-border-light bg-bg-light"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full border border-border-light bg-bg-light"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full border border-border-light bg-bg-light"
        />

        {/* LED indicator + halo at top */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-3 -translate-x-1/2"
        >
          <div className="relative">
            <span
              className={`absolute -inset-1 rounded-full bg-result-green/35 transition-opacity duration-300 ${
                isLightsOn ? "opacity-100" : "opacity-0"
              }`}
            />
            <span
              className={`relative block h-2 w-2 rounded-full transition-all duration-300 ${
                isLightsOn
                  ? "bg-result-green shadow-[0_0_6px_rgba(16,185,129,0.95),0_0_14px_rgba(16,185,129,0.5)]"
                  : "bg-text-light-muted/35"
              }`}
            />
          </div>
        </div>

        {/* ROCKER FRAME — dark recessed well that the rocker sits in */}
        <div
          className="absolute left-1/2 top-[26px] -translate-x-1/2 h-[52px] w-[38px] rounded-[3px]"
          style={{
            background: "rgb(8, 12, 22)",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.55)",
            perspective: "180px",
          }}
        >
          {/* ROCKER BODY — tilts on toggle */}
          <div
            className="absolute inset-[3px] flex flex-col overflow-hidden rounded-[2px]"
            style={{
              background:
                "linear-gradient(180deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 100%)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)",
              transform: `rotateX(${isLightsOn ? -14 : 14}deg)`,
              transformStyle: "preserve-3d",
              transition: reduce
                ? "none"
                : "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* TOP HALF — "I" (one/on). When ON, this half is depressed
                (rotates back), so we shade it slightly darker. */}
            <div
              className="flex flex-1 items-center justify-center font-mono font-bold text-[11px]"
              style={{
                background: isLightsOn
                  ? "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                color: isLightsOn
                  ? "rgba(248, 250, 252, 0.95)"
                  : "rgba(148, 163, 184, 0.5)",
                textShadow: isLightsOn
                  ? "0 0 4px rgba(16,185,129,0.55)"
                  : "none",
                transition: "all 240ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              I
            </div>

            {/* PIVOT LINE — visible hinge between top and bottom halves */}
            <div
              aria-hidden="true"
              className="h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.6) 75%, transparent)",
              }}
            />

            {/* BOTTOM HALF — "O" (off). When OFF, this half is depressed. */}
            <div
              className="flex flex-1 items-center justify-center font-mono font-bold text-[11px]"
              style={{
                background: !isLightsOn
                  ? "linear-gradient(0deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05))"
                  : "linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                color: !isLightsOn
                  ? "rgba(248, 250, 252, 0.95)"
                  : "rgba(148, 163, 184, 0.45)",
                transition: "all 240ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              O
            </div>
          </div>
        </div>

        {/* SILKSCREEN LABEL — mono "PWR" caption at the bottom */}
        <div
          aria-hidden="true"
          className="absolute bottom-[3px] left-1/2 -translate-x-1/2 font-mono text-[7.5px] tracking-[0.2em] text-text-light-muted/75"
        >
          PWR
        </div>
      </div>

      <span className="sr-only">
        {isLightsOn
          ? "Lights are on"
          : "Lights are off — cursor is your flashlight"}
      </span>
    </button>
  );
}
