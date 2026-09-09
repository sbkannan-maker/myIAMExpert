import { legacyKnowledgeArticles, legacyKnowledgeTopics } from "./legacyKnowledge";

export type KnowledgeSuggestion = {
  id: string;
  kind: "article" | "topic";
  label: string;
  detail: string;
  slug?: string;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export function getKnowledgeSuggestions(query: string, limit = 6): KnowledgeSuggestion[] {
  const term = normalize(query);
  if (term.length < 2) return [];

  const articleSuggestions = legacyKnowledgeArticles
    .filter(article => `${article.title} ${article.summary}`.toLocaleLowerCase().includes(term))
    .map(article => ({
      id: `article:${article.slug}`,
      kind: "article" as const,
      label: article.title,
      detail: `${article.category} note`,
      slug: article.slug,
    }));

  const topicSuggestions = Array.from(new Set(legacyKnowledgeArticles.flatMap(article => legacyKnowledgeTopics[article.slug] ?? [])))
    .filter(topic => normalize(topic).includes(term))
    .sort((first, second) => first.localeCompare(second))
    .map(topic => ({
      id: `topic:${topic}`,
      kind: "topic" as const,
      label: topic,
      detail: "Browse topic",
    }));

  return [...articleSuggestions, ...topicSuggestions].slice(0, limit);
}

export function knowledgeTopicPath(topic: string) {
  return `/knowledge?topic=${encodeURIComponent(topic)}`;
}

export function nextSuggestionIndex(currentIndex: number, count: number, key: "ArrowDown" | "ArrowUp" | "Home" | "End") {
  if (count <= 0) return -1;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowDown") return currentIndex < 0 || currentIndex >= count - 1 ? 0 : currentIndex + 1;
  return currentIndex <= 0 ? count - 1 : currentIndex - 1;
}

export const topicLinkCopySuccessMessage = "Topic link copied!";
export const topicLinkCopyFailureMessage = "Could not copy the topic link. Use the visible topic URL instead.";

export function topicShareUrl(origin: string, topic: string) {
  return `${origin}${knowledgeTopicPath(topic)}`;
}
