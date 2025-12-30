export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn, isLoaded } = useAuth();

  // If Clerk is not loaded yet, returning undefined lets the navigation proceed
  // But typically you might want to wait or show a loading state
  // ideally useAuth() handles this reactivity

  if (isLoaded.value && !isSignedIn.value) {
    return navigateTo("/sign-in");
  }
});
