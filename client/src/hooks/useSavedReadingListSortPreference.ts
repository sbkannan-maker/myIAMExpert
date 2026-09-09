import { useCallback, useEffect, useState } from "react";

export type SavedReadingListSortOrder = "newest" | "oldest";
export const savedReadingListSortStorageKey = "myiam-saved-blog-reading-list-sort";

export function readSavedReadingListSortPreference(value: string | null): SavedReadingListSortOrder {
  return value === "oldest" ? "oldest" : "newest";
}

export function useSavedReadingListSortPreference() {
  const [sortOrder, setLocalSortOrder] = useState<SavedReadingListSortOrder>(() => typeof window === "undefined" ? "newest" : readSavedReadingListSortPreference(window.localStorage.getItem(savedReadingListSortStorageKey)));

  useEffect(() => {
    const sync = () => setLocalSortOrder(readSavedReadingListSortPreference(window.localStorage.getItem(savedReadingListSortStorageKey)));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const setSortOrder = useCallback((nextSortOrder: SavedReadingListSortOrder) => {
    setLocalSortOrder(nextSortOrder);
    window.localStorage.setItem(savedReadingListSortStorageKey, nextSortOrder);
  }, []);

  const clearSortOrder = useCallback(() => {
    window.localStorage.removeItem(savedReadingListSortStorageKey);
    setLocalSortOrder("newest");
  }, []);

  return { sortOrder, setSortOrder, clearSortOrder };
}
