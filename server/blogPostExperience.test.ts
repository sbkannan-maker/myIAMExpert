import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Blog article experience", () => {
  it("renders reading progress and related-topic recommendations", () => {
    const page = readProjectFile("client/src/pages/BlogPostDetail.tsx");
    expect(page).toContain("ArticleReadingProgress");
    expect(page).toContain("Topic recommendations");
    expect(page).toContain("Continue through related identity topics.");
    expect(page).toContain("blogTopicPath");
    expect(page).toContain("blogAuthorPath");
    expect(page).toContain("BlogTopicTagRssAction");
    const rssTagAction = readProjectFile("client/src/components/BlogTopicTagRssAction.tsx");
    expect(rssTagAction).toContain("Copy RSS link for");
    expect(rssTagAction).toContain("rssLinkCopied");
  });
});
