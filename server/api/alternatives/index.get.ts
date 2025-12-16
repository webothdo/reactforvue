/**
 * GET /api/alternatives
 * List alternatives with pagination and optional search
 */

import { AlternativeService } from "../../lib/services/alternative.service";
import { paginationQuerySchema } from "../../utils/validation";
import { validateQuery } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

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