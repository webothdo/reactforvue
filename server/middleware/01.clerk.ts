import { clerkMiddleware, createRouteMatcher } from "@clerk/nuxt/server";

export default clerkMiddleware(async (event) => {
  const { isAuthenticated, userId } = event.context.auth();
  const isProtectedRoute = createRouteMatcher([
    "/api/alternatives(.*)",
    "/api/auth(.*)",
    "/api/categories(.*)",
    "/api/images(.*)",
    "/api/media(.*)",
    "/api/tools(.*)",
  ]);

  // Check if the user is not signed in
  // and is trying to access a protected route. If so, throw a 401 error.
  if (!isAuthenticated && isProtectedRoute(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }

  if (!userId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const account = await getAccountByUserId(userId);

  if (!account || account.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin access required",
    });
  }
});
