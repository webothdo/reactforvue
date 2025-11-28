/**
 * RESTful API endpoints for categories
 * Provides CRUD operations for categories resource
 *
 * @apiDefine CategoryResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} [message] Optional success message
 *
 * @apiDefine CategoryPaginationResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object[]} data Array of categories
 * @apiSuccess {Number} total Total number of categories
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pageSize Number of items per page
 * @apiSuccess {String} [message] Optional success message
 */

import { defineEventHandler, createError } from "h3";
import { z } from "zod";
import {
  createCategorySchema,
  updateCategorySchema,
  idSchema,
  paginationQuerySchema,
} from "../utils/validation";
import { insertCategory } from "../utils/insert";
import { updateCategory } from "../utils/update";
import { deleteCategory } from "../utils/delete";
import { getPaginatedCategories, getCategoryById } from "../utils/queries";
import { ApiResponse, PaginatedResponse, Category } from "../types";
import {
  handleApiError,
  createSuccessResponse,
  createNotFoundError,
} from "../utils/errorHandler";

/**
 * @api {post} /api/categories Create a new category
 * @param {CreateCategoryInput} body - Category data
 * @returns {ApiResponse<Category>} Created category
 */
/**
 * @api {post} /api/categories Create a new category
 * @apiName CreateCategory
 * @apiGroup Categories
 * @apiDescription Create a new category with the provided data
 *
 * @apiBody {String} name Category name (required)
 * @apiBody {String} slug Category slug (required)
 * @apiBody {String} [label] Category label
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Created category object
 */
export const createCategoryHandler = defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate input
    const validation = createCategorySchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const newCategory = await insertCategory(validation.data);
    return createSuccessResponse(newCategory, "Category created successfully");
  } catch (error) {
    throw handleApiError(error, "createCategory");
  }
});

/**
 * @api {get} /api/categories List categories with pagination
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Items per page
 * @param {string} [q] - Search query
 * @returns {PaginatedResponse<Category>} Paginated list of categories
 */
/**
 * @api {get} /api/categories List categories with pagination
 * @apiName GetCategories
 * @apiGroup Categories
 * @apiDescription Get a paginated list of categories, optionally filtered by search query
 *
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [limit=20] Items per page (max 100)
 * @apiParam {String} [q] Search query to filter categories by name or label
 *
 * @apiUse AlternativePaginationResponse
 */
export const getCategoriesHandler = defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Validate query parameters
    const validation = paginationQuerySchema.safeParse(query);
    if (!validation.success) {
      throw validation.error;
    }

    const result = await getPaginatedCategories({
      page: validation.data.page,
      limit: validation.data.limit,
      q: validation.data.q || undefined,
    });
    return result;
  } catch (error) {
    throw handleApiError(error, "getCategories");
  }
});

/**
 * @api {get} /api/categories/:id Get a single category by ID
 * @param {string} id - Category ID
 * @returns {ApiResponse<Category>} Category data
 */
/**
 * @api {get} /api/categories/:id Get a single category
 * @apiName GetCategory
 * @apiGroup Categories
 * @apiDescription Get a single category by ID
 *
 * @apiParam {String} id Category ID
 *
 * @apiUse AlternativeResponse
 * @apiSuccess {Object} data Single category object
 */
export const getCategoryByIdHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const category = await getCategoryById(id as string);

    if (!category) {
      throw createNotFoundError("Category", `id ${id}`);
    }

    return createSuccessResponse(category, "Category retrieved successfully");
  } catch (error) {
    throw handleApiError(error, "getCategoryById");
  }
});

/**
 * @api {patch} /api/categories/:id Update a category
 * @param {string} id - Category ID
 * @param {UpdateCategoryInput} body - Category data to update
 * @returns {ApiResponse<Category>} Updated category
 */
export const updateCategoryHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  // Validate ID
  const idValidation = idSchema.safeParse(id);
  if (!idValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: idValidation.error.errors[0].message,
    });
  }

  // Validate input
  const bodyValidation = updateCategorySchema.safeParse(body);
  if (!bodyValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: bodyValidation.error.errors[0].message,
    });
  }

  try {
    const updatedCategory = await updateCategory(
      id as string,
      bodyValidation.data
    );

    return {
      success: true,
      data: updatedCategory,
    } as ApiResponse<Category>;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error updating category: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
});

/**
 * @api {delete} /api/categories/:id Delete a category
 * @param {string} id - Category ID
 * @returns {ApiResponse} Success status
 */
export const deleteCategoryHandler = defineEventHandler(async (event) => {
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
    await deleteCategory(id as string);

    return {
      success: true,
      message: "Category deleted successfully",
    } as ApiResponse;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error deleting category: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
});

// Export handlers for individual HTTP methods
export default defineEventHandler((event) => {
  const method = event.method;

  switch (method) {
    case "POST":
      return createCategoryHandler(event);
    case "GET":
      // Check if this is a request for a specific category
      if (event.context.params?.id) {
        return getCategoryByIdHandler(event);
      } else {
        return getCategoriesHandler(event);
      }
    case "PATCH":
      return updateCategoryHandler(event);
    case "DELETE":
      return deleteCategoryHandler(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
