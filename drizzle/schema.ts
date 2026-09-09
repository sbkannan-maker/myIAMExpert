import { int, mediumtext, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "client", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("newsletter_subscriptions_email_unique").on(table.email),
]);

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

export const bookingInteractionEvents = mysqlTable("bookingInteractionEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventType: mysqlEnum("eventType", ["booking_started", "booking_completed"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingInteractionEvent = typeof bookingInteractionEvents.$inferSelect;

/** Privacy-minimized first-party page views. Raw IP is never stored; visitorHash is one-way and ipPrefix is masked. */
export const siteVisitorPageViews = mysqlTable("siteVisitorPageViews", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 255 }).notNull(),
  countryCode: varchar("countryCode", { length: 2 }),
  region: varchar("region", { length: 96 }),
  visitorHash: varchar("visitorHash", { length: 64 }),
  ipPrefix: varchar("ipPrefix", { length: 64 }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type SiteVisitorPageView = typeof siteVisitorPageViews.$inferSelect;

export const managedSiteContent = mysqlTable("managedSiteContent", {
  id: int("id").autoincrement().primaryKey(),
  area: varchar("area", { length: 32 }).notNull(),
  document: mediumtext("document").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("managed_site_content_area_unique").on(table.area),
]);

export type ManagedSiteContent = typeof managedSiteContent.$inferSelect;

export const managedSiteContentRevisions = mysqlTable("managedSiteContentRevisions", {
  id: int("id").autoincrement().primaryKey(),
  area: varchar("area", { length: 32 }).notNull(),
  entryKey: varchar("entryKey", { length: 255 }).notNull().default("collection"),
  note: text("note"),
  document: mediumtext("document").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ManagedSiteContentRevision = typeof managedSiteContentRevisions.$inferSelect;

export const scheduledBlogPublications = mysqlTable("scheduledBlogPublications", {
  id: int("id").autoincrement().primaryKey(),
  articleSlug: varchar("articleSlug", { length: 255 }).notNull(),
  articleDocument: mediumtext("articleDocument").notNull(),
  specification: text("specification").notNull(),
  revisionNote: text("revisionNote").notNull(),
  publishAt: timestamp("publishAt").notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  status: mysqlEnum("status", ["scheduled", "paused", "published", "cancelled"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, table => [
  uniqueIndex("scheduled_blog_publications_task_uid_unique").on(table.scheduleCronTaskUid),
]);

export type ScheduledBlogPublication = typeof scheduledBlogPublications.$inferSelect;

export const deletedManagedContentEntries = mysqlTable("deletedManagedContentEntries", {
  id: int("id").autoincrement().primaryKey(),
  area: varchar("area", { length: 32 }).notNull(),
  entryKey: varchar("entryKey", { length: 255 }).notNull(),
  document: mediumtext("document").notNull(),
  deletedAt: timestamp("deletedAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("deleted_managed_content_entry_unique").on(table.area, table.entryKey),
]);

export const managedContentDraftPreviews = mysqlTable("managedContentDraftPreviews", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull(),
  area: varchar("area", { length: 32 }).notNull(),
  entryKey: varchar("entryKey", { length: 255 }).notNull(),
  document: mediumtext("document").notNull(),
  passwordHash: varchar("passwordHash", { length: 128 }),
  passwordSalt: varchar("passwordSalt", { length: 64 }),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
  viewCount: int("viewCount").default(0).notNull(),
  lastViewedAt: timestamp("lastViewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("managed_content_draft_preview_token_unique").on(table.token),
]);

export const managedContentDraftPreviewViews = mysqlTable("managedContentDraftPreviewViews", {
  id: int("id").autoincrement().primaryKey(),
  previewId: int("previewId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});
