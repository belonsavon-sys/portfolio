import type { HTMLAttributes } from "react";

export type SectionDividerDirection = "light-to-dark" | "dark-to-light";

export type SectionDividerProps = HTMLAttributes<HTMLDivElement> & {
  direction?: SectionDividerDirection;
};

const gradients: Record<SectionDividerDirection, string> = {
  "light-to-dark": "linear-gradient(to bottom, #FFFFFF, #0A0E1A)",
  "dark-to-light": "linear-gradient(to bottom, #0A0E1A, #FFFFFF)",
};

export function SectionDivider({
  direction = "light-to-dark",
  style,
  ...props
}: SectionDividerProps) {
  const goingDark = direction === "light-to-dark";

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden"
      style={{
        background: gradients[direction],
        height: "100px",
        ...style,
      }}
      {...props}
    >
      {/* Ambient accent glow centered in the transition zone */}
      <div
        className="absolute left-1/2 top-1/2 h-32 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: goingDark
            ? "rgba(41, 110, 214, 0.22)"
            : "rgba(91, 155, 244, 0.18)",
        }}
      />
      {/* Faint horizontal accent line */}
      <div
        className="absolute left-1/2 top-1/2 h-px w-1/2 max-w-md -translate-x-1/2 -translate-y-1/2"
        style={{
          background: goingDark
            ? "linear-gradient(to right, transparent, rgba(41,110,214,0.35), transparent)"
            : "linear-gradient(to right, transparent, rgba(91,155,244,0.4), transparent)",
        }}
      />
    </div>
  );
}
