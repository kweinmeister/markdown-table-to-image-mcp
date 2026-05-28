import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { render } from "takumi-js";
import { getViewportDimensions } from "./dimensions.js";
import { type RendererOptions, TableRenderer } from "./renderer.js";

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
    { name: "Roboto", data: () => loadFontData("Roboto-Regular.ttf") },
    { name: "Roboto", data: () => loadFontData("Roboto-Bold.ttf") },
  ];
}

export interface RenderToPngOptions extends RendererOptions {
  scale?: number;
}

export async function renderTableToPng(options: RenderToPngOptions): Promise<Buffer> {
  const scale = options.scale ?? 2;
  const theme = options.theme ?? "glassmorphism";
  const aspectRatio = options.aspectRatio ?? "auto";
  const customWidth = options.customWidth ?? 800;

  const dimensions = getViewportDimensions(aspectRatio, customWidth);

  const element = React.createElement(TableRenderer, {
    table: options.table,
    title: options.title,
    theme,
    aspectRatio,
    customWidth,
    transparentBackground: options.transparentBackground,
  });

  const fonts = getFonts();

  const image = await render(element, {
    width: dimensions.width * scale,
    height: dimensions.height ? dimensions.height * scale : undefined,
    devicePixelRatio: scale,
    fonts,
    format: "png",
  });

  return Buffer.from(image);
}
