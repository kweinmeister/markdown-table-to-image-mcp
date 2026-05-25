import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import React from "react";
import satori from "satori";
import { getViewportDimensions } from "./dimensions.js";
import { type RendererOptions, TableRenderer } from "./renderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fontCache: Array<{
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}> | null = null;

/**
 * Resolves path to asset fonts robustly across development (tsx) and production bundle environments.
 */
function getAssetPath(fontName: string): string {
  const possiblePaths = [
    path.join(__dirname, fontName),
    path.join(__dirname, "assets", fontName),
    path.join(__dirname, "..", "src", "assets", fontName),
    path.join(process.cwd(), "src", "assets", fontName),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  throw new Error(`Font asset could not be resolved in paths: ${JSON.stringify(possiblePaths)}`);
}

/**
 * Loads font files from assets once and caches them in memory.
 */
function loadFonts() {
  if (fontCache) return fontCache;

  fontCache = [
    {
      name: "Roboto",
      data: fs.readFileSync(getAssetPath("Roboto-Regular.ttf")),
      weight: 400,
      style: "normal",
    },
    {
      name: "Roboto",
      data: fs.readFileSync(getAssetPath("Roboto-Bold.ttf")),
      weight: 700,
      style: "normal",
    },
  ];

  return fontCache;
}

export interface RenderToPngOptions extends RendererOptions {
  scale?: number;
}

/**
 * Compiles the React table layout into SVG using Satori, and rasterizes it to PNG using Resvg.
 */
export async function renderTableToPng(options: RenderToPngOptions): Promise<Buffer> {
  const scale = options.scale ?? 2;
  const theme = options.theme ?? "glassmorphism";
  const aspectRatio = options.aspectRatio ?? "auto";
  const customWidth = options.customWidth ?? 800;

  // Determine sizing dimensions
  const dimensions = getViewportDimensions(aspectRatio, customWidth);
  const fonts = loadFonts();

  // Instantiate React element
  const element = React.createElement(TableRenderer, {
    table: options.table,
    title: options.title,
    theme,
    aspectRatio,
    customWidth,
    transparentBackground: options.transparentBackground,
  });

  // Compile JSX to SVG string
  // Note: dimensions.height is intentionally undefined when aspectRatio is "auto".
  // Satori natively accepts this and dynamically infers the canvas height based on the card's content size.
  const svg = await satori(element, {
    width: dimensions.width,
    height: dimensions.height,
    fonts,
  });

  // Rasterize SVG to high-DPI PNG buffer using Resvg
  const resvg = new Resvg(svg, {
    background: "transparent",
    fitTo: {
      mode: "width",
      value: dimensions.width * scale,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
