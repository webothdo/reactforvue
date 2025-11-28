<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Home,
  Users,
  Settings,
  BarChart3,
  User,
  LogOut,
  HelpCircle,
  Image,
  FileIcon,
  FolderClosed,
  Star,
} from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();
const isOpen = ref(false);

// Navigation structure with grouping and icons
const navigationGroups = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/", icon: Home },
      { name: "Category", path: "/categories", icon: FolderClosed },
      { name: "Tools", path: "/tools", icon: FileIcon },
      { name: "Alternatives", path: "/alternatives", icon: Star },
      { name: "Images", path: "/images", icon: Image },
      { name: "Reports", path: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile", path: "/profile", icon: User },
      { name: "Settings", path: "/settings", icon: Settings },
    ],
  },
  {
    label: "Other",
    items: [
      {
        name: "Help & Support",
        path: "/help",
        icon: HelpCircle,
        shortcut: "?",
      },
      { name: "Logout", path: "/logout", icon: LogOut },
    ],
  },
];

// Check if a route is active
const isActiveRoute = (path: string) => {
  return route.path === path;
};

// Function to navigate to a route
const navigateTo = (path: string) => {
  router.push(path);
  isOpen.value = false; // Close dropdown after navigation
};

// Toggle dropdown manually
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// For responsive design
const isMobile = computed(() => {
  // You might want to use a more robust solution like a composable
  return window?.innerWidth < 768;
});
</script>

<template>
  <div class="hamburger-menu">
    <DropdownMenu v-model:open="isOpen">
      <DropdownMenuTrigger
        class="flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
        :class="{ 'bg-gray-100 dark:bg-gray-800': isOpen }"
      >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        class="w-64 p-1"
        :class="{ 'w-full max-w-xs': isMobile }"
      >
        <div v-for="(group, index) in navigationGroups" :key="`group-${index}`">
          <DropdownMenuLabel class="px-2 py-1.5 text-sm font-semibold">
            {{ group.label }}
          </DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="item in group.items"
              :key="item.path"
              @click="navigateTo(item.path)"
              class="cursor-pointer flex items-center gap-2 p-2 rounded-md"
              :class="{
                'bg-primary/10 text-primary': isActiveRoute(item.path),
              }"
            >
              <component :is="item.icon" class="h-4 w-4" />
              <span>{{ item.name }}</span>
              <DropdownMenuShortcut v-if="item.shortcut">{{
                item.shortcut
              }}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator
            v-if="index < navigationGroups.length - 1"
            class="my-1"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style scoped>
/* .hamburger-menu {
  @apply relative;
} */

/* Animation for the hamburger icon */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.hamburger-menu:hover :deep(svg) {
  animation: pulse 0.3s ease-in-out;
}

/* Dark mode support
:deep(.dark .dropdown-menu-content) {
  @apply bg-gray-900 border-gray-800;
} */

/* Responsive adjustments */
/* @media (max-width: 768px) {
  .hamburger-menu {
    @apply block w-full;
  }
} */
</style>
