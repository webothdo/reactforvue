/**
 * Shared utility functions for API operations
 */

import { createError } from "h3";
import { z } from "zod";

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): { success: boolean; data: T; message?: string } {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * Validate router parameter (ID)
 */
export async function validateId(id: string | undefined): Promise<string> {
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }
  return id;
}

/**
 * Validate request body with schema
 */
export async function validateBody<T>(
  event: any,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await readBody(event);
  const validation = schema.safeParse(body);
  if (!validation.success) {
    throw validation.error;
  }
  return validation.data;
}

/**
 * Validate query parameters with schema
 */
export async function validateQuery<T>(
  event: any,
  schema: z.ZodSchema<T>
): Promise<T> {
  const query = getQuery(event);
  const validation = schema.safeParse(query);
  if (!validation.success) {
    throw validation.error;
  }
  return validation.data;
}

/**
 * Extract pagination parameters with defaults
 */
export function extractPaginationParams(query: any): {
  page: number;
  limit: number;
  q?: string;
} {
  return {
    page: query.page ? parseInt(query.page) : 1,
    limit: query.limit ? Math.min(parseInt(query.limit), 100) : 20,
    q: query.q?.trim(),
  };
}