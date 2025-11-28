import { useFetch } from "#app";

/**
 * Composable for images API operations
 * @returns {Object} API methods for images
 */
export function useImagesApi() {
  /**
   * Create a new image
   * @param {Object} payload - Image data
   * @returns {Promise} API response
   */
  const createImage = async (payload: any) => {
    return await useFetch("/api/images", {
      method: "POST",
      body: payload,
    });
  };

  /**
   * Update an image
   * @param {string} id - Image ID
   * @param {Object} payload - Image data to update
   * @returns {Promise} API response
   */
  const updateImage = async (id: string, payload: any) => {
    return await useFetch(`/api/images/${id}`, {
      method: "PATCH",
      body: payload,
    });
  };

  /**
   * Delete an image
   * @param {string} id - Image ID
   * @returns {Promise} API response
   */
  const deleteImage = async (id: string) => {
    return await useFetch(`/api/images/${id}`, {
      method: "DELETE",
    });
  };

  /**
   * Get images with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.q] - Search query
   * @returns {Promise} API response
   */
  const getImages = async ({
    page = 1,
    limit = 20,
    q,
  }: { page?: number; limit?: number; q?: string } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (q) params.append("q", q);
    return await useFetch(`/api/images?${params.toString()}`);
  };

  return {
    createImage,
    updateImage,
    deleteImage,
    getImages,
  };
}
