export default defineNuxtRouteMiddleware(async (to) => {
  // // Only apply this check to routes that include 'admin'
  // if (!to.path.includes("admin")) {
  //   return;
  // }
  // const { isSignedIn, isLoaded } = useAuth();
  // // Redirect to sign-in if the user is not signed in
  // if (isLoaded.value && !isSignedIn.value) {
  //   return navigateTo("/sign-in");
  // }
  // // Check admin role via sync API
  // try {
  //   const { data } = await useFetch("/api/auth/sync", { method: "POST" });
  //   console.log(data);
  //   // If the role is not admin, redirect to the homepage
  //   if (data.value?.data?.role !== "admin") {
  //     return navigateTo("/");
  //   }
  // } catch (e) {
  //   console.error("Failed to verify admin status", e);
  //   return navigateTo("/");
  // }
});
