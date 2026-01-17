DROP INDEX "Alternative_slug_idx";--> statement-breakpoint
DROP INDEX "Alternative_slug_key";--> statement-breakpoint
DROP INDEX "alternatives_to_tools_toolId_idx";--> statement-breakpoint
DROP INDEX "alternatives_to_tools_alternativeId_idx";--> statement-breakpoint
DROP INDEX "category_slug_unique";--> statement-breakpoint
DROP INDEX "Category_slug_idx";--> statement-breakpoint
DROP INDEX "Category_slug_key";--> statement-breakpoint
DROP INDEX "Image_url_idx";--> statement-breakpoint
DROP INDEX "Image_url_key";--> statement-breakpoint
DROP INDEX "Like_toolId_idx";--> statement-breakpoint
DROP INDEX "Like_accountId_idx";--> statement-breakpoint
DROP INDEX "Like_toolId_accountId_key";--> statement-breakpoint
DROP INDEX "Tool_id_slug_idx";--> statement-breakpoint
DROP INDEX "Tool_descriptionSearch_idx";--> statement-breakpoint
DROP INDEX "Tool_slug_key";--> statement-breakpoint
ALTER TABLE `account` ALTER COLUMN "createdAt" TO "createdAt" integer;--> statement-breakpoint
CREATE INDEX `Alternative_slug_idx` ON `alternative` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `Alternative_slug_key` ON `alternative` (`slug`);--> statement-breakpoint
CREATE INDEX `alternatives_to_tools_toolId_idx` ON `alternatives_to_tools` (`tool_id`);--> statement-breakpoint
CREATE INDEX `alternatives_to_tools_alternativeId_idx` ON `alternatives_to_tools` (`alternative_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_slug_unique` ON `category` (`slug`);--> statement-breakpoint
CREATE INDEX `Category_slug_idx` ON `category` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `Category_slug_key` ON `category` (`slug`);--> statement-breakpoint
CREATE INDEX `Image_url_idx` ON `image` (`url`);--> statement-breakpoint
CREATE UNIQUE INDEX `Image_url_key` ON `image` (`url`);--> statement-breakpoint
CREATE INDEX `Like_toolId_idx` ON `like` (`toolId`);--> statement-breakpoint
CREATE INDEX `Like_accountId_idx` ON `like` (`accountId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Like_toolId_accountId_key` ON `like` (`toolId`,`accountId`);--> statement-breakpoint
CREATE INDEX `Tool_id_slug_idx` ON `tool` (`id`,`slug`);--> statement-breakpoint
CREATE INDEX `Tool_descriptionSearch_idx` ON `tool` (`descriptionSearch`);--> statement-breakpoint
CREATE UNIQUE INDEX `Tool_slug_key` ON `tool` (`slug`);--> statement-breakpoint
ALTER TABLE `account` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `alternative` ALTER COLUMN "createdAt" TO "createdAt" integer;--> statement-breakpoint
ALTER TABLE `image` ALTER COLUMN "createdAt" TO "createdAt" integer;--> statement-breakpoint
ALTER TABLE `like` ALTER COLUMN "createdAt" TO "createdAt" integer;--> statement-breakpoint
ALTER TABLE `tool` ALTER COLUMN "createdAt" TO "createdAt" integer;--> statement-breakpoint
ALTER TABLE `tool` ADD `tagline` text;