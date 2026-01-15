/**
 * GET /api/public/tools
 * List tools with pagination and optional search (public endpoint)
 */

import { paginationQuerySchema } from "~~/server/utils/validation";
import { validateQuery } from "~~/server/lib/utils/api";
import { handleApiError } from "~~/server/utils/errorHandler";
import { ToolService } from "~~/server/lib/services/tool.service";

export default defineEventHandler(async (event) => {
  try {
    const query = await validateQuery(event, paginationQuerySchema);
    const params = {
      page: query.page,
      limit: query.limit,
      q: query.q,
    };
    return await ToolService.findMany(params);
  } catch (error) {
    throw handleApiError(error, "getPublicTools");
  }
});
