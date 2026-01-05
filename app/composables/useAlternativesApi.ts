import { useFetch } from "#app";

/**
 * Composable for alternatives API operations
 * @returns {Object} API methods for alternatives
 */
export function useAlternativesApi() {
  /**
   * Create a new alternative
   * @param {Object} payload - Alternative data
   * @returns {Promise} API response
   */
  const createAlternative = async (payload: any) => {
    return await useFetch("/api/alternatives", {
      method: "POST",
      body: payload,
    });
  };

  /**
   * Update an alternative
   * @param {string} id - Alternative ID
   * @param {Object} payload - Alternative data to update
   * @returns {Promise} API response
   */
  const updateAlternative = async (id: string, payload: any) => {
    return await useFetch(`/api/alternatives/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };

  /**
   * Delete an alternative
   * @param {string} id - Alternative ID
   * @returns {Promise} API response
   */
  const deleteAlternative = async (id: string) => {
    return await useFetch(`/api/alternatives/${id}`, {
      method: "DELETE",
    });
  };

  /**
   * Get alternatives with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getAlternatives = async ({
    page = 1,
    limit = 20,
    q = "",
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/alternatives?${params.toString()}`);
  };

  /**
   * Get public alternatives with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getPublicAlternatives = async ({
    page = 1,
    limit = 20,
    q = "",
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/public/alternatives?${params.toString()}`);
  };

  return {
    createAlternative,
    updateAlternative,
    deleteAlternative,
    getAlternatives,
    getPublicAlternatives,
  };
}
