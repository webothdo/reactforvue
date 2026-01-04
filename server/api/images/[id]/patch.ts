/**
 * PATCH /api/images/[id]
 * Update an image by ID
 */

import { ImageService } from "../../../lib/services/image.service";
import { updateImageSchema } from "../../../utils/validation";
import { validateId, validateBody, createSuccessResponse } from "../../../lib/utils/api";
import { createNotFoundError, handleApiError } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    await validateId(id);
    
    const body = await validateBody(event, updateImageSchema);
    
    const updatedImage = await ImageService.update(id!, body);
    
    if (!updatedImage) {
      throw createNotFoundError("Image", `id ${id}`);
    }
    
    return createSuccessResponse(
      updatedImage,
      "Image updated successfully"
    );
  } catch (error) {
    throw handleApiError(error, "updateImage");
  }
});