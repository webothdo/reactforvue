<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["public"],
});
</script>

<template>
  <div class="flex justify-center">
    <SignIn sign-up-url="/sign-up" />
  </div>
</template>
