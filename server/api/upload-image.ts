import { nanoid } from "nanoid";
import { readMultipartFormData } from "#imports";
import { imagekit } from "../lib/imagekit";
import { insertImage } from "../utils/insert";

// Supported image MIME types
const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

// MIME type to extension mapping
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default defineEventHandler(async (event) => {
  try {
    // Read multipart form data from the request
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      return {
        statusCode: 400,
        body: { error: "No form data provided" },
      };
    }
    console.log("formdata", formData);
    // Find the image file in the form data
    const fileEntry = formData.find(
      (entry) =>
        entry &&
        entry.type &&
        SUPPORTED_MIME_TYPES.includes(entry.type) &&
        entry.data
    );

    if (!fileEntry) {
      return {
        statusCode: 400,
        body: {
          error: "No valid image file found",
          message: "Supported formats: JPEG, PNG, GIF, WebP, and SVG",
        },
      };
    }

    // Check file size
    if (fileEntry.data.length > MAX_FILE_SIZE) {
      return {
        statusCode: 400,
        body: {
          error: "File too large",
          message: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
      };
    }

    // Safely get the file extension from the MIME type
    const mimeType = fileEntry.type || "application/octet-stream";
    const fileExtension = MIME_TO_EXTENSION[mimeType] || "jpg"; // Default to jpg if unknown
    const uniqueFileName = `${nanoid()}.${fileExtension}`;

    // ImageKit's upload method can accept three types of inputs:
    // 1. Binary - pass the buffer directly
    // 2. Base64 - data URI format
    // 3. URL - external URL to fetch from

    // Upload with binary format
    const fileData = await imagekit.upload({
      file: fileEntry.data, // Pass the Buffer directly
      fileName: uniqueFileName,
      folder: "reactforvue",
    });

    // Create image record in database
    const newImage = await insertImage({
      url: fileData.url,
      thumbnailUrl: fileData.thumbnailUrl,
      fileId: fileData.fileId,
      filename: fileData.name,
      originalName: fileEntry.filename || "unknown",
      size: fileData.size || fileEntry.data.length,
      mimeType: mimeType,
    });

    // Return success response with file details
    return {
      success: true,
      url: fileData.url,
      thumbnailUrl: fileData.thumbnailUrl,
      fileId: fileData.fileId,
      filename: fileData.name,
      originalName: fileEntry.filename || "unknown",
      size: fileData.size || fileEntry.data.length,
      mimeType: mimeType,
    };
  } catch (error) {
    console.error("Error uploading image:", error);

    // Provide more specific error messages based on common ImageKit errors
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    let statusCode = 500;

    if (errorMessage.includes("Authentication failed")) {
      statusCode = 401;
      errorMessage = "ImageKit authentication failed. Check your API keys.";
    } else if (errorMessage.includes("rate limit")) {
      statusCode = 429;
      errorMessage = "Rate limit exceeded for ImageKit uploads.";
    }

    return {
      statusCode,
      body: {
        success: false,
        error: "Failed to upload image",
        message: errorMessage,
      },
    };
  }
});
