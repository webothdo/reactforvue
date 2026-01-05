<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "public",
});
</script>

<template>
  <div class="flex justify-center">
    <SignUp path="/sign-up" sign-in-url="/sign-in" />
  </div>
</template>
