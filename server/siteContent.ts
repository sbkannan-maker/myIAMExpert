export const managedContentAreas = ["blog", "expert", "use-cases", "community-guidance"] as const;
export type ManagedContentArea = (typeof managedContentAreas)[number];

const useCaseCategories = ["JML", "Compliance", "RBAC", "Workflows", "Governance", "Infrastructure", "Security", "Advanced"];
const complexityLevels = ["Beginner", "Intermediate", "Advanced"];

export function validateManagedDocument(area: ManagedContentArea, document: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(document);
  } catch {
    throw new Error("Content must be valid JSON before it can be saved.");
  }

  if (area === "blog" && (!Array.isArray(parsed) || !parsed.every((post) => post && typeof post === "object" && typeof (post as Record<string, unknown>).slug === "string" && typeof (post as Record<string, unknown>).title === "string"))) {
    throw new Error("Blog content must be an array of articles with a slug and title.");
  }
  if (area === "expert" && (!parsed || typeof parsed !== "object" || Array.isArray(parsed))) {
    throw new Error("Expert content must be a JSON object.");
  }
  if (area === "community-guidance" && (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || (() => {
    const guidance = parsed as Record<string, unknown>;
    return typeof guidance.title !== "string" || typeof guidance.intro !== "string" || !Array.isArray(guidance.rules) || !guidance.rules.every((rule) => typeof rule === "string") || typeof guidance.privateContactNote !== "string";
  })())) {
    throw new Error("Community guidance must include a title, introduction, string rules, and a private-contact note.");
  }
  if (area === "use-cases" && (!Array.isArray(parsed) || !parsed.every((useCase) => {
    if (!useCase || typeof useCase !== "object") return false;
    const item = useCase as Record<string, unknown>;
    return Number.isInteger(item.id) && typeof item.title === "string" && useCaseCategories.includes(String(item.category)) && complexityLevels.includes(String(item.complexity)) && Array.isArray(item.technicalSpecifications) && Array.isArray(item.implementationSteps) && Array.isArray(item.keywords);
  }))) {
    throw new Error("Each use case needs an ID, title, valid category and complexity, plus technical specifications, implementation steps, and keywords.");
  }
  return document;
}

export function validateScheduledBlogArticle(articleSlug: string, articleDocument: string) {
  let article: unknown;
  try {
    article = JSON.parse(articleDocument);
  } catch {
    throw new Error("The scheduled Blog article must be valid JSON.");
  }
  if (!article || typeof article !== "object" || Array.isArray(article) || (article as Record<string, unknown>).slug !== articleSlug || typeof (article as Record<string, unknown>).title !== "string") {
    throw new Error("The scheduled Blog article must include the selected slug and a title.");
  }
  return articleDocument;
}

const imageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export type BlogImageType = (typeof imageTypes)[number];

export function validateBlogImageUpload(contentType: string, base64: string) {
  if (!imageTypes.includes(contentType as BlogImageType)) throw new Error("Upload a PNG, JPEG, or WebP image.");
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error("Blog images must be between 1 byte and 8 MB.");
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isWebp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if ((contentType === "image/png" && !isPng) || (contentType === "image/jpeg" && !isJpeg) || (contentType === "image/webp" && !isWebp)) {
    throw new Error("The selected file does not match its declared image format.");
  }
  return bytes;
}
