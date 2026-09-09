ALTER TABLE `managedContentDraftPreviews` ADD `passwordHash` varchar(128);--> statement-breakpoint
ALTER TABLE `managedContentDraftPreviews` ADD `passwordSalt` varchar(64);