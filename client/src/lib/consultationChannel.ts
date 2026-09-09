export type ConsultationChannel = "booking" | "inquiry";

export function getConsultationChannelState(channel: ConsultationChannel) {
  if (channel === "inquiry") {
    return {
      channel,
      panelId: "inquiry-form",
      tabLabel: "Send inquiry message",
      panelLabel: "Frame the architecture challenge",
    };
  }

  return {
    channel,
    panelId: "consultation-panel",
    tabLabel: "Schedule direct call",
    panelLabel: "Direct availability",
  };
}
