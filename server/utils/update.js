import { db } from "../lib/drizzle";
import { alternative, category, tool, image } from "../db/schema";

export async function updateAlternative(id, data) {
  if (!id) throw new Error("Missing alternative id");
  const result = await db
    .update(alternative)
    .set(data)
    .where(alternative.id.eq(id));
  if (result.rowCount === 0) throw new Error("Alternative not found");
  return result;
}

export async function updateCategory(id, data) {
  if (!id) throw new Error("Missing category id");
  const result = await db.update(category).set(data).where(category.id.eq(id));
  if (result.rowCount === 0) throw new Error("Category not found");
  return result;
}

export async function updateTool(id, data) {
  if (!id) throw new Error("Missing tool id");
  const result = await db.update(tool).set(data).where(tool.id.eq(id));
  if (result.rowCount === 0) throw new Error("Tool not found");
  return result;
}

export async function updateImage(id, data) {
  if (!id) throw new Error("Missing image id");
  const result = await db.update(image).set(data).where(image.id.eq(id));
  if (result.rowCount === 0) throw new Error("Image not found");
  return result;
}
