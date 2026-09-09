CREATE TABLE `deletedManagedContentEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`area` varchar(32) NOT NULL,
	`entryKey` varchar(255) NOT NULL,
	`document` mediumtext NOT NULL,
	`deletedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deletedManagedContentEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `deleted_managed_content_entry_unique` UNIQUE(`area`,`entryKey`)
);
--> statement-breakpoint
CREATE TABLE `managedContentDraftPreviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`area` varchar(32) NOT NULL,
	`entryKey` varchar(255) NOT NULL,
	`document` mediumtext NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `managedContentDraftPreviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_content_draft_preview_token_unique` UNIQUE(`token`)
);
