<script setup lang="ts">
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard.vue";

const route = useRoute();

const page = computed(() => Number(route.query.page) || 1);
const pageSize = ref(12);

const {
  data: tools,
  error,
  status,
  refresh,
} = await useFetch(`/api/public/tools`, {
  query: {
    page: () => page.value,
    limit: pageSize.value,
  },
  watch: [page],
});

const totalPages = computed(() => {
  return Math.ceil((tools.value?.total || 0) / pageSize.value);
});

const nextPage = computed(() => {
  if (page.value < totalPages.value) {
    return page.value + 1;
  }
  return totalPages.value;
});

const previousPage = computed(() => {
  if (page.value > 1) {
    return page.value - 1;
  }
  return 1;
});

if (error.value) {
  console.log(error.value);
}
</script>

<template>
  <section
    id="alternatives"
    class="w-full flex flex-col items-center gap-8 px-4 md:px-0"
  >
    <div
      v-if="status === 'pending'"
      class="h-96 w-full flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        ></div>
        <p class="text-zinc-500">Loading alternatives...</p>
      </div>
    </div>

    <div
      v-else-if="status === 'error'"
      class="h-96 w-full flex flex-col items-center justify-center gap-4"
    >
      <p class="text-destructive font-bold text-lg">Something went wrong</p>
      <Button variant="outline" @click="refreshNuxtData">Try again</Button>
    </div>

    <div v-else-if="status === 'success'" class="w-full flex flex-col gap-8">
      <div
        v-if="tools?.data?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        <ToolCard v-for="tool in tools.data" :key="tool.id" :tool="tool" />
      </div>
      <div
        v-else
        class="h-64 flex w-full items-center justify-center text-zinc-500"
      >
        No tools found.
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex gap-4 justify-center items-center mt-8 pb-8"
      >
        <Button
          variant="outline"
          :disabled="page === 1"
          class="w-24 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          asChild
        >
          <NuxtLink
            :to="
              page !== 1
                ? {
                    path: '/',
                    query: { page: previousPage },
                  }
                : ''
            "
          >
            Previous
          </NuxtLink>
        </Button>

        <span class="text-sm text-zinc-400 font-medium">
          Page {{ page }} of {{ totalPages }}
        </span>

        <Button
          variant="outline"
          :disabled="page === totalPages"
          class="w-24 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          asChild
        >
          <NuxtLink
            :to="
              page !== totalPages
                ? {
                    path: '/',
                    query: { page: nextPage },
                  }
                : ''
            "
          >
            Next
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>
