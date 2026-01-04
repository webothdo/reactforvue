export default defineNuxtRouteMiddleware((to) => {
  // Public middleware - checks if user is signed in, maybe redirect away from auth pages?
  // For now, it just allows access.
  // This is used in sign-in/sign-up pages to explicitely allow access.
  const { isSignedIn } = useAuth();
  if (isSignedIn.value) {
    // Optional: redirect to home if already signed in
    return navigateTo("/");
  }
});
