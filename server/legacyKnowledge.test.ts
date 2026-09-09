import { describe, expect, it } from "vitest";
import { getKnowledgeSuggestions, knowledgeTopicPath, nextSuggestionIndex } from "../client/src/lib/legacyKnowledgeDiscovery";
import { legacyKnowledgeArticles, legacyKnowledgeCategories, legacyKnowledgePublishedAt, legacyKnowledgeTopics } from "../client/src/lib/legacyKnowledge";

describe("legacy WordPress knowledge archive", () => {
  it("preserves every public navigation topic as a sourced archive entry", () => {
    expect(legacyKnowledgeArticles).toHaveLength(14);
    expect(legacyKnowledgeCategories).toEqual(["All", "SailPoint", "IBM Identity", "Java & J2EE", "Archive"]);
    expect(legacyKnowledgeArticles.every(article => article.sourceUrl.startsWith("https://sbkannan.wordpress.com/"))).toBe(true);
    expect(legacyKnowledgeArticles.every(article => article.summary.length > 40 && article.sections.length > 0)).toBe(true);
    expect(Object.keys(legacyKnowledgeTopics)).toHaveLength(legacyKnowledgeArticles.length);
    expect(Object.keys(legacyKnowledgePublishedAt)).toHaveLength(legacyKnowledgeArticles.length);
    expect(legacyKnowledgePublishedAt["quick-ssd-deployment-steps"]).toBe("2019-10-18T15:07:21.000Z");
    expect(legacyKnowledgeTopics["overview-of-sailpoint-identityiq"]).toEqual(expect.arrayContaining(["IdentityIQ", "Access governance"]));
    expect(legacyKnowledgeArticles.find(article => article.slug === "overview-of-sailpoint-identityiq")?.sections.map(section => section.heading)).toEqual(expect.arrayContaining(["Four major components", "Identity data concepts", "Provisioning and certification"]));
    expect(legacyKnowledgeArticles.find(article => article.slug === "quick-ssd-deployment-steps")?.sections).toHaveLength(3);
  });

  it("offers focused suggestions and safely encodes shareable topic paths", () => {
    const suggestions = getKnowledgeSuggestions("identityiq");
    expect(suggestions.some(suggestion => suggestion.kind === "article" && suggestion.slug === "overview-of-sailpoint-identityiq")).toBe(true);
    expect(suggestions.some(suggestion => suggestion.kind === "topic" && suggestion.label === "IdentityIQ")).toBe(true);
    expect(getKnowledgeSuggestions("i")).toEqual([]);
    expect(knowledgeTopicPath("Access governance")).toBe("/knowledge?topic=Access%20governance");
  });

  it("cycles, jumps, and safely resets keyboard suggestion positions", () => {
    expect(nextSuggestionIndex(-1, 4, "ArrowDown")).toBe(0);
    expect(nextSuggestionIndex(3, 4, "ArrowDown")).toBe(0);
    expect(nextSuggestionIndex(0, 4, "ArrowUp")).toBe(3);
    expect(nextSuggestionIndex(2, 4, "Home")).toBe(0);
    expect(nextSuggestionIndex(1, 4, "End")).toBe(3);
    expect(nextSuggestionIndex(0, 0, "ArrowDown")).toBe(-1);
  });
});
