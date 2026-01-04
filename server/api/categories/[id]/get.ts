/**
 * GET /api/categories/[id]
 * Get a single category by ID
 */

import { CategoryService } from "../../../lib/services/category.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const category = await CategoryService.findById(id!);
    
    if (!category) {
      throw createNotFoundError("Category", `id ${id}`);
    }
    
    return createSuccessResponse(
      category,
      "Category retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getCategoryById");
  }
});