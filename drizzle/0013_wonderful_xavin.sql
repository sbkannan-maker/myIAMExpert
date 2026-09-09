CREATE TABLE `siteVisitorPageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(255) NOT NULL,
	`countryCode` varchar(2),
	`region` varchar(96),
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `siteVisitorPageViews_id` PRIMARY KEY(`id`)
);
