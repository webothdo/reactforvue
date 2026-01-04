import { createRouteMatcher } from "@clerk/nuxt/server";

export default defineEventHandler(async (event) => {
  // const isAdminRoute = createRouteMatcher(["/api/admin(.*)", "/admin(.*)"]);

  // if (!isAdminRoute(event)) {
  //   return;
  // }

  // Ensure auth context exists (populated by 01.clerk.ts)
  if (typeof event.context.auth !== "function") {
    console.warn(
      "Auth context not found. Ensure 01.clerk.ts is running before 02.admin.ts"
    );
    return;
  }

  const auth = await requireAuth(event);
  const account = await getAccountByUserId(auth.userId);

  if (!account || account.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin access required",
    });
  }
});
