<script setup lang="ts">
import { experimental_useObject as useObject } from "@ai-sdk/vue";
import {
  LucideSparkles,
  LucideImage,
  LucideGlobe,
  LucideSave,
  LucideLoader2,
  LucidePlus,
} from "lucide-vue-next";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import slugify from "slugify";

// UI Components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import AlternativeForm from "~/components/AlternativeForm.vue";

// Types
import type { CreateToolInput } from "~~/server/types";

// State
const isLoadingFavicon = ref(false);
const isLoadingScreenshot = ref(false);
const isSubmitting = ref(false);

const form = ref<CreateToolInput>({
  name: "",
  slug: "",
  websiteUrl: "",
  tagline: "",
  description: "",
  content: "",
  screenshotUrl: "",
  faviconUrl: "",
  categoryId: undefined,
  alternativeId: undefined,
  isOpenSource: true,
  isFeatured: false,
});

// Fetch Categories
const { data: categories } = await useFetch("/api/categories");

// Fetch Alternatives
const { data: alternativesData, refresh: refreshAlternatives } =
  await useFetch("/api/alternatives");
const alternatives = computed(() => alternativesData.value?.data || []);
const selectedAlternative = ref<string | undefined>(undefined);
const alternativeFormRef = ref<InstanceType<typeof AlternativeForm> | null>(
  null
);

// AI Content Generation
const {
  object,
  submit,
  stop,
  isLoading: isGeneratingContent,
} = useObject({
  api: "/api/tools/generate",
  schema: z.object({
    tagline: z
      .string()
      .describe(
        "A compelling tagline (max 60 char) that captures the tool's unique value proposition. Avoid tool name, focus on benefits."
      ),
    description: z
      .string()
      .describe(
        "A consice meta description (max 160 chars) highlighting key features and benefits. Use active voice, and avoid tool name"
      ),
    content: z
      .string()
      .describe(
        "A detailed and engaging longer description with key benefits (up to 1000 chars). Should be markdown formatted, should start with paragraph, and not use headings. Highlight important points with bold text. Make sure the lists use correct Markdown syntax and are properly formatted. End with a brief conclusion paragraph."
      ),
  }),
  onFinish(event) {
    if (event.error) {
      toast.error(event.error.message);
    } else if (event.object) {
      form.value.tagline = event.object.tagline;
      form.value.description = event.object.description;
      form.value.content = event.object.content;
      toast.success("Content generated successfully");
    }
  },
  onError(error) {
    console.log(error);
    toast.error("Failed to generate content: " + error.message);
  },
});

// Watchers
watch(
  () => form.value.name,
  (newName) => {
    if (newName && !form.value.slug) {
      form.value.slug = slugify(newName, { lower: true, strict: true });
    }
  }
);

// Sync selected alternative with form
watch(selectedAlternative, (newValue) => {
  form.value.alternativeId = newValue;
});

// Handle alternative created event
const onAlternativeCreated = (newAlternative: any) => {
  refreshAlternatives();
  if (newAlternative?.id) {
    selectedAlternative.value = newAlternative.id;
  }
};

// Actions
const generateContent = () => {
  try {
    if (!form.value.websiteUrl)
      return toast.error("Please enter a website URL");
    submit({ url: form.value.websiteUrl });
  } catch (error: any) {
    toast.error("Failed to generate content: " + error.message);
    console.log(error);
  }
};

const generateFavicon = async () => {
  if (!form.value.websiteUrl) return toast.error("Please enter a website URL");

  isLoadingFavicon.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: string }>(
      "/api/media/favicon",
      {
        method: "POST",
        body: { url: form.value.websiteUrl },
      }
    );
    if (res.success && res.data) {
      form.value.faviconUrl = res.data;
      toast.success("Favicon generated successfully");
    }
  } catch (error: any) {
    toast.error("Failed to generate favicon: " + error.message);
  } finally {
    isLoadingFavicon.value = false;
  }
};

