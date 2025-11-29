<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, X, Check } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useOpenDialog } from "~/composables/useOpenDialog";
import { useAlternativesApi } from "~/composables/useAlternativesApi";
import { useCategoriesApi } from "~/composables/useCategoriesApi";
import { useToolsApi } from "~/composables/useToolsApi";

definePageMeta({
  layout: "admin",
});

const { openDialog, closeDialog } = useOpenDialog();
const { getAlternatives } = useAlternativesApi();
const { getCategories } = useCategoriesApi();
const { createTool } = useToolsApi();

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2, {
        message: "Slug must be at least 2, characters.",
      })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
    websiteUrl: z.string().url({
      message: "Please enter a valid URL.",
    }),
    submitterName: z.string().optional(),
    submitterEmail: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
  })
);

// Main form initialization
const mainForm = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    slug: "",
    websiteUrl: "",
    submitterName: "",
    submitterEmail: "",
    description: "",
    content: "",
  },
});

const formState = reactive({
  isSubmitting: false,
  isSubmitted: false,
  submitError: null,
  imageUrl: "", // This will store the URL for display purposes, but we'll send it as screenshotUrl
  imageFile: null,
  isUploading: false,
  uploadError: null,
  uploadSuccess: false,
});

const alternatives = ref([]);
const categories = ref([]);
const selectedAlternative = ref(null);
const selectedCategory = ref(null);
const loading = ref(false);
const categoryState = reactive({
  loading: false,
  error: null,
});

// Pagination and search state
const alternativesPage = ref(1);
const alternativesPageSize = ref(50); // Higher limit for dropdowns
const alternativesTotal = ref(0);
const alternativesSearchQuery = ref("");

const categoriesPage = ref(1);
const categoriesPageSize = ref(50); // Higher limit for dropdowns
const categoriesTotal = ref(0);
const categoriesSearchQuery = ref("");
const alternativeFormRef = ref(null);
const categoryFormRef = ref(null);

const uploadImageFile = async () => {
  if (formState.imageFile) {
    const renamedImageFile = new File(
      [formState.imageFile],
      mainForm.values.name + "." + formState.imageFile?.name.split(".")[1],
      {
        type: formState.imageFile.type,
      }
    );
    formState.imageFile = await startUpload([renamedImageFile]);
  }
};

const saveData = async () => {
  // No need to validate here as handleSubmit does validation for us
  formState.isSubmitting = true;
  formState.submitError = null;

  try {
    // await uploadImageFile();

    // Combine form values with the image URL and selected alternative
    const payload = {
      ...mainForm.values,
      screenshotUrl: formState.imageUrl || undefined,
      alternativeId: selectedAlternative.value ?? null,
      categoryId: selectedCategory.value ?? null,
    };

    // Log the payload for debugging
    console.log("Form payload:", payload);
    const { data, error } = await createTool(payload);

    if (error.value) {
      formState.submitError = error.value.message || "Failed to save tool";
      console.error("Error saving tool:", error.value);
      // Clear error after 2 seconds
      setTimeout(() => {
        formState.submitError = null;
      }, 2000);
    } else if (data.value) {
      formState.isSubmitted = true;
      console.log("Tool saved:", data.value);
      // Reset form
      mainForm.resetForm();
      formState.imageUrl = "";
      formState.imageFile = null;
      formState.uploadSuccess = false;
      // Clear success message after 2 seconds
      setTimeout(() => {
        formState.isSubmitted = false;
      }, 2000);
    }
  } catch (error) {
    formState.submitError = error.message || "An unexpected error occurred";
    console.error("Error saving tool:", error);
    // Clear error after 2 seconds
    setTimeout(() => {
      formState.submitError = null;
    }, 2000);
  } finally {
    formState.isSubmitting = false;
  }
};

const fetchAlternatives = async () => {
  loading.value = true;
  const { data, error } = await getAlternatives({
    page: alternativesPage.value,
    limit: alternativesPageSize.value,
    q: alternativesSearchQuery.value,
  });

  if (error && error.value) {
    console.error("Error fetching alternatives:", error.value);
    alternatives.value = [];
    alternativesTotal.value = 0;
  } else if (data && data.value) {
    alternatives.value = data.value.data || [];
    alternativesTotal.value = data.value.total || 0;
    console.log("Alternatives fetched:", data.value);
  }

  loading.value = false;
};

const fetchCategories = async () => {
  categoryState.loading = true;
  const { data, error } = await getCategories({
    page: categoriesPage.value,
    limit: categoriesPageSize.value,
    q: categoriesSearchQuery.value,
  });

  if (error && error.value) {
    categoryState.error = error.value;
    categories.value = [];
    categoriesTotal.value = 0;
    console.error("Error fetching categories:", error.value);
  } else if (data && data.value) {
    categories.value = data.value.data || [];
    categoriesTotal.value = data.value.total || 0;
    console.log("Categories fetched:", data.value);
  }
  categoryState.loading = false;
};

// Generate slug from name for main form
const generateMainSlug = () => {
  const name = mainForm.values.name;
  console.log(name);
  if (name) {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    mainForm.setFieldValue("slug", slug);
  }
};

// Handle image selection
const handleImageSelect = (image) => {
  console.log("Image selected:", image);
  closeDialog();
  formState.imageFile = image.fileId;
  formState.imageUrl = image.url;
  formState.uploadSuccess = true;
};

