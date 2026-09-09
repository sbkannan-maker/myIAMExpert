import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Blog library presentation", () => {
  it("uses the Knowledge archive visual composition while preserving article discovery", () => {
    const page = readProjectFile("client/src/pages/Blog.tsx");

    expect(page).toContain('PublicSiteHeader currentPath="/blog"');
    expect(page).toContain("bg-slate-950 text-white");
    expect(page).toContain("Article library");
    expect(page).toContain("Article filters");
    expect(page).toContain("ContentSearchBar");
    expect(page).toContain("NewsletterForm");
    expect(page).toContain("/blog/${post.slug}");
    expect(page).toContain("Article date sort order");
    expect(page).toContain("allSavedTopics");
    expect(page).toContain("getSavedReadingListTopics");
    expect(page).toContain("savedTopic");
    expect(page).toContain("BlogReadingListControls");
    expect(page).toContain("savedQuery");
    expect(page).toContain("useSavedReadingListSortPreference");
    expect(page).toContain("blogAuthorPath");
    expect(page).toContain("blogTopicPath");
    expect(page).toContain("serializeBlogLibraryUrlState");
    expect(page).toContain("replaceState");
  });

  it("provides a local RSS-copy shortcut and saved-article search controls", () => {
    const controls = readProjectFile("client/src/components/BlogReadingListControls.tsx");
    expect(controls).toContain("Reading list");
    expect(controls).toContain("Saved article topic");
    expect(controls).toContain("Copy RSS link");
    expect(controls).toContain("Search saved articles");
    expect(controls).toContain("This order is saved in this browser.");
    expect(controls).toContain("rssLinkCopied");
    expect(controls).toContain("Clear all local preferences");
    expect(controls).toContain("onClearAllPreferences");
  });

  it("keeps the Lab control active, explained, and safely external", () => {
    const header = readProjectFile("client/src/components/PublicSiteHeader.tsx");

    expect(header).toContain("myIAM Lab is active");
    expect(header).toContain("bg-emerald-400");
    expect(header).toContain('target="_blank"');
    expect(header).toContain('rel="noopener noreferrer"');
    expect(header).toContain("Open the active myIAM Lab in a new tab");
  });

  it("uses a motion-safe fade-in treatment for shared desktop and mobile menu items", () => {
    const header = readProjectFile("client/src/components/PublicSiteHeader.tsx");
    const mobileNavigation = readProjectFile("client/src/components/MobileNavigationDrawer.tsx");
    const styles = readProjectFile("client/src/index.css");

    expect(header).toContain("site-menu-fade-in");
    expect(mobileNavigation).toContain("site-menu-fade-in");
    expect(styles).toContain("@keyframes site-menu-fade-in");
    expect(styles).toContain("animation: none");
    expect(styles).toContain("transform: scale(1.012)");
  });
});
