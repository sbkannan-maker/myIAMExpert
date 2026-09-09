import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildVisitorOriginTrend, createVisitorOriginKey, formatVisitorLocation, getVisitorCountryName, getVisitorRegionName, visitorAnalyticsToCsv, type VisitorAnalyticsSnapshot } from "../client/src/lib/visitorAnalytics";

const visitorAnalyticsPage = readFileSync(new URL("../client/src/pages/VisitorAnalytics.tsx", import.meta.url), "utf8");
const analyticsDbSource = readFileSync(new URL("./db.ts", import.meta.url), "utf8");

const snapshot: VisitorAnalyticsSnapshot = {
  totalViews: 12,
  totalVisitors: 4,
  daily: [{ day: "2026-08-31", views: 12 }],
  pages: [{ path: "/use-cases", views: 9 }, { path: '/blog/iam,governance', views: 3 }],
  regions: [{ label: "IN · TN", views: 8 }, { label: "Unavailable", views: 4 }],
  visitorOrigins: [{ anonymizedLabel: "Origin 001", ipPrefix: "203.0.113.0", countryCode: "IN", region: "TN", views: 5 }],
  countryMap: [],
  coverageHistory: [],
};

const originTrend = [
  { day: "2026-08-30", countries: [{ label: "IN", views: 3 }, { label: "US", views: 1 }], regions: [{ label: "TN", views: 3 }, { label: "CA", views: 1 }] },
  { day: "2026-08-31", countries: [{ label: "IN", views: 2 }], regions: [{ label: "TN", views: 2 }] },
];

describe("visitor analytics export", () => {
  it("exports aggregate summary, daily activity, pages, and coarse regions", () => {
    const csv = visitorAnalyticsToCsv(snapshot, { startDate: "2026-08-25", endDate: "2026-08-31" });

    expect(csv).toContain("section,label,views,country_or_region");
    expect(csv).toContain("summary,Total visitors (2026-08-25 to 2026-08-31),4,");
    expect(csv).toContain("summary,Total views (2026-08-25 to 2026-08-31),12");
    expect(csv).toContain("daily,2026-08-31,12");
    expect(csv).toContain("page,/use-cases,9");
    expect(csv).toContain('page,"/blog/iam,governance",3');
    expect(csv).toContain("region,IN · TN,8,");
    expect(csv).toContain("visitor_origin,Origin 001 · 203.0.113.0,5,IN · TN");
  });

  it("creates distinct internal keys when masked origin labels repeat", () => {
    const origin = { anonymizedLabel: "Origin 001", ipPrefix: "10.142.0.0", countryCode: null, region: null, views: 6 };
    expect(createVisitorOriginKey(origin, 0)).not.toBe(createVisitorOriginKey(origin, 1));
  });

  it("builds top country and selected region trend series without visitor identifiers", () => {
    const countries = buildVisitorOriginTrend(originTrend, "country", "all");
    expect(countries.labels).toEqual(["India", "United States"]);
    expect(countries.data).toEqual([{ day: "08-30", India: 3, "United States": 1 }, { day: "08-31", India: 2, "United States": 0 }]);

    const region = buildVisitorOriginTrend(originTrend, "region", "CA");
    expect(region.labels).toEqual(["CA"]);
    expect(region.data[1]).toEqual({ day: "08-31", CA: 0 });
  });

  it("keeps large origin panels paginated and explains missing proxy geography", () => {
    expect(visitorAnalyticsPage).toContain("Page {page} of {pageCount}");
    expect(visitorAnalyticsPage).toContain("Masked prefixes only · {totalCount} matching");
    expect(visitorAnalyticsPage).toContain("Country or region is unavailable because this hosting proxy did not provide a geography header");
    expect(visitorAnalyticsPage).toContain("anonymizedLabel");
    expect(visitorAnalyticsPage).toContain("Previous");
    expect(visitorAnalyticsPage).toContain("Next");
    expect(visitorAnalyticsPage).toContain("countryViewMode");
    expect(visitorAnalyticsPage).toContain("Top countries");
    expect(visitorAnalyticsPage).toContain("Map legend");
    expect(visitorAnalyticsPage).toContain("Detailed visitor country data");
    expect(visitorAnalyticsPage).toContain("Geography data health");
    expect(visitorAnalyticsPage).toContain("countryCoverage");
    expect(analyticsDbSource).toContain("countryCoverage >= 0.8");
  });

  it("maps provider geography codes to readable names with safe fallbacks", () => {
    expect(getVisitorCountryName("IN")).toBe("India");
    expect(getVisitorRegionName("IN", "TN")).toBe("Tamil Nadu");
    expect(getVisitorRegionName("US", "CA")).toBe("California");
    expect(getVisitorRegionName("AU", "QLD")).toBe("Queensland");
    expect(formatVisitorLocation("IN", "TN")).toBe("India · Tamil Nadu");
    expect(formatVisitorLocation(null, "Unavailable")).toBe("Location unavailable");
  });

  it("keeps coverage history and country map data aggregate-only", () => {
    expect(snapshot.coverageHistory).toEqual([]);
    expect(snapshot.countryMap).toEqual([]);
    expect(JSON.stringify(snapshot)).not.toContain("rawIp");
  });

  it("does not introduce raw identity, full IP, device, or exact-location fields", () => {
    const csv = visitorAnalyticsToCsv(snapshot, { startDate: "2026-08-25", endDate: "2026-08-31" }).toLowerCase();

    expect(csv).not.toMatch(/203\.0\.113\.42|visitorhash|identity|device|latitude|longitude|email/);
    expect(csv).toContain("203.0.113.0");
  });
});
