export type DailyPreviewViews = { day: string; views: number };

export type ExpiryRisk = "critical" | "warning" | "normal";

export function normalizePreviewDailyViews(source: DailyPreviewViews[], days = 14, now = new Date()) {
  const values = new Map(source.map((item) => [item.day, Number(item.views)]));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - days + 1 + index);
    const day = date.toISOString().slice(0, 10);
    return { day, label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), views: values.get(day) ?? 0 };
  });
}

export function getPreviewExpiryRisk(expiresAt: Date, now = new Date()): { level: ExpiryRisk; label: string } {
  const hours = (expiresAt.getTime() - now.getTime()) / 3_600_000;
  if (hours <= 24) return { level: "critical", label: "Expires within 24h" };
  if (hours <= 72) return { level: "warning", label: "Expires within 3 days" };
  return { level: "normal", label: `Expires ${expiresAt.toLocaleDateString()}` };
}
