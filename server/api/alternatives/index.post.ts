/**
 * POST /api/alternatives
 * Create a new alternative
 */

import { AlternativeService } from "../../lib/services/alternative.service";
import { createAlternativeSchema } from "../../utils/validation";
import { validateBody, createSuccessResponse } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const body = await validateBody(event, createAlternativeSchema);
    const newAlternative = await AlternativeService.create(body);
    return createSuccessResponse(
      newAlternative,
      "Alternative created successfully"
    );
  } catch (error) {
    throw handleApiError(error, "createAlternative");
  }
});