/**
 * RESTful API endpoints for tools
 * Provides CRUD operations for tools resource
 *
 * @apiDefine ToolResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} [message] Optional success message
 *
 * @apiDefine ToolPaginationResponse
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object[]} data Array of tools
 * @apiSuccess {Number} total Total number of tools
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pageSize Number of items per page
 * @apiSuccess {String} [message] Optional success message
 */

import { defineEventHandler, createError } from "h3";
import { z } from "zod";
import {
  createToolSchema,
  updateToolSchema,
  idSchema,
  paginationQuerySchema,
} from "../utils/validation";
import { insertTool, insertToolToAlternative } from "../utils/insert";
import { updateTool } from "../utils/update";
import { deleteTool } from "../utils/delete";
import {
  getPaginatedTools,
  getToolById,
  getToolBySlug,
} from "../utils/queries";
import { ApiResponse, PaginatedResponse, Tool } from "../types";
import {
  handleApiError,
  createSuccessResponse,
  createNotFoundError,
} from "../utils/errorHandler";

/**
 * @api {post} /api/tools Create a new tool
 * @apiName CreateTool
 * @apiGroup Tools
 * @apiDescription Create a new tool with the provided data
 *
 * @apiBody {String} name Tool name (required)
 * @apiBody {String} slug Tool slug (required)
 * @apiBody {String} websiteUrl Tool website URL (required)
 * @apiBody {String} [description] Tool description
 * @apiBody {String} [content] Tool content
 * @apiBody {String} [screenshotUrl] Tool screenshot URL
 * @apiBody {String} [submitterName] Submitter name
 * @apiBody {String} [submitterEmail] Submitter email
 * @apiBody {String} [categoryId] Category ID
 * @apiBody {String} [alternativeId] Alternative ID
 * @apiBody {Boolean} [isOpenSource] Whether tool is open source
 * @apiBody {Boolean} [isFeatured] Whether tool is featured
 *
 * @apiUse ToolResponse
 * @apiSuccess {Object} data Created tool object
 */
export const createToolHandler = defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate input
    const validation = createToolSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const newTool = await insertTool(validation.data);

    // Handle the alternativeId if it's present
    if (validation.data.alternativeId) {
      await insertToolToAlternative(newTool.id, validation.data.alternativeId);
    }

    return createSuccessResponse(newTool, "Tool created successfully");
  } catch (error) {
    throw handleApiError(error, "createTool");
  }
});

/**
 * @api {get} /api/tools List tools with pagination
 * @apiName GetTools
 * @apiGroup Tools
 * @apiDescription Get a paginated list of tools, optionally filtered by search query
 *
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [limit=20] Items per page (max 100)
 * @apiParam {String} [q] Search query to filter tools by name or description
 *
 * @apiUse ToolPaginationResponse
 */
export const getToolsHandler = defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Validate query parameters
    const validation = paginationQuerySchema.safeParse(query);
    if (!validation.success) {
      throw validation.error;
    }

    const result = await getPaginatedTools({
      page: validation.data.page,
      limit: validation.data.limit,
      q: validation.data.q || undefined,
    });
    return result;
  } catch (error) {
    throw handleApiError(error, "getTools");
  }
});

/**
 * @api {get} /api/tools/:id Get a single tool
 * @apiName GetTool
 * @apiGroup Tools
 * @apiDescription Get a single tool by ID
 *
 * @apiParam {String} id Tool ID
 *
 * @apiUse ToolResponse
 * @apiSuccess {Object} data Single tool object
 */
export const getToolByIdHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const tool = await getToolById(id as string);

    if (!tool) {
      throw createNotFoundError("Tool", `id ${id}`);
    }

    return createSuccessResponse(tool, "Tool retrieved successfully");
  } catch (error) {
    throw handleApiError(error, "getToolById");
  }
});

/**
 * @api {get} /api/tools/slug/:slug Get a single tool by slug
 * @param {string} slug - Tool slug
 * @returns {ApiResponse<Tool>} Tool data
 */
