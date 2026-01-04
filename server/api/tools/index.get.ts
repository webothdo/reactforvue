/**
 * GET /api/tools
 * List tools with pagination and optional search
 * Also supports single tool retrieval by slug parameter
 */

import { ToolService } from "../../lib/services/tool.service";
import { paginationQuerySchema } from "../../utils/validation";
import { validateQuery, createSuccessResponse } from "../../lib/utils/api";
import { handleApiError, createNotFoundError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const query = await validateQuery(event, paginationQuerySchema);
    
    // Check if this is a request for a specific tool by slug
    if (query.slug) {
      const tool = await ToolService.findBySlug(query.slug);
      if (!tool.data) {
        throw createNotFoundError("Tool", `slug ${query.slug}`);
      }
      return createSuccessResponse(tool.data, "Tool retrieved successfully");
    }
    
    // Otherwise, treat as paginated list request
    const params = {
      page: query.page,
      limit: query.limit,
      q: query.q,
    };
    return await ToolService.findMany(params);
  } catch (error) {
    throw handleApiError(error, "getTools");
  }
});