/**
 * GET /api/alternatives/[id]
 * Get a single alternative by ID
 */

import { AlternativeService } from "../../../lib/services/alternative.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const alternative = await AlternativeService.findById(id!);
    
    if (!alternative) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }
    
    return createSuccessResponse(
      alternative,
      "Alternative retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getAlternativeById");
  }
});