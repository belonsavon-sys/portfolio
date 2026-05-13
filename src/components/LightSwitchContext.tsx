"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightSwitchValue = {
  isLightsOn: boolean;
  toggleLights: () => void;
};

const LightSwitchContext = createContext<LightSwitchValue | null>(null);

const STORAGE_KEY = "pbs:lights-on";

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

  const toggleLights = useCallback(() => {
    setIsLightsOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

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
