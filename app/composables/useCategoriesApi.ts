import { useFetch } from "#app";

/**
 * Composable for categories API operations
 * @returns {Object} API methods for categories
 */
export function useCategoriesApi() {
  /**
   * Create a new category
   * @param {Object} payload - Category data
   * @returns {Promise} API response
   */
  const createCategory = async (payload: any) => {
    return await useFetch("/api/categories", {
      method: "POST",
      body: payload,
    });
  };

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {Object} payload - Category data to update
   * @returns {Promise} API response
   */
  const updateCategory = async (id: string, payload: any) => {
    return await useFetch(`/api/categories/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise} API response
   */
  const deleteCategory = async (id: string) => {
    return await useFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
  };

  /**
   * Get categories with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getCategories = async ({
    page = 1,
    limit = 20,
    q = "",
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/categories?${params.toString()}`);
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
  };
}
