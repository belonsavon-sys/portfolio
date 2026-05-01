"use client";

import { useEffect, useState } from "react";

export type CursorHaloProps = {
  className?: string;
  size?: number;
};

export function CursorHalo({ className = "", size = 480 }: CursorHaloProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    function onMove(event: PointerEvent) {
      setPos({ x: event.clientX, y: event.clientY });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!mounted || !pos) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed -z-10 rounded-full blur-3xl transition-opacity duration-300 ${className}`}
      style={{
        background:
          "radial-gradient(closest-side, rgba(41, 110, 214, 0.32), rgba(41, 110, 214, 0))",
        height: size,
        left: pos.x - size / 2,
        opacity: 1,
        top: pos.y - size / 2,
        width: size,
      }}
    />
  );
}
