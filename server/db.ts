import { and, desc, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { bookingInteractionEvents, deletedManagedContentEntries, InsertUser, managedContentDraftPreviewViews, managedContentDraftPreviews, managedSiteContent, managedSiteContentRevisions, newsletterSubscriptions, scheduledBlogPublications, siteVisitorPageViews, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { normalizeBookingMetricRange, normalizeDailyBookingMetricsForRange, type BookingMetricRange } from "../client/src/lib/bookingMetrics";

let _db: ReturnType<typeof drizzle> | null = null;

export function hashDraftPreviewPassword(password: string, salt = crypto.randomUUID().replace(/-/g, "")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}

export function verifyDraftPreviewPassword(password: string, salt: string, hash: string) {
  const computed = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === computed.length && timingSafeEqual(computed, expected);
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function normalizeVisitorDimension(value: string | null | undefined, maxLength: number) {
  const normalized = value?.trim().replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, maxLength) || null;
  return normalized;
}

function maskVisitorIp(value: string | null | undefined) {
  const ip = value?.trim();
  if (!ip) return null;
  const ipv4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4 && ipv4.slice(1).every((part) => Number(part) <= 255)) return `${ipv4[1]}.${ipv4[2]}.${ipv4[3]}.0`;
  const ipv6 = ip.match(/^([0-9a-f]{1,4}:){2,7}[0-9a-f]{1,4}$/i);
  return ipv6 ? `${ip.split(":").slice(0, 4).join(":")}::` : null;
}

function hashVisitorIp(value: string | null) {
  if (!value || !ENV.cookieSecret) return null;
  return createHmac("sha256", ENV.cookieSecret).update(value).digest("hex");
}

export async function recordSiteVisitorPageView(path: string, countryCode?: string | null, region?: string | null, clientIp?: string | null) {
  const db = await getDb();
  if (!db) return;
  const safePath = path.trim().slice(0, 255) || "/";
  const ipPrefix = maskVisitorIp(clientIp);
  await db.delete(siteVisitorPageViews).where(lt(siteVisitorPageViews.viewedAt, new Date(Date.now() - 90 * 86_400_000)));
  await db.insert(siteVisitorPageViews).values({
    path: safePath,
    countryCode: normalizeVisitorDimension(countryCode, 2)?.toUpperCase() ?? null,
    region: normalizeVisitorDimension(region, 96),
    visitorHash: hashVisitorIp(clientIp?.trim() ?? null),
    ipPrefix,
  });
}

export async function getSiteVisitorAnalytics(days = 30, startDate?: string, endDate?: string, originDimension: "country" | "region" = "country", originFilter = "all", originPage = 1, originPageSize = 10) {
  const db = await getDb();
  if (!db) throw new Error("Visitor analytics are temporarily unavailable");
  const since = startDate ? new Date(`${startDate}T00:00:00.000Z`) : new Date(Date.now() - days * 86_400_000);
  const until = endDate ? new Date(`${endDate}T23:59:59.999Z`) : new Date();
  const events = await db.select({ path: siteVisitorPageViews.path, countryCode: siteVisitorPageViews.countryCode, region: siteVisitorPageViews.region, visitorHash: siteVisitorPageViews.visitorHash, ipPrefix: siteVisitorPageViews.ipPrefix, viewedAt: siteVisitorPageViews.viewedAt }).from(siteVisitorPageViews).where(and(gte(siteVisitorPageViews.viewedAt, since), lte(siteVisitorPageViews.viewedAt, until)));
  const daily = new Map<string, number>();
  const pages = new Map<string, number>();
  const regions = new Map<string, number>();
  const visitors = new Map<string, { ipPrefix: string; countryCode: string | null; region: string | null; views: number }>();
  let countryEvents = 0;
  let regionEvents = 0;
  const countryTrend = new Map<string, Map<string, number>>();
  const regionTrend = new Map<string, Map<string, number>>();
  const countryCounts = new Map<string, number>();
  const coverageByDay = new Map<string, { total: number; countryEvents: number; regionEvents: number }>();
  const countries = new Set<string>();
  const visitorRegions = new Set<string>();
  const addTrend = (trend: Map<string, Map<string, number>>, day: string, label: string) => {
    const byLabel = trend.get(day) ?? new Map<string, number>();
    byLabel.set(label, (byLabel.get(label) ?? 0) + 1);
    trend.set(day, byLabel);
  };
  events.forEach((event) => {
    const day = event.viewedAt.toISOString().slice(0, 10);
    daily.set(day, (daily.get(day) ?? 0) + 1);
    pages.set(event.path, (pages.get(event.path) ?? 0) + 1);
    const dayCoverage = coverageByDay.get(day) ?? { total: 0, countryEvents: 0, regionEvents: 0 };
    dayCoverage.total += 1;
    if (event.countryCode) dayCoverage.countryEvents += 1;
    if (event.region) dayCoverage.regionEvents += 1;
    coverageByDay.set(day, dayCoverage);
    if (event.countryCode) countryCounts.set(event.countryCode, (countryCounts.get(event.countryCode) ?? 0) + 1);
    const geography = [event.countryCode, event.region].filter(Boolean).join(" · ") || "Unavailable";
    regions.set(geography, (regions.get(geography) ?? 0) + 1);
    const countryLabel = event.countryCode ?? "Unavailable";
    const regionLabel = event.region ?? "Unavailable";
    if (event.countryCode) countryEvents += 1;
    if (event.region) regionEvents += 1;
    countries.add(countryLabel);
    visitorRegions.add(regionLabel);
    addTrend(countryTrend, day, countryLabel);
    addTrend(regionTrend, day, regionLabel);
    if (event.visitorHash && event.ipPrefix) {
      const current = visitors.get(event.visitorHash);
      visitors.set(event.visitorHash, { ipPrefix: event.ipPrefix, countryCode: event.countryCode, region: event.region, views: (current?.views ?? 0) + 1 });
    }
  });
  const countryCoverage = events.length ? countryEvents / events.length : 0;
  const regionCoverage = events.length ? regionEvents / events.length : 0;
  const geographyStatus = events.length === 0 ? "no-data" : countryCoverage >= 0.8 && regionCoverage >= 0.8 ? "available" : countryCoverage > 0 || regionCoverage > 0 ? "partial" : "unavailable";
  return {
    totalViews: events.length,
    totalVisitors: visitors.size,
    days: Math.max(1, Math.ceil((until.getTime() - since.getTime()) / 86_400_000)),
    daily: Array.from(daily.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([day, views]) => ({ day, views })),
    pages: Array.from(pages.entries()).sort(([, a], [, b]) => b - a).slice(0, 10).map(([path, views]) => ({ path, views })),
    regions: Array.from(regions.entries()).sort(([, a], [, b]) => b - a).slice(0, 10).map(([label, views]) => ({ label, views })),
    visitorOrigins: (() => {
      const normalizedPage = Math.max(1, originPage);
      const normalizedPageSize = Math.min(50, Math.max(1, originPageSize));
      const filtered = Array.from(visitors.values()).filter((origin) => originFilter === "all" || (originDimension === "country" ? (origin.countryCode ?? "Unavailable") : (origin.region ?? "Unavailable")) === originFilter).sort((a, b) => b.views - a.views || a.ipPrefix.localeCompare(b.ipPrefix));
      const offset = (normalizedPage - 1) * normalizedPageSize;
      return filtered.slice(offset, offset + normalizedPageSize).map((origin, index) => ({ anonymizedLabel: `Origin ${String(offset + index + 1).padStart(3, "0")}`, ...origin }));
    })(),
    visitorOriginTotal: Array.from(visitors.values()).filter((origin) => originFilter === "all" || (originDimension === "country" ? (origin.countryCode ?? "Unavailable") : (origin.region ?? "Unavailable")) === originFilter).length,
    visitorOriginPage: Math.max(1, originPage),
    visitorOriginPageSize: Math.min(50, Math.max(1, originPageSize)),
    visitorOriginHasMore: Math.max(1, originPage) * Math.min(50, Math.max(1, originPageSize)) < Array.from(visitors.values()).filter((origin) => originFilter === "all" || (originDimension === "country" ? (origin.countryCode ?? "Unavailable") : (origin.region ?? "Unavailable")) === originFilter).length,
    geographyHealth: {
      status: geographyStatus,
      totalEvents: events.length,
      countryEvents,
      regionEvents,
      countryCoverage,
      regionCoverage,
    },
    originFilters: { countries: Array.from(countries).sort(), regions: Array.from(visitorRegions).sort() },
    countryMap: Array.from(countryCounts.entries()).sort(([, a], [, b]) => b - a).map(([countryCode, views]) => ({ countryCode, views })),
    coverageHistory: Array.from(coverageByDay.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([day, coverage]) => ({ day, ...coverage })),
    originTrend: Array.from(new Set([...Array.from(countryTrend.keys()), ...Array.from(regionTrend.keys())])).sort().map((day) => ({
      day,
      countries: Array.from(countryTrend.get(day)?.entries() ?? []).map(([label, views]) => ({ label, views })),
      regions: Array.from(regionTrend.get(day)?.entries() ?? []).map(([label, views]) => ({ label, views })),
    })),
  };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertNewsletterSubscription(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Newsletter subscriptions are temporarily unavailable");

  await db.insert(newsletterSubscriptions).values({ email, status: "active" }).onDuplicateKeyUpdate({
    set: { status: "active" },
  });
}

export async function recordBookingInteraction(eventType: "booking_started" | "booking_completed") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Booking tracking is temporarily unavailable");
    return;
  }
  await db.insert(bookingInteractionEvents).values({ eventType });
}

