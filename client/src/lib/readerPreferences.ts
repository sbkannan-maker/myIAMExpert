export type ReaderTheme = "light" | "dark";

export const readerThemeStorageKey = "theme-v2";

export function resolveReaderTheme(storedValue: string | null, fallback: ReaderTheme): ReaderTheme {
  return storedValue === "dark" || storedValue === "light" ? storedValue : fallback;
}

export function readReaderTheme(fallback: ReaderTheme): ReaderTheme {
  if (typeof window === "undefined") return fallback;
  return resolveReaderTheme(window.localStorage.getItem(readerThemeStorageKey), fallback);
}

export function persistReaderTheme(theme: ReaderTheme) {
  if (typeof window !== "undefined") window.localStorage.setItem(readerThemeStorageKey, theme);
}
