import { nanoid } from "nanoid";
import { imagekit } from "~~/server/lib/imagekit";
import { insertImage } from "~~/server/utils/insert";

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event);
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing URL",
    });
  }

  try {
    // Extract domain from URL
    const domain = new URL(url).hostname;
    const uniqueFileName = `${nanoid()}.png`;

    // Try multiple favicon providers for robustness
    const providers = [
      {
        name: "Google S2",
        url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      },
      {
        name: "DuckDuckGo",
        url: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      },
    ];

    let lastError: any = null;
    let fileData: any = null;

    for (const provider of providers) {
      try {
        console.log(
          `Trying favicon provider: ${provider.name} for domain: ${domain}`
        );
        fileData = await imagekit.upload({
          file: provider.url,
          fileName: uniqueFileName,
          folder: "reactforvue/favicons",
        });

        // If we reach here, the upload was successful
        console.log(
          `Successfully fetched and uploaded favicon using ${provider.name}`
        );
        break;
      } catch (err) {
        lastError = err;
        console.warn(
          `Favicon fetch failed for ${provider.name}:`,
          err instanceof Error ? err.message : err
        );
        // Continue to the next provider
      }
    }

    if (!fileData) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch favicon from all providers. Last error: ${lastError?.message || "Unknown error"}`,
      });
    }

    // Create image record in database
    const newImage = await insertImage({
      url: fileData.url,
      thumbnailUrl: fileData.thumbnailUrl,
      fileId: fileData.fileId,
      filename: fileData.name,
      originalName: `${domain}-favicon`,
      size: fileData.size,
      mimeType: "image/png",
    });

    return {
      success: true,
      data: newImage.url,
    };
  } catch (error: any) {
    console.error("Critical error in favicon handler:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || error.message || "An unexpected error occurred",
    });
  }
});
