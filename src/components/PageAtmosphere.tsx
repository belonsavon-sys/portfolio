"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useLightSwitch } from "./LightSwitchContext";

// ─────────────────────────────────────────────────────────────────────
// X-RAY SCHEMATIC TILE — a 1200×2400 SVG that contains FOUR distinct
// 600px-tall sections (power, CPU, memory, I/O). It's drawn as a
// fixed-position layer, masked by the cursor cone, and its
// background-position-y is offset by the page's scrollY so the blueprint
// scrolls naturally with the page. Tile repeats vertically (repeat-y),
// so even on long pages the schematic keeps unfolding new sections in
// a 2400px loop instead of repeating the same single tile.
//
// All four sections share the same 40px graph-paper grid so the
// boundaries between them disappear visually — it reads as one
// continuous board, not four independent tiles.
// ─────────────────────────────────────────────────────────────────────

const COL = "rgba(91,155,244,0.78)"; // primary stroke / text
const COL_M = "rgba(91,155,244,0.55)"; // muted trace
const COL_F = "rgba(91,155,244,0.35)"; // faintest grid

// Convenience builders for a 1200×600 section.
function header(label: string, y: number) {
  return `<text x='40' y='${y + 36}' font-family='ui-monospace,monospace' font-size='10' font-weight='600' fill='${COL}' letter-spacing='2'>${label}</text><line x1='160' y1='${y + 33}' x2='1140' y2='${y + 33}' stroke='${COL_F}' stroke-width='0.6'/><text x='1160' y='${y + 36}' text-anchor='end' font-family='ui-monospace,monospace' font-size='8' fill='${COL_M}'>SH-${(y / 600 + 1).toString().padStart(2, "0")} · rev A</text>`;
}

function chip(x: number, y: number, w: number, h: number, refdes: string, part: string) {
  return `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='3' fill='none' stroke='${COL}' stroke-width='1.2'/><circle cx='${x + 8}' cy='${y + 12}' r='1.8' fill='${COL_M}'/><text x='${x + w / 2}' y='${y + h / 2 - 2}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='10' font-weight='600' fill='${COL}'>${refdes}</text><text x='${x + w / 2}' y='${y + h / 2 + 12}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>${part}</text>`;
}

function cap(x: number, y: number, label: string) {
  return `<line x1='${x}' y1='${y}' x2='${x}' y2='${y + 22}' stroke='${COL}' stroke-width='1.6'/><line x1='${x + 7}' y1='${y}' x2='${x + 7}' y2='${y + 22}' stroke='${COL}' stroke-width='1.6'/><text x='${x + 3.5}' y='${y + 36}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>${label}</text>`;
}

function res(x: number, y: number, label: string) {
  return `<rect x='${x}' y='${y}' width='40' height='12' fill='none' stroke='${COL}' stroke-width='1'/><text x='${x + 20}' y='${y + 24}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>${label}</text>`;
}

function net(x: number, y: number, label: string, anchor: "start" | "end" = "start") {
  return `<text x='${x}' y='${y}' text-anchor='${anchor}' font-family='ui-monospace,monospace' font-size='8' font-weight='600' fill='${COL}' letter-spacing='1'>${label}</text><circle cx='${x + (anchor === "end" ? -28 : 28)}' cy='${y - 3}' r='1.6' fill='${COL_M}'/>`;
}

function trace(d: string, dashed = false) {
  return `<path d='${d}' stroke='${COL_M}' stroke-width='1' fill='none'${dashed ? " stroke-dasharray='4 3'" : ""}/>`;
}

