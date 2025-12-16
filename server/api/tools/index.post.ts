/**
 * POST /api/tools
 * Create a new tool
 */

import { ToolService } from "../../lib/services/tool.service";
import { createToolSchema } from "../../utils/validation";
import { validateBody, createSuccessResponse } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const body = await validateBody(event, createToolSchema);
    const newTool = await ToolService.create(body);
    return createSuccessResponse(
      newTool,
      "Tool created successfully"
    );
  } catch (error) {
    throw handleApiError(error, "createTool");
  }
});