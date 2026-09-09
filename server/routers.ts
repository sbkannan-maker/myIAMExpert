import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookie } from "cookie";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { adminProcedure, clientProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { catalogForSearch, normalizeSearchResponse } from "./catalogSearch";
import { consultingInquirySchema, formatConsultingInquiry } from "./consultingInquiry";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { newsletterSubscriptionSchema } from "./newsletter";
import { createHeartbeatJob, deleteHeartbeatJob, updateHeartbeatJob } from "./_core/heartbeat";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
import { managedContentAreas, validateBlogImageUpload, validateManagedDocument, validateScheduledBlogArticle } from "./siteContent";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  catalog: router({
    aiSearch: publicProcedure
      .input(z.object({ query: z.string().trim().min(12, "Describe the identity requirement in a little more detail.").max(900) }))
      .mutation(async ({ input }) => {
        const { data: models } = await listLLMModels();
        const model = models.find((item) => item.id === "gpt-5-mini")?.id
          ?? models.find((item) => item.id.includes("mini"))?.id
          ?? models[0]?.id;

        if (!model) throw new Error("No AI model is available for catalog search.");

        const response = await invokeLLM({
          model,
          maxTokens: 1600,
          reasoning: { effort: "minimal" },
          messages: [
            {
              role: "system",
              content: "You are an IdentityIQ solution architect. Match a user's requirement only to the supplied catalog. Recommend 1 to 8 IDs whose existing business requirement and technical pattern fit best. Do not invent use cases or claim features absent from the catalog. Keep the interpretation practical and concise.",
            },
            {
              role: "user",
              content: `Requirement:\n${input.query}\n\nCatalog:\n${JSON.stringify(catalogForSearch)}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "identityiq_catalog_match",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  interpretation: { type: "string" },
                  recommendedIds: { type: "array", items: { type: "integer" } },
                  suggestedRefinement: { type: "string" },
                },
                required: ["interpretation", "recommendedIds", "suggestedRefinement"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        const raw = typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((item) => item.type === "text" ? item.text : "").join("")
            : "";
        if (!raw) throw new Error("The AI search did not return a usable response.");
        return normalizeSearchResponse(JSON.parse(raw));
      }),
  }),
  consulting: router({
    submitInquiry: publicProcedure
      .input(consultingInquirySchema)
      .mutation(async ({ input }) => {
        if (input.website) return { success: true } as const;

        const delivered = await notifyOwner({
          title: `New consulting inquiry · ${input.name}`,
          content: formatConsultingInquiry(input),
        });

        if (!delivered) throw new Error("The inquiry service is temporarily unavailable. Please use LinkedIn to connect directly.");
        return { success: true } as const;
      }),
  }),
  siteAnalytics: router({
    recordPageView: publicProcedure
      .input(z.object({ path: z.string().trim().min(1).max(255) }))
      .mutation(({ input, ctx }) => {
        const countryHeader = ctx.req.headers["cf-ipcountry"] ?? ctx.req.headers["x-vercel-ip-country"];
        const regionHeader = ctx.req.headers["x-vercel-ip-country-region"] ?? ctx.req.headers["x-region"];
        const ipHeader = ctx.req.headers["cf-connecting-ip"] ?? ctx.req.headers["x-real-ip"] ?? ctx.req.headers["x-forwarded-for"];
        const headerValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
        const forwardedIp = headerValue(ipHeader)?.split(",")[0]?.trim();
        return db.recordSiteVisitorPageView(input.path, headerValue(countryHeader), headerValue(regionHeader), forwardedIp).then(() => ({ success: true } as const));
      }),
    overview: adminProcedure
      .input(z.object({ days: z.union([z.literal(7), z.literal(30), z.literal(90)]).optional(), startDate: z.string().date().optional(), endDate: z.string().date().optional(), originDimension: z.enum(["country", "region"]).optional(), originFilter: z.string().trim().max(96).optional(), originPage: z.number().int().min(1).max(10_000).optional(), originPageSize: z.number().int().min(1).max(50).optional() }).optional())
      .query(({ input }) => db.getSiteVisitorAnalytics(input?.days ?? 30, input?.startDate, input?.endDate, input?.originDimension ?? "country", input?.originFilter ?? "all", input?.originPage ?? 1, input?.originPageSize ?? 10)),
  }),
  booking: router({
    track: publicProcedure
      .input(z.object({ eventType: z.enum(["booking_started", "booking_completed"]) }))
      .mutation(async ({ input }) => {
        await db.recordBookingInteraction(input.eventType);
        return { success: true } as const;
      }),
    dailyMetrics: adminProcedure
      .input(z.object({ startDate: z.string().date(), endDate: z.string().date() }))
      .query(({ input }) => db.getDailyBookingMetrics(input)),
  }),
  clientResources: router({
    list: clientProcedure.query(async () => {
      const { approvedClientResources } = await import("./clientResources");
      return approvedClientResources;
    }),
  }),
  newsletter: router({
    subscribe: publicProcedure
      .input(newsletterSubscriptionSchema)
      .mutation(async ({ input }) => {
        if (input.website) return { success: true } as const;
        await db.upsertNewsletterSubscription(input.email.toLowerCase());
        await notifyOwner({
          title: "New IAM newsletter subscription",
          content: `Email: ${input.email.toLowerCase()}\nSource: Blog newsletter form`,
        });
        return { success: true } as const;
      }),
  }),
  siteContent: router({
    publicDocuments: publicProcedure.query(() => db.getPublishedManagedContent()),
    adminDocuments: adminProcedure.query(() => db.getManagedContentForAdmin()),
    saveDocument: adminProcedure
      .input(z.object({ area: z.enum(managedContentAreas), document: z.string().min(2).max(900_000), revisionNote: z.string().trim().min(3, "Add a short revision note before publishing.").max(500) }))
      .mutation(async ({ input }) => {
        const document = await db.saveManagedContent(input.area, validateManagedDocument(input.area, input.document), input.revisionNote);
        return { success: true, area: input.area, document } as const;
      }),
    restoreDefault: adminProcedure
      .input(z.object({ area: z.enum(managedContentAreas) }))
      .mutation(async ({ input }) => {
        await db.restoreManagedContentDefault(input.area);
        return { success: true, area: input.area } as const;
      }),
    revisions: adminProcedure.input(z.object({ area: z.enum(managedContentAreas) })).query(({ input }) => db.getManagedContentRevisions(input.area)),
    restoreRevision: adminProcedure
      .input(z.object({ area: z.enum(managedContentAreas), revisionId: z.number().int().positive() }))
      .mutation(async ({ input }) => ({ success: true, area: input.area, document: await db.restoreManagedContentRevision(input.area, input.revisionId) } as const)),
    deletedEntries: adminProcedure
      .input(z.object({ area: z.enum(["blog", "use-cases"]) }))
      .query(({ input }) => db.listDeletedManagedEntries(input.area)),
    softDeleteEntry: adminProcedure
      .input(z.object({ area: z.enum(["blog", "use-cases"]), entryKey: z.string().trim().min(1).max(255), nextDocument: z.string().min(2).max(900_000), revisionNote: z.string().trim().min(3).max(500) }))
      .mutation(async ({ input }) => ({ success: true, area: input.area, document: await db.softDeleteManagedEntry(input.area, input.entryKey, validateManagedDocument(input.area, input.nextDocument), input.revisionNote) } as const)),
    bulkArchiveEntries: adminProcedure
      .input(z.object({ area: z.enum(["blog", "use-cases"]), entryKeys: z.array(z.string().trim().min(1).max(255)).min(1).max(100), nextDocument: z.string().min(2).max(900_000), revisionNote: z.string().trim().min(3).max(500) }))
      .mutation(async ({ input }) => ({ success: true, area: input.area, document: await db.softDeleteManagedEntries(input.area, input.entryKeys, validateManagedDocument(input.area, input.nextDocument), input.revisionNote) } as const)),
    restoreDeletedEntry: adminProcedure
      .input(z.object({ area: z.enum(["blog", "use-cases"]), entryKey: z.string().trim().min(1).max(255), revisionNote: z.string().trim().min(3).max(500) }))
      .mutation(async ({ input }) => ({ success: true, area: input.area, document: await db.restoreDeletedManagedEntry(input.area, input.entryKey, input.revisionNote) } as const)),
    bulkRestoreEntries: adminProcedure
      .input(z.object({ area: z.enum(["blog", "use-cases"]), entryKeys: z.array(z.string().trim().min(1).max(255)).min(1).max(100), revisionNote: z.string().trim().min(3).max(500) }))
      .mutation(async ({ input }) => ({ success: true, area: input.area, document: await db.restoreDeletedManagedEntries(input.area, input.entryKeys, input.revisionNote) } as const)),
    draftPreviews: router({
      list: adminProcedure.input(z.object({ area: z.enum(["blog", "use-cases"]), entryKey: z.string().trim().min(1).max(255) })).query(({ input }) => db.listManagedDraftPreviews(input.area, input.entryKey)),
      all: adminProcedure.query(() => db.getAllManagedDraftPreviews()),
      dailyViews: adminProcedure.input(z.object({ previewId: z.number().int().positive().optional() }).optional()).query(({ input }) => db.getManagedDraftPreviewDailyViews(14, input?.previewId)),
      create: adminProcedure.input(z.object({ area: z.enum(["blog", "use-cases"]), entryKey: z.string().trim().min(1).max(255), document: z.string().min(2).max(400_000), expiresInHours: z.union([z.literal(24), z.literal(72), z.literal(168), z.literal(336), z.literal(720)]).optional().default(168), password: z.string().min(8).max(128).optional() })).mutation(async ({ input }) => db.createManagedDraftPreview(input.area, input.entryKey, input.document, input.expiresInHours, input.password)),
      revoke: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await db.revokeManagedDraftPreview(input.id); return { success: true } as const; }),
      resetPassword: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => db.resetManagedDraftPreviewPassword(input.id)),
      renew: adminProcedure.input(z.object({ id: z.number().int().positive(), expiresInHours: z.union([z.literal(24), z.literal(72), z.literal(168), z.literal(336), z.literal(720)]).optional().default(168) })).mutation(async ({ input }) => db.renewManagedDraftPreview(input.id, input.expiresInHours)),
    }),
    draftPreview: publicProcedure
      .input(z.object({ token: z.string().regex(/^[a-f0-9]{32}$/), password: z.string().min(1).max(128).optional() }))
      .query(({ input }) => db.getManagedDraftPreview(input.token, input.password)),
    uploadBlogImage: adminProcedure
      .input(z.object({ fileName: z.string().trim().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().min(4).max(12_000_000), alt: z.string().trim().min(2).max(180) }))
      .mutation(async ({ input, ctx }) => {
        const bytes = validateBlogImageUpload(input.contentType, input.base64);
        const extension = input.contentType === "image/png" ? "png" : input.contentType === "image/webp" ? "webp" : "jpg";
        const basename = input.fileName.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "blog-image";
        const uploaded = await storagePut(`owner-${ctx.user.id}/blog/${basename}.${extension}`, bytes, input.contentType);
        return { ...uploaded, markdown: `![${input.alt.replace(/[\[\]]/g, "").trim()}](${uploaded.url})` };
      }),
    scheduledBlog: router({
      list: adminProcedure.query(() => db.getScheduledBlogPublications()),
      create: adminProcedure
        .input(z.object({ articleSlug: z.string().trim().min(1).max(255), articleDocument: z.string().min(2).max(400_000), specification: z.string().trim().min(12, "Describe the approved publishing automation in at least 12 characters.").max(1_000), revisionNote: z.string().trim().min(3).max(500), publishAt: z.string().datetime() }))
        .mutation(async ({ input, ctx }) => {
          if (!ENV.isProduction) throw new Error("Publish this website before activating automatic Blog schedules.");
          const publishAt = new Date(input.publishAt);
          if (publishAt.getTime() < Date.now() + 90_000) throw new Error("Choose a publication time at least two minutes in the future.");
          validateScheduledBlogArticle(input.articleSlug, input.articleDocument);
          const id = await db.createScheduledBlogPublication(input.articleSlug, input.articleDocument, input.specification, input.revisionNote, publishAt);
          try {
            const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
            const cron = `0 ${publishAt.getUTCMinutes()} ${publishAt.getUTCHours()} ${publishAt.getUTCDate()} ${publishAt.getUTCMonth() + 1} *`;
            const job = await createHeartbeatJob({ name: `myiam-blog-publish-${id}`, cron, path: "/api/scheduled/blog-publish", payload: { scheduleId: id }, description: `Publish the scheduled Blog article ${input.articleSlug} at ${publishAt.toISOString()}` }, sessionToken);
            await db.attachBlogPublicationSchedule(id, job.taskUid);
            return { success: true, id, nextExecutionAt: job.nextExecutionAt ?? publishAt.toISOString() } as const;
          } catch (error) {
            await db.discardScheduledBlogPublication(id);
            throw error;
          }
        }),
      cancel: adminProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .mutation(async ({ input, ctx }) => {
          const taskUid = await db.cancelScheduledBlogPublication(input.id);
          if (taskUid) {
            const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
            await deleteHeartbeatJob(taskUid, sessionToken);
          }
          return { success: true } as const;
        }),
      pause: adminProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .mutation(async ({ input, ctx }) => {
          const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
          const taskUid = await db.setScheduledBlogPublicationStatus(input.id, "paused");
          await updateHeartbeatJob(taskUid, { enable: false }, sessionToken);
          return { success: true } as const;
        }),
      resume: adminProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .mutation(async ({ input, ctx }) => {
          const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
          const taskUid = await db.setScheduledBlogPublicationStatus(input.id, "scheduled");
          await updateHeartbeatJob(taskUid, { enable: true }, sessionToken);
          return { success: true } as const;
        }),
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
