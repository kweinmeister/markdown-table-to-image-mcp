import { FastMCP, imageContent } from "fastmcp";
import { generateCacheKey, getCachedImage, setCachedImage } from "./cache.js";
import { parseMarkdownTable } from "./parser.js";
import { renderTableToPng } from "./satori.js";
import { RenderOptionsSchema } from "./schemas.js";

// Initialize the FastMCP server instance
const server = new FastMCP({
  name: "markdown-table-to-image-mcp",
  version: "1.0.0",
});

// Register the primary markdown_table_to_image conversion tool
server.addTool({
  name: "markdown_table_to_image",
  description:
    "Converts a raw Markdown table string into a beautifully styled, high-DPI publication-ready PNG image card.",
  parameters: RenderOptionsSchema,
  execute: async (args) => {
    try {
      // 1. Safely parse the table
      const table = parseMarkdownTable(args.markdown);

      // 2. Check cache
      const cacheKey = generateCacheKey({
        markdown: args.markdown,
        title: args.title,
        theme: args.theme,
        aspectRatio: args.aspectRatio,
        scale: args.scale,
        customWidth: args.customWidth,
        transparentBackground: args.transparentBackground,
      });

      const cachedBuffer = getCachedImage(cacheKey);
      if (cachedBuffer) {
        console.error(
          `[markdown-table-to-image-mcp] Render success (cache HIT): theme=${args.theme ?? "glassmorphism"}, aspect=${args.aspectRatio ?? "auto"}, scale=${args.scale ?? 2}`,
        );
        return await imageContent({ buffer: cachedBuffer });
      }

      // 3. Render PNG
      const pngBuffer = await renderTableToPng({
        table,
        title: args.title,
        theme: args.theme,
        aspectRatio: args.aspectRatio,
        scale: args.scale,
        customWidth: args.customWidth,
        transparentBackground: args.transparentBackground,
      });

      // 4. Cache result
      setCachedImage(cacheKey, pngBuffer);

      console.error(
        `[markdown-table-to-image-mcp] Render success (cache MISS): theme=${args.theme ?? "glassmorphism"}, aspect=${args.aspectRatio ?? "auto"}, scale=${args.scale ?? 2}`,
      );

      return await imageContent({ buffer: pngBuffer });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(
        `[markdown-table-to-image-mcp] Error rendering markdown table to image: ${msg}`,
      );
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to render markdown table: ${msg}`,
          },
        ],
      };
    }
  },
});

// Start the server stdio transport
server.start();
