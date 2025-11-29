<script setup lang="ts">
definePageMeta({ layout: "admin" });
import { ref, computed, onMounted, watch } from "vue";
import { useCategoriesApi } from "@/composables/useCategoriesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formData = ref({
  name: "",
  slug: "",
  label: "",
});

const categories = ref([]);
const editingId = ref(null);
const isLoading = ref(false);
const errorMsg = ref(null);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchQuery = ref("");
const searchLoading = ref(false);
let searchTimeout = null;

const { createCategory, updateCategory, deleteCategory, getCategories } =
  useCategoriesApi();

const fetchCategories = async () => {
  isLoading.value = true;
  const { data, error } = await getCategories({
    page: page.value,
    limit: pageSize.value,
    q: searchQuery.value,
  });
  if (error && error.value) {
    errorMsg.value = error.value.message || "Failed to fetch categories";
    categories.value = [];
    total.value = 0;
  } else if (data && data.value) {
    console.log(data.value);
    categories.value = data.value.data || [];
    total.value = data.value.total || 0;
    errorMsg.value = null;
  }
  isLoading.value = false;
};

watch(searchQuery, (val, oldVal) => {
  if (val !== oldVal) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      page.value = 1;
      fetchCategories();
    }, 350);
  }
});

const handlePageChange = async (newPage) => {
  page.value = newPage;
  await fetchCategories();
};

const saveData = async () => {
  let response;
  if (editingId.value) {
    response = await updateCategory(editingId.value, formData.value);
  } else {
    response = await createCategory(formData.value);
  }
  if (response.error && response.error.value) {
    errorMsg.value = response.error.value.message || "Failed to save category";
    return;
  }
  if (response.data && response.data.value) {
    resetForm();
    editingId.value = null;
    await fetchCategories();
  }
};

const startEdit = (cat) => {
  editingId.value = cat.id;
  formData.value = { ...cat };
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this category?")) return;
  const { error } = await deleteCategory(id);
  if (!error || !error.value) {
    await fetchCategories();
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    slug: "",
    label: "",
  };
  editingId.value = null;
};

const canSubmit = computed(() => {
  return (
    formData.value.name &&
    formData.value.slug &&
    formData.value.label &&
    !isLoading.value
  );
});

onMounted(fetchCategories);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Categories Editor</h1>
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
          <label class="block text-sm font-medium mb-1">Label</label>
          <Input v-model="formData.label" placeholder="Label" />
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-1">
          {{ errorMsg }}
        </div>
        <div class="mt-4 flex items-center space-x-4">
          <Button @click="saveData" :disabled="!canSubmit"
            >{{ editingId ? "Update" : "Save" }} Category</Button
          >
          <Button variant="outline" @click="resetForm">Reset</Button>
        </div>
      </div>
      <div>
        <div class="mb-4 flex items-center gap-2">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="input input-bordered w-full max-w-xs"
          />
          <span v-if="searchLoading" class="ml-2 text-gray-500 text-sm"
            >Searching...</span
          >
        </div>
        <h2 class="text-lg font-semibold mb-2">Categories List</h2>
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
                    Label
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
                  v-for="cat in categories"
                  :key="cat.id"
                  class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td
                    class="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium"
                  >
                    {{ cat.name }}
                  </td>
                  <td
                    class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground"
                  >
                    {{ cat.slug }}
                  </td>
                  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    {{ cat.label }}
                  </td>
                  <td
                    class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right"
                  >
                    <div class="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        class="h-8 px-3"
                        @click="startEdit(cat)"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        class="h-8 px-3"
                        @click="handleDelete(cat.id)"
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
            Page {{ page }} of {{ Math.ceil(total / pageSize) || 1 }} ({{
              total
            }}
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
    </div>
  </div>
  <!-- Run: bunx shadcn-vue add Button Input if missing -->
</template>
