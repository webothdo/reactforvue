import { streamText, UIMessage, convertToModelMessages } from "ai";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openRouterApiKey;
  const jinaApiKey = useRuntimeConfig().jinaApiKey;
  if (!apiKey) throw new Error("Missing AI Gateway API key");
  const openrouter = createOpenRouter({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event: any) => {
    const { url } = await readBody(event);

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing URL",
      });
    }

    //scrape website url content
    const scrapedData = await $fetch("https://r.jina.ai", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jinaApiKey}`,
        "X-Engine": "cf-browser-rendering",
        "X-Remove-Selector": "img, video, iframe, a",
        "X-Retain-Images": "none",
        "X-Return-Format": "markdown",
      },
      body: JSON.stringify({ url }),
    });

    const result = streamText({
      model: openrouter("mistralai/devstral-2512:free"),
      system: `
      You are an expert content creator specializing in reactjs and vuejs alternatives.
      Your task is to generate high quality, engaging content to display on a directory website.
      You do not use any catchphrases or marketing speak like "best" or "top", "Empower", "Unleash", "Revolutionize", "Streamline" etc.
      `,
      prompt: "",
    });

    return result.toUIMessageStreamResponse();
  });
});
