import { useCallback, useEffect, useState } from "react";

export type TopicAlertPreferences = { email: string; topics: string[] };
export const topicAlertPreferencesStorageKey = "myiam-topic-alert-preferences";
export const topicAlertPreferencesChangeEvent = "myiam-topic-alert-preferences-change";

export function readTopicAlertPreferences(value: string | null): TopicAlertPreferences {
  try {
    const parsed = JSON.parse(value ?? "{}");
    return {
      email: typeof parsed.email === "string" ? parsed.email : "",
      topics: Array.isArray(parsed.topics) ? Array.from(new Set(parsed.topics.filter((topic: unknown): topic is string => typeof topic === "string" && topic.trim().length > 0))) : [],
    };
  } catch {
    return { email: "", topics: [] };
  }
}

function readPreferences() {
  if (typeof window === "undefined") return { email: "", topics: [] };
  return readTopicAlertPreferences(window.localStorage.getItem(topicAlertPreferencesStorageKey));
}

export function useTopicAlertPreferences() {
  const [preferences, setPreferences] = useState<TopicAlertPreferences>(readPreferences);
  useEffect(() => {
    const sync = () => setPreferences(readPreferences());
    window.addEventListener("storage", sync);
    window.addEventListener(topicAlertPreferencesChangeEvent, sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(topicAlertPreferencesChangeEvent, sync); };
  }, []);
  const savePreferences = useCallback((next: TopicAlertPreferences) => {
    window.localStorage.setItem(topicAlertPreferencesStorageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(topicAlertPreferencesChangeEvent));
    setPreferences(next);
  }, []);
  const clearPreferences = useCallback(() => {
    window.localStorage.removeItem(topicAlertPreferencesStorageKey);
    window.dispatchEvent(new Event(topicAlertPreferencesChangeEvent));
    setPreferences({ email: "", topics: [] });
  }, []);
  return { preferences, savePreferences, clearPreferences };
}
