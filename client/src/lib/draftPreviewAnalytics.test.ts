import { describe, expect, it } from "vitest";
import { getPreviewExpiryRisk, normalizePreviewDailyViews } from "./draftPreviewAnalytics";

describe("draft preview analytics helpers", () => {
  const now = new Date("2026-08-27T12:00:00.000Z");

  it("fills a fourteen-day UTC activity series with real counts and honest zeroes", () => {
    const series = normalizePreviewDailyViews([{ day: "2026-08-18", views: 2 }, { day: "2026-08-27", views: 5 }], 14, now);
    expect(series).toHaveLength(14);
    expect(series[0]).toMatchObject({ day: "2026-08-14", views: 0 });
    expect(series[4]).toMatchObject({ day: "2026-08-18", views: 2 });
    expect(series[13]).toMatchObject({ day: "2026-08-27", views: 5 });
  });

  it("classifies the 24-hour and 72-hour reminder boundaries deterministically", () => {
    expect(getPreviewExpiryRisk(new Date("2026-08-28T12:00:00.000Z"), now)).toMatchObject({ level: "critical" });
    expect(getPreviewExpiryRisk(new Date("2026-08-30T12:00:00.000Z"), now)).toMatchObject({ level: "warning" });
    expect(getPreviewExpiryRisk(new Date("2026-08-30T12:01:00.000Z"), now)).toMatchObject({ level: "normal" });
  });
});
