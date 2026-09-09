import { describe, expect, it } from "vitest";
import { bookingSecureLoadingCopy, getBookingTrackingEvent, getVisitorTimezoneContext, preCallPreparationItems } from "../client/src/lib/bookingExperience";

describe("booking experience contracts", () => {
  it("keeps the approved secure scheduler guidance and practical confirmation preparation list", () => {
    expect(bookingSecureLoadingCopy).toBe("Calendar scheduling loading securely. Pick any available slot to lock in your call.");
    expect(preCallPreparationItems).toHaveLength(3);
    expect(preCallPreparationItems.join(" ")).toContain("identity");
  });

  it("maps only non-identifying Calendly interaction signals to measurable booking events", () => {
    expect(getBookingTrackingEvent("calendly.date_and_time_selected")).toBe("booking_started");
    expect(getBookingTrackingEvent("calendly.event_scheduled")).toBe("booking_completed");
    expect(getBookingTrackingEvent("calendly.page_height")).toBeNull();
  });

  it("presents a supplied visitor time zone without storing it in the tracking event", () => {
    const context = getVisitorTimezoneContext(new Date("2026-08-20T12:30:00Z"), "UTC");
    expect(context.zone).toBe("UTC");
    expect(context.localTime).toBeTruthy();
  });
});
