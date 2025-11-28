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

const emit = defineEmits(["categoryCreated"]);

// Category form validation schema
const categorySchema = toTypedSchema(
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
    label: z.string().min({
      message: "Label characters.",
    }),
  })
);

// Alternative form initialization
const categoryForm = useForm({
  validationSchema: categorySchema,
  initialValues: {
    name: "",
    slug: "",
    label: "",
  },
});

const showModal = ref(false);
const loading = ref(false);

const openModal = () => {
  categoryForm.resetForm();
  showModal.value = true;
};

const createCategory = async () => {
  const valid = await categoryForm.validate();

  if (!valid) return;

  loading.value = true;
  try {
    const { data, error } = await useFetch("/api/create-category", {
      method: "POST",
      body: categoryForm.values,
    });

    if (error.value) {
      console.error("Error creating category:", error.value);
    } else if (data.value) {
      console.log("Category created:", data.value);
      emit("categoryCreated"); // Emit event to parent to refresh categories
      categoryForm.resetForm();
      showModal.value = false;
    }
  } catch (error) {
    console.error("Error creating category:", error);
  } finally {
    loading.value = false;
  }
};

// Generate slug from name for category form
const generateCategorySlug = () => {
  const name = categoryForm.values.name;
  if (name) {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    categoryForm.setFieldValue("slug", slug);
  }
};

// Expose methods to parent component
defineExpose({
  openModal,
});
</script>

<template>
  <!-- Modal for creating categories -->
  <Dialog v-model:open="showModal">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Category</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="createCategory" class="space-y-4">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="Category name"
                @blur="generateCategorySlug"
                :class="{ 'border-red-500': categoryForm.errors.name }"
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
                placeholder="category-slug"
                :class="{ 'border-red-500': categoryForm.errors.slug }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="label">
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="Label"
                :class="{
                  'border-red-500': categoryForm.errors.label,
                }"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" @click="createCategory" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? "Creating..." : "Create" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
