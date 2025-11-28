import { relations } from "drizzle-orm/relations";
import {
  category,
  tool,
  alternative,
  alternativesToTools,
  account,
  like,
} from "./schema";

export const toolRelations = relations(tool, ({ one, many }) => ({
  account: one(account, {
    fields: [tool.accountId],
    references: [account.id],
  }),
  category: one(category, {
    fields: [tool.categoryId],
    references: [category.id],
  }),
  alternativesToTools: many(alternativesToTools),
  likes: many(like),
}));

export const alternativeRelations = relations(alternative, ({ many }) => ({
  alternativesToTools: many(alternativesToTools),
}));

export const alternativesToToolsRelations = relations(
  alternativesToTools,
  ({ one }) => ({
    alternativeRel: one(alternative, {
      fields: [alternativesToTools.alternativeId],
      references: [alternative.id],
    }),
    toolRel: one(tool, {
      fields: [alternativesToTools.toolId],
      references: [tool.id],
    }),
  })
);

export const categoryRelations = relations(category, ({ many }) => ({
  tools: many(tool),
}));

export const accountRelations = relations(account, ({ many }) => ({
  tools: many(tool),
  likes: many(like),
}));

export const likeRelations = relations(like, ({ one }) => ({
  account: one(account, {
    fields: [like.accountId],
    references: [account.id],
  }),
  tool: one(tool, {
    fields: [like.toolId],
    references: [tool.id],
  }),
}));
