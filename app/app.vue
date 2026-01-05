<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <div class="flex-1">
        <NuxtPage />
      </div>
      <Toaster />
    </NuxtLayout>
  </div>
</template>
