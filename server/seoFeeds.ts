import type { Express, Request } from "express";
import { consultingProfile } from "../client/src/lib/consultingProfile";
import { blogPostsByTopic, blogTopics, findBlogTopic, toBlogDiscoverySlug } from "../client/src/lib/blogDiscovery";
import { useCases30 } from "../client/src/lib/useCases30";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, character => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

function requestOrigin(req: Request) {
  const protocol = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] || req.protocol || "https";
  return `${protocol}://${req.get("host") || "localhost:3000"}`;
}

function publicPaths() {
  return [
    "/",
    "/use-cases",
    "/blog",
    "/expert",
    "/consulting",
    "/delivery-guide",
    "/rss.xml",
    ...useCases30.map(useCase => `/use-case/${useCase.id}`),
    ...consultingProfile.linkedInFeed.map(post => `/blog/${post.slug}`),
    ...blogTopics.map(topic => `/rss/topics/${toBlogDiscoverySlug(topic)}.xml`),
  ];
}

export function buildSitemap(origin: string) {
  const entries = publicPaths().map(route => `  <url>\n    <loc>${escapeXml(new URL(route, origin).toString())}</loc>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export function buildRssFeed(origin: string) {
  const channelUrl = new URL("/blog", origin).toString();
  const items = consultingProfile.linkedInFeed.map(post => {
    const itemUrl = new URL(`/blog/${post.slug}`, origin).toString();
    const categories = post.categories.map(category => `      <category>${escapeXml(category)}</category>`).join("\n");
    return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${itemUrl}</link>\n      <guid isPermaLink="true">${itemUrl}</guid>\n      <description>${escapeXml(post.excerpt)}</description>\n      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>\n      <dc:creator>${escapeXml(post.author)}</dc:creator>\n${categories}\n    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">\n  <channel>\n    <title>Kannan IAM — Identity Engineering Insights</title>\n    <link>${channelUrl}</link>\n    <description>Architecture notes for IAM and IGA practitioners, covering identity governance, SailPoint IdentityIQ, connected access ecosystems, and delivery patterns.</description>\n    <language>en</language>\n${items}\n  </channel>\n</rss>`;
}

export function buildTopicRssFeed(origin: string, topicSlug: string) {
  const topic = findBlogTopic(topicSlug);
  if (!topic) return null;
  const channelUrl = new URL(`/blog/topics/${topicSlug}`, origin).toString();
  const items = blogPostsByTopic(topic).map(post => {
    const itemUrl = new URL(`/blog/${post.slug}`, origin).toString();
    return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${itemUrl}</link>\n      <guid isPermaLink="true">${itemUrl}</guid>\n      <description>${escapeXml(post.excerpt)}</description>\n      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>\n      <dc:creator>${escapeXml(post.author)}</dc:creator>\n      <category>${escapeXml(topic)}</category>\n    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">\n  <channel>\n    <title>Kannan IAM — ${escapeXml(topic)}</title>\n    <link>${channelUrl}</link>\n    <description>Topic-specific IAM and identity engineering insights for ${escapeXml(topic)}.</description>\n    <language>en</language>\n${items}\n  </channel>\n</rss>`;
}

export function registerSeoFeedRoutes(app: Express) {
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml").send(buildSitemap(requestOrigin(req)));
  });
  app.get("/rss.xml", (req, res) => {
    res.type("application/rss+xml").send(buildRssFeed(requestOrigin(req)));
  });
  app.get("/rss/topics/:slug.xml", (req, res) => {
    const feed = buildTopicRssFeed(requestOrigin(req), req.params.slug);
    if (!feed) return res.status(404).type("text/plain").send("Topic feed not found");
    return res.type("application/rss+xml").send(feed);
  });
  app.get("/robots.txt", (req, res) => {
    const origin = requestOrigin(req);
    res.type("text/plain").send(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", origin).toString()}\n`);
  });
}
