/**
 * PATCH /api/alternatives/[id]
 * Update an alternative by ID
 */

import { AlternativeService } from "../../../lib/services/alternative.service";
import { updateAlternativeSchema } from "../../../utils/validation";
import { validateId, validateBody, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const body = await validateBody(event, updateAlternativeSchema);
    
    const updatedAlternative = await AlternativeService.update(id!, body);
    
    if (!updatedAlternative) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }
    
    return createSuccessResponse(
      updatedAlternative,
      "Alternative updated successfully"
    );
  } catch (error) {
    throw handleApiError(error, "updateAlternative");
  }
});