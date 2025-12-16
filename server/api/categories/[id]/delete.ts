/**
 * DELETE /api/categories/[id]
 * Delete a category by ID
 */

import { CategoryService } from "../../../lib/services/category.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const result = await CategoryService.delete(id!);
    
    if (!result) {
      throw createNotFoundError("Category", `id ${id}`);
    }
    
    return createSuccessResponse(null, "Category deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteCategory");
  }
});