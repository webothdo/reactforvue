/**
 * POST /api/images
 * Create a new image
 */

import { ImageService } from "../../lib/services/image.service";
import { createImageSchema } from "../../utils/validation";
import { validateBody, createSuccessResponse } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const body = await validateBody(event, createImageSchema);
    const newImage = await ImageService.create(body);
    return createSuccessResponse(
      newImage,
      "Image created successfully"
    );
  } catch (error) {
    throw handleApiError(error, "createImage");
  }
});