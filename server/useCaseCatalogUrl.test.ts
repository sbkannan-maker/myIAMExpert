import { describe, expect, it } from "vitest";
import { catalogSharePath, parseCatalogShareState } from "../client/src/lib/useCaseCatalogUrl";

describe("use-case catalog share URLs", () => {
  it("generates a compact stable URL for a curated public catalog view", () => {
    expect(catalogSharePath({ searchQuery: " contractor access ", category: "JML", complexity: "Advanced", aiResultIds: [41, 5, 41] }))
      .toBe("/use-cases?q=contractor+access&category=JML&complexity=Advanced&ids=41%2C5");
  });

  it("restores valid public filters and ignores malformed recommendation IDs", () => {
    expect(parseCatalogShareState("?q=access%20review&category=Compliance&complexity=Intermediate&ids=7,bad,7,0,11"))
      .toEqual({ searchQuery: "access review", category: "Compliance", complexity: "Intermediate", aiResultIds: [7, 11] });
  });
});
