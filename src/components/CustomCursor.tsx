"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role=button], input, textarea, select, label, summary, [data-cursor=interactive]";

/**
 * Custom cursor — small precise dot + lagging outer ring.
 *
 * - Inner dot tracks the cursor 1:1.
 * - Outer ring lerps (0.22) behind it for a smooth ribbon-trail feel.
 * - On hover over interactive elements, ring scales up + brightens.
 * - On mousedown, both shrink slightly for tactile feedback.
 * - Only renders on devices with hover + fine pointer (skip touch).
 * - Respects prefers-reduced-motion (uses native cursor).
 *
 * Coexists with CursorHalo (the broader ambient glow).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);
  const visibleRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsFinePointer || reduce) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    let raf = 0;

    function show() {
      if (visibleRef.current) return;
      visibleRef.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    }

    function hide() {
      visibleRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    }

    function onMove(event: PointerEvent) {
      targetX.current = event.clientX;
      targetY.current = event.clientY;
      if (!visibleRef.current) {
        ringX.current = event.clientX;
        ringY.current = event.clientY;
        show();
      }
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${event.clientX - 4}px, ${event.clientY - 4}px, 0)`;
      }
    }

    function loop() {
      // Lerp ring towards target.
      ringX.current += (targetX.current - ringX.current) * 0.22;
      ringY.current += (targetY.current - ringY.current) * 0.22;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${ringX.current - 18}px, ${ringY.current - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }

    function onOver(event: PointerEvent) {
      const target = event.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE_SELECTOR);
      const ring = ringRef.current;
      if (!ring) return;
      ring.dataset.state = interactive ? "interactive" : "idle";
    }

    function onDown() {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring) ring.dataset.pressed = "true";
      if (dot) dot.dataset.pressed = "true";
    }
    function onUp() {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring) delete ring.dataset.pressed;
      if (dot) delete dot.dataset.pressed;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    raf = requestAnimationFrame(loop);

    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1000] h-2 w-2 rounded-full bg-accent opacity-0 transition-[opacity,transform,background] duration-150"
        ref={dotRef}
        style={{ willChange: "transform" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] h-9 w-9 rounded-full border border-accent/55 opacity-0 mix-blend-multiply transition-[opacity,width,height,background,border-color,transform] duration-200 ease-out data-[state=interactive]:h-12 data-[state=interactive]:w-12 data-[state=interactive]:border-accent data-[state=interactive]:bg-accent/10 data-[pressed=true]:scale-90"
        ref={ringRef}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
