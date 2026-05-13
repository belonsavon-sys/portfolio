"use client";

import { useEffect, useState } from "react";

export type PhotoSlotProps = {
  alt: string;
  caption?: string;
  className?: string;
  fallbackMeta: string;
  fallbackTitle: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  src: string;
};

export function PhotoSlot({
  alt,
  caption,
  className = "",
  fallbackMeta,
  fallbackTitle,
  fit = "cover",
  priority = false,
  src,
}: PhotoSlotProps) {
  const [assetState, setAssetState] = useState<"checking" | "missing" | "ready">(
    "checking",
  );

  useEffect(() => {
    let isMounted = true;

    fetch(src, { method: "HEAD" })
      .then((response) => {
        if (isMounted) {
          setAssetState(response.ok ? "ready" : "missing");
        }
      })
      .catch(() => {
        if (isMounted) {
          setAssetState("missing");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <figure className={className}>
      <div className="relative h-full overflow-hidden rounded-xl border border-[rgba(41,110,214,0.25)] bg-gradient-to-br from-bg-dark-2 to-bg-dark text-text-dark">
        {assetState !== "ready" ? (
          <div className="relative flex h-full flex-col justify-between p-5">
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl"
            />
            {/* Top dots */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent-deep" />
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="h-2 w-2 rounded-full bg-accent-light" />
              </div>
              <span className="font-mono text-[10px] text-text-dark-muted">
                Placeholder
              </span>
            </div>
            {/* Center monogram */}
            <div className="relative flex flex-1 items-center justify-center">
              <span
                className="select-none font-bold leading-none"
                style={{
                  fontSize: "clamp(3rem, 9vw, 5rem)",
                  letterSpacing: "-0.05em",
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PBS
              </span>
            </div>
            {/* Bottom meta */}
            <div className="relative">
              <p className="font-mono text-[10px] text-accent-light">
                {fallbackTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-text-dark-muted">
                {fallbackMeta}
              </p>
            </div>
          </div>
        ) : (
          // These photo paths are intentionally allowed to be missing until
          // Pierre adds the selected assets to public/.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt}
            className={`h-full w-full ${
              fit === "contain" ? "object-contain" : "object-cover"
            }`}
            fetchPriority={priority ? "high" : "auto"}
            loading="eager"
            onError={() => setAssetState("missing")}
            src={src}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-text-light-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
