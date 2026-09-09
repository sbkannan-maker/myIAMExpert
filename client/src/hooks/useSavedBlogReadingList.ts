import { useCallback, useEffect, useState } from "react";

export const savedBlogReadingListStorageKey = "myiam-saved-blog-reading-list";
const changeEvent = "myiam-saved-blog-reading-list-change";

export function readSavedBlogReadingList(value: string | null): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0))) : [];
  } catch {
    return [];
  }
}

function readSavedPosts() {
  if (typeof window === "undefined") return [];
  return readSavedBlogReadingList(window.localStorage.getItem(savedBlogReadingListStorageKey));
}

function persistSavedPosts(slugs: string[]) {
  window.localStorage.setItem(savedBlogReadingListStorageKey, JSON.stringify(slugs));
  window.dispatchEvent(new Event(changeEvent));
}

export function useSavedBlogReadingList() {
  const [savedPostSlugs, setSavedPostSlugs] = useState<string[]>(readSavedPosts);

  useEffect(() => {
    const sync = () => setSavedPostSlugs(readSavedPosts());
    window.addEventListener("storage", sync);
    window.addEventListener(changeEvent, sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(changeEvent, sync); };
  }, []);

  const toggleSavedPost = useCallback((slug: string) => {
    const current = readSavedPosts();
    persistSavedPosts(current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  }, []);
  const clearSavedPosts = useCallback(() => persistSavedPosts([]), []);

  return { savedPostSlugs, isPostSaved: (slug: string) => savedPostSlugs.includes(slug), toggleSavedPost, clearSavedPosts };
}
