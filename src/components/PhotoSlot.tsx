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
      <div className="relative h-full overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
        {assetState !== "ready" ? (
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="h-2 w-2 rounded-full bg-accent-light" />
              <span className="h-2 w-2 rounded-full bg-accent-deep" />
            </div>
            <div className="py-4">
              <p className="text-4xl font-semibold tracking-normal text-text-light">
                PBS
              </p>
              <p className="mt-3 text-sm font-semibold text-accent">
                {fallbackTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-light-muted">
                {fallbackMeta}
              </p>
            </div>
            <div className="h-px w-full bg-border-light" />
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
