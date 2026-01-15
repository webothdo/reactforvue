import { FatalError } from "workflow";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { generateText, Output } from "ai";
import Firecrawl from "@mendable/firecrawl-js";

const apiKey = process.env.NUXT_OPENROUTER_API_KEY;
const firecrawlApiKey = process.env.NUXT_FIRECRAWL_API_KEY;
if (!apiKey) throw new Error("Missing AI Gateway API key");
if (!firecrawlApiKey) throw new Error("Missing Firecrawl API key");

const openrouter = createOpenRouter({
  apiKey: apiKey,
  compatibility: "strict",
});

export const scrapeWebsite = async (url: string) => {
  "use step";
  const firecrawl = new Firecrawl({ apiKey: firecrawlApiKey });

  const scrapedData = await firecrawl.scrape(url, {
    formats: ["markdown"],
    onlyMainContent: true,
    excludeTags: ["img", "video", "iframe"],
  });
  return { scrapedData };
};
export const generateContent = async (scrapedData?: {
  metadata?: {
    title?: string;
    description?: string;
  };
  markdown?: string;
}) => {
  "use step";
  const result = await generateText({
    model: openrouter("mistralai/devstral-2512:free"),
    system: `
      You are an expert content creator specializing in reactjs and vuejs alternatives.
      Your task is to generate high quality, engaging content to display on a directory website.
      You do not use any catchphrases or marketing speak like "best" or "top", "Empower", "Unleash", "Revolutionize", "Streamline" etc.
      `,
    prompt: `
      Provide me details  for the following data: 
      Title: ${scrapedData?.metadata?.title || ""}
      Description: ${scrapedData?.metadata?.description || ""}
      Content: ${scrapedData?.markdown || ""}
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
  });
  return { content: result.output };
};
