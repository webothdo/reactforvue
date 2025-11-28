CREATE TABLE IF NOT EXISTS `account` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `alternative` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`websiteUrl` text NOT NULL,
	`faviconUrl` text,
	`isFeatured` integer DEFAULT false NOT NULL,
	`isOpenSource` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Alternative_slug_idx` ON `alternative` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Alternative_slug_key` ON `alternative` (`slug`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `alternatives_to_tools` (
	`alternative_id` text NOT NULL,
	`tool_id` text NOT NULL,
	PRIMARY KEY(`alternative_id`, `tool_id`),
	FOREIGN KEY (`alternative_id`) REFERENCES `alternative`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tool_id`) REFERENCES `tool`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `alternatives_to_tools_toolId_idx` ON `alternatives_to_tools` (`tool_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `alternatives_to_tools_alternativeId_idx` ON `alternatives_to_tools` (`alternative_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`label` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `category_slug_unique` ON `category` (`slug`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Category_slug_idx` ON `category` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Category_slug_key` ON `category` (`slug`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `image` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`thumbnailUrl` text,
	`fileId` text,
	`filename` text,
	`originalName` text,
	`size` integer,
	`mimeType` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Image_url_idx` ON `image` (`url`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Image_url_key` ON `image` (`url`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `like` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`accountId` text,
	`toolId` text,
	FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`toolId`) REFERENCES `tool`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Like_toolId_idx` ON `like` (`toolId`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Like_accountId_idx` ON `like` (`accountId`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Like_toolId_accountId_key` ON `like` (`toolId`,`accountId`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `tool` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`websiteUrl` text NOT NULL,
	`screenshotUrl` text,
	`description` text,
	`faviconUrl` text,
	`content` text,
	`isOpenSource` integer DEFAULT true NOT NULL,
	`isFeatured` integer DEFAULT false NOT NULL,
	`submitterName` text,
	`submitterEmail` text,
	`pageViews` integer DEFAULT 0,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`categoryId` text,
	`accountId` text,
	`descriptionSearch` text,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Tool_id_slug_idx` ON `tool` (`id`,`slug`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Tool_descriptionSearch_idx` ON `tool` (`descriptionSearch`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Tool_slug_key` ON `tool` (`slug`);