import { describe, expect, it } from "vitest";
import { newsletterSubscriptionSchema } from "./newsletter";

describe("newsletter subscriptions", () => {
  it("accepts a valid email and rejects invalid subscriber input", () => {
    expect(newsletterSubscriptionSchema.parse({ email: "reader@example.com", website: "" })).toMatchObject({ email: "reader@example.com" });
    expect(() => newsletterSubscriptionSchema.parse({ email: "invalid" })).toThrow();
  });
});
