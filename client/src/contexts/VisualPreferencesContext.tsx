import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type MotionPreference = "system" | "full" | "reduced";

type VisualPreferencesValue = {
  motionPreference: MotionPreference;
  isReducedMotion: boolean;
  setMotionPreference: (preference: MotionPreference) => void;
};

const motionStorageKey = "myiam-motion-preference";
const VisualPreferencesContext = createContext<VisualPreferencesValue | null>(null);

function readMotionPreference(): MotionPreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(motionStorageKey);
  return stored === "full" || stored === "reduced" || stored === "system" ? stored : "system";
}

export function VisualPreferencesProvider({ children }: { children: ReactNode }) {
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(readMotionPreference);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const isReducedMotion = motionPreference === "reduced" || (motionPreference === "system" && systemReducedMotion);

  useEffect(() => {
    document.documentElement.dataset.motion = isReducedMotion ? "reduced" : "full";
    window.localStorage.setItem(motionStorageKey, motionPreference);
  }, [isReducedMotion, motionPreference]);

  return <VisualPreferencesContext.Provider value={{ motionPreference, isReducedMotion, setMotionPreference }}>{children}</VisualPreferencesContext.Provider>;
}

export function useVisualPreferences() {
  const context = useContext(VisualPreferencesContext);
  if (!context) throw new Error("useVisualPreferences must be used within VisualPreferencesProvider");
  return context;
}

export { motionStorageKey };
