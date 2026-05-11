"use client";

import { useEffect } from "react";

export function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Guard against double-print under React strict mode in dev.
    const w = window as Window & { __pbs_console_signed?: boolean };
    if (w.__pbs_console_signed) return;
    w.__pbs_console_signed = true;

    const title =
      "%cPierre Belon Savon — AI Engineer";
    const titleStyle =
      "color:#296ed6;font-size:18px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;font-family:ui-sans-serif,system-ui,-apple-system";
    const tagline =
      "%cBuilds intelligent automation, full-stack apps, and multi-agent harnesses.";
    const taglineStyle =
      "color:#64748b;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace";
    const cta =
      "%c→ hiring? say hi at belonsavon@gmail.com";
    const ctaStyle =
      "color:#5b9bf4;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace";

    // eslint-disable-next-line no-console
    console.log(`${title}\n${tagline}\n${cta}`, titleStyle, taglineStyle, ctaStyle);
  }, []);

  return null;
}
