import fs from "node:fs";
import path from "node:path";
import { FastMCP, imageContent } from "fastmcp";
import { generateCacheKey, getCachedImage, setCachedImage } from "./cache.js";
import { getViewportDimensions } from "./dimensions.js";
import { parseMarkdownTable } from "./parser.js";
import { RenderOptionsSchema } from "./schemas.js";
import { renderTableToImage } from "./takumi.js";

// Initialize the FastMCP server instance
const server = new FastMCP({
  name: "markdown-table-to-image-mcp",
  version: "1.0.0",
});

// Register the primary markdown_table_to_image conversion tool
server.addTool({
  name: "markdown_table_to_image",
  description:
    "Converts a raw Markdown table string into a beautifully styled, high-DPI publication-ready image card (PNG, WebP, or JPEG). Supports inline formatting, status badges, custom themes, subtitles, and direct file saving.",
  parameters: RenderOptionsSchema,
  annotations: {
    title: "Markdown Table to Image",
    idempotentHint: true,
    openWorldHint: false,
    destructiveHint: false,
  },
  execute: async (args) => {
    try {
      // 1. Safely parse the table
      const table = parseMarkdownTable(args.markdown);

      // 2. Check cache
      const cacheKey = generateCacheKey({
        markdown: args.markdown,
        title: args.title,
        subtitle: args.subtitle,
        footer: args.footer,
        theme: args.theme,
        aspectRatio: args.aspectRatio,
        scale: args.scale,
        customWidth: args.customWidth,
        transparentBackground: args.transparentBackground,
        transparentCanvas: args.transparentCanvas,
        zebraStriping: args.zebraStriping,
        statusBadges: args.statusBadges,
        format: args.format,
      });

      let imageBuffer = getCachedImage(cacheKey);
      if (imageBuffer) {
        console.error(
          `[markdown-table-to-image-mcp] Render success (cache HIT): theme=${args.theme ?? "glassmorphism"}, format=${args.format ?? "png"}, aspect=${args.aspectRatio ?? "auto"}`,
        );
      } else {
        // 3. Render Image (PNG / WebP / JPEG)
        imageBuffer = await renderTableToImage({
          table,
          title: args.title,
          subtitle: args.subtitle,
          footer: args.footer,
          theme: args.theme,
          aspectRatio: args.aspectRatio,
          scale: args.scale,
          customWidth: args.customWidth,
          transparentBackground: args.transparentBackground,
          transparentCanvas: args.transparentCanvas,
          zebraStriping: args.zebraStriping,
          statusBadges: args.statusBadges,
          format: args.format,
        });

        // 4. Cache result
        setCachedImage(cacheKey, imageBuffer);

        console.error(
          `[markdown-table-to-image-mcp] Render success (cache MISS): theme=${args.theme ?? "glassmorphism"}, format=${args.format ?? "png"}, aspect=${args.aspectRatio ?? "auto"}`,
        );
      }

      // If outputPath is provided, write to disk
      if (args.outputPath) {
        const resolvedPath = path.resolve(args.outputPath);
        fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
        fs.writeFileSync(resolvedPath, imageBuffer);

        const dimensions = getViewportDimensions(
          args.aspectRatio ?? "auto",
          args.customWidth ?? 800,
        );
        const scale = args.scale ?? 2;
        const pixelW = dimensions.width * scale;
        const pixelH = dimensions.height ? dimensions.height * scale : undefined;
        const dimsStr = pixelH ? `${pixelW}x${pixelH}` : `${pixelW}px width (auto height)`;

        const imgContent = await imageContent({ buffer: imageBuffer });
        return {
          content: [
            {
              type: "text" as const,
              text: `Image successfully saved to ${args.outputPath} (${imageBuffer.length} bytes, ${dimsStr})`,
            },
            imgContent,
          ],
        };
      }

      return await imageContent({ buffer: imageBuffer });
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
