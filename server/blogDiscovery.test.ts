import { describe, expect, it } from "vitest";
import { blogAuthorPath, blogPostsByTopic, blogTopicPath, blogTopics, findBlogTopic, sortBlogArticlesByDate, toBlogDiscoverySlug } from "../client/src/lib/blogDiscovery";
import { consultingProfile } from "../client/src/lib/consultingProfile";
import { readSavedBlogReadingList, savedBlogReadingListStorageKey } from "../client/src/hooks/useSavedBlogReadingList";

describe("Blog discovery", () => {
  it("builds encoded author and topic detail paths", () => {
    expect(toBlogDiscoverySlug("OAuth 2.0")).toBe("oauth-2-0");
    expect(blogAuthorPath("Kannan Sriniyappan Balakrishnan")).toBe("/blog/authors/kannan-sriniyappan-balakrishnan");
    expect(blogTopicPath("SailPoint IdentityIQ")).toBe("/blog/topics/sailpoint-identityiq");
    expect(findBlogTopic("sailpoint-integration")).toBe("SailPoint Integration");
    expect(blogPostsByTopic("SailPoint Integration")).toHaveLength(1);
    expect(blogTopics.filter(topic => toBlogDiscoverySlug(topic) === "identity-correlation")).toHaveLength(1);
    expect(blogPostsByTopic("Identity Correlation")).toHaveLength(1);
  });

  it("sorts articles from their source publication dates", () => {
    const newest = sortBlogArticlesByDate(consultingProfile.linkedInFeed, "newest");
    const oldest = sortBlogArticlesByDate(consultingProfile.linkedInFeed, "oldest");
    expect(newest[0]?.slug).toBe("sailpoint-identityiq-governed-implementation-case-study");
    expect(oldest[0]?.slug).toBe("multi-source-identity-governance-architecture");
  });

  it("keeps the browser-local reading list defensive and duplicate-free", () => {
    expect(savedBlogReadingListStorageKey).toBe("myiam-saved-blog-reading-list");
    expect(readSavedBlogReadingList('["first", "first", "second", ""]')).toEqual(["first", "second"]);
    expect(readSavedBlogReadingList("invalid json")).toEqual([]);
  });
});
