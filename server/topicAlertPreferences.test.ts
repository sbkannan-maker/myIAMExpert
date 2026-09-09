import { describe, expect, it } from "vitest";
import { readTopicAlertPreferences, topicAlertPreferencesChangeEvent, topicAlertPreferencesStorageKey } from "../client/src/hooks/useTopicAlertPreferences";

describe("browser-local topic alert preferences", () => {
  it("stores only a local email and unique selected topics defensively", () => {
    expect(topicAlertPreferencesStorageKey).toBe("myiam-topic-alert-preferences");
    expect(topicAlertPreferencesChangeEvent).toBe("myiam-topic-alert-preferences-change");
    expect(readTopicAlertPreferences('{"email":"reader@example.com","topics":["SailPoint IdentityIQ","SailPoint IdentityIQ",""]}')).toEqual({ email: "reader@example.com", topics: ["SailPoint IdentityIQ"] });
    expect(readTopicAlertPreferences("invalid json")).toEqual({ email: "", topics: [] });
  });
});
