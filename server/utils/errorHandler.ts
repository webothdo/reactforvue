/**
 * Standardized error handling utility for API endpoints
 */

import { createError } from "h3";
import { ZodError } from "zod";

/**
 * Handle API errors and create consistent error responses
 * @param {Error} error - The error to handle
 * @param {string} context - Context for error logging
 * @returns {Error} H3 error to throw
 */
export function handleApiError(error: unknown, context: string): Error {
  console.error(`[${context}] Error:`, error);

  if (error instanceof ZodError) {
    // Handle Zod validation errors
    return createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: error.errors[0].message,
      data: {
        errors: error.errors,
      },
    });
  } else if (error instanceof Error) {
    // Handle generic errors
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message || "An unexpected error occurred",
    });
  } else {
    // Handle unknown errors
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An unknown error occurred",
    });
  }
}

/**
 * Create a success response
 * @param {any} data - Data to return
 * @param {string} [message] - Optional success message
 * @returns {Object} Success response object
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): { success: boolean; data: T; message?: string } {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * Create a not found error
 * @param {string} resource - Resource name
 * @param {string} identifier - Identifier (ID, slug, etc.)
 * @returns {Error} H3 error
 */
export function createNotFoundError(
  resource: string,
  identifier: string
): Error {
  return createError({
    statusCode: 404,
    statusMessage: "Not Found",
    message: `${resource} with ${identifier} not found`,
  });
}
