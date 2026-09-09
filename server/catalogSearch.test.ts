import { describe, expect, it } from "vitest";
import { normalizeSearchResponse } from "./catalogSearch";

describe("normalizeSearchResponse", () => {
  it("keeps only unique catalog IDs and preserves a concise interpretation", () => {
    const result = normalizeSearchResponse({
      interpretation: "Find patterns for short-lived contractor access with a sponsor approval and automatic removal.",
      recommendedIds: [10, 36, 10, 999, "five", 28],
      suggestedRefinement: "Do you need the pattern to include emergency access?",
    });

    expect(result.recommendedIds).toEqual([10, 36, 28]);
    expect(result.interpretation).toContain("short-lived contractor access");
    expect(result.suggestedRefinement).toContain("emergency access");
  });

  it("returns a safe empty result for malformed model output", () => {
    expect(normalizeSearchResponse({ recommendedIds: "not-an-array" })).toEqual({
      interpretation: "Relevant IdentityIQ implementation patterns",
      recommendedIds: [],
      suggestedRefinement: "",
    });
  });
});
