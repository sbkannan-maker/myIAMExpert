export type BookingTrackingEvent = "booking_started" | "booking_completed";

export const bookingSecureLoadingCopy = "Calendar scheduling loading securely. Pick any available slot to lock in your call.";

export const preCallPreparationItems = [
  "A short outline of the identity, governance, or integration decision you want to address.",
  "The systems, connectors, or stakeholders that shape the current architecture.",
  "Any relevant delivery timing, control obligations, or decision constraints.",
] as const;

export function getBookingTrackingEvent(eventName: unknown): BookingTrackingEvent | null {
  if (eventName === "calendly.date_and_time_selected") return "booking_started";
  if (eventName === "calendly.event_scheduled") return "booking_completed";
  return null;
}

export function getVisitorTimezoneContext(date = new Date(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const zone = timeZone || "your local time zone";
  const localTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: timeZone || undefined }).format(date);
  return { zone, localTime };
}