// SECTION 1 — POWER. Regulator + diode bridge + bulk caps + fuse.
function sectionPower(y: number) {
  return [
    header("§ PWR · psu-01", y),
    chip(100, y + 100, 160, 80, "U1", "LM2576-5"),
    chip(500, y + 100, 80, 80, "BR1", "DB107"),
    cap(360, y + 110, "C1 100µ"),
    cap(390, y + 110, "C2 10n"),
    cap(420, y + 110, "C3 220µ"),
    res(700, y + 120, "R1 220Ω"),
    res(760, y + 120, "R2 1.5k"),
    // fuse drawing
    `<rect x='820' y='${y + 116}' width='44' height='12' fill='none' stroke='${COL}' stroke-width='1' rx='6'/><text x='842' y='${y + 140}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>F1 3A</text>`,
    // inductor coils
    `<path d='M 920 ${y + 122} q 8 -10 16 0 q 8 -10 16 0 q 8 -10 16 0 q 8 -10 16 0' stroke='${COL}' stroke-width='1' fill='none'/><text x='960' y='${y + 150}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>L1 100µH</text>`,
    net(40, y + 100, "+12V"),
    net(40, y + 560, "GND"),
    net(1160, y + 100, "+5V", "end"),
    net(1160, y + 560, "+3.3V", "end"),
    trace(`M 80 ${y + 95} L 260 ${y + 95} L 260 ${y + 100}`),
    trace(`M 260 ${y + 180} L 360 ${y + 180} L 360 ${y + 132}`),
    trace(`M 580 ${y + 140} L 700 ${y + 140} L 700 ${y + 120}`),
    trace(`M 760 ${y + 132} L 820 ${y + 122}`),
    trace(`M 864 ${y + 122} L 920 ${y + 122}`),
    trace(`M 984 ${y + 122} L 1140 ${y + 95}`, true),
  ].join("");
}

// SECTION 2 — CPU. Big IC with pin labels, crystal, decoupling caps.
function sectionCpu(y: number) {
  const pins: string[] = [];
  // 12 pin labels along the top edge
  for (let i = 0; i < 12; i++) {
    const px = 320 + i * 30;
    pins.push(
      `<line x1='${px}' y1='${y + 100}' x2='${px}' y2='${y + 88}' stroke='${COL_M}' stroke-width='0.9'/>`,
      `<text x='${px}' y='${y + 80}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6' fill='${COL_M}'>${i + 1}</text>`,
    );
  }
  // 12 along the bottom
  for (let i = 0; i < 12; i++) {
    const px = 320 + i * 30;
    pins.push(
      `<line x1='${px}' y1='${y + 260}' x2='${px}' y2='${y + 272}' stroke='${COL_M}' stroke-width='0.9'/>`,
      `<text x='${px}' y='${y + 286}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6' fill='${COL_M}'>${24 - i}</text>`,
    );
  }
  return [
    header("§ CPU · u2-mk-xr1", y),
    `<rect x='310' y='${y + 100}' width='370' height='160' rx='4' fill='none' stroke='${COL}' stroke-width='1.3'/><circle cx='324' cy='${y + 114}' r='2.2' fill='${COL_M}'/><text x='495' y='${y + 175}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='14' font-weight='700' fill='${COL}' letter-spacing='1'>U2 · MK-XR1</text><text x='495' y='${y + 195}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='8' fill='${COL_M}'>32-bit · 200MHz · 96kB SRAM</text>`,
    pins.join(""),
    // Crystal
    `<rect x='770' y='${y + 130}' width='60' height='30' rx='2' fill='none' stroke='${COL}' stroke-width='1'/><text x='800' y='${y + 150}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='9' fill='${COL}'>Y2</text><text x='800' y='${y + 175}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>24.000MHz</text>`,
    // Decoupling caps
    cap(140, y + 200, "C4 100n"),
    cap(180, y + 200, "C5 100n"),
    cap(220, y + 200, "C6 10µ"),
    // Reset button
    `<rect x='870' y='${y + 200}' width='40' height='40' rx='1' fill='none' stroke='${COL}' stroke-width='1'/><circle cx='890' cy='${y + 220}' r='6' fill='none' stroke='${COL_M}' stroke-width='0.7'/><text x='890' y='${y + 260}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>RST1</text>`,
    // Net labels
    net(40, y + 130, "CLK"),
    net(40, y + 220, "RST"),
    net(40, y + 470, "VCC"),
    net(40, y + 540, "GND"),
    net(1160, y + 130, "IO[7:0]", "end"),
    net(1160, y + 220, "SPI", "end"),
    net(1160, y + 470, "I2C", "end"),
    net(1160, y + 540, "UART", "end"),
    trace(`M 68 ${y + 125} L 770 ${y + 125} L 770 ${y + 145}`),
    trace(`M 68 ${y + 215} L 870 ${y + 220}`),
    trace(`M 680 ${y + 130} L 1140 ${y + 130}`, true),
    trace(`M 680 ${y + 220} L 1140 ${y + 220}`, true),
  ].join("");
}

