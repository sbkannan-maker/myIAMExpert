import { parseEditableBlogArticles, type EditableBlogArticle } from "./blogContentEditor";
import type { UseCase } from "./useCases30";

export type EditableUseCase = UseCase;

export function parseEditableUseCases(document: string): EditableUseCase[] {
  try {
    const parsed = JSON.parse(document);
    return Array.isArray(parsed) ? parsed.filter((item): item is EditableUseCase => Boolean(item) && typeof item === "object" && typeof item.id === "number" && typeof item.title === "string") : [];
  } catch { return []; }
}

export function createBlogArticle(document: string) {
  const articles = parseEditableBlogArticles(document) as Array<Record<string, unknown> & EditableBlogArticle>;
  const base = "new-identity-insight";
  let suffix = 1;
  let slug = base;
  while (articles.some((article) => article.slug === slug)) slug = `${base}-${++suffix}`;
  const article = {
    slug,
    title: "Untitled identity insight",
    kind: "Field note",
    date: new Date().toISOString().slice(0, 10),
    author: "Kannan",
    category: "Identity Governance",
    categories: ["Identity Governance"],
    tags: ["SailPoint IdentityIQ"],
    readingTime: "4 min read",
    excerpt: "Add a concise description of the identity outcome this article explains.",
    sourceLabel: "myIAM original",
    sections: [{ heading: "Overview", paragraphs: ["Start drafting the article here."] }],
    takeaways: ["Add a practical takeaway."],
  };
  return { article, document: JSON.stringify([article, ...articles], null, 2) };
}

export function duplicateBlogArticle(document: string, sourceSlug: string) {
  const articles = parseEditableBlogArticles(document) as Array<Record<string, unknown> & EditableBlogArticle>;
  const source = articles.find((article) => article.slug === sourceSlug);
  if (!source) throw new Error("The selected Blog article is no longer available.");
  const base = `${source.slug}-copy`;
  let suffix = 1;
  let slug = base;
  while (articles.some((article) => article.slug === slug)) slug = `${base}-${++suffix}`;
  const article = { ...source, slug, title: `${source.title} (copy)`, date: new Date().toISOString().slice(0, 10) };
  return { article, document: JSON.stringify([article, ...articles], null, 2) };
}

export function createUseCase(document: string) {
  const entries = parseEditableUseCases(document);
  const id = Math.max(0, ...entries.map((entry) => entry.id)) + 1;
  const useCase: EditableUseCase = { id, title: "Untitled IdentityIQ pattern", category: "JML", complexity: "Intermediate", businessRequirement: "Describe the business outcome, affected population, and control objective.", technicalSpecifications: ["Add a technical requirement."], implementationSteps: ["Add the first implementation step."], keywords: ["identity governance"] };
  return { useCase, document: JSON.stringify([useCase, ...entries], null, 2) };
}

export function duplicateUseCase(document: string, sourceId: number) {
  const entries = parseEditableUseCases(document);
  const source = entries.find((entry) => entry.id === sourceId);
  if (!source) throw new Error("The selected Use Case is no longer available.");
  const id = Math.max(0, ...entries.map((entry) => entry.id)) + 1;
  const useCase: EditableUseCase = { ...source, id, title: `${source.title} (copy)`, technicalSpecifications: [...source.technicalSpecifications], implementationSteps: [...source.implementationSteps], keywords: [...source.keywords] };
  return { useCase, document: JSON.stringify([useCase, ...entries], null, 2) };
}

export function updateUseCase(document: string, id: number, patch: Partial<EditableUseCase>) {
  const parsed = JSON.parse(document);
  if (!Array.isArray(parsed)) throw new Error("Use Cases content must be an array.");
  const index = parsed.findIndex((item) => item && typeof item === "object" && item.id === id);
  if (index < 0) throw new Error("The selected Use Case is no longer available.");
  parsed[index] = { ...parsed[index], ...patch };
  return JSON.stringify(parsed, null, 2);
}
