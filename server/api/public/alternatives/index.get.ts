/**
 * GET /api/alternatives
 * List alternatives with pagination and optional search
 */

import { paginationQuerySchema } from "~~/server/utils/validation";
import { validateQuery } from "~~/server/lib/utils/api";
import { handleApiError } from "~~/server/utils/errorHandler";
import { AlternativeService } from "~~/server/lib/services/alternative.service";

export default defineEventHandler(async (event) => {
  try {
    const query = await validateQuery(event, paginationQuerySchema);
    const params = {
      page: query.page,
      limit: query.limit,
      q: query.q,
    };
    return await AlternativeService.findMany(params);
  } catch (error) {
    throw handleApiError(error, "getAlternatives");
  }
});
