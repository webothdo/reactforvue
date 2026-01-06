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

  if (!isSignedIn.value) {
    return navigateTo("/sign-in");
  }
});