// SECTION 3 — MEMORY. RAM + ROM + address/data buses.
function sectionMemory(y: number) {
  const addr: string[] = [];
  for (let i = 0; i < 8; i++) {
    addr.push(
      trace(`M ${260 + i * 18} ${y + 320} L ${260 + i * 18} ${y + 380}`),
    );
  }
  const data: string[] = [];
  for (let i = 0; i < 8; i++) {
    data.push(
      trace(`M ${620 + i * 18} ${y + 320} L ${620 + i * 18} ${y + 380}`),
    );
  }
  return [
    header("§ MEM · u3-u4-bus", y),
    chip(180, y + 100, 200, 100, "U3", "RAM 1Mx8"),
    chip(450, y + 100, 200, 100, "U4", "ROM 512k"),
    chip(720, y + 100, 200, 100, "U5", "EEPROM 256k"),
    // Bypass caps
    cap(180, y + 220, "C7"),
    cap(450, y + 220, "C8"),
    cap(720, y + 220, "C9"),
    // Address bus bracket
    `<text x='${260 + 4 * 18}' y='${y + 310}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='8' fill='${COL}'>A[7:0]</text>`,
    addr.join(""),
    `<text x='${620 + 4 * 18}' y='${y + 310}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='8' fill='${COL}'>D[7:0]</text>`,
    data.join(""),
    // Decoder
    `<polygon points='${1000},${y + 130} ${1080},${y + 160} ${1000},${y + 190}' fill='none' stroke='${COL}' stroke-width='1.2'/><text x='1030' y='${y + 165}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='9' fill='${COL}'>U6</text><text x='1030' y='${y + 210}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>3-to-8</text>`,
    net(40, y + 150, "ADDR"),
    net(40, y + 250, "DATA"),
    net(40, y + 540, "CS#"),
    net(1160, y + 150, "RD#", "end"),
    net(1160, y + 250, "WR#", "end"),
    net(1160, y + 540, "OE#", "end"),
    trace(`M 68 ${y + 145} L 180 ${y + 145}`),
    trace(`M 380 ${y + 145} L 450 ${y + 145} L 450 ${y + 145}`),
    trace(`M 650 ${y + 145} L 720 ${y + 145}`),
    trace(`M 920 ${y + 145} L 1000 ${y + 145} L 1000 ${y + 130}`),
    trace(`M 68 ${y + 245} L 1140 ${y + 245}`, true),
  ].join("");
}

