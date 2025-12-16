<script setup lang="ts">
import {
  LucideArrowRight,
  LucideStar,
  LucideGitFork,
  LucideHistory,
} from "lucide-vue-next";

interface Tool {
  name: string;
  description: string;
  slug: string;
  stars?: number;
  forks?: number;
  lastCommit?: string;
  // logoUrl?: string; // If available
}

defineProps<{
  tool: Tool;
}>();

const formatNumber = (num?: number) => {
  if (!num) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
};
</script>

<template>
  <NuxtLink
    :to="tool.slug"
    class="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-primary/5"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Placeholder for Logo if available, using a generic icon for now -->
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-primary transition-colors"
        >
          <span class="text-lg font-bold">{{ tool.name.charAt(0) }}</span>
        </div>
        <h3
          class="text-xl font-semibold text-zinc-100 group-hover:text-primary transition-colors"
        >
          {{ tool.name }}
        </h3>
      </div>
      <LucideArrowRight
        class="h-5 w-5 text-zinc-600 transition-transform group-hover:-rotate-45 group-hover:text-primary"
      />
    </div>

    <p class="mb-6 line-clamp-3 text-sm text-zinc-400">
      {{ tool.description }}
    </p>

    <div class="mt-auto flex items-center gap-4 text-xs text-zinc-500">
      <div v-if="tool.stars" class="flex items-center gap-1">
        <LucideStar class="h-3.5 w-3.5" />
        <span>{{ formatNumber(tool.stars) }}</span>
      </div>
      <div v-if="tool.forks" class="flex items-center gap-1">
        <LucideGitFork class="h-3.5 w-3.5" />
        <span>{{ formatNumber(tool.forks) }}</span>
      </div>
      <div v-if="tool.lastCommit" class="flex items-center gap-1">
        <LucideHistory class="h-3.5 w-3.5" />
        <span>{{ tool.lastCommit }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
