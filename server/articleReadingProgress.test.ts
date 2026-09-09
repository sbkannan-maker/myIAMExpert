import { describe, expect, it } from "vitest";
import { calculateReadingProgress } from "../client/src/components/ArticleReadingProgress";

describe("article reading progress", () => {
  it("keeps the progress indicator between zero and one hundred percent", () => {
    expect(calculateReadingProgress(0, 2000, 800)).toBe(0);
    expect(calculateReadingProgress(600, 2000, 800)).toBe(50);
    expect(calculateReadingProgress(5000, 2000, 800)).toBe(100);
  });
});
