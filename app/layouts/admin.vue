<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-background">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r dark:bg-background dark:border-gray-800 flex flex-col p-4">
      <nav class="flex flex-col gap-2">
        <NuxtLink to="/admin" class="font-bold text-lg px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Dashboard</NuxtLink>
        <NuxtLink to="/alternatives" class="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Alternatives</NuxtLink>
        <NuxtLink to="/categories" class="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Categories</NuxtLink>
        <NuxtLink to="/tools" class="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Tools</NuxtLink>
        <NuxtLink to="/images" class="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Images</NuxtLink>
        <NuxtLink to="/admin/users" class="px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Users</NuxtLink>
      </nav>
    </aside>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="flex items-center justify-between p-4 border-b bg-white dark:bg-background dark:border-gray-800">
        <div class="text-xl font-semibold">Admin Dashboard</div>
        <div>
          <!-- Placeholder: user/account actions, theme switch, etc. -->
          <ColorModeComp />
        </div>
      </header>
      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Uses <ColorModeComp /> for theme switching in the top bar
// Sidebar links use NuxtLink and Tailwind classes for active/hover state
</script>
