CREATE TABLE `bookingInteractionEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` enum('booking_started','booking_completed') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingInteractionEvents_id` PRIMARY KEY(`id`)
);
