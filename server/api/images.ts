/**
 * RESTful API endpoints for images
 * Provides CRUD operations for images resource
 *
 * @apiDefine ImageResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} [message] Optional success message
 *
 * @apiDefine ImagePaginationResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object[]} data Array of images
 * @apiSuccess {Number} total Total number of images
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pageSize Number of items per page
 * @apiSuccess {String} [message] Optional success message
 */

import { defineEventHandler, createError } from "h3";
import { z } from "zod";
import {
  createImageSchema,
  updateImageSchema,
  idSchema,
  paginationQuerySchema,
} from "../utils/validation";
import { insertImage } from "../utils/insert";
import { updateImage } from "../utils/update";
import { deleteImage } from "../utils/delete";
import { getPaginatedImages, getImageById } from "../utils/queries";
import { ApiResponse, PaginatedResponse, Image } from "../types";
import {
  handleApiError,
  createSuccessResponse,
  createNotFoundError,
} from "../utils/errorHandler";

/**
 * @api {post} /api/images Create a new image
 * @param {CreateImageInput} body - Image data
 * @returns {ApiResponse<Image>} Created image
 */
/**
 * @api {post} /api/images Create a new image
 * @apiName CreateImage
 * @apiGroup Images
 * @apiDescription Create a new image with the provided data
 *
 * @apiBody {String} url Image URL (required)
 * @apiBody {String} [thumbnailUrl] Image thumbnail URL
 * @apiBody {String} [fileId] Image file ID
 * @apiBody {String} [filename] Image filename
 * @apiBody {String} [originalName] Original image name
 * @apiBody {Number} [size] Image size in bytes
 * @apiBody {String} [mimeType] Image MIME type
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Created image object
 */
export const createImageHandler = defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate input
    const validation = createImageSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const newImage = await insertImage(validation.data);
    return createSuccessResponse(newImage, "Image created successfully");
  } catch (error) {
    throw handleApiError(error, "createImage");
  }
});

/**
 * @api {get} /api/images List images with pagination
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Items per page
 * @param {string} [q] - Search query
 * @returns {PaginatedResponse<Image>} Paginated list of images
 */
/**
 * @api {get} /api/images List images with pagination
 * @apiName GetImages
 * @apiGroup Images
 * @apiDescription Get a paginated list of images, optionally filtered by search query
 *
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [limit=20] Items per page (max 100)
 * @apiParam {String} [q] Search query to filter images by original name or filename
 *
 * @apiUse AlternativePaginationResponse
 */
export const getImagesHandler = defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Validate query parameters
    const validation = paginationQuerySchema.safeParse(query);
    if (!validation.success) {
      throw validation.error;
    }

    const result = await getPaginatedImages({
      page: validation.data.page,
      limit: validation.data.limit,
      q: validation.data.q || undefined,
    });
    return result;
  } catch (error) {
    throw handleApiError(error, "getImages");
  }
});

/**
 * @api {get} /api/images/:id Get a single image by ID
 * @param {string} id - Image ID
 * @returns {ApiResponse<Image>} Image data
 */
/**
 * @api {get} /api/images/:id Get a single image
 * @apiName GetImage
 * @apiGroup Images
 * @apiDescription Get a single image by ID
 *
 * @apiParam {String} id Image ID
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Single image object
 */
export const getImageByIdHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const image = await getImageById(id as string);

    if (!image) {
      throw createNotFoundError("Image", `id ${id}`);
    }

    return createSuccessResponse(image, "Image retrieved successfully");
  } catch (error) {
    throw handleApiError(error, "getImageById");
  }
});

/**
 * @api {patch} /api/images/:id Update an image
 * @param {string} id - Image ID
 * @param {UpdateImageInput} body - Image data to update
 * @returns {ApiResponse<Image>} Updated image
 */
/**
 * @api {patch} /api/images/:id Update an image
 * @apiName UpdateImage
 * @apiGroup Images
 * @apiDescription Update an existing image with the provided data
 *
 * @apiParam {String} id Image ID
 *
 * @apiBody {String} [url] Image URL
 * @apiBody {String} [thumbnailUrl] Image thumbnail URL
 * @apiBody {String} [fileId] Image file ID
 * @apiBody {String} [filename] Image filename
 * @apiBody {String} [originalName] Original image name
 * @apiBody {Number} [size] Image size in bytes
 * @apiBody {String} [mimeType] Image MIME type
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Updated image object
 */
export const updateImageHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    // Validate input
    const bodyValidation = updateImageSchema.safeParse(body);
    if (!bodyValidation.success) {
      throw bodyValidation.error;
    }

    const updatedImage = await updateImage(id as string, bodyValidation.data);

    if (!updatedImage) {
      throw createNotFoundError("Image", `id ${id}`);
    }

    return createSuccessResponse(updatedImage, "Image updated successfully");
  } catch (error) {
    throw handleApiError(error, "updateImage");
  }
});

/**
 * @api {delete} /api/images/:id Delete an image
 * @param {string} id - Image ID
 * @returns {ApiResponse} Success status
 */
export const deleteImageHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  // Validate ID
  const idValidation = idSchema.safeParse(id);
  if (!idValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: idValidation.error.errors[0].message,
    });
  }

  try {
    await deleteImage(id as string);

    return {
      success: true,
      message: "Image deleted successfully",
    } as ApiResponse;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error deleting image: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
});

// Export handlers for individual HTTP methods
export default defineEventHandler((event) => {
  const method = event.method;

  switch (method) {
    case "POST":
      return createImageHandler(event);
    case "GET":
      // Check if this is a request for a specific image
      if (event.context.params?.id) {
        return getImageByIdHandler(event);
      } else {
        return getImagesHandler(event);
      }
    case "PATCH":
      return updateImageHandler(event);
    case "DELETE":
      return deleteImageHandler(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
