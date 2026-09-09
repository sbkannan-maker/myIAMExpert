export function getCalendlyEmbedUrl(calendlyUrl: string) {
  const url = new URL(calendlyUrl);
  url.searchParams.set("hide_gdpr_banner", "1");
  url.searchParams.set("background_color", "0e1728");
  url.searchParams.set("text_color", "edf5ff");
  url.searchParams.set("primary_color", "5e93df");
  return url.toString();
}

export function isCalendlyActiveEvent(eventName: unknown) {
  return eventName === "calendly.event_type_viewed";
}

export const calendlyUnavailableMessage = "The configured Calendly event is unavailable. Enable the event in Calendly or provide a replacement scheduling link; direct inquiry remains available here.";
