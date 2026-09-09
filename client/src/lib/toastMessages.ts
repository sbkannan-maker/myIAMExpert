export const toastMessages = {
  catalogFiltersCleared: "Catalog filters cleared.",
  savedPattern: "Saved to your shortlist.",
  removedPattern: "Removed from your shortlist.",
  fullCatalog: "Showing the full catalog.",
  savedPatterns: "Showing your saved patterns.",
  aiTooShort: "Describe the requirement in at least 12 characters.",
  aiStarted: "Matching your requirement against the catalog…",
  aiUnavailable: "AI matching is unavailable. Try the catalog search instead.",
  newsletterPending: "Adding you to the IAM article list…",
  newsletterSuccess: "You’re subscribed to IAM article updates.",
  newsletterFailure: "We couldn’t complete the subscription. Please try again.",
  bookingConfirmed: "Booking confirmed. Your pre-call guide is ready.",
  checklistPreparing: "Preparing your pre-call checklist…",
  resourcesOpening: "Opening post-call resources…",
  patternsOpening: "Opening implementation patterns…",
  copyLinkDescription: "Shareable topic view is ready to paste.",
  topicPreferencesSaved: "Topic preferences saved in this browser.",
  topicPreferencesReset: "Local topic preferences reset.",
  rssLinkCopied: "RSS feed link copied.",
  rssLinkCopyFailure: "RSS link could not be copied. Try again.",
  localBlogPreferencesCleared: "Local Blog preferences cleared.",
} as const;

export function aiMatchSummary(count: number): string {
  return `Found ${count} matching implementation ${count === 1 ? "pattern" : "patterns"}.`;
}
