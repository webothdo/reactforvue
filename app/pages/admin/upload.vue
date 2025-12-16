<script setup lang="ts">
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);

// Handle file selection
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  imageFile.value = file;

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result && typeof e.target.result === "string") {
      imagePreview.value = e.target.result;
    }
  };
  reader.readAsDataURL(file);
};

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
    if (error && error.value) {
      uploadError.value = error.value.message || "Failed to upload image";
      console.error("Error uploading image:", error.value);
      return null;
    }
  } catch (err) {
    uploadError.value =
      (err as Error).message || "An unexpected error occurred";
    console.error("Exception during image upload:", err);
  } finally {
    isUploading.value = false;
    imageFile.value = null;
    imagePreview.value = null;
  }

  return null;
};
</script>

<template>
  <div>
    <!-- File Input with custom styling -->
    <div class="relative flex-1 min-w-0">
      <label class="block w-fit">
        <span class="sr-only">Choose image to upload</span>
        <Input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="w-[234px] h-fit cursor-pointer text-sm text-muted-foreground file:mr-4 file:py-2 px-1 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors file:cursor-pointer file:whitespace-nowrap overflow-hidden"
        />
      </label>
    </div>
    <button
      :disabled="isUploading"
      @click="uploadImage"
      class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      {{ isUploading ? "Uploading..." : "Upload" }}
    </button>
    <span v-if="uploadError" class="text-red-500 mt-2">{{ uploadError }}</span>
  </div>
</template>
