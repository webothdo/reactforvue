// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "shadcn-nuxt"],
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    jinaApiKey: process.env.JINA_API_KEY,
  },
});
