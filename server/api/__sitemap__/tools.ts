import { defineSitemapEventHandler } from "#imports";
import { db } from "../../lib/drizzle";
import { tool } from "../../db/schema";
import { desc } from "drizzle-orm";

export default defineSitemapEventHandler(async () => {
  try {
    const tools = await db.query.tool.findMany({
      columns: {
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: [desc(tool.createdAt)],
    });

    return tools.map((t) => ({
      loc: `/t/${t.slug}`,
      lastmod: t.updatedAt || t.createdAt,
      changefreq: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return empty array on error to prevent serverless crash
    return [];
  }
});