export async function getDailyBookingMetrics(range: BookingMetricRange) {
  const db = await getDb();
  if (!db) throw new Error("Booking metrics are temporarily unavailable");
  const normalizedRange = normalizeBookingMetricRange(range);
  const since = new Date(`${normalizedRange.startDate}T00:00:00Z`);
  const until = new Date(`${normalizedRange.endDate}T23:59:59.999Z`);
  const events = await db.select({ eventType: bookingInteractionEvents.eventType, createdAt: bookingInteractionEvents.createdAt }).from(bookingInteractionEvents).where(gte(bookingInteractionEvents.createdAt, since));
  return normalizeDailyBookingMetricsForRange(events.filter(event => event.createdAt <= until), normalizedRange);
}

export async function getPublishedManagedContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ area: managedSiteContent.area, document: managedSiteContent.document }).from(managedSiteContent).where(inArray(managedSiteContent.area, ["blog", "expert", "use-cases"]));
}

export async function getManagedContentForAdmin() {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  return db.select({ area: managedSiteContent.area, document: managedSiteContent.document, updatedAt: managedSiteContent.updatedAt }).from(managedSiteContent);
}

export async function saveManagedContent(area: string, document: string, revisionNote: string | null = null) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const current = await db.select({ document: managedSiteContent.document }).from(managedSiteContent).where(eq(managedSiteContent.area, area)).limit(1);
  if (current[0] && (area === "blog" || area === "use-cases")) {
    try {
      const keyField = area === "blog" ? "slug" : "id";
      const previousEntries = JSON.parse(current[0].document) as Array<Record<string, unknown>>;
      const nextEntries = JSON.parse(document) as Array<Record<string, unknown>>;
      const nextByKey = new Map(nextEntries.filter((entry) => typeof entry?.[keyField] === "string" || typeof entry?.[keyField] === "number").map((entry) => [String(entry[keyField]), entry]));
      const changedEntries = previousEntries.filter((entry) => (typeof entry?.[keyField] === "string" || typeof entry?.[keyField] === "number") && JSON.stringify(entry) !== JSON.stringify(nextByKey.get(String(entry[keyField]))));
      if (changedEntries.length) await db.insert(managedSiteContentRevisions).values(changedEntries.map((entry) => ({ area, entryKey: String(entry[keyField]), note: revisionNote, document: JSON.stringify(entry) })));
    } catch {
      await db.insert(managedSiteContentRevisions).values({ area, entryKey: "collection", note: revisionNote, document: current[0].document });
    }
  } else if (current[0]) {
    await db.insert(managedSiteContentRevisions).values({ area, entryKey: "collection", note: revisionNote, document: current[0].document });
  }
  await db.insert(managedSiteContent).values({ area, document }).onDuplicateKeyUpdate({ set: { document, updatedAt: new Date() } });
  return document;
}

