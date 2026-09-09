import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("Unified expert consultation experience", () => {
  it("renders consulting context inside Talk to an Expert and redirects the legacy route", () => {
    const expert = readProjectFile("client/src/pages/TalkToExpert.tsx");
    const context = readProjectFile("client/src/components/ExpertConsultingContext.tsx");
    const app = readProjectFile("client/src/App.tsx");
    const profile = readProjectFile("client/src/components/ProfessionalProfileCard.tsx");
    expect(expert).toContain("ExpertConsultingContext");
    expect(expert).toContain('id="consultation-panel"');
    expect(expert).not.toContain("ProfessionalProfileCard");
    expect(expert).toContain("lg:items-start");
    expect(context).toContain("Architecture contexts & delivery patterns");
    expect(context).toContain("ProfessionalProfileCard");
    expect(context).toContain('lg:grid-cols-[minmax(0,1fr)_20rem]');
    expect(profile).toContain("Official SailPoint Ambassador badge");
    expect(profile).toContain("Connect with Kannan on LinkedIn");
    expect(profile).toContain("Share myIAM on X");
    expect(app).toContain('path="/consulting" component={ConsultingRedirect}');
  });

  it("shows Blog topic-specific RSS subscription links", () => {
    const directory = readProjectFile("client/src/components/BlogTopicRssDirectory.tsx");
    expect(directory).toContain("Topic subscriptions");
    expect(directory).toContain("/rss/topics/");
    expect(directory).toContain("All Blog articles");
    const topicPageRss = readProjectFile("client/src/components/TopicRssSubscribeLink.tsx");
    expect(topicPageRss).toContain("Subscribe by RSS");
    expect(topicPageRss).toContain("/rss/topics/");
    const localAlerts = readProjectFile("client/src/components/BlogTopicAlertPreferences.tsx");
    expect(localAlerts).toContain("Preference-only for now.");
    expect(localAlerts).toContain("No emails are sent");
    expect(localAlerts).toContain("Saved local topic preferences");
    expect(localAlerts).toContain("Reset");
    expect(localAlerts).toContain("topicPreferencesSaved");
  });
});
