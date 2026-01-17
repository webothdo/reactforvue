<script setup lang="ts">
import { Button } from "@/components/ui/button";
import ToolListComp from "@/components/ToolListComp.vue";
import { LucideSearch } from "lucide-vue-next";
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <main
      class="container mx-auto flex flex-col items-center gap-6 mt-16 mb-16 px-4 text-center"
    >
      <div class="flex flex-col items-center gap-4 max-w-3xl">
        <h1
          class="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
        >
          Discover <span class="text-primary">open source</span> alternatives to
          popular software
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Over 1 million developers use our curated list to find the perfect
          open-source alternative to their proprietary tools.
        </p>
      </div>

      <!-- Search Bar Placeholer (Interactive search could be added here) -->
      <div class="relative w-full max-w-md hidden">
        <LucideSearch
          class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Search for alternatives (e.g., Notion, Vercel)..."
          class="h-12 w-full rounded-full border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          asChild
          class="rounded-full px-8 h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <NuxtLink to="#alternatives">Browse All Tools</NuxtLink>
        </Button>
        <Button
          asChild
          variant="outline"
          class="rounded-full px-8 h-12 text-base border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
        >
          <NuxtLink
            to="https://reactforvue.beehiiv.com/subscribe"
            target="_blank"
          >
            Join Newsletter
          </NuxtLink>
        </Button>
      </div>

      <p class="text-zinc-500 text-sm mt-2">
        Join thousands of developers saving money and regaining control.
      </p>
    </main>

    <!-- Content Section -->
    <div class="container mx-auto px-4 pb-16">
      <ToolListComp />
    </div>
  </div>
</template>
