/**
 * Service layer for Categories business logic
 * Separates business logic from HTTP handling
 */

import { 
  insertCategory
} from "../../utils/insert";
import { 
  updateCategory
} from "../../utils/update";
import { 
  deleteCategory
} from "../../utils/delete";
import { 
  getPaginatedCategories, 
  getCategoryById 
} from "../../utils/queries";
import { 
  CreateCategoryInput, 
  UpdateCategoryInput, 
  PaginatedResponse 
} from "../../types";

export class CategoryService {
  /**
   * Create a new category
   */
  static async create(data: CreateCategoryInput) {
    return await insertCategory(data);
  }

  /**
   * Get paginated list of categories
   */
  static async findMany(params: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PaginatedResponse> {
    return await getPaginatedCategories({
      page: params.page || 1,
      limit: params.limit || 20,
      q: params.q,
    });
  }

  /**
   * Get category by ID
   */
  static async findById(id: string) {
    return await getCategoryById(id);
  }

  /**
   * Update category by ID
   */
  static async update(id: string, data: UpdateCategoryInput) {
    return await updateCategory(id, data);
  }

  /**
   * Delete category by ID
   */
  static async delete(id: string) {
    return await deleteCategory(id);
  }
}