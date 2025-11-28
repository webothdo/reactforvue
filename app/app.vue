<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <HeaderComp />
    <div class="flex-1">
      <NuxtPage />
    </div>
    <footer class="flex flex-col items-center mt-4 py-2 px-4 text-sm">
      <div
        class="flex flex-col w-full gap-2 pt-2 mb-4 border-t border-zinc-400"
      >
        <NuxtLink to="https://tally.so/r/w2D81V" target="_blank"
          >Submit</NuxtLink
        >
        <NuxtLink to="/"> About </NuxtLink>
      </div>
      <p class="text-zinc-400 text-xs">created with ❤️</p>
    </footer>
  </UApp>
</template>
