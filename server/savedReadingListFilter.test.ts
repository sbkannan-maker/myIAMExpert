import { describe, expect, it } from "vitest";
import { getSavedReadingListTopics, matchesSavedReadingListTopic } from "../client/src/lib/savedReadingListFilter";
import { consultingProfile } from "../client/src/lib/consultingProfile";
import { toBlogDiscoverySlug } from "../client/src/lib/blogDiscovery";
import { readSavedReadingListSortPreference, savedReadingListSortStorageKey } from "../client/src/hooks/useSavedReadingListSortPreference";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("saved Blog reading-list topic filters", () => {
  const caseStudy = consultingProfile.linkedInFeed.find(article => article.slug === "sailpoint-identityiq-governed-implementation-case-study")!;
  const integration = consultingProfile.linkedInFeed.find(article => article.slug === "entra-id-sailpoint-iiq-integration-overview")!;

  it("derives normalized topics from locally saved articles and filters by a chosen topic", () => {
    const topics = getSavedReadingListTopics(consultingProfile.linkedInFeed, [caseStudy.slug, integration.slug]);
    expect(topics).toContain("SailPoint IdentityIQ");
    expect(topics.filter(topic => toBlogDiscoverySlug(topic) === "sailpoint-identityiq")).toHaveLength(1);
    expect(matchesSavedReadingListTopic(caseStudy, "SailPoint IdentityIQ")).toBe(true);
    expect(matchesSavedReadingListTopic(integration, "SailPoint IdentityIQ")).toBe(true);
    expect(matchesSavedReadingListTopic(integration, "JML lifecycle")).toBe(false);
  });

  it("restores a safe persisted saved-list sort preference", () => {
    expect(savedReadingListSortStorageKey).toBe("myiam-saved-blog-reading-list-sort");
    expect(readSavedReadingListSortPreference("oldest")).toBe("oldest");
    expect(readSavedReadingListSortPreference("newest")).toBe("newest");
    expect(readSavedReadingListSortPreference("invalid")).toBe("newest");
    const hook = readFileSync(resolve(import.meta.dirname, "../client/src/hooks/useSavedReadingListSortPreference.ts"), "utf8");
    expect(hook).toContain("clearSortOrder");
    expect(hook).toContain("removeItem(savedReadingListSortStorageKey)");
  });
});
