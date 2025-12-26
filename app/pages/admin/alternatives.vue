<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAlternativesApi } from "@/composables/useAlternativesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formData = ref({
  name: "",
  slug: "",
  websiteUrl: "",
  imageUrl: "",
});

const alternatives = ref<any[]>([]);
const editingId = ref<string | null>(null);
const searchQuery = ref("");
const searchLoading = ref(false);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const {
  createAlternative,
  updateAlternative,
  deleteAlternative,
  getAlternatives,
} = useAlternativesApi();

const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

// Handle file selection
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  imageFile.value = file;

  // Create preview URLs
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result && typeof e.target.result === "string") {
      imagePreview.value = e.target.result;
    }
  };
  reader.readAsDataURL(file);
};

// Upload the image to the API
const uploadImage = async () => {
  if (!imageFile.value) return;

  isUploading.value = true;
  uploadError.value = null;

  try {
    const formData = new FormData();
    formData.append("image", imageFile.value);

    const { data, error } = await useFetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });
    console.log(data.value);
    if (error.value) {
      uploadError.value = error.value.message || "Failed to upload image";
      console.error("Error uploading image:", error.value);
      return null;
    }

    if (data.value && data.value.imageUrl) {
      return data.value.imageUrl;
    }
  } catch (err) {
    uploadError.value =
      (err as Error).message || "An unexpected error occurred";
    console.error("Exception during image upload:", err);
  } finally {
    isUploading.value = false;
  }

  return null;
};

const saveData = async () => {
  // First upload the image if one is selected
  if (imageFile.value) {
    const imageUrl = await uploadImage();
    if (imageUrl) {
      formData.value.imageUrl = imageUrl;
    } else if (uploadError.value) {
      // If there was an error uploading the image, stop the save process
      return;
    }
  }

  let response;
  if (editingId.value) {
    // Update
    response = await updateAlternative(editingId.value, formData.value);
  } else {
    // Create
    response = await createAlternative(formData.value);
  }

  if (response.error && response.error.value) {
    uploadError.value =
      response.error.value.message || "Failed to save alternative";
    return;
  }
  if (response.data && response.data.value) {
    resetForm();
    editingId.value = null;
    await fetchAlternatives();
  }
};

const fetchAlternatives = async () => {
  const { data, error } = await getAlternatives({
    page: page.value,
    limit: pageSize.value,
    q: searchQuery.value,
  });
  if (error && error.value) {
    alternatives.value = [];
    total.value = 0;
    return;
  }
  if (data && data.value) {
    alternatives.value = data.value.data || [];
    total.value = (data.value as any).total || 0;
  }
};

const performSearch = async () => {
  page.value = 1;
  await fetchAlternatives();
};

let searchTimeout: NodeJS.Timeout | null = null;
watch(searchQuery, (val, oldVal) => {
  if (val !== oldVal) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(), 350);
  }
});

const handlePageChange = async (newPage: number) => {
  page.value = newPage;
  await fetchAlternatives();
};

const startEdit = (alt: any) => {
  editingId.value = alt.id;
  formData.value = { ...alt };
  imagePreview.value = alt.imageUrl || null;
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this alternative?")) return;
  const { error } = await deleteAlternative(id);
  if (!error || !error.value) {
    await fetchAlternatives();
  }
};

await fetchAlternatives();

const resetForm = () => {
  formData.value = {
    name: "",
    slug: "",
    websiteUrl: "",
    imageUrl: "",
  };
  imageFile.value = null;
  imagePreview.value = null;
};

const canSubmit = computed(() => {
  return !isUploading.value; //&& formData.value.name && formData.value.slug;
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Editor</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <Input v-model="formData.name" placeholder="Name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Slug</label>
          <Input v-model="formData.slug" placeholder="Slug" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Website URL</label>
          <Input v-model="formData.websiteUrl" placeholder="Website URL" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <div class="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="flex-1"
            />
            <Button
              v-if="imageFile"
              variant="outline"
              size="sm"
              @click="
                imageFile = null;
                imagePreview = null;
              "
            >
              Clear
            </Button>
          </div>
          <p v-if="uploadError" class="text-red-500 text-sm mt-1">
            {{ uploadError }}
          </p>
        </div>
      </div>

      <div v-if="imagePreview" class="border rounded-md p-4">
        <h3 class="text-sm font-medium mb-2">Image Preview</h3>
        <img
          :src="imagePreview"
          alt="Preview"
          class="max-h-64 max-w-full object-contain"
        />
      </div>
    </div>

    <div class="mt-6 flex items-center space-x-4">
      <Button
        @click="saveData"
        :disabled="!canSubmit"
        :class="{ 'opacity-50 cursor-not-allowed': !canSubmit }"
      >
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Save Alternative</span>
      </Button>
      <Button variant="outline" @click="resetForm">Reset</Button>
    </div>
  </div>
  <div class="mt-10">
    <div class="mb-4 flex items-center gap-2">
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Search alternatives..."
        class="input input-bordered w-full max-w-xs"
      />
      <span v-if="searchLoading" class="ml-2 text-gray-500 text-sm"
        >Searching...</span
      >
    </div>
    <h2 class="text-xl font-semibold mb-4">Alternatives List</h2>
    <div class="rounded-md border overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                Name
              </th>
              <th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                Slug
              </th>
              <th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                Website URL
              </th>
              <th
                class="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr
              v-for="alt in alternatives"
              :key="alt.id"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td
                class="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium"
              >
                {{ alt.name }}
              </td>
              <td
                class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground"
              >
                {{ alt.slug }}
              </td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <a
                  :href="alt.websiteUrl"
                  target="_blank"
                  class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors truncate inline-block max-w-xs"
                >
                  {{ alt.websiteUrl }}
                </a>
              </td>
              <td
                class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right"
              >
                <div class="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    class="h-8 px-3"
                    @click="startEdit(alt)"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    class="h-8 px-3"
                    @click="handleDelete(alt.id)"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">
        Page {{ page }} of {{ Math.ceil(total / pageSize) || 1 }} ({{ total }}
        total)
      </div>
      <div class="flex gap-2">
        <Button
          size="sm"
          :disabled="page === 1"
          @click="handlePageChange(page - 1)"
          >Prev</Button
        >
        <Button
          size="sm"
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="handlePageChange(page + 1)"
          >Next</Button
        >
      </div>
    </div>
  </div>
</template>

<!-- Run: bunx shadcn-vue add Button if Button is missing -->