export async function restoreManagedContentDefault(area: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const current = await db.select({ document: managedSiteContent.document }).from(managedSiteContent).where(eq(managedSiteContent.area, area)).limit(1);
  if (current[0]) await db.insert(managedSiteContentRevisions).values({ area, entryKey: "collection", note: "Restored the built-in content version.", document: current[0].document });
  await db.delete(managedSiteContent).where(eq(managedSiteContent.area, area));
}

export async function getManagedContentRevisions(area: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  return db.select({ id: managedSiteContentRevisions.id, area: managedSiteContentRevisions.area, entryKey: managedSiteContentRevisions.entryKey, note: managedSiteContentRevisions.note, createdAt: managedSiteContentRevisions.createdAt }).from(managedSiteContentRevisions).where(eq(managedSiteContentRevisions.area, area)).orderBy(desc(managedSiteContentRevisions.createdAt));
}

export async function restoreManagedContentRevision(area: string, revisionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const revision = await db.select({ document: managedSiteContentRevisions.document, entryKey: managedSiteContentRevisions.entryKey }).from(managedSiteContentRevisions).where(and(eq(managedSiteContentRevisions.id, revisionId), eq(managedSiteContentRevisions.area, area))).limit(1);
  if (!revision[0]) throw new Error("This content revision could not be found.");
  if ((area === "blog" || area === "use-cases") && revision[0].entryKey !== "collection") {
    const current = await db.select({ document: managedSiteContent.document }).from(managedSiteContent).where(eq(managedSiteContent.area, area)).limit(1);
    if (!current[0]) throw new Error(`There is no published ${area === "blog" ? "Blog" : "Use Cases"} document to restore into.`);
    try {
      const keyField = area === "blog" ? "slug" : "id";
      const entries = JSON.parse(current[0].document) as Array<Record<string, unknown>>;
      const restoredEntry = JSON.parse(revision[0].document) as Record<string, unknown>;
      if (String(restoredEntry[keyField]) !== revision[0].entryKey) throw new Error("The revision entry does not match its recorded key.");
      const index = entries.findIndex((entry) => String(entry?.[keyField]) === revision[0].entryKey);
      const nextEntries = index >= 0 ? entries.map((entry, entryIndex) => entryIndex === index ? restoredEntry : entry) : [restoredEntry, ...entries];
      return saveManagedContent(area, JSON.stringify(nextEntries), `Restored ${area === "blog" ? "Blog article" : "Use Case"} revision ${revisionId}.`);
    } catch (error) {
      const label = area === "blog" ? "Blog article" : "Use Case";
      throw new Error(error instanceof Error ? `Could not restore this ${label} revision: ${error.message}` : `Could not restore this ${label} revision.`);
    }
  }
  return saveManagedContent(area, revision[0].document, `Restored collection revision ${revisionId}.`);
}

