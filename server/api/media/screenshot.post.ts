/**
 * POST /api/media/screenshot
 * Take a screenshot of a URL
 */

export default defineEventHandler(async (event) => {
  // Import the existing screenshot logic from the original file
  const { default: screenshotHandler } = await import('../screenshot.post');
  return screenshotHandler(event);
});