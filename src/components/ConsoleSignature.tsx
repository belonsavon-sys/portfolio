"use client";

import { useEffect } from "react";

type PierreApi = {
  about: () => void;
  ai: () => void;
  atlas: () => void;
  business: () => void;
  contact: () => void;
  help: () => void;
  home: () => void;
  now: () => void;
  resume: () => void;
  uses: () => void;
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
      ai() {
        logRoute("AI", "/ai", "Demos, case studies, Atlas portfolio.");
        go("/ai");
      },
      atlas() {
        logRoute(
          "Atlas",
          "/business#blackdoor",
          "Multi-agent harness · Blackdoor's engine.",
        );
        go("/business#blackdoor");
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
          "/contact",
          "Methods · pipeline · engagements · availability.",
        );
        go("/contact");
      },
      help() {
        console.log(
          "%cpierre.* commands\n%c" +
            "  pierre.home()      — back to the opener\n" +
            "  pierre.about()     — scroll to About on the home page\n" +
            "  pierre.ai()        — see the demos + case studies\n" +
            "  pierre.business()  — how it runs in production\n" +
            "  pierre.resume()    — the receipts, one page, PDF-ready\n" +
            "  pierre.contact()   — methods, pipeline, availability\n" +
            "  pierre.now()       — what I'm doing this week\n" +
            "  pierre.uses()      — stack with reasons\n" +
            "  pierre.atlas()     — the multi-agent harness\n" +
            "  pierre.help()      — this menu",
          "color:#296ed6;font-size:13px;font-weight:700;font-family:ui-sans-serif",
          "color:#0f172a;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.6",
        );
      },
      home() {
        logRoute("Home", "/", "The opener.");
        go("/");
      },
      now() {
        logRoute(
          "Now",
          "/now",
          "Building · Reading · Learning · Recent ships · What's next.",
        );
        go("/now");
      },
      resume() {
        logRoute("Resume", "/resume", "The receipts, one page, PDF-ready.");
        go("/resume");
      },
      uses() {
        logRoute(
          "Uses",
          "/uses",
          "AI stack · editor · infra · hardware — with reasons.",
        );
        go("/uses");
      },
    };

    window.pierre = api;
    /* eslint-enable no-console */
  }, []);

  return null;
}
