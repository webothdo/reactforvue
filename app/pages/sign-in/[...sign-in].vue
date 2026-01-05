<script setup lang="ts">
import { Spinner } from "~/components/ui/spinner";

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
      <SignIn path="/sign-in" sign-up-url="/sign-up" />
    </ClerkLoaded>
  </div>
</template>
