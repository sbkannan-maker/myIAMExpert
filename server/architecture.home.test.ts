import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { architectureOverviewPdfSrc } from "../client/src/lib/architectureOverview";
import { headerLogoPosterSrc, headerLogoStaticHoldMs, headerLogoVideoSrc } from "../client/src/lib/logoVideo";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("architecture homepage", () => {
  it("keeps the root route architecture-first and preserves the catalog route", () => {
    const app = readProjectFile("client/src/App.tsx");
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(app).toContain('<Route path="/" component={Home} />');
    expect(app).toContain('<Route path="/use-cases" component={UseCases} />');
    expect(home).toContain("Identity, designed as a");
    expect(home).toContain("Identity Fabric");
    expect(home).toContain("IdentityIQ");
    expect(home).toContain("Identity Security Cloud");
    expect(home).toContain("TooltipTrigger");
    expect(home).toContain("Hover or focus a layer");
    expect(home).toContain('jumpTo("fabric")');
    expect(home).toContain('jumpTo("iiq")');
    expect(home).toContain('jumpTo("isc")');
    expect(home).toContain("SheetContent side=\"right\"");
    expect(home).toContain("Architecture layer detail");
    expect(home).toContain("IIQ and ISC: different strengths, one governed architecture.");
    expect(home).toContain("Enterprise governance depth");
    expect(home).toContain("Cloud service reach");
    expect(home).toContain("ArchitectureDecisionGuide");
    expect(home).toContain('href={`/use-cases?category=${component.category}`}');
  });

  it("points shared brand media to the supplied managed asset and matching poster", () => {
    expect(headerLogoVideoSrc).toBe("/manus-storage/myiam-architecture-header_0b7d329b.mp4");
    expect(headerLogoPosterSrc).toBe("/manus-storage/myiam-static-lockup_86d411d0.png");
    expect(headerLogoStaticHoldMs).toBe(30_000);
  });

  it("keeps the shared header focused on navigation and improves catalog orientation", () => {
    const header = readProjectFile("client/src/components/PublicSiteHeader.tsx");
    const catalog = readProjectFile("client/src/pages/UseCases.tsx");

    expect(architectureOverviewPdfSrc).toBe("/manus-storage/main_187fad6f.pdf");
    expect(header).not.toContain("Download Overview");
    expect(header).not.toContain("architectureOverviewPdfFilename");
    expect(catalog).toContain("right IdentityIQ pattern");
    expect(catalog).toContain("Implementation discovery");
    expect(catalog).toContain("Open the blueprint");
    expect(catalog).toContain("parseCatalogShareState");
  });

  it("publishes an icon-only Lab link in the shared header", () => {
    const header = readProjectFile("client/src/components/PublicSiteHeader.tsx");

    expect(header).toContain("FlaskConical");
    expect(header).toContain("Open the active myIAM Lab in a new tab");
    expect(header).toContain("https://leotard-riveting-spinster.ngrok-free.dev/myIAM/login.jsf?prompt=true");
    expect(header).not.toContain(">Lab<");
    expect(header).toContain('aria-label="Open the active myIAM Lab in a new tab"');
  });

  it("mounts shared active navigation once for public routes", () => {
    const app = readProjectFile("client/src/App.tsx");
    const header = readProjectFile("client/src/components/PublicSiteHeader.tsx");

    expect(app).toContain("PublicNavigationShell");
    expect(app).toContain('<PublicSiteHeader currentPath={location} />');
    expect(app).toContain("public-route-container");
    expect(header).toContain('currentPath.startsWith("/blog") ? "/blog"');
    expect(header).toContain("expertPath");
  });
});
