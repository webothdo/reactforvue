/**
 * Delete utility functions for database operations
 */
import {
  alternative,
  alternativesToTools,
  category,
  image,
  tool,
} from "../db/schema";
import { db } from "../lib/drizzle";
import { eq } from "drizzle-orm";

export const deleteTool = async (id: string) => {
  await db.delete(tool).where(eq(tool.id, id));
  return { success: true };
};

export const deleteAlternative = async (id: string) => {
  await db.delete(alternative).where(eq(alternative.id, id));
  return { success: true };
};

export const deleteCategory = async (id: string) => {
  await db.delete(category).where(eq(category.id, id));
  return { success: true };
};

export const deleteImage = async (id: string) => {
  await db.delete(image).where(eq(image.id, id));
  return { success: true };
};

export const deleteToolToAlternative = async (
  toolId: string,
  alternativeId: string
) => {
  await db
    .delete(alternativesToTools)
    .where(
      eq(alternativesToTools.toolId, toolId) &&
        eq(alternativesToTools.alternativeId, alternativeId)
    );
  return { success: true };
};
