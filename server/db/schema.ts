import { sql, SQL } from "drizzle-orm";
import {
  sqliteTable,
  text,
  index,
  uniqueIndex,
  primaryKey,
  integer,
} from "drizzle-orm/sqlite-core";

import { nanoid } from "nanoid";

export const account = sqliteTable("account", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  image: text(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(
    () => sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const category = sqliteTable(
  "category",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text().notNull(),
    slug: text().notNull().unique(),
    label: text(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("Category_slug_idx").on(table.slug),
    uniqueIndex("Category_slug_key").on(table.slug),
  ]
);

export const tool = sqliteTable(
  "tool",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text().notNull(),
    slug: text().notNull(),
    websiteUrl: text().notNull(),
    screenshotUrl: text(),
    description: text(),
    faviconUrl: text(),
    content: text(),
    tagline: text(),
    isOpenSource: integer({ mode: "boolean" }).default(true).notNull(),
    isFeatured: integer({ mode: "boolean" }).default(false).notNull(),
    submitterName: text(),
    submitterEmail: text(),
    pageViews: integer().default(0),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
      () => sql`CURRENT_TIMESTAMP`
    ),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
    //Relations
    categoryId: text().references(() => category.id, { onDelete: "set null" }),
    accountId: text().references(() => account.id, { onDelete: "set null" }),
    //Search
    descriptionSearch: text(),
  },
  (table) => [
    index("Tool_id_slug_idx").on(table.id, table.slug),
    index("Tool_descriptionSearch_idx").on(table.descriptionSearch),
    uniqueIndex("Tool_slug_key").on(table.slug),
  ]
);

export const alternative = sqliteTable(
  "alternative",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text().notNull(),
    slug: text().notNull(),
    description: text(),
    websiteUrl: text().notNull(),
    faviconUrl: text(),
    isFeatured: integer({ mode: "boolean" }).default(false).notNull(),
    isOpenSource: integer({ mode: "boolean" }).default(true).notNull(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
      () => sql`CURRENT_TIMESTAMP`
    ),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("Alternative_slug_idx").on(table.slug),
    uniqueIndex("Alternative_slug_key").on(table.slug),
  ]
);

export const alternativesToTools = sqliteTable(
  "alternatives_to_tools",
  {
    alternativeId: text("alternative_id")
      .notNull()
      .references(() => alternative.id),
    toolId: text("tool_id")
      .notNull()
      .references(() => tool.id),
  },
  (table) => [
    index("alternatives_to_tools_toolId_idx").on(table.toolId),
    index("alternatives_to_tools_alternativeId_idx").on(table.alternativeId),
    primaryKey({
      columns: [table.alternativeId, table.toolId],
    }),
  ]
);

export const like = sqliteTable(
  "like",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
      () => sql`CURRENT_TIMESTAMP`
    ),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
    //Relations
    accountId: text().references(() => account.id, { onDelete: "cascade" }),
    toolId: text().references(() => tool.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("Like_toolId_idx").on(table.toolId),
    index("Like_accountId_idx").on(table.accountId),
    uniqueIndex("Like_toolId_accountId_key").on(table.toolId, table.accountId),
  ]
);

export const image = sqliteTable(
  "image",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    url: text().notNull(),
    thumbnailUrl: text(),
    fileId: text(),
    filename: text(),
    originalName: text(),
    size: integer(),
    mimeType: text(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
      () => sql`CURRENT_TIMESTAMP`
    ),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("Image_url_idx").on(table.url),
    uniqueIndex("Image_url_key").on(table.url),
  ]
);
