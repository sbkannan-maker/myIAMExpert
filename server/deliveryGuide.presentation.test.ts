import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Delivery Guide presentation", () => {
  it("uses the Knowledge-style public header, technical hero, filter rail, and stacked documentation cards", () => {
    const guide = readProjectFile("client/src/pages/DeliveryGuide.tsx");
    expect(guide).toContain('PublicSiteHeader currentPath="/delivery-guide"');
    expect(guide).toContain("bg-slate-950 text-white");
    expect(guide).toContain("Delivery context");
    expect(guide).toContain("Delivery map");
    expect(guide).toContain("Evidence before velocity");
    expect(guide).toContain("CI/CD quality gates");
  });
});
