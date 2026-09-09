import { describe, expect, it } from "vitest";
import { getGlobalSearchResults, globalSearchEntries } from "../client/src/lib/globalSearch";

describe("global command search", () => {
  it("indexes real use cases, knowledge notes, and articles", () => {
    expect(globalSearchEntries.some((entry) => entry.kind === "Use cases")).toBe(true);
    expect(globalSearchEntries.some((entry) => entry.kind === "Knowledge")).toBe(true);
    expect(globalSearchEntries.some((entry) => entry.kind === "Articles")).toBe(true);
  });

  it("returns only entries that satisfy every entered search term", () => {
    expect(getGlobalSearchResults("identityiq implementation").every((entry) => `${entry.title} ${entry.detail} ${entry.keywords.join(" ")}`.toLowerCase().includes("identityiq"))).toBe(true);
    expect(getGlobalSearchResults("identityiq implementation", 3)).toHaveLength(1);
    expect(getGlobalSearchResults("identityiq implementation", 0)).toHaveLength(0);
  });

  it("preserves cross-site discovery by balancing visible results across content types", () => {
    const resultKinds = getGlobalSearchResults("", 9).map((entry) => entry.kind);
    expect(resultKinds).toContain("Use cases");
    expect(resultKinds).toContain("Knowledge");
    expect(resultKinds).toContain("Articles");
  });
});
