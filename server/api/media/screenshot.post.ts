/**
 * POST /api/media/screenshot
 * Take a screenshot of a URL
 */

import { nanoid } from "nanoid";
import * as screenshotone from "screenshotone-api-sdk";
import { imagekit } from "~~/server/lib/imagekit";

const apiKey = useRuntimeConfig().screenshotoneAccessKey;
const apiSecret = useRuntimeConfig().screenshotoneSecretKey;

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event);
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing URL",
    });
  }
  const client = new screenshotone.Client(apiKey, apiSecret);

  const options = screenshotone.TakeOptions.url(url)
    .viewportWidth(1280)
    .viewportHeight(720)
    .format("webp")
    .blockAds(true)
    .blockCookieBanners(true)
    .blockBannersByHeuristics(false)
    .blockTrackers(true)
    .delay(0)
    .timeout(60)
    .darkMode(true)
    .responseType("by_format")
    .imageQuality(90);

  const blob = await client.take(options);
  const buffer = Buffer.from(await blob.arrayBuffer());

  const uniqueFileName = `${nanoid()}.webp`;

  const fileData = await imagekit.upload({
    file: buffer, // Pass the Buffer directly
    fileName: uniqueFileName,
    folder: "reactforvue",
  });

  return {
    success: true,
    url: fileData.url,
  };
});
