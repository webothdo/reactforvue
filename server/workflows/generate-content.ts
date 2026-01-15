import { generateContent, scrapeWebsite } from "./steps/generateSteps";

export async function handleGenerateContent(url: string) {
  "use workflow";

  const { scrapedData } = await scrapeWebsite(url);

  const { content } = await generateContent({
    metadata: {
      title: scrapedData.metadata?.title || "",
      description: scrapedData.metadata?.description || "",
    },
    markdown: scrapedData.markdown || "",
  });

  // const { content } = await generateContent();

  console.log(
    "Workflow is complete! Run 'npx workflow web' to inspect your run"
  );

  return { status: "generated", content };
}
