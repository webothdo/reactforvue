<script setup lang="ts"></script>

<template>
  <div>
    <main class="flex flex-col items-center gap-3 mt-4 mb-4 px-4 text-center">
      <div>
        <h1 class="text-[28px] font-bold">
          Discover vuejs alternatives to react libraries
        </h1>
        <p class="text-zinc-400">
          A curated list of hand-picked vuejs alternatives to your favourites
          from the react ecosystem.
        </p>
      </div>
      <p class="text-zinc-600 text-xs">Join thousands of vuejs developers</p>
      <UButton asChild variant="outline" class="rounded-lg py-0">
        <NuxtLink to="https://reactforvue.beehiiv.com/subscribe" target="_blank"
          >Join Our Newsletter</NuxtLink
        >
      </UButton>
    </main>
    <ToolListComp />
  </div>
</template>
