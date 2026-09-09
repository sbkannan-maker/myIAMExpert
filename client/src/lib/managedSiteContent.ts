import { consultingProfile } from "@/lib/consultingProfile";
import { useCases30 } from "@/lib/useCases30";

export const managedContentAreas = ["blog", "expert", "use-cases", "community-guidance"] as const;
export type ManagedContentArea = (typeof managedContentAreas)[number];

export type ManagedContentDocument = {
  area: ManagedContentArea;
  document: string;
};

const expertFields = [
  "name",
  "role",
  "location",
  "linkedinUrl",
  "calendlyUrl",
  "directInquiryEmail",
  "focusAreas",
  "consultationThemes",
  "caseStudies",
] as const;

export function getDefaultManagedDocument(area: ManagedContentArea) {
  if (area === "blog") return JSON.stringify(consultingProfile.linkedInFeed, null, 2);
  if (area === "use-cases") return JSON.stringify(useCases30, null, 2);
  if (area === "community-guidance") return JSON.stringify({
    title: "myIAM community guidance",
    intro: "Keep peer learning practical, respectful, and safe for enterprise identity work.",
    rules: [
      "Ask focused questions with enough context to make the discussion useful.",
      "Never share credentials, personal data, customer evidence, or restricted architecture details.",
      "Keep recommendations constructive, relevant, and grounded in verifiable implementation experience.",
      "Respect different delivery environments and avoid unsolicited promotion.",
    ],
    privateContactNote: "Use the direct expert-contact route when a question needs private context.",
  }, null, 2);
  return JSON.stringify(Object.fromEntries(expertFields.map((field) => [field, consultingProfile[field]])), null, 2);
}

export function applyManagedContentDocuments(documents: readonly ManagedContentDocument[]) {
  let changed = false;

  documents.forEach(({ area, document }) => {
    try {
      const parsed = JSON.parse(document) as unknown;
      if (area === "blog" && Array.isArray(parsed)) {
        const editableBlogFeed = consultingProfile.linkedInFeed as unknown as unknown[];
        editableBlogFeed.splice(0, editableBlogFeed.length, ...parsed);
        changed = true;
      }
      if (area === "use-cases" && Array.isArray(parsed)) {
        useCases30.splice(0, useCases30.length, ...(parsed as typeof useCases30));
        changed = true;
      }
      if (area === "expert" && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const source = parsed as Record<string, unknown>;
        expertFields.forEach((field) => {
          if (field in source) (consultingProfile as Record<string, unknown>)[field] = source[field];
        });
        changed = true;
      }
    } catch {
      // Invalid documents are rejected by the server. Keep the in-code fallback if a legacy record cannot be parsed.
    }
  });

  return changed;
}
