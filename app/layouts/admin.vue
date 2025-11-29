<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-background">
    <!-- Content Area -->
    <div class="flex-1 flex flex-col">
      <HeaderComp />

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Uses <ColorModeComp /> for theme switching in the top bar
// Sidebar links use NuxtLink and Tailwind classes for active/hover state
</script>
