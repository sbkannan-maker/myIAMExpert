import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const useCasesPage = readFileSync(new URL("../client/src/pages/UseCases.tsx", import.meta.url), "utf8");
const siteStyles = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("use-case catalog presentation", () => {
  it("uses a static dark treatment instead of rendering the shared background video", () => {
    expect(useCasesPage).not.toContain('import BrandBackgroundVideo');
    expect(useCasesPage).not.toContain("<BrandBackgroundVideo");
    expect(useCasesPage).toContain("bg-[linear-gradient(105deg");
    expect(useCasesPage).toContain("myIAM implementation studio");
    expect(useCasesPage).toContain("PublicSiteHeader currentPath=\"/use-cases\"");
    expect(useCasesPage).toContain('setLocation("/")');
    expect(useCasesPage).toContain("Copy filtered view");
    expect(useCasesPage).toContain("Curated catalog view");
    expect(useCasesPage).toContain("discoverySteps.map");
    expect(useCasesPage).toContain("catalogSharePath");
    expect(useCasesPage).toContain("IntersectionObserver");
    expect(useCasesPage).toContain("Category legend");
    expect(useCasesPage).toContain("Compare shortlisted use cases");
    expect(useCasesPage).toContain("You can compare up to three patterns at a time.");
    expect(useCasesPage).not.toContain("Describe your IAM scenario");
    expect(useCasesPage).not.toContain("Include the identity type, control objective, and one important constraint.");
    expect(useCasesPage).not.toContain("Recommend patterns");
    expect(useCasesPage).not.toContain("ContentSearchBar");
    expect(useCasesPage).not.toContain("Search and match");
    expect(useCasesPage).toContain("Popular patterns");
    expect(useCasesPage).toContain(">Reset all<");
    expect(useCasesPage).toContain("onClick={clearFilters}");
    expect(useCasesPage).toContain("Quick filters");
    expect(useCasesPage).toContain('short: "Lifecycle"');
    expect(useCasesPage).toContain('short: "Roles"');
  });

  it("clears each visible catalog filter state through the reset-all action", () => {
    expect(useCasesPage).toContain("setSelectedCategory(null);");
    expect(useCasesPage).toContain("setSelectedComplexity(null);");
    expect(useCasesPage).toContain("setShowSavedOnly(false);");
    expect(useCasesPage).toContain("setAiResultIds(null);");
  });

  it("provides motion-safe keyboard focus and filtered-result feedback", () => {
    expect(useCasesPage).toContain("catalog-result-refresh");
    expect(useCasesPage).toContain("void card.offsetWidth");
    expect(siteStyles).toContain(":focus-within");
    expect(siteStyles).toContain(":focus-visible");
    expect(siteStyles).toContain("@keyframes catalog-result-refresh");
    expect(siteStyles).toContain(".catalog-result-refresh {\n    animation: none;");
  });
});
