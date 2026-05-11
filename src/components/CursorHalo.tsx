"use client";

import { useEffect, useRef, useState } from "react";

export type CursorHaloProps = {
  className?: string;
  size?: number;
};

export function CursorHalo({ className = "", size = 480 }: CursorHaloProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const half = size / 2;

    function onMove(event: PointerEvent) {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (!visible.current) {
        visible.current = true;
        current.current.x = event.clientX;
        current.current.y = event.clientY;
        if (ref.current) ref.current.style.opacity = "1";
      }
    }

    function loop() {
      // Lerp smoothing — 0.18 gives a tight but soft follow.
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      const node = ref.current;
      if (node) {
        node.style.transform = `translate3d(${current.current.x - half}px, ${
          current.current.y - half
        }px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [size]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 -z-10 rounded-full opacity-0 blur-3xl transition-opacity duration-500 ${className}`}
      ref={ref}
      style={{
        background:
          "radial-gradient(closest-side, rgba(41, 110, 214, 0.32), rgba(41, 110, 214, 0))",
        height: size,
        width: size,
        willChange: "transform",
      }}
    />
  );
}
