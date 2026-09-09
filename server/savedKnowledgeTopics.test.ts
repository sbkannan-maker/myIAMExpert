import { describe, expect, it } from "vitest";
import { readSavedKnowledgeTopics, savedKnowledgeTopicsStorageKey } from "../client/src/hooks/useSavedKnowledgeTopics";

describe("saved knowledge topics", () => {
  it("keeps only distinct non-empty saved topics and handles malformed device storage", () => {
    expect(savedKnowledgeTopicsStorageKey).toBe("myiam-saved-knowledge-topics");
    expect(readSavedKnowledgeTopics('["IdentityIQ", "IdentityIQ", "", "Access governance"]')).toEqual(["IdentityIQ", "Access governance"]);
    expect(readSavedKnowledgeTopics("not-json")).toEqual([]);
  });
});
