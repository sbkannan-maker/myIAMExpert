# Calendly availability diagnostic

On 20 August 2026, the configured public event URL `https://calendly.com/sbkannan/30min` returned Calendly’s owner-facing message: **“This calendar is currently unavailable.”** The wider profile did not provide a verified replacement event during the same review.

The website now loads the standard inline-widget URL without an `embed_domain` override, waits only for Calendly’s `calendly.event_type_viewed` signal before treating a calendar as active, and presents a clear direct-inquiry recovery state when that signal never arrives.

To restore live inline scheduling, the Calendly account owner must enable the `30min` event or supply a verified active replacement event URL. The direct inquiry form and the copied email action remain available while the external event is disabled.

On 20 August 2026, after a request to verify a newly enabled event, the public URL was checked again and still returned the same Calendly unavailable-calendar message. No implementation change can make an externally unavailable event offer booking times; the site will retain its recovery route until Calendly confirms an active event.

The supplied embed material contains a separate public Google Calendar appointment schedule. It was verified on 20 August 2026 to expose selectable 30-minute times, but its public owner and title are **Tyler Rettkowski — IdentityEXE Availability**, rather than Kannan Sriniyappan Balakrishnan / myIAM. This schedule must not be embedded in the myIAM site without the user confirming that this third-party-labelled calendar is intentionally the desired booking destination.

After clarification, the expert page was switched to a direct iframe of the user-owned `https://calendly.com/sbkannan/30min` destination, preserving the frame-based layout pattern without using the third-party Google calendar. The iframe load event completes in the preview and the panel changes to its direct-availability state. Cross-origin frame content is opaque to the host page, so its appointment controls must be confirmed from the public event itself rather than inspected by the site code.

Final public verification on 20 August 2026 confirmed that the user-owned Calendly page now loads as **Kannan Sriniyappan Balakrishnan — 30 Minute Meeting**, with selectable appointment dates and available times. The direct expert-page frame therefore points to the correct live booking destination.

The sandbox browser can navigate away from the host page while an external nested frame is initializing, so that browser session does not provide reliable visual inspection of the cross-origin iframe. The independently verified public event remains the authoritative live-booking confirmation; the expert page uses that exact URL in its direct frame.
