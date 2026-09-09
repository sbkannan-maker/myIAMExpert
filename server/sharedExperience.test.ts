import { describe, expect, it } from "vitest";
import { matchesContentQuery } from "../client/src/lib/contentSearch";
import { readerThemeStorageKey, resolveReaderTheme } from "../client/src/lib/readerPreferences";

describe("shared public-site experience", () => {
  it("filters displayed content dynamically using every entered search term", () => {
    const searchable = ["SailPoint IdentityIQ", "Access governance", "Lifecycle workflows"];
    expect(matchesContentQuery("sailpoint governance", searchable)).toBe(true);
    expect(matchesContentQuery("sailpoint cyberark", searchable)).toBe(false);
    expect(matchesContentQuery("", searchable)).toBe(true);
  });

  it("uses the persisted navigation reading-mode key for the dark-mode control", () => {
    expect(readerThemeStorageKey).toBe("theme-v2");
    expect(resolveReaderTheme("light", "dark")).toBe("light");
  });
});
