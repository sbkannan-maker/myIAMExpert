import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const handler = readFileSync(new URL("./scheduledBlogPublishing.ts", import.meta.url), "utf8");
const serverIndex = readFileSync(new URL("./_core/index.ts", import.meta.url), "utf8");

describe("scheduled Blog publishing contract", () => {
  it("uses cron authentication and task IDs rather than request payload for scheduled release", () => {
    expect(handler).toContain("user.isCron");
    expect(handler).toContain("user.taskUid");
    expect(handler).toContain("getScheduledBlogPublicationByTaskUid");
    expect(serverIndex).toContain('app.post("/api/scheduled/blog-publish", handleScheduledBlogPublishing)');
  });

  it("requires a production deployment before an owner can activate an automatic schedule", () => {
    const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

    expect(router).toContain("ENV.isProduction");
    expect(router).toContain("Publish this website before activating automatic Blog schedules.");
    expect(router).toContain("createHeartbeatJob");
  });
});
