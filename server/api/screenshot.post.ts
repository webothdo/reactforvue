import { z } from "zod";
import { Client, TakeOptions } from "screenshotone-api-sdk";

const ScreenshotRequestSchema = z.object({
  url: z.string().url(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url } = ScreenshotRequestSchema.parse(body);
  const config = useRuntimeConfig();
  const accessKey = config.screenshotoneAccessKey;
  const secretKey = config.screenshotoneSecretKey;
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: "URL is required",
    });
  }
  if (!accessKey || !secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "ScreenshotOne API key missing",
    });
  }

  // create API client
  const client = new Client(accessKey, secretKey);

  // set up options
  const options = TakeOptions.url(url)
    .format("jpg")
    .blockAds(true)
    .blockCookieBanners(true)
    .blockBannersByHeuristics(false)
    .blockTrackers(true)
    .delay(0)
    .timeout(60)
    .darkMode(true)
    .responseType("by_format")
    .imageQuality(80);

  try {
    const blob = await client.take(options);
    const buffer = await blob.arrayBuffer();
    console.log("buff", buffer);
    const base64 = Buffer.from(buffer).toString("base64");
    return { base64: `data:image/png;base64,${base64}`, blob };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "ScreenshotOne API error",
      message: (error as Error).message,
    });
  }
});
