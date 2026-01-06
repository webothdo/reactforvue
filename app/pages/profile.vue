<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user } = useUser();
</script>

<template>
  <div class="container mx-auto py-10">
    <div class="flex flex-col items-center gap-6">
      <h1 class="text-3xl font-bold">Your Profile</h1>
      <UserProfile />
      <!-- <div class="p-6 border rounded-lg shadow-sm bg-card">
        <div class="flex items-center gap-4 mb-6">
          <UserButton />
          <div v-if="user">
            <p class="font-medium">{{ user.fullName }}</p>
            <p class="text-muted-foreground text-sm">
              {{ user.primaryEmailAddress?.emailAddress }}
            </p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
