import { generateContent, scrapeWebsite } from "./steps/generateSteps";

export async function handleGenerateContent(url: string) {
  "use workflow";

  //   const { scrapedData } = await scrapeWebsite(url);

  //   const { content } = await generateContent({
  //     title: scrapedData.metadata?.title || "",
  //     description: scrapedData.metadata?.description || "",
  //     content: scrapedData.markdown || "",
  //   });

  const { content } = await generateContent();

  console.log(
    "Workflow is complete! Run 'npx workflow web' to inspect your run"
  );

  console.log(content);
  return { status: "generated", content };
}
