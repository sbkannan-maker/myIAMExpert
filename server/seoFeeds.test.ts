import { describe, expect, it } from "vitest";
import { buildRssFeed, buildSitemap, buildTopicRssFeed } from "./seoFeeds";

describe("SEO discovery feeds", () => {
  const origin = "https://example.com";

  it("includes primary routes and individual Blog routes in the sitemap", () => {
    const sitemap = buildSitemap(origin);
    expect(sitemap).toContain("https://example.com/blog");
    expect(sitemap).toContain("https://example.com/use-cases");
    expect(sitemap).toContain("https://example.com/expert");
    expect(sitemap).toContain("https://example.com/blog/multi-source-identity-governance-architecture");
    expect(sitemap).toContain("https://example.com/rss.xml");
    expect(sitemap).toContain("https://example.com/rss/topics/sailpoint-identityiq.xml");
  });

  it("creates an RSS channel with the specific IAM article categories", () => {
    const rss = buildRssFeed(origin);
    expect(rss).toContain("Kannan IAM — Identity Engineering Insights");
    expect(rss).toContain("<category>IGA Architecture</category>");
    expect(rss).toContain("<category>SailPoint IdentityIQ</category>");
    expect(rss).toContain("<pubDate>Thu, 09 Apr 2026 00:00:00 GMT</pubDate>");
    expect(rss).toContain("<dc:creator>Kannan Sriniyappan Balakrishnan</dc:creator>");
  });

  it("creates a focused per-topic RSS channel and rejects unknown topics", () => {
    const feed = buildTopicRssFeed(origin, "sailpoint-identityiq");
    expect(feed).toContain("Kannan IAM — SailPoint IdentityIQ");
    expect(feed).toContain("https://example.com/blog/topics/sailpoint-identityiq");
    expect(feed).toContain("SailPoint IdentityIQ implementation case study");
    expect(buildTopicRssFeed(origin, "missing-topic")).toBeNull();
  });
});
