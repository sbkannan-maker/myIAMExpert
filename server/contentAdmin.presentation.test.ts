import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const adminPage = readFileSync(new URL("../client/src/pages/ContentAdmin.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../client/src/components/PublicSiteHeader.tsx", import.meta.url), "utf8");
const blogEditor = readFileSync(new URL("../client/src/components/BlogContentEditor.tsx", import.meta.url), "utf8");
const useCaseEditor = readFileSync(new URL("../client/src/components/UseCaseContentEditor.tsx", import.meta.url), "utf8");
const editorHelpers = readFileSync(new URL("../client/src/lib/adminContentEditors.ts", import.meta.url), "utf8");

describe("owner content workspace presentation", () => {
  it("provides rich Blog editing, draft and published previews, and revision restoration", () => {
    expect(blogEditor).toContain("Rich Markdown article editor");
    expect(blogEditor).toContain("Draft preview");
    expect(blogEditor).toContain("Published preview");
    expect(adminPage).toContain("Revision history");
    expect(adminPage).toContain("restoreRevision");
    expect(adminPage).toContain("Revision note");
    expect(blogEditor).toContain("Insert image");
  });

  it("supports guided Blog and Use Case creation with selected record comparison", () => {
    expect(blogEditor).toContain("New Blog post");
    expect(useCaseEditor).toContain("New Use Case");
    expect(useCaseEditor).toContain("Selected-pattern comparison");
    expect(useCaseEditor).toContain("Published preview");
    expect(useCaseEditor).toContain("Draft preview");
    expect(editorHelpers).toContain("createBlogArticle");
    expect(editorHelpers).toContain("createUseCase");
    expect(adminPage).toContain("View public home");
  });

  it("exposes the administration icon only when the authenticated user is the owner", () => {
    expect(header).toContain('user?.role === "admin"');
    expect(header).toContain('href="/owner/content"');
    expect(header).toContain("ShieldCheck");
    expect(header).not.toContain("OwnerHeaderStatus");
    expect(header).not.toContain("activeLabel");
  });

  it("keeps the owner administration entry available inside the mobile menu", () => {
    const mobileNavigation = readFileSync(new URL("../client/src/components/MobileNavigationDrawer.tsx", import.meta.url), "utf8");

    expect(mobileNavigation).toContain('user?.role === "admin"');
    expect(mobileNavigation).toContain("Content administration");
    expect(mobileNavigation).toContain('href: "/owner/content"');
    expect(mobileNavigation).toContain("Owner controls");
    expect(mobileNavigation).toContain('href: "/owner/visitor-analytics"');
    expect(mobileNavigation).toContain('href: "/owner/content#community-guidance"');
  });
});
