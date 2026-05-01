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
  return (
    <div
      aria-hidden="true"
      style={{
        background: gradients[direction],
        height: "80px",
        ...style,
      }}
      {...props}
    />
  );
}
