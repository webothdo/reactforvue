import { z } from "zod";

export const idSchema = z.string().min(1, "ID is required");

export const createAlternativeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  websiteUrl: z.string().url("Invalid website URL"),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  isOpenSource: z.boolean().optional(),
});

export const updateAlternativeSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  isOpenSource: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  label: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  label: z.string().optional(),
});

export const createToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  websiteUrl: z.string().url("Invalid website URL"),
  description: z.string().optional(),
  content: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional(),
  categoryId: z.string().optional(),
  alternativeId: z.string().optional(),
  isOpenSource: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const updateToolSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  screenshotUrl: z.string().url().optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  content: z.string().optional(),
  isOpenSource: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional(),
  pageViews: z.number().optional(),
  categoryId: z.string().optional(),
});

export const createImageSchema = z.object({
  url: z.string().url("Invalid URL"),
  thumbnailUrl: z.string().url().optional(),
  fileId: z.string().optional(),
  filename: z.string().optional(),
  originalName: z.string().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

export const updateImageSchema = z.object({
  url: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  fileId: z.string().optional(),
  filename: z.string().optional(),
  originalName: z.string().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  q: z.string().trim().optional(),
});
