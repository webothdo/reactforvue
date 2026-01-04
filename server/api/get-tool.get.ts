/**
 * GET /api/get-tool
 * Get a tool by slug (legacy endpoint - redirects to tools/slug/[slug])
 */

// Redirect to the new endpoint
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = query.slug;
  
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }
  
  // Redirect to the new API endpoint
  return new Response(null, {
    status: 302,
    statusText: `Use /api/tools/slug/${slug} instead`,
    headers: {
      Location: `/api/tools/slug/${slug}`,
    },
  });
});