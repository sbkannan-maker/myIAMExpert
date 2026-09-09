CREATE TABLE `scheduledBlogPublications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(255) NOT NULL,
	`articleDocument` mediumtext NOT NULL,
	`revisionNote` text NOT NULL,
	`publishAt` timestamp NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`status` enum('scheduled','published','cancelled') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`publishedAt` timestamp,
	CONSTRAINT `scheduledBlogPublications_id` PRIMARY KEY(`id`),
	CONSTRAINT `scheduled_blog_publications_task_uid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
ALTER TABLE `managedSiteContentRevisions` ADD `note` text;