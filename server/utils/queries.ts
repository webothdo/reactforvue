import { asc, or, ilike, eq, desc } from "drizzle-orm";
import { db } from "../lib/drizzle";
import { alternative, category, image, tool } from "../db/schema";

export const getToolBySlug = async ({ slug }: { slug: string }) => {
  const toolData = await db.query.tool.findFirst({
    where: eq(tool.slug, slug),
  });
  return { data: toolData };
};

export const getPaginatedAlternatives = async ({
  page = 1,
  limit = 20,
  q,
}: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const offset = (page - 1) * limit;

  // Always get the total count of all alternatives in the database
  const total = await db.$count(alternative);

  if (q) {
    // Fetch data with search filter
    const data = await db.query.alternative.findMany({
      where: or(
        ilike(alternative.name, `%${q}%`),
        ilike(alternative.description, `%${q}%`)
      ),
      orderBy: [desc(alternative.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  } else {
    // Fetch data without search filter
    const data = await db.query.alternative.findMany({
      orderBy: [desc(alternative.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  }
};

export const getPaginatedCategories = async ({
  page = 1,
  limit = 20,
  q,
}: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const offset = (page - 1) * limit;

  // Always get the total count of all categories in the database
  const total = await db.$count(category);

  if (q) {
    // Fetch data with search filter
    const data = await db.query.category.findMany({
      where: or(
        ilike(category.name, `%${q}%`),
        ilike(category.label, `%${q}%`)
      ),
      orderBy: [desc(category.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  } else {
    // Fetch data without search filter
    const data = await db.query.category.findMany({
      orderBy: [desc(category.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  }
};

export const getPaginatedTools = async ({
  page = 1,
  limit = 10,
  q,
}: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const offset = (page - 1) * limit;

  // Always get the total count of all tools in the database
  const total = await db.$count(tool);

  if (q) {
    // Fetch data with search filter
    const data = await db.query.tool.findMany({
      where: or(ilike(tool.name, `%${q}%`), ilike(tool.description, `%${q}%`)),
      orderBy: [desc(tool.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  } else {
    // Fetch data without search filter
    const data = await db.query.tool.findMany({
      orderBy: [desc(tool.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  }
};

export const getToolById = async (id: string) => {
  const toolData = await db.query.tool.findFirst({
    where: eq(tool.id, id),
  });
  return toolData;
};

export const getAlternativeById = async (id: string) => {
  const alternativeData = await db.query.alternative.findFirst({
    where: eq(alternative.id, id),
  });
  return alternativeData;
};

export const getCategoryById = async (id: string) => {
  const categoryData = await db.query.category.findFirst({
    where: eq(category.id, id),
  });
  return categoryData;
};

export const getImageById = async (id: string) => {
  const imageData = await db.query.image.findFirst({
    where: eq(image.id, id),
  });
  return imageData;
};

export const getPaginatedImages = async ({
  page = 1,
  limit = 20,
  q,
}: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const offset = (page - 1) * limit;

  // Always get the total count of all images in the database
  const total = await db.$count(image);

  if (q) {
    // Fetch data with search filter
    const data = await db.query.image.findMany({
      where: or(
        ilike(image.originalName, `%${q}%`),
        ilike(image.filename, `%${q}%`)
      ),
      orderBy: [desc(image.createdAt)],
      limit,
      offset,
    });
    return {
      data,
      total,
      page,
      pageSize: limit,
    };
  } else {
    // Fetch data without search filter
    const data = await db.query.image.findMany({
      orderBy: [desc(image.createdAt)],
      limit,
      offset,
    });
    return { data, total, page, pageSize: limit };
  }
};

// Legacy:
export const getAllCategories = async () => {
  const categories = await db.query.category.findMany({
    orderBy: [asc(category.name)],
  });
  return categories;
};

export const getAllImages = async () => {
  const images = await db.query.image.findMany({
    orderBy: [desc(image.createdAt)],
  });
  return images;
};
