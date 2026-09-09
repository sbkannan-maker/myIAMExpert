import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "iiq-field-guide-saved-use-cases";
const CHANGE_EVENT = "iiq-field-guide-saved-use-cases-change";

function readSavedIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item)) : [];
  } catch {
    return [];
  }
}

function persistSavedIds(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSavedUseCases() {
  const [savedIds, setSavedIds] = useState<number[]>(readSavedIds);

  useEffect(() => {
    const sync = () => setSavedIds(readSavedIds());
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const toggleSaved = useCallback((id: number) => {
    const current = readSavedIds();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    persistSavedIds(next);
  }, []);

  const clearSaved = useCallback(() => persistSavedIds([]), []);

  return { savedIds, isSaved: (id: number) => savedIds.includes(id), toggleSaved, clearSaved };
}
