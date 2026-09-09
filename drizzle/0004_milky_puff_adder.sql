CREATE TABLE `managedSiteContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`area` varchar(32) NOT NULL,
	`document` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managedSiteContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_site_content_area_unique` UNIQUE(`area`)
);
