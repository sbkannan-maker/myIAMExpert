import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { aiMatchSummary, toastMessages } from "../client/src/lib/toastMessages";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("toast feedback messages", () => {
  it("provides contextual catalog and interaction copy", () => {
    expect(toastMessages.savedPattern).toContain("shortlist");
    expect(toastMessages.removedPattern).toContain("Removed");
    expect(toastMessages.aiTooShort).toContain("12 characters");
    expect(toastMessages.newsletterSuccess).toContain("subscribed");
    expect(toastMessages.bookingConfirmed).toContain("Booking confirmed");
    expect(toastMessages.copyLinkDescription).toContain("Shareable topic view");
    expect(toastMessages.topicPreferencesSaved).toBe("Topic preferences saved in this browser.");
    expect(toastMessages.rssLinkCopied).toBe("RSS feed link copied.");
    expect(toastMessages.localBlogPreferencesCleared).toBe("Local Blog preferences cleared.");
    const sonner = readProjectFile("client/src/components/ui/sonner.tsx");
    expect(sonner).toContain("duration={3000}");
    const styles = readProjectFile("client/src/index.css");
    expect(styles).toContain("myiam-toast-slide-in");
  });

  it("uses singular and plural wording for AI match results", () => {
    expect(aiMatchSummary(1)).toBe("Found 1 matching implementation pattern.");
    expect(aiMatchSummary(3)).toBe("Found 3 matching implementation patterns.");
  });
});
