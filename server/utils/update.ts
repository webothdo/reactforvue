/**
 * Update utility functions for database operations
 */
import { alternative, category, image, tool } from "../db/schema";
import { db } from "../lib/drizzle";
import { eq } from "drizzle-orm";
import {
  UpdateAlternativeInput,
  UpdateCategoryInput,
  UpdateToolInput,
  UpdateImageInput,
} from "../types";

export const updateTool = async (id: string, toolData: UpdateToolInput) => {
  const updatedTool = await db
    .update(tool)
    .set(toolData)
    .where(eq(tool.id, id))
    .returning();
  return updatedTool[0];
};

export const updateAlternative = async (
  id: string,
  alternativeData: UpdateAlternativeInput
) => {
  const updatedAlternative = await db
    .update(alternative)
    .set(alternativeData)
    .where(eq(alternative.id, id))
    .returning();
  return updatedAlternative[0];
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryInput
) => {
  const updatedCategory = await db
    .update(category)
    .set(categoryData)
    .where(eq(category.id, id))
    .returning();
  return updatedCategory[0];
};

export const updateImage = async (id: string, imageData: UpdateImageInput) => {
  const updatedImage = await db
    .update(image)
    .set(imageData)
    .where(eq(image.id, id))
    .returning();
  return updatedImage[0];
};