export async function createScheduledBlogPublication(articleSlug: string, articleDocument: string, specification: string, revisionNote: string, publishAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const result = await db.insert(scheduledBlogPublications).values({ articleSlug, articleDocument, specification, revisionNote, publishAt, status: "scheduled" });
  return Number(result[0].insertId);
}

export async function attachBlogPublicationSchedule(id: number, taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  await db.update(scheduledBlogPublications).set({ scheduleCronTaskUid: taskUid }).where(eq(scheduledBlogPublications.id, id));
}

export async function discardScheduledBlogPublication(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(scheduledBlogPublications).where(eq(scheduledBlogPublications.id, id));
}

export async function getScheduledBlogPublications() {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  return db.select({ id: scheduledBlogPublications.id, articleSlug: scheduledBlogPublications.articleSlug, specification: scheduledBlogPublications.specification, revisionNote: scheduledBlogPublications.revisionNote, publishAt: scheduledBlogPublications.publishAt, status: scheduledBlogPublications.status, scheduleCronTaskUid: scheduledBlogPublications.scheduleCronTaskUid, createdAt: scheduledBlogPublications.createdAt }).from(scheduledBlogPublications).orderBy(desc(scheduledBlogPublications.publishAt));
}

export async function cancelScheduledBlogPublication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const rows = await db.select({ scheduleCronTaskUid: scheduledBlogPublications.scheduleCronTaskUid, status: scheduledBlogPublications.status }).from(scheduledBlogPublications).where(eq(scheduledBlogPublications.id, id)).limit(1);
  if (!rows[0] || rows[0].status !== "scheduled") throw new Error("This scheduled publication is no longer available to cancel.");
  await db.update(scheduledBlogPublications).set({ status: "cancelled" }).where(eq(scheduledBlogPublications.id, id));
  return rows[0].scheduleCronTaskUid;
}

