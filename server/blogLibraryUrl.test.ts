import { describe, expect, it } from "vitest";
import { parseBlogLibraryUrlState, serializeBlogLibraryUrlState } from "../client/src/lib/blogLibraryUrl";

describe("Blog library shareable URL state", () => {
  it("serializes only meaningful search, category, and date-order controls", () => {
    expect(serializeBlogLibraryUrlState({ query: "", category: "All categories", sortOrder: "newest" })).toBe("");
    expect(serializeBlogLibraryUrlState({ query: "sailpoint", category: "SailPoint IdentityIQ", sortOrder: "oldest" })).toBe("?q=sailpoint&category=SailPoint+IdentityIQ&sort=oldest");
  });

  it("restores valid filters and defaults a missing or invalid sort order", () => {
    expect(parseBlogLibraryUrlState("?q=governance&category=Access+Governance&sort=oldest")).toEqual({ query: "governance", category: "Access Governance", sortOrder: "oldest" });
    expect(parseBlogLibraryUrlState("?sort=unexpected")).toEqual({ query: "", category: "All categories", sortOrder: "newest" });
  });
});
