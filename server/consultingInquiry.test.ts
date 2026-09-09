import { describe, expect, it } from "vitest";
import { consultingInquirySchema, formatConsultingInquiry } from "./consultingInquiry";

describe("consulting inquiry", () => {
  it("validates and formats a consulting inquiry for owner notification", () => {
    const inquiry = consultingInquirySchema.parse({
      name: "Alex Morgan",
      email: "alex@example.com",
      organization: "Northstar Systems",
      topic: "SailPoint delivery patterns",
      message: "We are planning an IdentityIQ implementation and need to align workflow and release design.",
      website: "",
    });

    expect(formatConsultingInquiry(inquiry)).toContain("Northstar Systems");
    expect(formatConsultingInquiry(inquiry)).toContain("SailPoint delivery patterns");
  });
});
