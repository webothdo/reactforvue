<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useOpenDialog } from "~/composables/useOpenDialog";
import { useImagesApi } from "~/composables/useImagesApi";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useWindowSize } from "@vueuse/core";

const { getImages, createImage } = useImagesApi();

// Screen size detection
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);

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

const { isDialogOpen, openDialog, closeDialog } = useOpenDialog();

const images = ref<Image[]>([]);

const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);

// --- Screenshot from URL logic ---
const mode = ref<"file" | "url">("file");
const urlInput = ref("");
const isScreenshotLoading = ref(false);

const handleScreenshot = async () => {
  if (!urlInput.value) return;
  isScreenshotLoading.value = true;
  uploadError.value = null;
  try {
    const { data, error } = await useFetch("/api/screenshot", {
      method: "POST",
      body: { url: urlInput.value },
    });
    if (error.value) {
      uploadError.value = error.value.message || "Screenshot failed";
      return;
    }
    console.log(data.value);
    const urlName =
      urlInput.value.split("/")[urlInput.value.split("/").length - 1];
    const blobType = data.value.blob.type;
    const fff = new File([data.value.blob], `${urlName}-screenshot`, {
      type: blobType,
    });
    console.log("file", fff);
    if (data.value?.base64) {
      imagePreview.value = data.value.base64;
      imageFile.value = fff;
    }
  } catch (err) {
    uploadError.value = (err as Error).message || "Screenshot error";
  } finally {
    isScreenshotLoading.value = false;
  }
};

const resetScreenshot = () => {
  urlInput.value = "";
  imagePreview.value = null;
  imageFile.value = null;
};

// Handle file selection
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  imageFile.value = file;
  console.log(file);

  // Create preview URL
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

    const { data, error } = await createImage(formData);
    console.log(data.value);
    if (error && error.value) {
      uploadError.value = error.value.message || "Failed to upload image";
      console.error("Error uploading image:", error.value);
      return null;
    }

    // The backend should return { imageUrl } on success
    // @ts-ignore
    if (data && data.value && data.value.imageUrl) {
      // @ts-ignore
      return data.value.imageUrl;
    }
  } catch (err) {
    uploadError.value =
      (err as Error).message || "An unexpected error occurred";
    console.error("Exception during image upload:", err);
  } finally {
    isUploading.value = false;
    imageFile.value = null;
    imagePreview.value = null;
    fetchImages();
  }

  return null;
};

const fetchImages = async () => {
  const { data, error } = await getImages({ page: 1, limit: 50 });
  if (error && error.value) {
    console.error("Error fetching images:", error.value);
    images.value = [];
    return;
  }
  // @ts-ignore
  images.value = data.value?.data || [];
  console.log("Images fetched:", data.value);
};

fetchImages();
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-4xl p-0 max-h-[90dvh] flex flex-col">
      <DialogHeader class="border-b px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex flex-col sm:flex-row gap-3 w-full items-stretch">
          <!-- File Input with custom styling -->
          <div class="flex gap-2 mb-4">
            <Button
              :variant="mode === 'file' ? 'default' : 'outline'"
              @click="mode = 'file'"
              >Upload file</Button
            >
            <Button
              :variant="mode === 'url' ? 'default' : 'outline'"
              @click="mode = 'url'"
              >From URL</Button
            >
          </div>

          <!-- File Upload Mode -->
          <div v-if="mode === 'file'" class="relative flex-1 min-w-0">
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

          <!-- Screenshot from URL Mode -->
          <div v-else class="flex flex-1 items-end gap-2">
            <Input
              v-model="urlInput"
              placeholder="Enter URL to screenshot"
              class="flex-1"
            />
            <Button
              :loading="isScreenshotLoading"
              @click="handleScreenshot"
              :disabled="!urlInput || isScreenshotLoading"
            >
              Generate Screenshot
            </Button>
            <Button
              variant="outline"
              @click="resetScreenshot"
              v-if="imagePreview"
              >Clear</Button
            >
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <Button
              v-if="imageFile"
              variant="outline"
              @click="
                imageFile = null;
                imagePreview = null;
              "
              class="flex-1 sm:flex-none px-3 sm:px-4 h-10"
            >
              <span class="hidden xs:inline">Clear</span>
              <svg
                v-if="isMobile"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </Button>

            <Button
              v-if="imageFile"
              @click="uploadImage"
              :disabled="isUploading"
              class="flex-1 sm:flex-none px-3 sm:px-4 h-10"
            >
              <span v-if="isUploading" class="flex items-center gap-1.5">
                <svg
                  class="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span class="hidden xs:inline">Uploading</span>
              </span>
              <span v-else class="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span class="hidden xs:inline">Upload</span>
              </span>
            </Button>
          </div>
        </div>

        <!-- File Info -->
        <div
          v-if="imageFile"
          class="mt-2 text-xs text-muted-foreground flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 flex-shrink-0"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span class="truncate flex-1">{{ imageFile.name }}</span>
          <span class="text-muted-foreground/70"
            >{{ Math.round(imageFile.size / 1024) }} KB</span
          >
        </div>
      </DialogHeader>

      <!-- Preview Section -->
      <div
        v-if="imagePreview"
        class="flex-1 overflow-auto p-6 flex flex-col items-center justify-center"
      >
        <div
          class="w-full max-w-2xl border rounded-lg overflow-hidden bg-muted/50"
        >
          <div class="p-4 bg-muted/50 border-b">
            <h3 class="text-sm font-medium text-muted-foreground">Preview</h3>
          </div>
          <div class="p-4 flex justify-center bg-background">
            <img
              :src="imagePreview"
              alt="Preview"
              class="max-h-[60vh] max-w-full object-contain"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6 w-full max-w-2xl justify-end">
          <Button variant="outline" @click="closeDialog"> Cancel </Button>
          <Button
            @click="uploadImage"
            :disabled="!imageFile || isUploading"
            class="min-w-[100px]"
          >
            <span v-if="isUploading" class="flex items-center gap-2">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
            <span v-else>Upload Image</span>
          </Button>
        </div>
      </div>

      <!-- Image Grid -->
      <div v-else class="flex-1 overflow-y-scroll">
        <div
          v-if="images.length === 0"
          class="h-full flex items-center justify-center"
        >
          <div class="text-center p-8">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-foreground mb-1">
              No images uploaded
            </h3>
            <p class="text-sm text-muted-foreground">
              Get started by uploading a new image
            </p>
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 overflow-y-auto h-full"
        >
          <Card
            v-for="image in images"
            :key="image?.id ?? image?.url"
            @click="$emit('selectedImage', image)"
            class="group relative overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20 cursor-pointer h-full flex flex-col"
          >
            <div class="aspect-square overflow-hidden bg-muted/50">
              <img
                :src="image?.url"
                :alt="image?.originalName || 'Image'"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-3 flex-1 flex flex-col">
              <div
                v-if="image?.originalName"
                class="text-sm font-medium text-foreground line-clamp-2 break-words"
                :title="image.originalName"
              >
                {{ image.originalName }}
              </div>
              <div
                v-if="image?.size"
                class="mt-1 text-xs text-muted-foreground"
              >
                {{ Math.round((image.size / 1024) * 100) / 100 }} KB
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div
        v-if="uploadError"
        class="px-6 py-3 bg-destructive/10 text-destructive text-sm rounded-b-lg"
      >
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ uploadError }}</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
