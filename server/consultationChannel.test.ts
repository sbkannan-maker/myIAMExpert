import { describe, expect, it } from "vitest";
import { getConsultationChannelState } from "../client/src/lib/consultationChannel";

describe("consultation channel state", () => {
  it("maps the booking tab to the direct availability panel", () => {
    expect(getConsultationChannelState("booking")).toEqual({
      channel: "booking",
      panelId: "consultation-panel",
      tabLabel: "Schedule direct call",
      panelLabel: "Direct availability",
    });
  });

  it("maps the inquiry tab to the architecture-context form", () => {
    expect(getConsultationChannelState("inquiry")).toEqual({
      channel: "inquiry",
      panelId: "inquiry-form",
      tabLabel: "Send inquiry message",
      panelLabel: "Frame the architecture challenge",
    });
  });
});
