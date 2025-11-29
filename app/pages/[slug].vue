<script setup lang="ts">
import { LucideArrowRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const route = useRoute();
const alternative = ref({});

const { data, error, status } = await useFetch("/api/get-tool", {
  params: {
    slug: route.params.slug,
  },
});

if (status.value === "error") {
  console.log(error.value);
}

if (data.value) {
  alternative.value = data.value?.data;
  console.log(alternative.value);
}
</script>

<template>
  <div>
    <div v-if="status === 'pending'" class="h-96 flex items-center">
      <p>Loading....</p>
    </div>
    <div v-if="status === 'error'" class="h-96 flex items-center">
      <p>Something went wrong</p>
      <p>Please try to reload</p>
    </div>
    <div
      v-if="status === 'success'"
      class="flex flex-col gap-3 mt-4 mb-4 px-4 h-full"
    >
      <h1 class="text-lg font-bold mb-2">{{ data.data?.name }}</h1>
      <p v-if="data.data?.description" class="text-zinc-400 mb-2">
        {{ data.data?.description }}
      </p>
      <div class="flex flex-col gap-2">
        <Button
          asChild
          class="bg-zinc-100 text-zinc-950 w-fit border border-zinc-600 px-5 py-3 h-0 text-sm"
        >
          <NuxtLink
            :to="`${data.data?.websiteUrl}?ref=reactforvue`"
            target="_blank"
            >Visit
            <LucideArrowRight />
          </NuxtLink>
        </Button>
        <div
          class="h-[250px] w-full rounded-lg overflow-hidden border border-zinc-600"
        >
          <img
            v-if="data.data?.screenshotUrl"
            :src="data.data?.screenshotUrl"
            alt="screenshot"
            class="object-contain w-full h-full"
          />
        </div>
        <div
          v-if="data.data?.content"
          v-html="data.data?.content"
          class="mt-2"
        ></div>
      </div>
    </div>
  </div>
</template>
