import { describe, expect, it } from "vitest";
import { calendlyUnavailableMessage, getCalendlyEmbedUrl } from "../client/src/lib/calendlyEmbed";

describe("Calendly embed contract", () => {
  it("uses the standard public event URL without a custom embed-domain override", () => {
    const url = getCalendlyEmbedUrl("https://calendly.com/sbkannan/30min");
    expect(url).toContain("hide_gdpr_banner=1");
    expect(url).not.toContain("embed_domain");
  });

  it("keeps a direct recovery explanation if the user-owned frame does not load", () => {
    expect(calendlyUnavailableMessage).toContain("Enable the event in Calendly");
  });
});
