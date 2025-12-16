/**
 * DELETE /api/alternatives/[id]
 * Delete an alternative by ID
 */

import { AlternativeService } from "../../../lib/services/alternative.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const result = await AlternativeService.delete(id!);
    
    if (!result) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }
    
    return createSuccessResponse(null, "Alternative deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteAlternative");
  }
});