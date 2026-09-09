import { toBlogDiscoverySlug, type BlogArticle } from "@/lib/blogDiscovery";

export const allSavedTopics = "All saved topics";

export function getSavedReadingListTopics(articles: readonly BlogArticle[], savedPostSlugs: readonly string[]) {
  const topicBySlug = new Map<string, string>();
  articles.filter(article => savedPostSlugs.includes(article.slug)).flatMap(article => [article.category, ...article.categories, ...article.tags] as readonly string[]).forEach(topic => {
    const slug = toBlogDiscoverySlug(topic);
    if (!topicBySlug.has(slug)) topicBySlug.set(slug, topic);
  });
  return Array.from(topicBySlug.values()).sort();
}

export function matchesSavedReadingListTopic(article: BlogArticle, topic: string) {
  if (topic === allSavedTopics) return true;
  const requestedSlug = toBlogDiscoverySlug(topic);
  return ([article.category, ...article.categories, ...article.tags] as readonly string[]).some(value => toBlogDiscoverySlug(value) === requestedSlug);
}
