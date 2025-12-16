/**
 * GET /api/images/[id]
 * Get a single image by ID
 */

import { ImageService } from "../../../lib/services/image.service";
import { validateId, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const image = await ImageService.findById(id!);
    
    if (!image) {
      throw createNotFoundError("Image", `id ${id}`);
    }
    
    return createSuccessResponse(
      image,
      "Image retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getImageById");
  }
});