export async function setScheduledBlogPublicationStatus(id: number, status: "scheduled" | "paused") {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const rows = await db.select({ scheduleCronTaskUid: scheduledBlogPublications.scheduleCronTaskUid, status: scheduledBlogPublications.status }).from(scheduledBlogPublications).where(eq(scheduledBlogPublications.id, id)).limit(1);
  if (!rows[0] || !rows[0].scheduleCronTaskUid) throw new Error("This scheduled publication is not available to update.");
  if (status === "paused" && rows[0].status !== "scheduled") throw new Error("Only active schedules can be paused.");
  if (status === "scheduled" && rows[0].status !== "paused") throw new Error("Only paused schedules can be resumed.");
  await db.update(scheduledBlogPublications).set({ status }).where(eq(scheduledBlogPublications.id, id));
  return rows[0].scheduleCronTaskUid;
}

export async function getScheduledBlogPublicationByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const rows = await db.select().from(scheduledBlogPublications).where(eq(scheduledBlogPublications.scheduleCronTaskUid, taskUid)).limit(1);
  return rows[0];
}

export async function publishScheduledBlogPublication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const schedule = (await db.select().from(scheduledBlogPublications).where(eq(scheduledBlogPublications.id, id)).limit(1))[0];
  if (!schedule || schedule.status !== "scheduled") return { published: false, taskUid: schedule?.scheduleCronTaskUid ?? null };
  if (schedule.publishAt.getTime() > Date.now()) return { published: false, taskUid: schedule.scheduleCronTaskUid, notDue: true };
  const current = (await db.select({ document: managedSiteContent.document }).from(managedSiteContent).where(eq(managedSiteContent.area, "blog")).limit(1))[0];
  const document = current?.document ?? JSON.stringify((await import("../client/src/lib/consultingProfile")).consultingProfile.linkedInFeed);
  let nextDocument: string;
  try {
    const articles = JSON.parse(document) as Array<{ slug?: unknown }>;
    const scheduledArticle = JSON.parse(schedule.articleDocument) as { slug?: unknown };
    if (scheduledArticle.slug !== schedule.articleSlug) throw new Error("Scheduled article key does not match the stored content.");
    const index = articles.findIndex((article) => article?.slug === schedule.articleSlug);
    const merged = index >= 0 ? articles.map((article, articleIndex) => articleIndex === index ? scheduledArticle : article) : [scheduledArticle, ...articles];
    nextDocument = JSON.stringify(merged);
  } catch (error) {
    throw new Error(error instanceof Error ? `Scheduled Blog merge failed: ${error.message}` : "Scheduled Blog merge failed.");
  }
  await saveManagedContent("blog", nextDocument, schedule.revisionNote);
  await db.update(scheduledBlogPublications).set({ status: "published", publishedAt: new Date() }).where(eq(scheduledBlogPublications.id, id));
  return { published: true, taskUid: schedule.scheduleCronTaskUid };
}

