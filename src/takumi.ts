import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { render } from "takumi-js";
import { getViewportDimensions } from "./dimensions.js";
import { type RendererOptions, TableRenderer } from "./renderer.js";
import type { ImageFormat } from "./schemas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

let fontDataCache: Map<string, Buffer> | null = null;

function loadFontData(fontName: string): Buffer {
  if (!fontDataCache) {
    fontDataCache = new Map();
  }
  const cached = fontDataCache.get(fontName);
  if (cached) return cached;

  const buffer = fs.readFileSync(getAssetPath(fontName));
  fontDataCache.set(fontName, buffer);
  return buffer;
}

function getFonts() {
  return [
    { name: "Roboto", data: () => loadFontData("Roboto-Regular.ttf"), weight: 400 },
    { name: "Roboto", data: () => loadFontData("Roboto-Bold.ttf"), weight: 700 },
    { name: "Roboto Mono", data: () => loadFontData("RobotoMono-Regular.ttf"), weight: 400 },
  ];
}

export interface RenderToImageOptions extends RendererOptions {
  scale?: number;
  format?: ImageFormat;
}

export type RenderToPngOptions = RenderToImageOptions;

export async function renderTableToImage(options: RenderToImageOptions): Promise<Buffer> {
  const scale = options.scale ?? 2;
  const theme = options.theme ?? "glassmorphism";
  const aspectRatio = options.aspectRatio ?? "auto";
  const customWidth = options.customWidth ?? 800;
  const format = options.format ?? "png";

  const dimensions = getViewportDimensions(aspectRatio, customWidth);

  const element = React.createElement(TableRenderer, {
    table: options.table,
    title: options.title,
    subtitle: options.subtitle,
    footer: options.footer,
    theme,
    aspectRatio,
    customWidth,
    transparentBackground: options.transparentBackground,
    transparentCanvas: options.transparentCanvas,
    zebraStriping: options.zebraStriping,
    statusBadges: options.statusBadges,
  });

  const fonts = getFonts();

  const image = await render(element, {
    width: dimensions.width * scale,
    height: dimensions.height ? dimensions.height * scale : undefined,
    devicePixelRatio: scale,
    fonts,
    format,
  } as Parameters<typeof render>[1]);

  return Buffer.from(image);
}

// Backward-compatible alias for existing tests and callers
export const renderTableToPng = renderTableToImage;
