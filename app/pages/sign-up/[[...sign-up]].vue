<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "public",
});
</script>

<template>
  <div class="flex justify-center">
    <SignUp sign-in-url="/sign-in" />
  </div>
</template>
