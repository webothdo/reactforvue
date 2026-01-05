<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="flex justify-center">
    <ClerkLoading>
      <Spinner class="w-8 h-8" />
    </ClerkLoading>
    <ClerkLoaded>
      <SignUp path="/sign-up" sign-in-url="/sign-in" />
    </ClerkLoaded>
  </div>
</template>
