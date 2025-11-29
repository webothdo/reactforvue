<script setup>
import { Button } from "@/components/ui/button";

const { getAlternatives } = useAlternativesApi();

const route = useRoute();

const page = computed(() => Number(route.query.page) || 1);
const pageSize = ref(10);
const offset = computed(() => (page.value - 1) * 10);

// const { data: tools, status } = await useAsyncData(
//   "tools",
//   () =>
//     $fetch("/api/get-tools", {
//       params: {
//         page: page.value,
//       },
//     }),
//   {
//     watch: [() => page.value],
//   }
// );

const {
  data: tools,
  error,
  status,
} = await getAlternatives({
  page: page.value,
  limit: pageSize.value,
});

const totalPages = computed(() => {
  return Math.ceil(tools.value?.total / pageSize.value);
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
  return;
});

if (error.value) {
  console.log(error.value);
}

const useTruncate = (text, length = 100) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  }
  return text;
};
</script>

<template>
  <section id="alternatives" class="flex flex-col items-center gap-4">
    <div v-if="status === 'pending'" class="h-96 flex items-center">
      <p>Loading....</p>
    </div>
    <div v-if="status === 'error'" class="h-96 flex items-center">
      <p>Something went wrong</p>
      <p>Please try to reload</p>
    </div>
    <div v-if="status === 'success'" class="flex flex-col items-center gap-4">
      <NuxtLink
        v-if="tools"
        :to="tools.slug"
        v-for="tools in tools?.data"
        :key="tools.id"
        class="flex flex-col gap-2 h-[150px] w-[300px] px-3 py-3 bg-black/50 rounded-lg border"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:radar" class="w-6 h-6" />
          <p>{{ tools.name }}</p>
        </div>
        <p class="text-zinc-400 text-sm">
          <!-- {{ useTruncate(tools.description, 50) }} -->
          {{ tools }}
        </p>
      </NuxtLink>
      <div class="flex gap-3 justify-between items-center">
        <Button
          asChild
          :class="[
            'border border-zinc-600 px-2 py-3 h-0 text-xs bg-background text-foreground hover:bg-foreground/80 hover:text-background',
            { 'opacity-50 cursor-not-allowed': page === 1 },
          ]"
        >
          <NuxtLink
            :disabled="page === 1"
            :to="
              page !== 1
                ? {
                    path: '/',
                    query: { page: previousPage },
                  }
                : ''
            "
          >
            Prev
          </NuxtLink>
        </Button>
        <p>{{ page }} / {{ totalPages }}</p>
        <Button
          asChild
          :class="[
            'border border-zinc-600 px-2 py-3 h-0 text-xs bg-background text-foreground hover:bg-foreground/80 hover:text-background',
            { 'opacity-50 cursor-not-allowed': page === totalPages },
          ]"
        >
          <NuxtLink
            :disabled="page === totalPages"
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
