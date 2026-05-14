"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

type ToggleOrigin = { cx: number; cy: number };

type LightSwitchValue = {
  isLightsOn: boolean;
  toggleLights: (origin?: ToggleOrigin) => void;
};

const LightSwitchContext = createContext<LightSwitchValue | null>(null);

const STORAGE_KEY = "pbs:lights-on";

// Cast helper — the View Transitions API is still surfaced as an
// optional method on Document in older lib.dom.d.ts. Narrow to a
// minimal shape so we can call it without `any`.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

/**
 * Provider that holds the room's light state. Default is "off"
 * because the cursor-flashlight atmosphere is the site's intended
 * resting look; pulling the cord turns the lights *on* (full bright).
 *
 * Preference persists to localStorage so it survives navigation and
 * reloads. On first render we use the SSR default (off) to avoid
 * hydration mismatch, then read localStorage on mount and swap to the
 * stored value — visible only as a brief flicker if the visitor
 * previously turned the lights on.
 */
export function LightSwitchProvider({ children }: { children: ReactNode }) {
  const [isLightsOn, setIsLightsOn] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        // Hydration-from-localStorage: this is the canonical pattern
        // for syncing client-only storage with React state. The
        // cascading-render warning is expected and harmless here.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLightsOn(true);
      }
    } catch {
      // localStorage unavailable (private mode, blocked) — ignore
    }
  }, []);

  // Mirror state onto `body.dark` so the CSS variable overrides in
  // globals.css take effect. Off = dark mode (flashlight room), on =
  // light mode (full bright). useLayoutEffect (not useEffect) so the
  // class swap commits during the same paint as React state — which
  // matters for the View Transitions API path in `toggleLights`,
  // where the browser snapshots the new state immediately after the
  // callback returns. We also write the class imperatively inside
  // the toggle callback for that path, but this layout-effect is
  // what handles the keyboard `L` shortcut and localStorage
  // hydration without duplicate code.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isLightsOn) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  }, [isLightsOn]);

  const toggleLights = useCallback(
    (origin?: ToggleOrigin) => {
      const next = !isLightsOn;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }

      const doc =
        typeof document === "undefined"
          ? null
          : (document as ViewTransitionDocument);

      const supportsVT =
        doc !== null &&
        typeof doc.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (supportsVT && doc) {
        const cx = origin?.cx ?? window.innerWidth / 2;
        const cy = origin?.cy ?? window.innerHeight / 2;
        const root = doc.documentElement;
        root.style.setProperty("--toggle-cx", `${cx}px`);
        root.style.setProperty("--toggle-cy", `${cy}px`);

        // Pick which clip-path keyframe runs based on toggle
        // direction. Dark→light collapses the OLD (dark) state
        // inward to the switch; light→dark expands the NEW (dark)
        // state outward from the switch. The CSS rules read these
        // four properties at snapshot time.
        if (next) {
          // dark → light: OLD on top, collapses inward
          root.style.setProperty("--lights-anim-old", "lights-clip-collapse");
          root.style.setProperty("--lights-anim-new", "none");
          root.style.setProperty("--lights-z-old", "2");
          root.style.setProperty("--lights-z-new", "1");
        } else {
          // light → dark: NEW on top, expands outward
          root.style.setProperty("--lights-anim-old", "none");
          root.style.setProperty("--lights-anim-new", "lights-clip-reveal");
          root.style.setProperty("--lights-z-old", "1");
          root.style.setProperty("--lights-z-new", "2");
        }

        // The View-Transition callback must mutate the DOM
        // synchronously, so wrap the React state update in flushSync
        // to force it to commit before the browser captures the
        // "new" snapshot. We also flip the body class imperatively
        // here — relying on the effect alone would miss the snapshot
        // window, because useEffect runs as a microtask AFTER
        // flushSync returns.
        doc.startViewTransition?.(() => {
          flushSync(() => {
            setIsLightsOn(next);
          });
          if (next) {
            doc.body.classList.remove("dark");
          } else {
            doc.body.classList.add("dark");
          }
        });
      } else {
        setIsLightsOn(next);
      }
    },
    [isLightsOn],
  );

  // Global keyboard shortcut: `L` toggles the lights regardless of
  // where focus sits, as long as the user isn't typing in an input/
  // textarea/contenteditable and isn't holding a modifier (Cmd+L is
  // the browser's "focus address bar" shortcut — never shadow it).
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "l" && event.key !== "L") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      toggleLights();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleLights]);

  return (
    <LightSwitchContext.Provider value={{ isLightsOn, toggleLights }}>
      {children}
    </LightSwitchContext.Provider>
  );
}

export function useLightSwitch() {
  const ctx = useContext(LightSwitchContext);
  if (!ctx) {
    throw new Error("useLightSwitch must be used within LightSwitchProvider");
  }
  return ctx;
}
