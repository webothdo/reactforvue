<script setup lang="ts">
import { ref, onMounted } from "vue";
import Card from "@/components/ui/card/Card.vue";
import { useImagesApi } from "@/composables/useImagesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Image {
  id: string;
  url: string;
  originalName: string | null;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl: string | null;
  fileId: string | null;
  filename: string | null;
  size: number | null;
  mimeType: string | null;
}

const images = ref<Image[]>([]);
const imageFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchQuery = ref("");
const searchLoading = ref(false);

const { createImage, deleteImage, getImages } = useImagesApi();

const fetchImages = async () => {
  const { data, error } = await getImages({
    page: page.value,
    limit: pageSize.value,
    // q: searchQuery.value,
  });
  if (error && error.value) {
    uploadError.value = error.value.message || "Failed to fetch images";
    images.value = [];
    total.value = 0;
    return;
  }
  console.log(data.value);
  if (data && data.value) {
    // Convert createdAt/updatedAt to Date objects for type safety
    // @ts-ignore
    images.value = data.value.data?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt ? new Date(img.createdAt) : null,
      updatedAt: img.updatedAt ? new Date(img.updatedAt) : null,
    }));
    // @ts-ignore
    total.value = data.value?.total || 0;
  }
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  imageFile.value = file;
};

const uploadImage = async () => {
  if (!imageFile.value) return;
  isUploading.value = true;
  uploadError.value = null;
  try {
    const formData = new FormData();
    formData.append("image", imageFile.value);
    const { data, error } = await createImage(formData);
    if (error && error.value) {
      uploadError.value = error.value.message || "Failed to upload image";
      return;
    }
    imageFile.value = null;
    await fetchImages();
  } catch (err: any) {
    uploadError.value = err.message || "An unexpected error occurred";
  } finally {
    isUploading.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this image?")) return;
  const { error } = await deleteImage(id);
  if (!error || !error.value) {
    await fetchImages();
  }
};

watch(searchQuery, (val, oldVal) => {
  if (val !== oldVal) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      page.value = 1;
      fetchImages();
    }, 350);
  }
});

let searchTimeout: any = null;

const handlePageChange = async (newPage: number) => {
  page.value = newPage;
  await fetchImages();
};

await fetchImages();
</script>

<template>
  <div>
    <div class="mb-6 flex items-center space-x-4">
      <Input type="file" accept="image/*" @change="handleFileChange" />
      <Button
        class="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        :disabled="isUploading || !imageFile"
        @click="uploadImage"
      >
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Upload Image</span>
      </Button>
      <span v-if="uploadError" class="text-red-500 ml-2">{{
        uploadError
      }}</span>
    </div>
    <div class="mb-4 flex items-center gap-2">
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Search images..."
        class="input input-bordered w-full max-w-xs px-3 py-2 border rounded"
      />
      <span v-if="searchLoading" class="ml-2 text-gray-500 text-sm"
        >Searching...</span
      >
    </div>
    <div
      v-if="images.length === 0"
      class="text-center text-muted-foreground mt-12 text-lg font-medium"
    >
      No images found
    </div>
    <div
      v-else
      class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4"
    >
      <Card
        v-for="image in images"
        :key="image?.id ?? image?.url"
        class="flex flex-col items-center p-2 h-full relative group hover:shadow-lg transition"
      >
        <img
          :src="image?.url"
          :alt="image?.originalName || 'Image'"
          class="w-full h-48 object-cover rounded-lg mb-3 shadow group-hover:scale-105 transition-transform duration-200"
        />
        <div
          class="w-full text-center text-[15px] font-semibold truncate"
          v-if="image?.originalName"
          :title="image.originalName"
        >
          {{ image.originalName }}
        </div>
        <Button
          class="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          @click="handleDelete(image.id)"
        >
          Delete
        </Button>
      </Card>
    </div>
  </div>
  <div class="flex items-center justify-between mt-4">
    <div class="text-sm text-gray-600">
      Page {{ page }} of {{ Math.ceil(total / pageSize) || 1 }} ({{ total }}
      total)
    </div>
    <div class="flex gap-2">
      <Button
        class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="page === 1"
        @click="handlePageChange(page - 1)"
        >Prev</Button
      >
      <Button
        class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="page >= Math.ceil(total / pageSize)"
        @click="handlePageChange(page + 1)"
        >Next</Button
      >
    </div>
  </div>
</template>

<style scoped>
/* Ensures gap and layout for grid cards; most styling is via Tailwind classes in template */
</style>
