import { consultingProfile } from "../client/src/lib/consultingProfile";

const OG_IMAGE_PATH = "/manus-storage/kannan-iam-open-graph_acc91642.png";

type Meta = {
  title: string;
  description: string;
  type: "website" | "article";
  canonicalPath: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function resolveMeta(url: string): Meta {
  const pathname = url.split("?")[0] || "/";
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  const article = blogMatch ? consultingProfile.linkedInFeed.find(post => post.slug === blogMatch[1]) : undefined;

  if (article) {
    return {
      title: `${article.title} | ${consultingProfile.siteName}`,
      description: article.excerpt,
      type: "article",
      canonicalPath: pathname,
    };
  }

  if (pathname === "/blog") {
    return {
      title: `Identity Engineering Insights | ${consultingProfile.siteName}`,
      description: "Architecture notes for IAM and IGA practitioners covering identity governance, SailPoint IdentityIQ, and connected access ecosystems.",
      type: "website",
      canonicalPath: pathname,
    };
  }

  if (pathname === "/knowledge") {
    return {
      title: `Legacy IAM Knowledge Archive | ${consultingProfile.siteName}`,
      description: "A source-attributed archive of Kannan’s public SailPoint, IBM Identity, Java, and J2EE learning notes.",
      type: "website",
      canonicalPath: pathname,
    };
  }

  return {
    title: `${consultingProfile.siteName} | ${consultingProfile.siteCaption}`,
    description: "An architecture-first myIAM guide to Identity Fabric, SailPoint IdentityIQ, Identity Security Cloud, and governed access across the enterprise.",
    type: "website",
    canonicalPath: pathname,
  };
}

export function injectSocialMeta(template: string, url: string, origin: string) {
  const meta = resolveMeta(url);
  const canonical = new URL(meta.canonicalPath, origin).toString();
  const image = new URL(OG_IMAGE_PATH, origin).toString();
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const socialHead = [
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:type" content="${meta.type}">`,
    `<meta property="og:site_name" content="${escapeHtml(consultingProfile.siteName)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:alt" content="myIAM identity security architecture illustration">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace("<!--social-head-->", socialHead);
}
