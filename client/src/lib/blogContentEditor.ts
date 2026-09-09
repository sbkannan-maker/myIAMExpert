export type EditableBlogSection = { heading: string; paragraphs: string[] };
export type EditableBlogArticle = { slug: string; title: string; sections?: EditableBlogSection[]; [key: string]: unknown };

export function parseEditableBlogArticles(document: string): EditableBlogArticle[] {
  try {
    const parsed = JSON.parse(document);
    return Array.isArray(parsed) ? parsed.filter((item): item is EditableBlogArticle => Boolean(item) && typeof item === "object" && typeof item.slug === "string" && typeof item.title === "string") : [];
  } catch {
    return [];
  }
}

export function articleBodyToMarkdown(article: EditableBlogArticle | undefined) {
  if (!article?.sections?.length) return "";
  return article.sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n");
}

export function markdownToArticleSections(markdown: string): EditableBlogSection[] {
  const sections: EditableBlogSection[] = [];
  let heading = "Overview";
  let paragraphs: string[] = [];
  const commit = () => {
    const cleaned = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
    if (cleaned.length) sections.push({ heading, paragraphs: cleaned });
  };

  markdown.trim().split(/\n{2,}/).forEach((block) => {
    const cleaned = block.trim();
    if (!cleaned) return;
    if (cleaned.startsWith("## ")) {
      commit();
      heading = cleaned.slice(3).trim() || "Overview";
      paragraphs = [];
      return;
    }
    paragraphs.push(cleaned);
  });
  commit();
  return sections;
}

export function updateBlogArticleBody(document: string, slug: string, markdown: string) {
  const parsed = JSON.parse(document);
  if (!Array.isArray(parsed)) throw new Error("Blog content must be an article array.");
  const index = parsed.findIndex((item) => item && typeof item === "object" && item.slug === slug);
  if (index < 0) throw new Error("The selected article is no longer in this Blog document.");
  parsed[index] = { ...parsed[index], sections: markdownToArticleSections(markdown) };
  return JSON.stringify(parsed, null, 2);
}
