<script setup lang="ts"></script>

<template>
  <div
    class="flex items-center justify-between bg-background/80 backdrop-blur-lg py-1 px-3 border rounded-full sticky top-3 z-50"
  >
    <NuxtLink to="/">Editor</NuxtLink>
    <div class="flex items-center gap-1">
      <HamburgerMenu />
      <ColorModeComp />
      <UserButton />
    </div>
  </div>
</template>
