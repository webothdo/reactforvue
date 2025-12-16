/**
 * POST /api/categories
 * Create a new category
 */

import { CategoryService } from "../../lib/services/category.service";
import { createCategorySchema } from "../../utils/validation";
import { validateBody, createSuccessResponse } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const body = await validateBody(event, createCategorySchema);
    const newCategory = await CategoryService.create(body);
    return createSuccessResponse(
      newCategory,
      "Category created successfully"
    );
  } catch (error) {
    throw handleApiError(error, "createCategory");
  }
});