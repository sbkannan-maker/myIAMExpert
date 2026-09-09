import { describe, expect, it } from "vitest";
import { consultingProfile } from "../client/src/lib/consultingProfile";

describe("consulting profile content", () => {
  it("provides a public LinkedIn contact route and consulting topics", () => {
    expect(consultingProfile.linkedinUrl).toBe("https://www.linkedin.com/in/kannan-iam-specialist/");
    expect(consultingProfile.siteName).toBe("myIAM");
    expect(consultingProfile.siteCaption).toBe("Enrich Your Innovation & Elevate Your Identity");
    expect(consultingProfile.brandLogoUrl).toBe("/manus-storage/myIAM-ISC_fc87f9d9.png");
    expect(consultingProfile.ambassadorBadgeUrl).toBe("/manus-storage/sailpoint-ambassador_dfce06e0.png");
    expect(consultingProfile.ambassadorBadgeDescription).toContain("SailPoint Developer Community recognition");
    expect(consultingProfile.ambassadorBadgeDescription).toContain("not a product certification");
    expect(consultingProfile.consultationThemes).toHaveLength(4);
    expect(consultingProfile.consultationThemes[1]?.description).toContain("IdentityIQ");
    expect(consultingProfile.linkedInFeed).toHaveLength(3);
    expect(consultingProfile.calendlyUrl).toBe("https://calendly.com/sbkannan/30min");
    expect(consultingProfile.directInquiryEmail).toBe("sbkannan@hotmail.com");
    expect(consultingProfile.linkedInFeed.every((post) => post.slug && post.sections.length > 0)).toBe(true);
    expect(consultingProfile.linkedInFeed.every((post) => post.category && post.categories.length > 0 && post.tags.length > 0)).toBe(true);
    const categoryMap = consultingProfile.linkedInFeed.reduce<Record<string, string[]>>((result, post) => {
      post.categories.forEach(category => {
        result[category] = [...(result[category] ?? []), post.slug];
      });
      return result;
    }, {});
    expect(categoryMap["IGA Architecture"]).toEqual(["multi-source-identity-governance-architecture"]);
    expect(categoryMap["Identity Data Governance"]).toEqual(["multi-source-identity-governance-architecture"]);
    expect(categoryMap["Identity Correlation"]).toEqual(["multi-source-identity-governance-architecture"]);
    expect(categoryMap["SailPoint IdentityIQ"]).toEqual(expect.arrayContaining(["entra-id-sailpoint-iiq-integration-overview", "sailpoint-identityiq-governed-implementation-case-study"]));
    expect(categoryMap["Microsoft Entra ID"]).toEqual(["entra-id-sailpoint-iiq-integration-overview"]);
    expect(categoryMap["Lifecycle Provisioning"]).toEqual(["entra-id-sailpoint-iiq-integration-overview"]);
    expect(consultingProfile.focusAreas).toContain("SailPoint IdentityIQ");
    expect(consultingProfile.linkedInFeed.find(post => post.slug === "sailpoint-identityiq-governed-implementation-case-study")?.kind).toBe("Implementation case study");
    expect(consultingProfile.caseStudies).toHaveLength(6);
    expect(consultingProfile.caseStudies.every(study => study.categories.length > 0)).toBe(true);
    expect(consultingProfile.caseStudies.find(study => study.id === "03")).toMatchObject({
      title: "SailPoint IdentityIQ governed delivery blueprint",
      categories: expect.arrayContaining(["SailPoint IdentityIQ", "Release Engineering"]),
      href: "/blog/sailpoint-identityiq-governed-implementation-case-study",
    });
    const referenceScenarios = consultingProfile.caseStudies.filter(study => study.type === "Reference delivery scenario");
    expect(referenceScenarios).toHaveLength(3);
    expect(referenceScenarios.every(study => !study.href && study.summary.startsWith("A non-client reference scenario"))).toBe(true);
  });
});