/**
 * @api {get} /api/tools/slug/:slug Get a single tool by slug
 * @apiName GetToolBySlug
 * @apiGroup Tools
 * @apiDescription Get a single tool by slug
 *
 * @apiParam {String} slug Tool slug
 *
 * @apiUse ToolResponse
 * @apiSuccess {Object} data Single tool object
 */
export const getToolBySlugHandler = defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  try {
    const result = await getToolBySlug({ slug: slug as string });
    if (!result.data) {
      throw createNotFoundError("Tool", `slug ${slug}`);
    }

    return createSuccessResponse(result.data, "Tool retrieved successfully");
  } catch (error) {
    throw handleApiError(error, "getToolBySlug");
  }
});

/**
 * @api {patch} /api/tools/:id Update a tool
 * @apiName UpdateTool
 * @apiGroup Tools
 * @apiDescription Update an existing tool with the provided data
 *
 * @apiParam {String} id Tool ID
 *
 * @apiBody {String} [name] Tool name
 * @apiBody {String} [slug] Tool slug
 * @apiBody {String} [websiteUrl] Tool website URL
 * @apiBody {String} [description] Tool description
 * @apiBody {String} [content] Tool content
 * @apiBody {String} [screenshotUrl] Tool screenshot URL
 * @apiBody {String} [faviconUrl] Tool favicon URL
 * @apiBody {String} [submitterName] Submitter name
 * @apiBody {String} [submitterEmail] Submitter email
 * @apiBody {String} [categoryId] Category ID
 * @apiBody {Boolean} [isOpenSource] Whether tool is open source
 * @apiBody {Boolean} [isFeatured] Whether tool is featured
 * @apiBody {Number} [pageViews] Page views count
 *
 * @apiUse ToolResponse
 * @apiSuccess {Object} data Updated tool object
 */
export const updateToolHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    // Validate input
    const bodyValidation = updateToolSchema.safeParse(body);
    if (!bodyValidation.success) {
      throw bodyValidation.error;
    }

    const updatedTool = await updateTool(id as string, bodyValidation.data);

    if (!updatedTool) {
      throw createNotFoundError("Tool", `id ${id}`);
    }

    return createSuccessResponse(updatedTool, "Tool updated successfully");
  } catch (error) {
    throw handleApiError(error, "updateTool");
  }
});

/**
 * @api {delete} /api/tools/:id Delete a tool
 * @apiName DeleteTool
 * @apiGroup Tools
 * @apiDescription Delete a tool by ID
 *
 * @apiParam {String} id Tool ID
 *
 * @apiUse ToolResponse
 * @apiSuccess {String} [message] Success message
 */
export const deleteToolHandler = defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // Validate ID
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      throw idValidation.error;
    }

    const result = await deleteTool(id as string);

    if (!result) {
      throw createNotFoundError("Tool", `id ${id}`);
    }

    return createSuccessResponse(null, "Tool deleted successfully");
  } catch (error) {
    throw handleApiError(error, "deleteTool");
  }
});

// Export handlers for individual HTTP methods
export default defineEventHandler((event) => {
  const method = event.method;
  const path = event.path;

  // Handle tool by slug requests
  if (path.includes("/slug/")) {
    switch (method) {
      case "GET":
        return getToolBySlugHandler(event);
      default:
        throw createError({
          statusCode: 405,
          statusMessage: "Method not allowed",
        });
    }
  }

  // Handle regular tool requests
  switch (method) {
    case "POST":
      return createToolHandler(event);
    case "GET":
      // Check if this is a request for a specific tool
      if (event.context.params?.id) {
        return getToolByIdHandler(event);
      } else {
        return getToolsHandler(event);
      }
    case "PATCH":
      return updateToolHandler(event);
    case "DELETE":
      return deleteToolHandler(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: "Method not allowed",
      });
  }
});
