import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const header = readFileSync(new URL("../client/src/components/PublicSiteHeader.tsx", import.meta.url), "utf8");
const mobileNavigation = readFileSync(new URL("../client/src/components/MobileNavigationDrawer.tsx", import.meta.url), "utf8");

describe("WhatsApp community navigation", () => {
  it("shows the supplied icon in shared desktop and mobile navigation with safe new-tab linking", () => {
    [header, mobileNavigation].forEach((source) => {
      expect(source).toContain("https://chat.whatsapp.com/KdaifKJ9LMc5j8eM5Ow6el");
      expect(source).toContain("/manus-storage/whatsapp-community-icon_6871e592.png");
      expect(source).toContain('target="_blank"');
      expect(source).toContain('rel="noopener noreferrer"');
    });
    expect(header).toContain("Community");
    expect(mobileNavigation).toContain("WhatsApp Community");
  });
});
