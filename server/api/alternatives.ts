/**
 * RESTful API endpoints for alternatives
 * Provides CRUD operations for alternatives resource
 *
 * @apiDefine AlternativeResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} [message] Optional success message
 *
 * @apiDefine AlternativePaginationResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object[]} data Array of alternatives
 * @apiSuccess {Number} total Total number of alternatives
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pageSize Number of items per page
 * @apiSuccess {String} [message] Optional success message
 */

import { defineEventHandler, createError } from "h3";
import { z } from "zod";
import {
  createAlternativeSchema,
  updateAlternativeSchema,
  idSchema,
  paginationQuerySchema,
} from "../utils/validation";
import { insertAlternative } from "../utils/insert";
import { updateAlternative } from "../utils/update";
import { deleteAlternative } from "../utils/delete";
import { getPaginatedAlternatives, getAlternativeById } from "../utils/queries";
import { ApiResponse, PaginatedResponse, Alternative } from "../types";
import {
  handleApiError,
  createSuccessResponse,
  createNotFoundError,
} from "../utils/errorHandler";

/**
 * @api {post} /api/alternatives Create a new alternative
 * @param {CreateAlternativeInput} body - Alternative data
 * @returns {ApiResponse<Alternative>} Created alternative
 */
/**
 * @api {post} /api/alternatives Create a new alternative
 * @apiName CreateAlternative
 * @apiGroup Alternatives
 * @apiDescription Create a new alternative with the provided data
 *
 * @apiBody {String} name Alternative name (required)
 * @apiBody {String} slug Alternative slug (required)
 * @apiBody {String} websiteUrl Alternative website URL (required)
 * @apiBody {String} [description] Alternative description
 * @apiBody {String} [faviconUrl] Alternative favicon URL
 * @apiBody {Boolean} [isFeatured] Whether alternative is featured
 * @apiBody {Boolean} [isOpenSource] Whether alternative is open source
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Created alternative object
 *
 * @apiError {Object} 400 Validation error with details
 * @apiError {Object} 500 Internal server error
 */
export const createAlternativeHandler = defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate input
    const validation = createAlternativeSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const newAlternative = await insertAlternative(validation.data);
    return createSuccessResponse(
      newAlternative,
      "Alternative created successfully"
    );
  } catch (error) {
    throw handleApiError(error, "createAlternative");
  }
});

/**
 * @api {get} /api/alternatives List alternatives with pagination
 * @apiName GetAlternatives
 * @apiGroup Alternatives
 * @apiDescription Get a paginated list of alternatives, optionally filtered by search query
 *
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [limit=20] Items per page (max 100)
 * @apiParam {String} [q] Search query to filter alternatives by name or description
 *
 * @apiUse AlternativePaginationResponse
 *
 * @apiError {Object} 400 Validation error with details
 * @apiError {Object} 500 Internal server error
 */
export const getAlternativesHandler = defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Validate query parameters
    const validation = paginationQuerySchema.safeParse(query);
    if (!validation.success) {
      throw validation.error;
    }

    const result = await getPaginatedAlternatives({
      page: validation.data.page,
      limit: validation.data.limit,
      q: validation.data.q || undefined,
    });
    return result;
  } catch (error) {
    throw handleApiError(error, "getAlternatives");
  }
});

/**
 * @api {get} /api/alternatives/:id Get a single alternative
 * @apiName GetAlternative
 * @apiGroup Alternatives
 * @apiDescription Get a single alternative by ID
 *
 * @apiParam {String} id Alternative ID
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Single alternative object
 *
 * @apiError {Object} 400 Invalid ID format
 * @apiError {Object} 404 Alternative not found
 * @apiError {Object} 500 Internal server error
 */
export const getAlternativeByIdHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const alternative = await getAlternativeById(id as string);

    if (!alternative) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }

    return createSuccessResponse(
      alternative,
      "Alternative retrieved successfully"
    );
  } catch (error) {
    throw handleApiError(error, "getAlternativeById");
  }
});

/**
 * @api {patch} /api/alternatives/:id Update an alternative
 * @apiName UpdateAlternative
 * @apiGroup Alternatives
 * @apiDescription Update an existing alternative with the provided data
 *
 * @apiParam {String} id Alternative ID
 *
 * @apiBody {String} [name] Alternative name
 * @apiBody {String} [slug] Alternative slug
 * @apiBody {String} [websiteUrl] Alternative website URL
 * @apiBody {String} [description] Alternative description
 * @apiBody {String} [faviconUrl] Alternative favicon URL
 * @apiBody {Boolean} [isFeatured] Whether alternative is featured
 * @apiBody {Boolean} [isOpenSource] Whether alternative is open source
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Updated alternative object
 *
 * @apiError {Object} 400 Validation error with details
 * @apiError {Object} 404 Alternative not found
 * @apiError {Object} 500 Internal server error
 */
export const updateAlternativeHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    // Validate input
    const bodyValidation = updateAlternativeSchema.safeParse(body);
    if (!bodyValidation.success) {
      throw bodyValidation.error;
    }

    const updatedAlternative = await updateAlternative(
      id as string,
      bodyValidation.data
    );

    if (!updatedAlternative) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }

    return createSuccessResponse(
      updatedAlternative,
      "Alternative updated successfully"
    );
  } catch (error) {
    throw handleApiError(error, "updateAlternative");
  }
});

/**
 * @api {delete} /api/alternatives/:id Delete an alternative
 * @apiName DeleteAlternative
 * @apiGroup Alternatives
 * @apiDescription Delete an alternative by ID
 *
 * @apiParam {String} id Alternative ID
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {String} [message] Success message
 *
 * @apiError {Object} 400 Invalid ID format
 * @apiError {Object} 404 Alternative not found
 * @apiError {Object} 500 Internal server error
 */
export const deleteAlternativeHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const result = await deleteAlternative(id as string);

    if (!result) {
      throw createNotFoundError("Alternative", `id ${id}`);
    }

    return createSuccessResponse(null, "Alternative deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteAlternative");
  }
});

// Export handlers for individual HTTP methods
export default defineEventHandler((event) => {
  const method = event.method;

  switch (method) {
    case "POST":
      return createAlternativeHandler(event);
    case "GET":
      // Check if this is a request for a specific alternative
      if (event.context.params?.id) {
        return getAlternativeByIdHandler(event);
      } else {
        return getAlternativesHandler(event);
      }
    case "PATCH":
      return updateAlternativeHandler(event);
    case "DELETE":
      return deleteAlternativeHandler(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
