// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "shadcn-nuxt",
    "@clerk/nuxt",
    "@nuxtjs/seo",
    "@nuxtjs/color-mode",
    "workflow/nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  clerk: {
    skipServerMiddleware: true,
  },
  site: {
    url: "https://www.reactforvue.com",
    name: "React for Vue",
    description:
      "Discover the best vue alternatives for popular react libraries and tools.",
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    openRouterApiKey: process.env.NUXT_OPENROUTER_API_KEY,
    firecrawlApiKey: process.env.NUXT_FIRECRAWL_API_KEY,
    screenshotoneAccessKey: process.env.NUXT_SCREENSHOTONE_ACCESS_KEY,
    screenshotoneSecretKey: process.env.NUXT_SCREENSHOTONE_SECRET_KEY,
  },
});
