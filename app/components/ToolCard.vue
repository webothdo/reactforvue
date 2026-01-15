<script setup lang="ts">
import { LucideArrowRight } from "lucide-vue-next";

interface Tool {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  tagline?: string | null;
  description?: string | null;
  content?: string | null;
  screenshotUrl?: string | null;
  faviconUrl?: string | null;
  isOpenSource?: boolean;
  isFeatured?: boolean;
}

defineProps<{
  tool: Tool;
}>();
</script>

<template>
  <NuxtLink
    :to="`/t/${tool.slug}`"
    class="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-primary/5"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-primary transition-colors"
        >
          <img
            v-if="tool.faviconUrl"
            :src="tool.faviconUrl"
            :alt="tool.name"
            class="h-full w-full object-contain p-1.5"
          />
          <span v-else class="text-lg font-bold">{{
            tool.name.charAt(0)
          }}</span>
        </div>
        <h3
          class="text-xl font-semibold text-zinc-100 group-hover:text-primary transition-colors line-clamp-1"
        >
          {{ tool.name }}
        </h3>
      </div>
      <LucideArrowRight
        class="h-5 w-5 text-zinc-600 transition-transform group-hover:-rotate-45 group-hover:text-primary shrink-0"
      />
    </div>

    <p class="mb-6 line-clamp-3 text-sm text-zinc-400">
      {{ tool.description }}
    </p>

    <div
      v-if="tool.tagline"
      class="mt-auto flex items-center gap-4 text-xs text-zinc-500"
    >
      <span class="line-clamp-1">{{ tool.tagline }}</span>
    </div>
  </NuxtLink>
</template>
