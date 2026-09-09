import { consultingProfile } from "@/lib/consultingProfile";
import { legacyKnowledgeArticles, legacyKnowledgeTopics } from "@/lib/legacyKnowledge";
import { useCases30 } from "@/lib/useCases30";
import { matchesContentQuery } from "@/lib/contentSearch";

export type GlobalSearchEntry = {
  id: string;
  title: string;
  detail: string;
  kind: "Use cases" | "Knowledge" | "Articles";
  href: string;
  keywords: string[];
};

export const globalSearchEntries: GlobalSearchEntry[] = [
  ...useCases30.map((useCase) => ({ id: `use-case-${useCase.id}`, title: useCase.title, detail: `${useCase.category} · ${useCase.complexity}`, kind: "Use cases" as const, href: `/use-case/${useCase.id}`, keywords: [useCase.businessRequirement, ...useCase.keywords, ...useCase.technicalSpecifications] })),
  ...legacyKnowledgeArticles.map((article) => ({ id: `knowledge-${article.slug}`, title: article.title, detail: article.category, kind: "Knowledge" as const, href: `/knowledge#archive-note-${article.slug}`, keywords: [article.summary, ...(legacyKnowledgeTopics[article.slug] ?? [])] })),
  ...consultingProfile.linkedInFeed.map((article) => ({ id: `article-${article.slug}`, title: article.title, detail: `${article.category} · ${article.readingTime}`, kind: "Articles" as const, href: `/blog/${article.slug}`, keywords: [article.kind, article.excerpt, ...article.categories, ...article.tags] })),
];

export function getGlobalSearchResults(query: string, limit = 8) {
  const matchingEntries = globalSearchEntries.filter((entry) => matchesContentQuery(query, [entry.title, entry.detail, ...entry.keywords]));
  const kinds: GlobalSearchEntry["kind"][] = ["Use cases", "Knowledge", "Articles"];
  const perKind = Math.max(0, Math.ceil(limit / kinds.length));
  return kinds.flatMap((kind) => matchingEntries.filter((entry) => entry.kind === kind).slice(0, perKind)).slice(0, limit);
}