// SECTION 4 — I/O. Connectors, drivers, LEDs, ESD.
function sectionIO(y: number) {
  const leds: string[] = [];
  for (let i = 0; i < 4; i++) {
    const lx = 700 + i * 80;
    leds.push(
      `<rect x='${lx}' y='${y + 130}' width='32' height='12' fill='none' stroke='${COL}' stroke-width='1'/><text x='${lx + 16}' y='${y + 152}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>R${10 + i}</text>`,
      `<circle cx='${lx + 16}' cy='${y + 180}' r='7' fill='none' stroke='${COL}' stroke-width='1.2'/><line x1='${lx + 16}' y1='${y + 173}' x2='${lx + 16}' y2='${y + 187}' stroke='${COL}' stroke-width='1'/><text x='${lx + 16}' y='${y + 200}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>D${10 + i}</text>`,
    );
  }
  return [
    header("§ I/O · j1-j2-out", y),
    // USB-C connector
    `<rect x='100' y='${y + 100}' width='100' height='180' rx='8' fill='none' stroke='${COL}' stroke-width='1.3'/><rect x='110' y='${y + 130}' width='80' height='30' rx='12' fill='none' stroke='${COL_M}' stroke-width='0.8'/><text x='150' y='${y + 220}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='10' font-weight='600' fill='${COL}'>J1</text><text x='150' y='${y + 240}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7.5' fill='${COL_M}'>USB-C</text><text x='150' y='${y + 260}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>24-pin</text>`,
    // Serial header
    `<rect x='260' y='${y + 100}' width='60' height='80' rx='2' fill='none' stroke='${COL}' stroke-width='1.2'/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx='275' cy='${y + 115 + i * 10}' r='1.6' fill='${COL_M}'/><circle cx='305' cy='${y + 115 + i * 10}' r='1.6' fill='${COL_M}'/>`).join("")}<text x='290' y='${y + 200}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='9' font-weight='600' fill='${COL}'>J2</text><text x='290' y='${y + 218}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='7' fill='${COL_M}'>2x6 IDC</text>`,
    // Transceiver IC
    chip(380, y + 100, 140, 80, "U7", "USB-PHY"),
    // ESD protection diodes
    `<polygon points='${560},${y + 110} ${580},${y + 100} ${580},${y + 120}' fill='none' stroke='${COL_M}' stroke-width='0.9'/><line x1='580' y1='${y + 100}' x2='580' y2='${y + 120}' stroke='${COL_M}' stroke-width='1'/><text x='572' y='${y + 138}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>D5</text>`,
    `<polygon points='${600},${y + 110} ${620},${y + 100} ${620},${y + 120}' fill='none' stroke='${COL_M}' stroke-width='0.9'/><line x1='620' y1='${y + 100}' x2='620' y2='${y + 120}' stroke='${COL_M}' stroke-width='1'/><text x='612' y='${y + 138}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>D6</text>`,
    leds.join(""),
    // Test points
    `<circle cx='1040' cy='${y + 130}' r='3' fill='none' stroke='${COL}' stroke-width='1'/><text x='1040' y='${y + 148}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>TP1</text>`,
    `<circle cx='1080' cy='${y + 130}' r='3' fill='none' stroke='${COL}' stroke-width='1'/><text x='1080' y='${y + 148}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>TP2</text>`,
    `<circle cx='1120' cy='${y + 130}' r='3' fill='none' stroke='${COL}' stroke-width='1'/><text x='1120' y='${y + 148}' text-anchor='middle' font-family='ui-monospace,monospace' font-size='6.5' fill='${COL_M}'>TP3</text>`,
    net(40, y + 110, "DP"),
    net(40, y + 130, "DN"),
    net(40, y + 480, "TX"),
    net(40, y + 540, "RX"),
    net(1160, y + 480, "IRQ", "end"),
    net(1160, y + 540, "GND", "end"),
    trace(`M 68 ${y + 105} L 100 ${y + 105}`),
    trace(`M 68 ${y + 125} L 100 ${y + 125}`),
    trace(`M 200 ${y + 140} L 380 ${y + 140}`),
    trace(`M 520 ${y + 140} L 700 ${y + 136}`, true),
    trace(`M 1000 ${y + 130} L 1040 ${y + 130}`),
  ].join("");
}

const XRAY_TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='2400' viewBox='0 0 1200 2400'>
  <defs>
    <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
      <path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(91,155,244,0.18)' stroke-width='0.5'/>
    </pattern>
    <pattern id='grid-major' width='200' height='200' patternUnits='userSpaceOnUse'>
      <path d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(91,155,244,0.32)' stroke-width='0.9'/>
    </pattern>
  </defs>
  <rect width='1200' height='2400' fill='url(%23grid)'/>
  <rect width='1200' height='2400' fill='url(%23grid-major)'/>
  ${sectionPower(0)}
  ${sectionCpu(600)}
  ${sectionMemory(1200)}
  ${sectionIO(1800)}
