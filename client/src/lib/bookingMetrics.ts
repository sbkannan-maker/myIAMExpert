export type BookingMetricEvent = {
  eventType: "booking_started" | "booking_completed";
  createdAt: Date;
};

export type DailyBookingMetric = {
  date: string;
  started: number;
  completed: number;
};

export type BookingMetricRange = {
  startDate: string;
  endDate: string;
};

function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function normalizeDailyBookingMetrics(events: BookingMetricEvent[], days = 14, referenceDate = new Date()): DailyBookingMetric[] {
  const safeDays = Math.min(Math.max(Math.trunc(days), 1), 31);
  const start = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - safeDays + 1);
  const metrics = new Map<string, DailyBookingMetric>();

  for (let offset = 0; offset < safeDays; offset += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + offset);
    const date = utcDay(day);
    metrics.set(date, { date, started: 0, completed: 0 });
  }

  for (const event of events) {
    const metric = metrics.get(utcDay(event.createdAt));
    if (!metric) continue;
    if (event.eventType === "booking_started") metric.started += 1;
    if (event.eventType === "booking_completed") metric.completed += 1;
  }

  return Array.from(metrics.values());
}

export function createBookingMetricRange(days = 14, referenceDate = new Date()): BookingMetricRange {
  const safeDays = Math.min(Math.max(Math.trunc(days), 1), 90);
  const end = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - safeDays + 1);
  return { startDate: utcDay(start), endDate: utcDay(end) };
}

export function normalizeBookingMetricRange({ startDate, endDate }: BookingMetricRange): BookingMetricRange {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) throw new Error("Choose a valid chronological date range.");
  const span = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (span > 90) throw new Error("Choose a range of 90 days or fewer.");
  return { startDate: utcDay(start), endDate: utcDay(end) };
}

export function normalizeDailyBookingMetricsForRange(events: BookingMetricEvent[], range: BookingMetricRange): DailyBookingMetric[] {
  const normalizedRange = normalizeBookingMetricRange(range);
  const start = new Date(`${normalizedRange.startDate}T00:00:00Z`);
  const end = new Date(`${normalizedRange.endDate}T00:00:00Z`);
  const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const metrics = normalizeDailyBookingMetrics([], days, end);
  const byDate = new Map(metrics.map(metric => [metric.date, metric]));
  for (const event of events) {
    const metric = byDate.get(utcDay(event.createdAt));
    if (!metric) continue;
    if (event.eventType === "booking_started") metric.started += 1;
    if (event.eventType === "booking_completed") metric.completed += 1;
  }
  return metrics;
}

export function bookingMetricsToCsv(metrics: DailyBookingMetric[]) {
  return ["date,booking_started,booking_completed", ...metrics.map(metric => `${metric.date},${metric.started},${metric.completed}`)].join("\n");
}

export function formatMetricDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
