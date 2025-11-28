import {
  alternative,
  alternativesToTools,
  category,
  image,
  tool,
} from "../db/schema";
import { db } from "../lib/drizzle";
import {
  CreateAlternativeInput,
  CreateCategoryInput,
  CreateToolInput,
  CreateImageInput,
} from "../types";

export const insertTool = async (toolData: CreateToolInput) => {
  const newTool = await db.insert(tool).values(toolData).returning();
  return newTool[0];
};

export const insertAlternative = async (
  alternativeData: CreateAlternativeInput
) => {
  const newAlternative = await db
    .insert(alternative)
    .values(alternativeData)
    .returning();
  return newAlternative[0];
};

export const insertToolToAlternative = async (
  toolId: string,
  alternativeId: string
) => {
  const newToolToAlternative = await db
    .insert(alternativesToTools)
    .values({ toolId, alternativeId })
    .returning();
  return newToolToAlternative[0];
};

export const insertCategory = async (categoryData: CreateCategoryInput) => {
  const newCategory = await db
    .insert(category)
    .values(categoryData)
    .returning();
  return newCategory[0];
};

export const insertImage = async (imageData: CreateImageInput) => {
  const newImage = await db.insert(image).values(imageData).returning();
  return newImage[0];
};
