<script setup>
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-vue-next";
import { ref, defineEmits } from "vue";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

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
  })
);

// Alternative form initialization
const alternativeForm = useForm({
  validationSchema: alternativeSchema,
  initialValues: {
    name: "",
    slug: "",
    websiteUrl: "",
  },
});

const showModal = ref(false);
const loading = ref(false);

const openModal = () => {
  alternativeForm.resetForm();
  showModal.value = true;
};

const createAlternative = async () => {
  const valid = await alternativeForm.validate();

  if (!valid) return;

  loading.value = true;
  try {
    const { data, error } = await useFetch("/api/create-alternative", {
      method: "POST",
      body: alternativeForm.values,
    });

    if (error.value) {
      console.error("Error creating alternative:", error.value);
    } else if (data.value) {
      console.log("Alternative created:", data.value);
      emit("alternativeCreated"); // Emit event to parent to refresh alternatives
      alternativeForm.resetForm();
      showModal.value = false;
    }
  } catch (error) {
    console.error("Error creating alternative:", error);
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
    <DialogContent>
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
                :class="{ 'border-red-500': alternativeForm.errors.name }"
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
                :class="{ 'border-red-500': alternativeForm.errors.slug }"
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
                  'border-red-500': alternativeForm.errors.websiteUrl,
                }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" @click="createAlternative" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating..." : "Create" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
