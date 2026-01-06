<script lang="ts" setup>
import { SignInButton, SignOutButton } from "@clerk/nuxt/components";
import { Button } from "~/components/ui/button";

const { isSignedIn } = useAuth();
</script>
<template>
  <div>
    <header class="flex justify-between px-3 py-2">
      <NuxtLink to="/">Home</NuxtLink>
      <div v-if="isSignedIn" class="flex justify-center gap-2">
        <Button asChild>
          <NuxtLink to="/profile"> Profile </NuxtLink>
        </Button>
        <Button asChild variant="outline">
          <SignOutButton />
        </Button>
      </div>
      <template v-else>
        <Button asChild>
          <SignInButton mode="modal" />
        </Button>
      </template>
    </header>
    <slot />
    <footer class="flex flex-col items-center mt-4 py-2 px-4 text-sm">
      <div
        class="flex flex-col w-full gap-2 pt-2 mb-4 border-t border-zinc-400"
      >
        <NuxtLink to="https://tally.so/r/w2D81V" target="_blank"
          >Submit</NuxtLink
        >
        <NuxtLink to="/"> About </NuxtLink>
      </div>
      <p class="text-zinc-400 text-xs">created with ❤️</p>
    </footer>
  </div>
</template>
