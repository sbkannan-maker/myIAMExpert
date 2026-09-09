CREATE TABLE `managedContentDraftPreviewViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`previewId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `managedContentDraftPreviewViews_id` PRIMARY KEY(`id`)
);
