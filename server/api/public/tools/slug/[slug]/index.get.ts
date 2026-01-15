/**
 * GET /api/tools/slug/[slug]
 * Get a single tool by slug
 */

import { ToolService } from "~~/server/lib/services/tool.service";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Slug is required",
      });
    }

    const result = await ToolService.findBySlug(slug!);
    if (!result.data) {
      throw createNotFoundError("Tool", `slug ${slug}`);
    }

    return createSuccessResponse(result.data, "Tool retrieved successfully");
  } catch (error) {
    throw handleApiError(error, "getToolBySlug");
  }
});
