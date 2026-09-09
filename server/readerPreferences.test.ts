import { describe, expect, it } from "vitest";
import { readerThemeStorageKey, resolveReaderTheme } from "../client/src/lib/readerPreferences";
import { topicLinkCopyFailureMessage, topicLinkCopySuccessMessage, topicShareUrl } from "../client/src/lib/legacyKnowledgeDiscovery";

describe("reader preference and topic sharing contracts", () => {
  it("accepts only persisted reader themes and uses the supplied fallback for invalid storage", () => {
    expect(readerThemeStorageKey).toBe("theme-v2");
    expect(resolveReaderTheme("dark", "light")).toBe("dark");
    expect(resolveReaderTheme("light", "dark")).toBe("light");
    expect(resolveReaderTheme("system", "dark")).toBe("dark");
    expect(resolveReaderTheme(null, "light")).toBe("light");
  });

  it("constructs a shareable encoded topic URL and exposes clear copy feedback", () => {
    expect(topicShareUrl("https://example.test", "Access governance")).toBe("https://example.test/knowledge?topic=Access%20governance");
    expect(topicLinkCopySuccessMessage).toBe("Topic link copied!");
    expect(topicLinkCopyFailureMessage).toContain("Could not copy");
  });
});