type EntryArea = "blog" | "use-cases";
const entryKeyField = (area: EntryArea) => area === "blog" ? "slug" : "id";

async function getManagedCollection(area: EntryArea) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const current = await db.select({ document: managedSiteContent.document }).from(managedSiteContent).where(eq(managedSiteContent.area, area)).limit(1);
  if (current[0]) return current[0].document;
  if (area === "blog") return JSON.stringify((await import("../client/src/lib/consultingProfile")).consultingProfile.linkedInFeed);
  return JSON.stringify((await import("../client/src/lib/useCases30")).useCases30);
}

function readEntry(document: string, area: EntryArea, entryKey: string) {
  const collection = JSON.parse(document) as Array<Record<string, unknown>>;
  if (!Array.isArray(collection)) throw new Error("Managed content must be a collection.");
  const key = entryKeyField(area);
  const entry = collection.find((item) => String(item?.[key]) === entryKey);
  if (!entry) throw new Error("The selected entry is no longer available.");
  return { collection, entry };
}

export async function softDeleteManagedEntry(area: EntryArea, entryKey: string, nextDocument: string, revisionNote: string) {
  return softDeleteManagedEntries(area, [entryKey], nextDocument, revisionNote);
}

export async function softDeleteManagedEntries(area: EntryArea, entryKeys: string[], nextDocument: string, revisionNote: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const selectedKeys = Array.from(new Set(entryKeys));
  if (!selectedKeys.length) throw new Error("Select at least one entry to archive.");
  const currentDocument = await getManagedCollection(area);
  const { collection } = readEntry(currentDocument, area, selectedKeys[0]);
  selectedKeys.forEach((entryKey) => readEntry(currentDocument, area, entryKey));
  const next = JSON.parse(nextDocument) as Array<Record<string, unknown>>;
  if (!Array.isArray(next) || next.some((item) => selectedKeys.includes(String(item?.[entryKeyField(area)])))) throw new Error("The archive request must remove every selected entry.");
  if (collection.length - selectedKeys.length < 1) throw new Error("Keep at least one entry in this collection. Restore or add another entry first.");
  const key = entryKeyField(area);
  const remainingCurrentKeys = collection.filter((item) => !selectedKeys.includes(String(item?.[key]))).map((item) => String(item?.[key])).sort();
  const nextKeys = next.map((item) => String(item?.[key])).sort();
  if (remainingCurrentKeys.length !== nextKeys.length || remainingCurrentKeys.some((value, index) => value !== nextKeys[index])) throw new Error("The archive request must preserve every non-selected entry.");
  const removedEntries = collection.filter((item) => selectedKeys.includes(String(item?.[key])));
  await db.insert(deletedManagedContentEntries).values(removedEntries.map((entry) => ({ area, entryKey: String(entry[key]), document: JSON.stringify(entry) }))).onDuplicateKeyUpdate({ set: { deletedAt: new Date() } });
  await db.update(managedContentDraftPreviews).set({ revokedAt: new Date() }).where(and(eq(managedContentDraftPreviews.area, area), inArray(managedContentDraftPreviews.entryKey, selectedKeys)));
  return saveManagedContent(area, nextDocument, revisionNote);
}

export async function listDeletedManagedEntries(area: EntryArea) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  return db.select({ id: deletedManagedContentEntries.id, entryKey: deletedManagedContentEntries.entryKey, document: deletedManagedContentEntries.document, deletedAt: deletedManagedContentEntries.deletedAt }).from(deletedManagedContentEntries).where(eq(deletedManagedContentEntries.area, area)).orderBy(desc(deletedManagedContentEntries.deletedAt));
}

