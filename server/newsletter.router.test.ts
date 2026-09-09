import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsertNewsletterSubscription, notifyOwner } = vi.hoisted(() => ({
  upsertNewsletterSubscription: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", () => ({ upsertNewsletterSubscription }));
vi.mock("./_core/notification", () => ({ notifyOwner }));

import { appRouter } from "./routers";

describe("newsletter.subscribe", () => {
  beforeEach(() => {
    upsertNewsletterSubscription.mockReset().mockResolvedValue(undefined);
    notifyOwner.mockReset().mockResolvedValue(true);
  });

  it("persists a normalized subscriber email and emits an owner notification", async () => {
    const caller = appRouter.createCaller({} as never);
    await expect(caller.newsletter.subscribe({ email: "Reader@Example.com", website: "" })).resolves.toEqual({ success: true });
    expect(upsertNewsletterSubscription).toHaveBeenCalledWith("reader@example.com");
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({ title: "New IAM newsletter subscription" }));
  });

  it("uses the same idempotent storage path for repeat subscriptions", async () => {
    const caller = appRouter.createCaller({} as never);
    await caller.newsletter.subscribe({ email: "reader@example.com", website: "" });
    await caller.newsletter.subscribe({ email: "reader@example.com", website: "" });
    expect(upsertNewsletterSubscription).toHaveBeenCalledTimes(2);
    expect(upsertNewsletterSubscription).toHaveBeenNthCalledWith(1, "reader@example.com");
    expect(upsertNewsletterSubscription).toHaveBeenNthCalledWith(2, "reader@example.com");
  });

  it("rejects a filled honeypot field before persistence", async () => {
    const caller = appRouter.createCaller({} as never);
    await expect(caller.newsletter.subscribe({ email: "reader@example.com", website: "bot-value" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(upsertNewsletterSubscription).not.toHaveBeenCalled();
  });
});
