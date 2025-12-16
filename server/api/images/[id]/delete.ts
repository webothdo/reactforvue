/**
 * DELETE /api/images/[id]
 * Delete an image by ID
 */

import { ImageService } from "../../../lib/services/image.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const result = await ImageService.delete(id!);
    
    if (!result) {
      throw createNotFoundError("Image", `id ${id}`);
    }
    
    return createSuccessResponse(null, "Image deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteImage");
  }
});