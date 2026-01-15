/**
 * GET /api/tools/slug/[slug]
 * Get a single tool by slug
 */

import { ToolService } from "../../../../lib/services/tool.service";
import { createSuccessResponse } from "../../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    
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
    
    return createSuccessResponse(
      result.data,
      "Tool retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getToolBySlug");
  }
});