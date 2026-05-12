"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_SIZE = 32;
const HOVER_SIZE = 56;
const PRESS_SIZE = 22;

/**
 * Signature precision cursor — a thin accent-ring that follows the OS
 * cursor with a soft lerp, grows when hovering interactive elements,
 * and contracts on click. The native cursor stays visible underneath
 * (we never hide it — accessibility); this is a foreground "second
 * cursor" that adds personality without compromising usability.
 *
 * Hidden on touch / coarse pointers via `(hover: hover) and
 * (pointer: fine)` media query — phones and tablets never see it.
 *
 * Reduced-motion users get a static, non-animated ring (still respects
 * size changes on hover/press, just without the lerp easing).
 */
export function PrecisionCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const sizeRef = useRef(DEFAULT_SIZE);
  const visible = useRef(false);
  const pressed = useRef(false);
  const hovered = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Skip the precision cursor entirely on touch / coarse pointers.
    // (Mobile, tablets, anything without a real hover capability.)
    const supports = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    if (!supports.matches) return;
    setActive(true);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;

    function applyTransform() {
      const node = ref.current;
      if (!node) return;
      const size = sizeRef.current;
      node.style.transform = `translate3d(${current.current.x - size / 2}px, ${
        current.current.y - size / 2
      }px, 0)`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
    }

    function applyTargetSize() {
      // Compose: press > hover > default.
      const next = pressed.current
        ? PRESS_SIZE
        : hovered.current
          ? HOVER_SIZE
          : DEFAULT_SIZE;
      sizeRef.current = next;
      const inner = innerRef.current;
      if (inner) {
        inner.dataset.state = pressed.current
          ? "press"
          : hovered.current
            ? "hover"
            : "rest";
      }
    }

    function loop() {
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      applyTransform();
      raf = requestAnimationFrame(loop);
    }

    function onMove(event: PointerEvent) {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (!visible.current) {
        visible.current = true;
        current.current.x = event.clientX;
        current.current.y = event.clientY;
        if (ref.current) ref.current.style.opacity = "1";
        applyTransform();
      }
      // Detect interactive hover targets. Anything with an
      // a[href], button, [role="button"], or [data-cursor="link"]
      // ancestor triggers the hover state. Bumping the ring to the
      // larger size is then the cursor's "I'm pointing at something
      // clickable" signal.
      const node = event.target as Element | null;
      const interactive = !!node?.closest?.(
        'a[href], button, [role="button"], input, textarea, select, label, [data-cursor="link"]',
      );
      if (interactive !== hovered.current) {
        hovered.current = interactive;
        applyTargetSize();
      }
    }

    function onLeave() {
      visible.current = false;
      if (ref.current) ref.current.style.opacity = "0";
    }

    function onDown() {
      pressed.current = true;
      applyTargetSize();
    }

    function onUp() {
      pressed.current = false;
      applyTargetSize();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    if (reduce) {
      // Snap mode — no lerp loop; cursor follows pointer 1:1.
      function snapMove(event: PointerEvent) {
        current.current.x = event.clientX;
        current.current.y = event.clientY;
        applyTransform();
      }
      window.addEventListener("pointermove", snapMove, { passive: true });
      applyTargetSize();
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointermove", snapMove);
        window.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    }

    applyTargetSize();
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!mounted || !active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] opacity-0"
      ref={ref}
      style={{
        height: DEFAULT_SIZE,
        transition: "opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        width: DEFAULT_SIZE,
        willChange: "transform, width, height",
      }}
    >
      {/* The visible ring. data-state controls its appearance via CSS
          variables that interpolate. */}
      <div
        className="precision-cursor-ring"
        data-state="rest"
        ref={innerRef}
      />
    </div>
  );
}