export async function restoreDeletedManagedEntry(area: EntryArea, entryKey: string, revisionNote: string) {
  return restoreDeletedManagedEntries(area, [entryKey], revisionNote);
}

export async function restoreDeletedManagedEntries(area: EntryArea, entryKeys: string[], revisionNote: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const selectedKeys = Array.from(new Set(entryKeys));
  if (!selectedKeys.length) throw new Error("Select at least one archived entry to restore.");
  const deleted = await db.select().from(deletedManagedContentEntries).where(and(eq(deletedManagedContentEntries.area, area), inArray(deletedManagedContentEntries.entryKey, selectedKeys)));
  if (deleted.length !== selectedKeys.length) throw new Error("One or more archived entries are no longer available to restore.");
  const currentDocument = await getManagedCollection(area);
  const key = entryKeyField(area);
  const existing = JSON.parse(currentDocument) as Array<Record<string, unknown>>;
  if (existing.some((item) => selectedKeys.includes(String(item?.[key])))) throw new Error("An archived entry conflicts with an existing entry and cannot be restored in bulk.");
  const restoredEntries = deleted.map((entry) => JSON.parse(entry.document) as Record<string, unknown>);
  restoredEntries.forEach((entry) => { if (!selectedKeys.includes(String(entry[key]))) throw new Error("An archived entry does not match its recovery key."); });
  const next = [...restoredEntries, ...existing];
  await db.delete(deletedManagedContentEntries).where(inArray(deletedManagedContentEntries.id, deleted.map((entry) => entry.id)));
  return saveManagedContent(area, JSON.stringify(next), revisionNote);
}

export async function createManagedDraftPreview(area: EntryArea, entryKey: string, document: string, expiresInHours: number, password?: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  readEntry(JSON.stringify([JSON.parse(document)]), area, entryKey);
  const token = crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  const passwordData = password ? hashDraftPreviewPassword(password) : null;
  const passwordSalt = passwordData?.salt;
  const passwordHash = passwordData?.hash;
  await db.insert(managedContentDraftPreviews).values({ token, area, entryKey, document, expiresAt, passwordHash, passwordSalt });
  return { token, expiresAt };
}

export async function listManagedDraftPreviews(area: EntryArea, entryKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  return db.select({ id: managedContentDraftPreviews.id, token: managedContentDraftPreviews.token, expiresAt: managedContentDraftPreviews.expiresAt, revokedAt: managedContentDraftPreviews.revokedAt, createdAt: managedContentDraftPreviews.createdAt, passwordHash: managedContentDraftPreviews.passwordHash, viewCount: managedContentDraftPreviews.viewCount, lastViewedAt: managedContentDraftPreviews.lastViewedAt }).from(managedContentDraftPreviews).where(and(eq(managedContentDraftPreviews.area, area), eq(managedContentDraftPreviews.entryKey, entryKey))).orderBy(desc(managedContentDraftPreviews.createdAt));
}

export async function getAllManagedDraftPreviews() {
  const db = await getDb();
  if (!db) throw new Error("Draft previews are temporarily unavailable");
  return db.select({ id: managedContentDraftPreviews.id, token: managedContentDraftPreviews.token, area: managedContentDraftPreviews.area, entryKey: managedContentDraftPreviews.entryKey, expiresAt: managedContentDraftPreviews.expiresAt, revokedAt: managedContentDraftPreviews.revokedAt, createdAt: managedContentDraftPreviews.createdAt, passwordHash: managedContentDraftPreviews.passwordHash, viewCount: managedContentDraftPreviews.viewCount, lastViewedAt: managedContentDraftPreviews.lastViewedAt }).from(managedContentDraftPreviews).orderBy(desc(managedContentDraftPreviews.createdAt));
}

