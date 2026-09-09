ALTER TABLE `managedContentDraftPreviews` ADD `viewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `managedContentDraftPreviews` ADD `lastViewedAt` timestamp;