import { consultingProfile } from "@/lib/consultingProfile";

export type BlogArticle = (typeof consultingProfile.linkedInFeed)[number];

export const toBlogDiscoverySlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const blogAuthorPath = (author: string) => `/blog/authors/${toBlogDiscoverySlug(author)}`;
export const blogTopicPath = (topic: string) => `/blog/topics/${toBlogDiscoverySlug(topic)}`;

export const blogAuthors = Array.from(new Set(consultingProfile.linkedInFeed.map(post => post.author))).map(name => ({ name, slug: toBlogDiscoverySlug(name) }));
const topicBySlug = new Map<string, string>();
consultingProfile.linkedInFeed.flatMap(post => [post.category, ...post.categories, ...post.tags] as readonly string[]).forEach(topic => {
  const slug = toBlogDiscoverySlug(topic);
  if (!topicBySlug.has(slug)) topicBySlug.set(slug, topic);
});
export const blogTopics = Array.from(topicBySlug.values()).sort();

export const findBlogAuthor = (slug: string) => blogAuthors.find(author => author.slug === slug);
export const findBlogTopic = (slug: string) => blogTopics.find(topic => toBlogDiscoverySlug(topic) === slug);
export const blogPostsByAuthor = (author: string) => consultingProfile.linkedInFeed.filter(post => post.author === author);
export const blogPostsByTopic = (topic: string) => {
  const topicSlug = toBlogDiscoverySlug(topic);
  return consultingProfile.linkedInFeed.filter(post => ([post.category, ...post.categories, ...post.tags] as readonly string[]).some(value => toBlogDiscoverySlug(value) === topicSlug));
};

export const sortBlogArticlesByDate = (articles: readonly BlogArticle[], order: "newest" | "oldest") => [...articles].sort((first, second) => {
  const firstTime = Date.parse(first.publishedAt);
  const secondTime = Date.parse(second.publishedAt);
  return order === "newest" ? secondTime - firstTime : firstTime - secondTime;
});