export async function getManagedDraftPreview(token: string, password?: string) {
  const db = await getDb();
  if (!db) throw new Error("Draft previews are temporarily unavailable");
  const preview = await db.select({ id: managedContentDraftPreviews.id, area: managedContentDraftPreviews.area, entryKey: managedContentDraftPreviews.entryKey, document: managedContentDraftPreviews.document, expiresAt: managedContentDraftPreviews.expiresAt, revokedAt: managedContentDraftPreviews.revokedAt, passwordHash: managedContentDraftPreviews.passwordHash, passwordSalt: managedContentDraftPreviews.passwordSalt }).from(managedContentDraftPreviews).where(eq(managedContentDraftPreviews.token, token)).limit(1);
  if (!preview[0] || preview[0].revokedAt || preview[0].expiresAt.getTime() <= Date.now()) throw new Error("This draft preview link is unavailable or has expired.");
  if (preview[0].passwordHash) {
    if (!password) return { passwordRequired: true, expiresAt: preview[0].expiresAt };
    if (!verifyDraftPreviewPassword(password, preview[0].passwordSalt ?? "", preview[0].passwordHash)) throw new Error("This preview password is not valid.");
  }
  await db.update(managedContentDraftPreviews).set({ viewCount: sql`${managedContentDraftPreviews.viewCount} + 1`, lastViewedAt: new Date() }).where(eq(managedContentDraftPreviews.token, token));
  await db.insert(managedContentDraftPreviewViews).values({ previewId: preview[0].id });
  return { passwordRequired: false, area: preview[0].area, entryKey: preview[0].entryKey, document: preview[0].document, expiresAt: preview[0].expiresAt };
}

export async function getManagedDraftPreviewDailyViews(days = 14, previewId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Draft preview analytics are temporarily unavailable");
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const filters = [gte(managedContentDraftPreviewViews.viewedAt, since)];
  if (previewId) filters.push(eq(managedContentDraftPreviewViews.previewId, previewId));
  const events = await db.select({ viewedAt: managedContentDraftPreviewViews.viewedAt }).from(managedContentDraftPreviewViews).where(and(...filters));
  const dailyCounts = new Map<string, number>();
  events.forEach(({ viewedAt }) => {
    const day = viewedAt.toISOString().slice(0, 10);
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
  });
  return Array.from(dailyCounts.entries()).sort(([left], [right]) => left.localeCompare(right)).map(([day, views]) => ({ day, views }));
}

export async function revokeManagedDraftPreview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  await db.update(managedContentDraftPreviews).set({ revokedAt: new Date() }).where(eq(managedContentDraftPreviews.id, id));
}

export async function resetManagedDraftPreviewPassword(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const preview = await db.select({ id: managedContentDraftPreviews.id, revokedAt: managedContentDraftPreviews.revokedAt, expiresAt: managedContentDraftPreviews.expiresAt }).from(managedContentDraftPreviews).where(eq(managedContentDraftPreviews.id, id)).limit(1);
  if (!preview[0] || preview[0].revokedAt || preview[0].expiresAt.getTime() <= Date.now()) throw new Error("Only an active preview link can receive a new password.");
  const password = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const protectedPreview = hashDraftPreviewPassword(password);
  await db.update(managedContentDraftPreviews).set({ passwordHash: protectedPreview.hash, passwordSalt: protectedPreview.salt }).where(eq(managedContentDraftPreviews.id, id));
  return { password };
}

export async function renewManagedDraftPreview(id: number, expiresInHours: number) {
  const db = await getDb();
  if (!db) throw new Error("Content management is temporarily unavailable");
  const preview = await db.select({ id: managedContentDraftPreviews.id, revokedAt: managedContentDraftPreviews.revokedAt, expiresAt: managedContentDraftPreviews.expiresAt }).from(managedContentDraftPreviews).where(eq(managedContentDraftPreviews.id, id)).limit(1);
  if (!preview[0] || preview[0].revokedAt || preview[0].expiresAt.getTime() <= Date.now()) throw new Error("Only an active preview link can be renewed.");
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  await db.update(managedContentDraftPreviews).set({ expiresAt }).where(eq(managedContentDraftPreviews.id, id));
  return { expiresAt };
}
