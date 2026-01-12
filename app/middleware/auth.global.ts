// Route matchers
const createRouteMatcher = (patterns: string[]) => {
  return (to: { path: string }) => {
    return patterns.some((pattern) => {
      // Convert pattern to regex, supporting (.*) syntax
      const regexPattern = pattern.replace(/\(\.\*\)/g, ".*");
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(to.path);
    });
  };
};

// Guest pages - redirect to home if already signed in
const isGuestPage = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Protected user pages - require authentication
const isProtectedPage = createRouteMatcher(["/profile(.*)", "/dashboard(.*)"]);

// Admin pages - require admin role
const isAdminPage = createRouteMatcher(["/admin(.*)"]);

// Public pages (/, /[slug], etc.) - accessible to everyone, no listing needed
// They simply pass through without any auth checks

export default defineNuxtRouteMiddleware(async (to) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before checking auth
  if (!isLoaded.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(
        isLoaded,
        (loaded) => {
          if (loaded) {
            unwatch();
            resolve();
          }
        },
        { immediate: true }
      );
    });
  }

  // Redirect signed-in users away from guest pages (sign-in, sign-up)
  if (isSignedIn.value && isGuestPage(to)) {
    return navigateTo("/");
  }

  // Redirect unauthenticated users to sign-in for protected pages
  if (!isSignedIn.value && (isProtectedPage(to) || isAdminPage(to))) {
    return navigateTo("/sign-in");
  }

  // Check admin role for admin pages
  if (isSignedIn.value && isAdminPage(to)) {
    try {
      const data = await $fetch("/api/auth/sync", { method: "POST" });
      console.log(data);
      // if (data?.role !== "admin") {
      //   return navigateTo("/");
      // }
    } catch (e) {
      console.error("Failed to verify admin status", e);
      return navigateTo("/");
    }
  }
});
