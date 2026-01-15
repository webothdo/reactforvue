import { useFetch } from "#app";

/**
 * Composable for tools API operations
 * @returns {Object} API methods for tools
 */
export function useToolsApi() {
  /**
   * Create a new tool
   * @param {Object} payload - Tool data
   * @returns {Promise} API response
   */
  const createTool = async (payload: any) => {
    return await useFetch("/api/tools", {
      method: "POST",
      body: payload,
    });
  };

  /**
   * Update a tool
   * @param {string} id - Tool ID
   * @param {Object} payload - Tool data to update
   * @returns {Promise} API response
   */
  const updateTool = async (id: string, payload: any) => {
    return await useFetch(`/api/tools/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };

  /**
   * Delete a tool
   * @param {string} id - Tool ID
   * @returns {Promise} API response
   */
  const deleteTool = async (id: string) => {
    return await useFetch(`/api/tools/${id}`, {
      method: "DELETE",
    });
  };

  /**
   * Get tools with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getTools = async ({
    page = 1,
    limit = 20,
    q = "",
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/tools?${params.toString()}`, {
      watch: [() => page],
    });
  };

  /**
   * Get public tools with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getPublicTools = async ({
    page = 1,
    limit = 20,
    q = "",
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/public/tools?${params.toString()}`);
  };

  return {
    createTool,
    updateTool,
    deleteTool,
    getTools,
    getPublicTools,
  };
}
