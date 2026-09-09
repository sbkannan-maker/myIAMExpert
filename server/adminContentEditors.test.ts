import { describe, expect, it } from "vitest";
import { createBlogArticle, createUseCase, duplicateBlogArticle, duplicateUseCase, parseEditableUseCases, updateUseCase } from "../client/src/lib/adminContentEditors";

describe("owner content editor helpers", () => {
  it("adds a unique Blog draft with safe initial publish metadata", () => {
    const created = createBlogArticle(JSON.stringify([{ slug: "new-identity-insight", title: "Existing" }]));
    expect(created.article.slug).toBe("new-identity-insight-2");
    expect(JSON.parse(created.document)).toHaveLength(2);
  });

  it("adds and updates a selected Use Case without changing other catalog records", () => {
    const document = JSON.stringify([{ id: 8, title: "Existing", category: "JML", complexity: "Beginner", businessRequirement: "Existing need", technicalSpecifications: ["A"], implementationSteps: ["B"], keywords: ["C"] }]);
    const created = createUseCase(document);
    expect(created.useCase.id).toBe(9);
    const updated = updateUseCase(created.document, 9, { title: "New catalog pattern" });
    expect(parseEditableUseCases(updated).find((entry) => entry.id === 9)?.title).toBe("New catalog pattern");
    expect(parseEditableUseCases(updated).find((entry) => entry.id === 8)?.title).toBe("Existing");
  });

  it("duplicates selected records with fresh identifiers and isolated mutable arrays", () => {
    const blog = duplicateBlogArticle(JSON.stringify([{ slug: "original", title: "Original", sections: [] }]), "original");
    expect(blog.article.slug).toBe("original-copy");
    expect(blog.article.title).toBe("Original (copy)");
    const useCase = duplicateUseCase(JSON.stringify([{ id: 3, title: "Original", category: "JML", complexity: "Beginner", businessRequirement: "Need", technicalSpecifications: ["One"], implementationSteps: ["Two"], keywords: ["Three"] }]), 3);
    expect(useCase.useCase.id).toBe(4);
    expect(useCase.useCase.title).toBe("Original (copy)");
    expect(useCase.useCase.technicalSpecifications).not.toBe(parseEditableUseCases(JSON.stringify([{ id: 3, title: "Original", category: "JML", complexity: "Beginner", businessRequirement: "Need", technicalSpecifications: ["One"], implementationSteps: ["Two"], keywords: ["Three"] }]))[0].technicalSpecifications);
  });
});
