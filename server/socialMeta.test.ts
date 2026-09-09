import { describe, expect, it } from "vitest";
import { injectSocialMeta } from "./socialMeta";

describe("social metadata", () => {
  const template = "<html><head><title>Default</title><!--social-head--></head><body></body></html>";

  it("writes article-specific Open Graph metadata for a blog route", () => {
    const page = injectSocialMeta(template, "/blog/multi-source-identity-governance-architecture", "https://example.com");
    expect(page).toContain("Multi-Source Identity Governance");
    expect(page).toContain("| myIAM");
    expect(page).toContain('property="og:site_name" content="myIAM"');
    expect(page).toContain('property="og:type" content="article"');
    expect(page).toContain('property="og:image" content="https://example.com/manus-storage/kannan-iam-open-graph_acc91642.png"');
  });
});
