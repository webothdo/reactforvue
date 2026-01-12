import { clerkClient, clerkMiddleware } from "@clerk/nuxt/server";
import { AccountService } from "../lib/services/account.service";

export default clerkMiddleware(async (event) => {
  const { isAuthenticated, userId } = event.context.auth();
  const isAdminRoute = (event: any) =>
    [
      "/api/alternatives",
      "/api/categories",
      "/api/images",
      "/api/media",
      "/api/tools",
    ].some((path) => event.path.includes(path));

  const isProtectedRoute = (event: any) =>
    [
      "/api/auth",
      "/api/alternatives",
      "/api/categories",
      "/api/images",
      "/api/media",
      "/api/tools",
    ].some((path) => event.path.includes(path));

  //   const { data } = await useFetch("/api/auth/sync", { method: "POST" });
  //   console.log(data);
  //   // If the role is not admin, redirect to the homepage
  //   if (data.value?.data?.role !== "admin") {
  //     return navigateTo("/");
  //   }
  // TODO: still redirecting anyhow
  // Check if the user is not signed in
  // and is trying to access a protected route. If so, throw a 401 error.
  if (!isAuthenticated && isProtectedRoute(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User is not signed in",
    });
  }
  // let user;

  // if (userId) {
  //   user = await clerkClient(event).users.getUser(userId!);
  // }

  // let account = userId ? await getAccountByUserId(userId) : null;

  // if (!account && isProtectedRoute(event)) {
  //   if (!user) return;
  //   await AccountService.create({
  //     userId: userId!,
  //     email: user.primaryEmailAddress?.emailAddress!,
  //     name:
  //       user.fullName ||
  //       user.username ||
  //       user.primaryEmailAddress?.emailAddress!,
  //   });
  //   account = await getAccountByUserId(userId!);
  // }

  // if (isAdminRoute(event) && account?.role !== "admin") {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: "Forbidden: Admin access required",
  //   });
  // }
});
