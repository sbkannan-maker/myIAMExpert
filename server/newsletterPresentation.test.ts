import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NewsletterSuccessMessage } from "../client/src/components/NewsletterForm";

describe("newsletter success confirmation", () => {
  it("renders an accessible animated confirmation without needing a live subscription", () => {
    const markup = renderToStaticMarkup(createElement(NewsletterSuccessMessage, { onSubscribeAnotherEmail: () => undefined }));
    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain("animate-in");
    expect(markup).toContain("Subscription confirmed.");
    expect(markup).toContain("Subscribe another email");
  });
});
