/**
 * PATCH /api/tools/[id]
 * Update a tool by ID
 */

import { ToolService } from "../../../lib/services/tool.service";
import { updateToolSchema } from "../../../utils/validation";
import { validateId, validateBody, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const body = await validateBody(event, updateToolSchema);
    
    const updatedTool = await ToolService.update(id!, body);
    
    if (!updatedTool) {
      throw createNotFoundError("Tool", `id ${id}`);
    }
    
    return createSuccessResponse(
      updatedTool,
      "Tool updated successfully"
    );
  } catch (error) {
    throw handleApiError(error, "updateTool");
  }
});