const removeImage = () => {
  formState.imageUrl = "";
  formState.imageFile = null;
  formState.uploadSuccess = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const hasAlternatives = computed(() => alternatives.value.length > 0);
const hasCategories = computed(() => categories.value.length > 0);

await fetchAlternatives();
await fetchCategories();
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Editor</h1>

    <!-- Change from @submit.prevent="saveData" to handleSubmit -->
    <form @submit.prevent="saveData" class="space-y-6">
      <!-- Name input with validation -->
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Tool name"
              :class="{ 'border-red-500': mainForm.errors.name }"
              @blur="generateMainSlug"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Slug input with validation -->
      <FormField v-slot="{ componentField }" name="slug">
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="tool-slug"
              :class="{ 'border-red-500': mainForm.errors.slug }"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Website URL input with validation -->
      <FormField v-slot="{ componentField }" name="websiteUrl">
        <FormItem>
          <FormLabel>Website URL</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="https://example.com"
              :class="{ 'border-red-500': mainForm.errors.websiteUrl }"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Submitter Name input with validation -->
      <FormField v-slot="{ componentField }" name="submitterName">
        <FormItem>
          <FormLabel>Submitter Name</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Submitter Name"
              :class="{ 'border-red-500': mainForm.errors.submitterName }"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Submitter Email input with validation -->
      <FormField v-slot="{ componentField }" name="submitterEmail">
        <FormItem>
          <FormLabel>Submitter Email</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Submitter Email"
              :class="{ 'border-red-500': mainForm.errors.submitterEmail }"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Description input with validation -->
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Description"
              :class="{ 'border-red-500': mainForm.errors.description }"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Image upload section -->
      <div class="space-y-2">
        <Label>Image</Label>
        <div class="flex flex-col gap-3">
          <ImagePicker @selectedImage="handleImageSelect" />
          <Button variant="outline" @click.prevent="openDialog"
            >Select Image</Button
          >
          <div
            class="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2"
            :class="{
              'border-primary hover:border-primary/70':
                !formState.imageUrl && !formState.uploadError,
              'border-red-400': formState.uploadError,
              'border-green-400': formState.uploadSuccess,
            }"
          >
            <div v-if="formState.imageUrl" class="w-full">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Uploaded Image</span>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="removeImage"
                  class="h-8 w-8"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>
              <img
                :src="formState.imageUrl"
                alt="Uploaded image"
                class="max-h-56 rounded-md mx-auto"
              />
            </div>
          </div>
        </div>
        <p
          v-if="formState.uploadError"
          class="text-sm font-medium text-red-500 mt-1"
        >
          {{ formState.uploadError }}
        </p>
      </div>

      <!-- Alternatives selection -->
      <div class="space-y-2">
        <Label for="alternatives">Alternative</Label>
        <div class="flex gap-3">
          <div class="flex-1">
            <Select
              v-model="selectedAlternative"
              :disabled="loading || !hasAlternatives"
            >
              <SelectTrigger>
                <SelectValue
                  :placeholder="
                    loading
                      ? 'Loading alternatives...'
                      : !hasAlternatives
                        ? 'No alternatives available'
                        : 'Select an alternative'
                  "
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="alternative in alternatives"
                  :key="alternative.id"
                  :value="alternative.id"
                >
                  {{ alternative.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            @click="alternativeFormRef.openModal()"
            class="whitespace-nowrap"
            type="button"
          >
            <template v-if="loading">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Loading
            </template>
            <template v-else> Create Alternative </template>
          </Button>
        </div>
      </div>

      <!-- Categories selection -->
      <div class="space-y-2">
        <Label for="categories">Categories</Label>
        <div class="flex gap-3">
          <div class="flex-1">
            <Select
              v-model="selectedCategory"
              :disabled="categoryState.loading || !hasCategories"
            >
              <SelectTrigger>
                <SelectValue
                  :placeholder="
                    categoryState.loading
                      ? 'Loading categories...'
                      : !hasCategories
                        ? 'No categories available'
                        : 'Select categories'
                  "
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            @click="categoryFormRef.openModal()"
            class="whitespace-nowrap"
            type="button"
          >
            <template v-if="loading">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Loading
            </template>
            <template v-else> Create Alternative </template>
          </Button>
        </div>
      </div>

      <!-- Content editor -->
      <FormField v-slot="{ componentField, setValue }" name="content">
        <FormItem>
          <FormLabel for="content">Content</FormLabel>
          <FormControl>
            <TiptapEditor
              :modelValue="componentField.value || ''"
              @update:modelValue="(newContent) => setValue(newContent)"
              class="mt-2"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Submit button -->
      <Button type="submit" :disabled="formState.isSubmitting" class="mt-4">
        <Loader2
          v-if="formState.isSubmitting"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ formState.isSubmitting ? "Saving..." : "Save Tool" }}
      </Button>
    </form>

    <!-- Alternative Form Component -->
    <AlternativeForm
      ref="alternativeFormRef"
      @alternativeCreated="fetchAlternatives"
    />

    <!-- Category Form Component -->
    <CategoryForm ref="categoryFormRef" @categoryCreated="fetchCategories" />
  </div>

  <!-- Fixed position alerts at bottom -->
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <Alert
      v-if="formState.submitError"
      variant="destructive"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 shadow-lg mx-4"
    >
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ formState.submitError }}</AlertDescription>
    </Alert>
  </Transition>

  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <Alert
      v-if="formState.isSubmitted"
      variant="default"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 shadow-lg mx-4 bg-green-50 text-green-800 border-green-200"
    >
      <Check class="h-4 w-4 mr-2" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Tool successfully saved!</AlertDescription>
    </Alert>
  </Transition>
</template>
