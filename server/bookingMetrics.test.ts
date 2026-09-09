import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { bookingMetricsToCsv, normalizeBookingMetricRange, normalizeDailyBookingMetrics } from "../client/src/lib/bookingMetrics";
import { preCallChecklistUrl, postCallResourcesPath } from "../client/src/lib/bookingResources";

describe("booking metrics contracts", () => {
  it("normalizes non-identifying start and completion events into UTC daily counts", () => {
    const metrics = normalizeDailyBookingMetrics([
      { eventType: "booking_started", createdAt: new Date("2026-08-19T09:00:00Z") },
      { eventType: "booking_completed", createdAt: new Date("2026-08-19T10:00:00Z") },
      { eventType: "booking_started", createdAt: new Date("2026-08-20T11:00:00Z") },
    ], 2, new Date("2026-08-20T15:00:00Z"));

    expect(metrics).toEqual([
      { date: "2026-08-19", started: 1, completed: 1 },
      { date: "2026-08-20", started: 1, completed: 0 },
    ]);
  });

  it("keeps the checklist download and follow-up route explicit", () => {
    expect(preCallChecklistUrl).toContain("myiam-enterprise-iam-pre-call-checklist");
    expect(postCallResourcesPath).toBe("/post-call-resources");
  });

  it("normalizes export-safe ranges and produces a CSV with aggregate-only columns", () => {
    expect(normalizeBookingMetricRange({ startDate: "2026-08-01", endDate: "2026-08-07" })).toEqual({ startDate: "2026-08-01", endDate: "2026-08-07" });
    expect(() => normalizeBookingMetricRange({ startDate: "2026-08-08", endDate: "2026-08-01" })).toThrow("valid chronological date range");
    expect(bookingMetricsToCsv([{ date: "2026-08-01", started: 2, completed: 1 }])).toBe("date,booking_started,booking_completed\n2026-08-01,2,1");
  });

  it("rejects a non-owner before any metrics data can be read", async () => {
    const caller = appRouter.createCaller({ req: {} as never, res: {} as never, user: { role: "user" } as never });
    await expect(caller.booking.dailyMetrics({ startDate: "2026-08-01", endDate: "2026-08-07" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("restricts the engagement library to approved client or owner accounts", async () => {
    const publicCaller = appRouter.createCaller({ req: {} as never, res: {} as never, user: { role: "user" } as never });
    await expect(publicCaller.clientResources.list()).rejects.toMatchObject({ code: "FORBIDDEN" });

    const clientCaller = appRouter.createCaller({ req: {} as never, res: {} as never, user: { role: "client" } as never });
    await expect(clientCaller.clientResources.list()).resolves.toHaveLength(3);
  });
});
