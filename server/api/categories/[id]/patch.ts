/**
 * PATCH /api/categories/[id]
 * Update a category by ID
 */

import { CategoryService } from "../../../lib/services/category.service";
import { updateCategorySchema } from "../../../utils/validation";
import { validateId, validateBody, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const body = await validateBody(event, updateCategorySchema);
    
    const updatedCategory = await CategoryService.update(id!, body);
    
    if (!updatedCategory) {
      throw createNotFoundError("Category", `id ${id}`);
    }
    
    return createSuccessResponse(
      updatedCategory,
      "Category updated successfully"
    );
  } catch (error) {
    throw handleApiError(error, "updateCategory");
  }
});