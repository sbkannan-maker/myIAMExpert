import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const blogEditor = readFileSync(new URL("../client/src/components/BlogContentEditor.tsx", import.meta.url), "utf8");
const useCaseEditor = readFileSync(new URL("../client/src/components/UseCaseContentEditor.tsx", import.meta.url), "utf8");
const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const preview = readFileSync(new URL("../client/src/pages/DraftPreview.tsx", import.meta.url), "utf8");
const previewControls = readFileSync(new URL("../client/src/components/DraftPreviewControls.tsx", import.meta.url), "utf8");
const lifecycleDashboard = readFileSync(new URL("../client/src/components/ContentLifecycleDashboard.tsx", import.meta.url), "utf8");
const previewAccessDashboard = readFileSync(new URL("../client/src/components/PreviewAccessDashboard.tsx", import.meta.url), "utf8");
const previewAnalytics = readFileSync(new URL("../client/src/lib/draftPreviewAnalytics.ts", import.meta.url), "utf8");

describe("owner draft lifecycle presentation", () => {
  it("keeps duplication and recoverable deletion available for both selected record types", () => {
    [blogEditor, useCaseEditor].forEach((source) => {
      expect(source).toContain("Duplicate");
      expect(source).toContain("Soft delete");
      expect(source).toContain("Recovery");
      expect(source).toContain("Restore");
    });
  });

  it("uses a private, revocable, configurable review link rather than public draft content", () => {
    expect(previewControls).toContain("Reviewer password");
    expect(previewControls).toContain("24 hours");
    expect(previewControls).toContain("30 days");
    expect(previewControls).toContain("Revoke link");
    expect(router).toContain("softDeleteEntry: adminProcedure");
    expect(router).toContain("restoreDeletedEntry: adminProcedure");
    expect(router).toContain("draftPreview: publicProcedure");
    expect(preview).toContain("Private draft preview");
    expect(preview).toContain("Protected draft preview");
    expect(preview).toContain("Draft preview unavailable");
  });

  it("places active links and bulk recovery controls in the protected owner dashboard", () => {
    expect(lifecycleDashboard).toContain("Draft lifecycle dashboard");
    expect(previewAccessDashboard).toContain("Anonymous preview activity");
    expect(previewAccessDashboard).toContain("Reset password");
    expect(lifecycleDashboard).toContain("Bulk archive");
    expect(lifecycleDashboard).toContain("Search recovery");
    expect(lifecycleDashboard).toContain("Restore selected");
    expect(router).toContain("bulkArchiveEntries: adminProcedure");
    expect(router).toContain("bulkRestoreEntries: adminProcedure");
  });

  it("shows owner-only daily activity without reviewer identity and flags expiring links", () => {
    expect(previewAccessDashboard).toContain("Daily preview opens");
    expect(previewAccessDashboard).toContain("All preview IDs");
    expect(previewAccessDashboard).toContain("Renew 7d");
    expect(previewAccessDashboard).toContain("Expiry reminders");
    expect(previewAccessDashboard).toContain("Reviewer identity and IP data are not collected");
    expect(previewAnalytics).toContain("Expires within 24h");
    expect(router).toContain("dailyViews: adminProcedure");
    expect(router).toContain("renew: adminProcedure");
  });
});
