/**
 * GET /api/tools/[id]
 * Get a single tool by ID
 */

import { ToolService } from "../../../lib/services/tool.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const tool = await ToolService.findById(id!);
    
    if (!tool) {
      throw createNotFoundError("Tool", `id ${id}`);
    }
    
    return createSuccessResponse(
      tool,
      "Tool retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getToolById");
  }
});