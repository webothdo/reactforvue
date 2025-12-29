import { streamText, UIMessage, convertToModelMessages, Output } from "ai";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import Firecrawl from "@mendable/firecrawl-js";

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openRouterApiKey;
  const firecrawlApiKey = useRuntimeConfig().firecrawlApiKey;
  if (!apiKey) throw new Error("Missing AI Gateway API key");
  if (!firecrawlApiKey) throw new Error("Missing Firecrawl API key");

  const openrouter = createOpenRouter({
    apiKey: apiKey,
  });

  const firecrawl = new Firecrawl({ apiKey: firecrawlApiKey });

  return defineEventHandler(async (event: any) => {
    const { url } = await readBody(event);

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing URL",
      });
    }

    // Scrape website content using Firecrawl
    let scrapedData;
    try {
      scrapedData = await firecrawl.scrape(url, {
        formats: ["markdown"],
        onlyMainContent: true,
        excludeTags: ["img", "video", "iframe"],
      });
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error?.message || "Failed to scrape URL",
      });
    }

    const result = streamText({
      model: openrouter("mistralai/devstral-2512:free"),
      system: `
      You are an expert content creator specializing in reactjs and vuejs alternatives.
      Your task is to generate high quality, engaging content to display on a directory website.
      You do not use any catchphrases or marketing speak like "best" or "top", "Empower", "Unleash", "Revolutionize", "Streamline" etc.
      `,
      prompt: `
      Provide me details  for the following data: 
      Title: ${scrapedData.metadata?.title || ""}
      Description: ${scrapedData.metadata?.description || ""}
      Content: ${scrapedData.markdown || ""}
      `,
      output: Output.object({
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
      }),
      onError: (error) => {
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage:
            (error.error as any)?.message ||
            (error as any)?.message ||
            JSON.stringify(error) ||
            "Failed to generate content",
        });
      },
    });

    return result.toUIMessageStreamResponse();
  });
});
