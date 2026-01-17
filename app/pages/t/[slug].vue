<script setup lang="ts">
import {
  LucideArrowRight,
  LucideExternalLink,
  LucideGlobe,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const route = useRoute();
const alternative = ref({});

const { data, error, status } = await useFetch(
  `/api/public/tools/slug/${route.params.slug}`
);

if (status.value === "error") {
  console.log(error.value);
}

if (data.value) {
  alternative.value = data.value?.data;
}

const toolName = computed(() => data.value?.data?.name || "Tool");
const toolDescription = computed(() => data.value?.data?.description || "");

useSeoMeta({
  title: `${toolName.value} - React Alternative`,
  description: toolDescription.value,
  ogTitle: `${toolName.value} - React Alternative`,
  ogDescription: toolDescription.value,
});
</script>

<template>
  <div class="min-h-screen pb-16">
    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="h-96 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        ></div>
        <p class="text-zinc-500">Loading tool details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="status === 'error'"
      class="h-96 flex flex-col items-center justify-center gap-4"
    >
      <p class="text-destructive font-medium text-lg">Something went wrong</p>
      <Button variant="outline" @click="refreshNuxtData">Try again</Button>
    </div>

    <!-- Content -->
    <div
      v-if="status === 'success' && data?.data"
      class="container mx-auto px-4 mt-8 max-w-5xl"
    >
      <!-- Breadcrumbs / Navigation -->
      <div class="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <NuxtLink to="/" class="hover:text-primary transition-colors"
          >Home</NuxtLink
        >
        <span>/</span>
        <span class="text-zinc-300">{{ data.data.name }}</span>
      </div>

      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row gap-8 items-start justify-between mb-12"
      >
        <div class="flex-1">
          <h1
            class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-4"
          >
            {{ data.data.name }}
          </h1>
          <p
            v-if="data.data.description"
            class="text-lg text-zinc-400 leading-relaxed max-w-2xl"
          >
            {{ data.data.description }}
          </p>
        </div>

        <div class="flex flex-col gap-3 w-full md:w-auto">
          <Button
            asChild
            class="w-full md:w-auto rounded-full px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
          >
            <NuxtLink
              :to="`${data.data.websiteUrl}?ref=reactforvue`"
              target="_blank"
              class="flex items-center gap-2"
            >
              Visit Website
              <LucideExternalLink class="w-4 h-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column: Screenshot & Content -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Screenshot -->
          <div
            class="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl"
          >
            <img
              v-if="data.data.screenshotUrl"
              :src="data.data.screenshotUrl"
              :alt="data.data.name + ' Screenshot'"
              class="w-full h-auto object-cover"
            />
            <div
              v-else
              class="h-64 w-full flex items-center justify-center bg-zinc-900 text-zinc-600"
            >
              No screenshot available
            </div>
          </div>

          <!-- Content / Markdown -->
          <div
            v-if="data.data.content"
            class="prose prose-invert prose-zinc max-w-none"
          >
            <div v-html="data.data.content"></div>
          </div>
        </div>

        <!-- Right Column: Sidebar / Meta -->
        <div class="flex flex-col gap-6">
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3
              class="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider"
            >
              Details
            </h3>
            <div class="flex flex-col gap-4">
              <div
                class="flex justify-between items-center py-2 border-b border-zinc-800/50"
              >
                <span class="text-zinc-400">Website</span>
                <a
                  :href="data.data.websiteUrl"
                  target="_blank"
                  class="text-primary hover:underline flex items-center gap-1"
                >
                  {{ data.data.name }} <LucideGlobe class="w-3 h-3" />
                </a>
              </div>
              <!-- Placeholder for other meta data if available from API -->
              <div
                class="flex justify-between items-center py-2 border-b border-zinc-800/50"
              >
                <span class="text-zinc-400">License</span>
                <span class="text-zinc-200">Open Source</span>
              </div>
            </div>
          </div>

          <!-- Ad / Promo Placeholder if needed -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 class="text-sm font-medium text-zinc-500 mb-2">Support us</h3>
            <p class="text-sm text-zinc-400 mb-4">
              Join our newsletter to get the latest tools delivered to your
              inbox.
            </p>
            <Button
              asChild
              variant="outline"
              class="w-full text-zinc-300 border-zinc-700 hover:bg-zinc-800"
            >
              <NuxtLink
                to="https://reactforvue.beehiiv.com/subscribe"
                target="_blank"
                >Subscribe</NuxtLink
              >
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
