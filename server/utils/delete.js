import { db } from "../lib/drizzle";
import { alternative, category, tool, image } from "../db/schema";

export async function deleteAlternative(id) {
  if (!id) throw new Error("Missing alternative id");
  const result = await db.delete(alternative).where(alternative.id.eq(id));
  if (result.rowCount === 0) throw new Error("Alternative not found");
  return true;
}

export async function deleteCategory(id) {
  if (!id) throw new Error("Missing category id");
  const result = await db.delete(category).where(category.id.eq(id));
  if (result.rowCount === 0) throw new Error("Category not found");
  return true;
}

export async function deleteTool(id) {
  if (!id) throw new Error("Missing tool id");
  const result = await db.delete(tool).where(tool.id.eq(id));
  if (result.rowCount === 0) throw new Error("Tool not found");
  return true;
}

export async function deleteImage(id) {
  if (!id) throw new Error("Missing image id");
  const result = await db.delete(image).where(image.id.eq(id));
  if (result.rowCount === 0) throw new Error("Image not found");
  return true;
}
