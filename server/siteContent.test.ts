import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getDefaultManagedDocument } from "../client/src/lib/managedSiteContent";
import { articleBodyToMarkdown, markdownToArticleSections, updateBlogArticleBody } from "../client/src/lib/blogContentEditor";
import { validateBlogImageUpload, validateManagedDocument, validateScheduledBlogArticle } from "./siteContent";
import { hashDraftPreviewPassword, verifyDraftPreviewPassword } from "./db";

describe("managed site content validation", () => {
  it("accepts the three supported owner-managed document areas", () => {
    expect(validateManagedDocument("blog", JSON.stringify([{ slug: "identity-news", title: "Identity news" }]))).toContain("identity-news");
    expect(validateManagedDocument("expert", JSON.stringify({ name: "Kannan", focusAreas: [] }))).toContain("Kannan");
    expect(validateManagedDocument("use-cases", JSON.stringify([{ id: 99, title: "Sample pattern", category: "JML", complexity: "Beginner", technicalSpecifications: [], implementationSteps: [], keywords: [] }]))).toContain("Sample pattern");
  });

  it("supplies the existing Blog, expert, and catalog content as editable documents", () => {
    expect(JSON.parse(getDefaultManagedDocument("blog"))).toEqual(expect.any(Array));
    expect(JSON.parse(getDefaultManagedDocument("expert"))).toMatchObject({ name: "Kannan Sriniyappan Balakrishnan" });
    expect(JSON.parse(getDefaultManagedDocument("use-cases"))).toEqual(expect.any(Array));
  });

  it("converts Blog article bodies between structured sections and rich Markdown draft editing", () => {
    const document = JSON.stringify([{ slug: "identity-news", title: "Identity news", sections: [{ heading: "Start here", paragraphs: ["A practical opening."] }] }]);
    const updated = updateBlogArticleBody(document, "identity-news", "## Updated section\n\n**Formatted** content.");
    const [article] = JSON.parse(updated);

    expect(articleBodyToMarkdown(article)).toContain("## Updated section");
    expect(markdownToArticleSections("## Overview\n\nA paragraph.")).toEqual([{ heading: "Overview", paragraphs: ["A paragraph."] }]);
  });

  it("keeps a stable entry key when rich Blog revisions are captured", () => {
    const document = JSON.stringify([{ slug: "identity-news", title: "Identity news", sections: [] }]);
    const updated = updateBlogArticleBody(document, "identity-news", "## Updated\n\nRevision-ready content.");
    expect(JSON.parse(updated)[0].slug).toBe("identity-news");
  });

  it("keeps a stable identifier when a Use Cases entry is versioned", () => {
    const document = JSON.stringify([{ id: 42, title: "Lifecycle pattern", category: "JML", complexity: "Beginner", technicalSpecifications: [], implementationSteps: [], keywords: [] }]);
    expect(JSON.parse(validateManagedDocument("use-cases", document))[0].id).toBe(42);
  });

  it("accepts only verified supported Blog image formats and scheduled article documents", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString("base64");
    expect(validateBlogImageUpload("image/png", png)).toHaveLength(8);
    expect(() => validateBlogImageUpload("image/png", Buffer.from("not-an-image").toString("base64"))).toThrow("does not match");
    expect(validateScheduledBlogArticle("identity-news", JSON.stringify({ slug: "identity-news", title: "Identity news" }))).toContain("identity-news");
  });

  it("stores preview-password material as a hash and rejects a different reviewer password", () => {
    const protectedPreview = hashDraftPreviewPassword("reviewer-passphrase");
    expect(protectedPreview.hash).not.toContain("reviewer-passphrase");
    expect(verifyDraftPreviewPassword("reviewer-passphrase", protectedPreview.salt, protectedPreview.hash)).toBe(true);
    expect(verifyDraftPreviewPassword("incorrect-password", protectedPreview.salt, protectedPreview.hash)).toBe(false);
  });

  it("rejects malformed and incomplete documents before persistence", () => {
    expect(() => validateManagedDocument("blog", "not json")).toThrow("valid JSON");
    expect(() => validateManagedDocument("use-cases", JSON.stringify([{ id: 1, title: "Incomplete" }]))).toThrow("Each use case needs");
  });

  it("rejects non-owner access before content-management data can be read or written", async () => {
    const caller = appRouter.createCaller({ req: {} as never, res: {} as never, user: { role: "user" } as never });

    await expect(caller.siteContent.adminDocuments()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.saveDocument({ area: "expert", document: JSON.stringify({ name: "Kannan" }) })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.uploadBlogImage({ fileName: "diagram.png", contentType: "image/png", base64: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString("base64"), alt: "Identity diagram" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.scheduledBlog.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.scheduledBlog.pause({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.scheduledBlog.resume({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.deletedEntries({ area: "blog" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.softDeleteEntry({ area: "blog", entryKey: "identity-news", nextDocument: "[]", revisionNote: "Remove duplicate draft" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.restoreDeletedEntry({ area: "use-cases", entryKey: "1", revisionNote: "Restore approved pattern" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.draftPreviews.create({ area: "blog", entryKey: "identity-news", document: JSON.stringify({ slug: "identity-news", title: "Identity news" }) })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.draftPreviews.all()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.draftPreviews.dailyViews({ previewId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.draftPreviews.renew({ id: 1, expiresInHours: 168 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.siteContent.bulkArchiveEntries({ area: "blog", entryKeys: ["identity-news"], nextDocument: "[]", revisionNote: "Archive stale draft" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
