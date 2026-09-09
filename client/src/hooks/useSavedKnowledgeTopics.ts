import { useCallback, useEffect, useState } from "react";

export const savedKnowledgeTopicsStorageKey = "myiam-saved-knowledge-topics";
const changeEvent = "myiam-saved-knowledge-topics-change";

export function readSavedKnowledgeTopics(value: string | null): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0))) : [];
  } catch {
    return [];
  }
}

function readTopics() {
  if (typeof window === "undefined") return [];
  return readSavedKnowledgeTopics(window.localStorage.getItem(savedKnowledgeTopicsStorageKey));
}

function persistTopics(topics: string[]) {
  window.localStorage.setItem(savedKnowledgeTopicsStorageKey, JSON.stringify(topics));
  window.dispatchEvent(new Event(changeEvent));
}

export function useSavedKnowledgeTopics() {
  const [savedTopics, setSavedTopics] = useState<string[]>(readTopics);

  useEffect(() => {
    const sync = () => setSavedTopics(readTopics());
    window.addEventListener("storage", sync);
    window.addEventListener(changeEvent, sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(changeEvent, sync); };
  }, []);

  const toggleSavedTopic = useCallback((topic: string) => {
    const current = readTopics();
    persistTopics(current.includes(topic) ? current.filter(item => item !== topic) : [...current, topic]);
  }, []);
  const clearSavedTopics = useCallback(() => persistTopics([]), []);

  return { savedTopics, isTopicSaved: (topic: string) => savedTopics.includes(topic), toggleSavedTopic, clearSavedTopics };
}
