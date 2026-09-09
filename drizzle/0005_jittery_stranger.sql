CREATE TABLE `managedSiteContentRevisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`area` varchar(32) NOT NULL,
	`document` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `managedSiteContentRevisions_id` PRIMARY KEY(`id`)
);
