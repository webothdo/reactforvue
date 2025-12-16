/**
 * GET /api/images
 * List images with pagination and optional search
 */

import { ImageService } from "../../lib/services/image.service";
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
    return await ImageService.findMany(params);
  } catch (error) {
    throw handleApiError(error, "getImages");
  }
});