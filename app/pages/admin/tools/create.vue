<script setup lang="ts">
import { Chat, experimental_useObject } from "@ai-sdk/vue";
import { DefaultChatTransport } from "ai";
import { LucideSparkles } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";

const url = ref("");
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "/api/tools/generate",
  }),
});

const { object, submit, stop, isLoading } = experimental_useObject({
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
    event.error
      ? toast.error(event.error.message)
      : toast.success("Content generated successfully. Please save tool");
  },

  onError(error) {
    toast.error("Failed to generate content: " + error.message);
  },
});

const generateContent = (e: Event) => {
  e.preventDefault();
  if (!isLoading.value) {
    submit({ url: url.value });
    url.value = "";
  }
};

// TODO: GENERATE FAVICON
// TODO: HANDLE SAVE TO DATABASE
// TODO: GENERATE SCREENSHOT
// TODO: HANDLE IMAGE UPLOAD
</script>

<template>
  <div>
    <div>
      <Input v-model="url" placeholder="Say something..." />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        @click="isLoading ? stop : generateContent"
      >
        <template #leading>
          <Spinner v-if="isLoading" />
          <LucideSparkles v-else />
        </template>
        {{ isLoading ? "Stop Generating" : "Generate Content" }}
      </Button>
    </div>
  </div>
</template>