const generateScreenshot = async () => {
  if (!form.value.websiteUrl) return toast.error("Please enter a website URL");

  isLoadingScreenshot.value = true;
  try {
    const res = await $fetch<{ success: boolean; url: string }>(
      "/api/media/screenshot",
      {
        method: "POST",
        body: { url: form.value.websiteUrl },
      }
    );
    if (res.success && res.url) {
      form.value.screenshotUrl = res.url;
      toast.success("Screenshot generated successfully");
    }
  } catch (error: any) {
    toast.error("Failed to generate screenshot: " + error.message);
  } finally {
    isLoadingScreenshot.value = false;
  }
};

const saveTool = async () => {
  if (!form.value.name || !form.value.slug || !form.value.websiteUrl) {
    return toast.error(
      "Please fill in all required fields (Name, Slug, Key URL)"
    );
  }

  isSubmitting.value = true;
  try {
    await $fetch("/api/tools", {
      method: "POST",
      body: form.value,
    });
    toast.success("Tool created successfully");
    navigateTo("/admin/tools");
  } catch (error: any) {
    toast.error("Failed to create tool: " + error.message);
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Add New Tool</h1>
        <p class="text-muted-foreground mt-2">
          Create a new tool listing with AI-generated content.
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" to="/admin/tools">Cancel</Button>
        <Button @click="saveTool" :disabled="isSubmitting">
          <LucideLoader2
            v-if="isSubmitting"
            class="mr-2 h-4 w-4 animate-spin"
          />
          <LucideSave v-else class="mr-2 h-4 w-4" />
          Save Tool
        </Button>
      </div>
    </div>

    <div class="grid gap-8">
      <!-- Main Info Card -->
      <Card>
        <CardHeader>
          <CardTitle>Core Information</CardTitle>
          <CardDescription>
            Enter the website URL to auto-generate content.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex gap-4 items-end">
            <div class="grid w-full items-center gap-1.5">
              <Label for="url">Website URL</Label>
              <Input
                id="url"
                v-model="form.websiteUrl"
                placeholder="https://example.com"
                :disabled="isGeneratingContent"
              />
            </div>

            <Button
              variant="secondary"
              @click="isGeneratingContent ? stop() : generateContent()"
              :disabled="!form.websiteUrl"
              class="min-w-[180px]"
            >
              <LucideLoader2
                v-if="isGeneratingContent"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <LucideSparkles v-else class="mr-2 h-4 w-4" />
              {{ isGeneratingContent ? "Stop Generating" : "Generate Content" }}
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="name">Tool Name</Label>
              <Input id="name" v-model="form.name" placeholder="e.g. Vue.js" />
            </div>
            <div class="space-y-2">
              <Label for="slug">Slug</Label>
              <Input id="slug" v-model="form.slug" placeholder="e.g. vue-js" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="category">Category</Label>
            <Select v-model="form.categoryId">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="category in categories?.data"
                  :key="category.id"
                  :value="category.id"
                  :text-value="category.name"
                >
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Alternative Selection -->
          <div class="space-y-2">
            <Label for="alternative">Alternative To</Label>
            <div class="flex gap-3">
              <div class="flex-1">
                <Select v-model="selectedAlternative">
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select an alternative (optional)"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="alternative in alternatives"
                      :key="alternative.id"
                      :value="alternative.id"
                      :text-value="alternative.name"
                    >
                      {{ alternative.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                type="button"
                @click="alternativeFormRef?.openModal()"
              >
                <LucidePlus class="mr-2 h-4 w-4" />
                Create Alternative
              </Button>
            </div>
          </div>

          <div class="flex gap-8 pt-2">
            <div class="flex items-center space-x-2">
              <Switch id="open-source" v-model:checked="form.isOpenSource" />
              <Label for="open-source">Open Source</Label>
            </div>
            <div class="flex items-center space-x-2">
              <Switch id="featured" v-model:checked="form.isFeatured" />
              <Label for="featured">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Content Card -->
      <Card>
        <CardHeader>
          <CardTitle>Content & SEO</CardTitle>
          <CardDescription>
            Optimize your tool's presentation for search engines and users.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label for="tagline">Tagline</Label>
            <Input
              id="tagline"
              v-model="form.tagline"
              placeholder="A short, catchy phrase..."
            />
            <p class="text-xs text-muted-foreground">
              {{ form.tagline?.length || 0 }}/60 characters
            </p>
          </div>

          <div class="space-y-2">
            <Label for="description">Meta Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Brief overview for SEO..."
              rows="3"
            />
            <p class="text-xs text-muted-foreground">
              {{ form.description?.length || 0 }}/160 characters
            </p>
          </div>

          <div class="space-y-2">
            <Label for="content">Detailed Content (Markdown)</Label>
            <Textarea
              id="content"
              v-model="form.content"
              placeholder="# Key Features..."
              class="min-h-[300px] font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Media Card -->
      <Card>
        <CardHeader>
          <CardTitle>Media Assets</CardTitle>
          <CardDescription>
            Manage visual assets for the tool card and page.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-8">
          <!-- Favicon Section -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <Label>Favicon</Label>
              <Button
                variant="outline"
                size="sm"
                @click="generateFavicon"
                :disabled="isLoadingFavicon || !form.websiteUrl"
              >
                <LucideLoader2
                  v-if="isLoadingFavicon"
                  class="mr-2 h-3 w-3 animate-spin"
                />
                <LucideGlobe v-else class="mr-2 h-3 w-3" />
                Fetch Favicon
              </Button>
            </div>
            <div class="flex gap-4 items-start">
              <div
                class="border rounded-lg p-2 bg-muted/50 h-16 w-16 flex items-center justify-center flex-shrink-0"
              >
                <img
                  v-if="form.faviconUrl"
                  :src="form.faviconUrl"
                  alt="Favicon"
                  class="h-10 w-10 object-contain"
                />
                <LucideGlobe v-else class="h-6 w-6 text-muted-foreground/50" />
              </div>
              <Input v-model="form.faviconUrl" placeholder="https://..." />
            </div>
          </div>

          <!-- Screenshot Section -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <Label>Screenshot</Label>
              <Button
                variant="outline"
                size="sm"
                @click="generateScreenshot"
                :disabled="isLoadingScreenshot || !form.websiteUrl"
              >
                <LucideLoader2
                  v-if="isLoadingScreenshot"
                  class="mr-2 h-3 w-3 animate-spin"
                />
                <LucideImage v-else class="mr-2 h-3 w-3" />
                Generate Screenshot
              </Button>
            </div>
            <div class="space-y-3">
              <div
                class="border rounded-lg bg-muted/50 aspect-video w-full flex items-center justify-center overflow-hidden relative group"
              >
                <img
                  v-if="form.screenshotUrl"
                  :src="form.screenshotUrl"
                  alt="Screenshot"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-center p-4">
                  <LucideImage
                    class="h-12 w-12 text-muted-foreground/30 mx-auto mb-2"
                  />
                  <span class="text-sm text-muted-foreground"
                    >No screenshot generated</span
                  >
                </div>
              </div>
              <Input v-model="form.screenshotUrl" placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Bottom Actions -->
      <div class="flex justify-end gap-4">
        <Button variant="outline" to="/admin/tools">Cancel</Button>
        <Button @click="saveTool" :disabled="isSubmitting" size="lg">
          <LucideLoader2
            v-if="isSubmitting"
            class="mr-2 h-4 w-4 animate-spin"
          />
          <LucideSave v-else class="mr-2 h-4 w-4" />
          Save Tool
        </Button>
      </div>
    </div>
  </div>

  <!-- Alternative Form Modal -->
  <AlternativeForm
    ref="alternativeFormRef"
    @alternativeCreated="onAlternativeCreated"
  />
</template>
