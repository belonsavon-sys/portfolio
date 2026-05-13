"use client";

import { useEffect } from "react";

type PierreApi = {
  about: () => void;
  atlas: () => void;
  business: () => void;
  contact: () => void;
  help: () => void;
  home: () => void;
  lab: () => void;
  resume: () => void;
};

declare global {
  interface Window {
    __pbs_console_signed?: boolean;
    pierre?: PierreApi;
  }
}

/**
 * ConsoleSignature does two things on first mount:
 *
 *  1. Prints a styled banner introducing Pierre + the email CTA.
 *  2. Installs a global `pierre` object exposing navigation
 *     commands (pierre.contact() / pierre.ai() / pierre.help() etc).
 *     Devs who pop open DevTools get an interactive surface that
 *     mirrors the command palette inside the page itself.
 */
export function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__pbs_console_signed) return;
    window.__pbs_console_signed = true;

    const titleStyle =
      "color:#296ed6;font-size:18px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;font-family:ui-sans-serif,system-ui,-apple-system";
    const taglineStyle =
      "color:#64748b;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace";
    const ctaStyle =
      "color:#5b9bf4;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace";
    const hintStyle =
      "color:#296ed6;font-size:12px;font-weight:600;font-family:ui-monospace,SFMono-Regular,Menlo,monospace";

    /* eslint-disable no-console */
    console.log(
      `%cPierre Belon Savon — AI Engineer\n%cBuilds intelligent automation, full-stack apps, and multi-agent harnesses.\n%c→ hiring? say hi at belonsavon@gmail.com\n%cTry pierre.help() ↓`,
      titleStyle,
      taglineStyle,
      ctaStyle,
      hintStyle,
    );

    function go(path: string) {
      if (typeof window === "undefined") return;
      window.location.assign(path);
    }

    function logRoute(label: string, path: string, description: string) {
      console.log(
        `%c${label}\n%c→ ${path}\n%c${description}`,
        "color:#0f172a;font-size:13px;font-weight:600;font-family:ui-sans-serif",
        "color:#5b9bf4;font-size:11px;font-family:ui-monospace",
        "color:#64748b;font-size:11px;font-family:ui-monospace",
      );
    }

    const api: PierreApi = {
      about() {
        logRoute("About", "scroll to #about", "The two-minute version.");
        const el = document.getElementById("about");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      atlas() {
        logRoute(
          "Atlas",
          "/atlas",
          "Multi-agent harness · Blackdoor's engine.",
        );
        go("/atlas");
      },
      business() {
        logRoute(
          "Business",
          "/business",
          "How the systems run in production.",
        );
        go("/business");
      },
      contact() {
        logRoute(
          "Contact",
          "/resume#contact",
          "Email · phone · GitHub · LinkedIn.",
        );
        go("/resume#contact");
      },
      help() {
        console.log(
          "%cpierre.* commands\n%c" +
            "  pierre.home()      — back to the opener\n" +
            "  pierre.about()     — scroll to About on the home page\n" +
            "  pierre.atlas()     — the multi-agent harness\n" +
            "  pierre.business()  — how it runs in production\n" +
            "  pierre.resume()    — the receipts, one page, PDF-ready\n" +
            "  pierre.lab()       — what i'm shipping, using, building\n" +
            "  pierre.contact()   — reach me\n" +
            "  pierre.help()      — this menu",
          "color:#296ed6;font-size:13px;font-weight:700;font-family:ui-sans-serif",
          "color:#0f172a;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.6",
        );
      },
      home() {
        logRoute("Home", "/", "The opener.");
        go("/");
      },
      lab() {
        logRoute(
          "Lab",
          "/lab",
          "What I'm shipping · demos · stack · how it's built.",
        );
        go("/lab");
      },
      resume() {
        logRoute("Resume", "/resume", "The receipts + contact, one page.");
        go("/resume");
      },
    };

    window.pierre = api;
    /* eslint-enable no-console */
  }, []);

  return null;
}