</svg>`;

const XRAY_TILE_URL = `url("data:image/svg+xml;utf8,${XRAY_TILE.replace(/\n/g, "").replace(/"/g, "'").replace(/#/g, "%23")}")`;

/**
 * Global background atmosphere — four layers stacked for depth:
 *
 *   1. Gradient mesh    — absolute, full body height, scrolls with the
 *                         page so each section sits in its own tonal
 *                         zone.
 *   2. Matrix rain      — canvas of falling green glyphs masked by a
 *                         cursor-following radial, so the rain is only
 *                         visible inside the flashlight cone.
 *   3. Cursor spotlight — fixed, viewport-relative. Dim overlay with a
 *                         transparent "hole" tracking the cursor.
 *                         Multiply blend.
 *   4. Cursor glow      — fixed, viewport-relative. Soft accent radial
 *                         centered on the cursor, screen blend.
 *
 * All cursor-tracked layers share a single spring (damping 32, stiff
 * 180) so the light has gentle inertia rather than locking 1:1 to the
 * pointer — feels "alive" instead of mechanical.
 *
 * Reduced-motion users get the mesh alone (frozen hue, no cursor
 * layers, no rain) so the page still feels considered without any
 * motion.
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

  // Glow: tighter, brighter accent bloom centered on the cursor. Screen
  // blend so it lifts whatever sits underneath. Acts as the
  // flashlight's bright core against the dark room.
  const glow = useMotionTemplate`radial-gradient(circle 360px at ${springX}px ${springY}px, rgba(91,155,244,0.55) 0%, rgba(91,155,244,0.22) 35%, transparent 72%)`;
  // X-ray reveal mask: a circular window that follows the cursor.
  // Inside the window the tiled schematic shows through; outside it
  // is fully masked. Slightly smaller than the glow halo so the
  // X-ray reads as "what the light reveals on the wall behind it."
  const xrayMask = useMotionTemplate`radial-gradient(circle 320px at ${springX}px ${springY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0) 72%)`;

  // X-ray layer ref so the scroll listener can update background-
  // position-y directly without round-tripping through React state.
  const xrayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (reduce) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = xrayRef.current;
        if (el) {
          el.style.backgroundPositionY = `${-window.scrollY}px`;
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  // Lights on — page is fully bright. No mesh, no spotlight, no glow.
  // Hooks above still run unconditionally; we just don't render the
  // atmosphere DOM.
  if (isLightsOn) return null;

  // In dark mode the page background is already dark, so a multiply
  // dim overlay would crush pixels to black and the colorful gradient
  // mesh would muddle the contrast. We render only the layers that
  // ADD light against the dark room: the X-ray schematic revealed
  // inside the flashlight cone, plus an accent bloom centered on the
  // cursor.
  return (
    <>
      {reduce ? null : (
        <>
          {/* X-RAY SCHEMATIC underlayer — 1200×2400 SVG tile with four
              distinct sections (PWR · CPU · MEM · I/O) tiling
              vertically. Background-position-y is bound to the page's
              scrollY so new sections come into view at the cursor as
              the reader moves down — the blueprint reads as one
              continuous board, not the same stamp repeated. Revealed
              only inside the cursor mask. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[1]"
            ref={xrayRef}
            style={{
              backgroundImage: XRAY_TILE_URL,
              backgroundRepeat: "repeat",
              backgroundSize: "1200px 2400px",
              maskImage: xrayMask,
              opacity: 0.85,
              WebkitMaskImage: xrayMask,
              willChange: "mask-image, background-position",
            }}
          />

          {/* CURSOR ACCENT BLOOM — accent-tinted radial centered on
              the pointer, screen blend so it brightens the dark room
              right where the flashlight points. */}
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
