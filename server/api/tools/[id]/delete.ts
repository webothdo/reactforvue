/**
 * DELETE /api/tools/[id]
 * Delete a tool by ID
 */

import { ToolService } from "../../../lib/services/tool.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const result = await ToolService.delete(id!);
    
    if (!result) {
      throw createNotFoundError("Tool", `id ${id}`);
    }
    
    return createSuccessResponse(null, "Tool deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteTool");
  }
});