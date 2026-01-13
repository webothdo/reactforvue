<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, LucideGlobe } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";

const emit = defineEmits(["alternativeCreated"]);

// Alternative form validation schema
const alternativeSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2, {
        message: "Slug must be at least 2 characters.",
      })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
    websiteUrl: z.string().url({
      message: "Please enter a valid URL.",
    }),
    description: z.string().optional(),
    faviconUrl: z.string().optional(),
    isOpenSource: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
);

// Alternative form initialization
const alternativeForm = useForm({
  validationSchema: alternativeSchema,
  initialValues: {
    name: "",
    slug: "",
    websiteUrl: "",
    description: "",
    faviconUrl: "",
    isOpenSource: true,
    isFeatured: false,
  },
});

const showModal = ref(false);
const loading = ref(false);
const isLoadingFavicon = ref(false);

const openModal = () => {
  alternativeForm.resetForm();
  showModal.value = true;
};

// Generate favicon from website URL
const generateFavicon = async () => {
  const websiteUrl = alternativeForm.values.websiteUrl;
  if (!websiteUrl) {
    toast.error("Please enter a website URL first");
    return;
  }

  isLoadingFavicon.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: string }>(
      "/api/media/favicon",
      {
        method: "POST",
        body: { url: websiteUrl },
      }
    );
    if (res.success && res.data) {
      alternativeForm.setFieldValue("faviconUrl", res.data);
      toast.success("Favicon generated successfully");
    }
  } catch (error) {
    toast.error("Failed to generate favicon: " + (error as Error).message);
  } finally {
    isLoadingFavicon.value = false;
  }
};

const createAlternative = async () => {
  const valid = await alternativeForm.validate();

  if (!valid.valid) return;

  loading.value = true;
  try {
    const { data, error } = await useFetch("/api/alternatives", {
      method: "POST",
      body: alternativeForm.values,
    });

    if (error.value) {
      console.error("Error creating alternative:", error.value);
      toast.error("Failed to create alternative");
    } else if (data.value) {
      console.log("Alternative created:", data.value);
      toast.success("Alternative created successfully");
      emit("alternativeCreated", data.value.data); // Emit event with created alternative
      alternativeForm.resetForm();
      showModal.value = false;
    }
  } catch (error) {
    console.error("Error creating alternative:", error);
    toast.error("Failed to create alternative");
  } finally {
    loading.value = false;
  }
};

// Generate slug from name for alternative form
const generateAlternativeSlug = () => {
  const name = alternativeForm.values.name;
  if (name) {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    alternativeForm.setFieldValue("slug", slug);
  }
};

// Expose methods to parent component
defineExpose({
  openModal,
});
</script>

<template>
  <!-- Modal for creating alternatives -->
  <Dialog v-model:open="showModal">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create New Alternative</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="createAlternative" class="space-y-4">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="Alternative name"
                @blur="generateAlternativeSlug"
                :class="{
                  'border-red-500': alternativeForm.errors.value?.name,
                }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="slug">
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="alternative-slug"
                :class="{
                  'border-red-500': alternativeForm.errors.value?.slug,
                }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="websiteUrl">
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="https://example.com"
                :class="{
                  'border-red-500': alternativeForm.errors.value?.websiteUrl,
                }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Favicon Section -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>Favicon</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="generateFavicon"
              :disabled="isLoadingFavicon || !alternativeForm.values.websiteUrl"
            >
              <Loader2
                v-if="isLoadingFavicon"
                class="mr-2 h-3 w-3 animate-spin"
              />
              <LucideGlobe v-else class="mr-2 h-3 w-3" />
              Fetch Favicon
            </Button>
          </div>
          <div class="flex gap-3 items-start">
            <div
              class="border rounded-lg p-2 bg-muted/50 h-12 w-12 flex items-center justify-center flex-shrink-0"
            >
              <img
                v-if="alternativeForm.values.faviconUrl"
                :src="alternativeForm.values.faviconUrl"
                alt="Favicon"
                class="h-8 w-8 object-contain"
              />
              <LucideGlobe v-else class="h-5 w-5 text-muted-foreground/50" />
            </div>
            <FormField v-slot="{ field }" name="faviconUrl">
              <FormItem class="flex-1">
                <FormControl>
                  <Input
                    v-bind="field"
                    placeholder="https://... (auto-generated)"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>

        <FormField v-slot="{ field }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                v-bind="field"
                placeholder="Brief description..."
                rows="3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Toggle Switches -->
        <div class="flex gap-6 pt-2">
          <FormField v-slot="{ field, handleChange }" name="isOpenSource">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="field.value" @update:checked="handleChange" />
              </FormControl>
              <Label>Open Source</Label>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, handleChange }" name="isFeatured">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="field.value" @update:checked="handleChange" />
              </FormControl>
              <Label>Featured</Label>
            </FormItem>
          </FormField>
        </div>

        <DialogFooter>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating..." : "Create Alternative" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
