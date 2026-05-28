import { describe, expect, it } from "vitest";
import { parseMarkdownTable } from "../parser.js";
import { renderTableToPng } from "../takumi.js";

function parsePngDimensions(png: Buffer): { width: number; height: number } {
  // PNG IHDR chunk starts at byte 16: 4 bytes width, 4 bytes height (big-endian)
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  return { width, height };
}

describe("Takumi Render Engine", () => {
  it("should compile a table to a valid, non-empty PNG buffer", async () => {
    const table = parseMarkdownTable(`
| Component | Speed | Size |
| :--- | :---: | ---: |
| FastMCP | Instant | Tiny |
| Takumi | Rapid | Small |
| Biome | Blazing | Micro |
    `);

    const pngBuffer = await renderTableToPng({
      table,
      title: "Benchmark Results",
      theme: "glassmorphism",
      aspectRatio: "auto",
      scale: 1.5,
    });

    expect(pngBuffer).toBeDefined();
    expect(pngBuffer.length).toBeGreaterThan(0);
    // PNG files always start with magic bytes 0x89 0x50 0x4E 0x47
    expect(pngBuffer[0]).toBe(0x89);
    expect(pngBuffer[1]).toBe(0x50);
    expect(pngBuffer[2]).toBe(0x4e);
    expect(pngBuffer[3]).toBe(0x47);
  });

  it("should render under all standard themes and custom dimensions successfully", async () => {
    const table = parseMarkdownTable(`
| Theme | Color |
| --- | --- |
| Light | White |
| Dark | Black |
    `);

    const themes = [
      "glassmorphism",
      "slate-dark",
      "minimalist-light",
      "emerald-glow",
      "synthwave",
    ] as const;

    for (const theme of themes) {
      const buffer = await renderTableToPng({
        table,
        title: `Test Theme: ${theme}`,
        theme,
        aspectRatio: "16:9",
        customWidth: 600,
      });
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
    }
  });

  it("should scale output pixel dimensions by the scale factor", async () => {
    const table = parseMarkdownTable(`
| A | B |
| --- | --- |
| 1 | 2 |
    `);

    const png1x = await renderTableToPng({
      table,
      aspectRatio: "auto",
      customWidth: 400,
      scale: 1,
    });
    const png2x = await renderTableToPng({
      table,
      aspectRatio: "auto",
      customWidth: 400,
      scale: 2,
    });

    const dim1x = parsePngDimensions(png1x);
    const dim2x = parsePngDimensions(png2x);

    expect(dim2x.width).toBe(dim1x.width * 2);
    expect(dim2x.height).toBe(dim1x.height * 2);
  });

  it("should produce correct pixel dimensions for each aspect ratio", async () => {
    const table = parseMarkdownTable(`
| A | B |
| --- | --- |
| 1 | 2 |
    `);

    const auto = await renderTableToPng({ table, aspectRatio: "auto", customWidth: 800, scale: 1 });
    const wide = await renderTableToPng({ table, aspectRatio: "16:9", customWidth: 800, scale: 1 });
    const square = await renderTableToPng({
      table,
      aspectRatio: "1:1",
      customWidth: 800,
      scale: 1,
    });
    const tall = await renderTableToPng({ table, aspectRatio: "9:16", customWidth: 800, scale: 1 });

    const autoDim = parsePngDimensions(auto);
    const wideDim = parsePngDimensions(wide);
    const squareDim = parsePngDimensions(square);
    const tallDim = parsePngDimensions(tall);

    // auto: width matches, height shrinks to content
    expect(autoDim.width).toBe(800);
    expect(autoDim.height).toBeLessThan(800);

    // 16:9
    expect(wideDim.width).toBe(800);
    expect(wideDim.height).toBe(450);

    // 1:1
    expect(squareDim.width).toBe(800);
    expect(squareDim.height).toBe(800);

    // 9:16
    expect(tallDim.width).toBe(800);
    expect(tallDim.height).toBe(1422);
  });

  it("should render all columns within the canvas width", async () => {
    const table = parseMarkdownTable(`
| Item | Category | Status | Price |
| :--- | :--- | :---: | ---: |
| Widget Alpha | Hardware | Active | $5.99 |
| Gadget Beta | Software | Pending | $12.50 |
    `);

    const png = await renderTableToPng({
      table,
      theme: "synthwave",
      aspectRatio: "auto",
      customWidth: 800,
      scale: 1,
    });

    const { width } = parsePngDimensions(png);
    // All columns should fit within the canvas — no overflow
    expect(width).toBe(800);
  });

  it("should support rendering with transparentBackground", async () => {
    const table = parseMarkdownTable(`
| Column 1 | Column 2 |
| --- | --- |
| Value 1 | Value 2 |
    `);

    const pngBuffer = await renderTableToPng({
      table,
      title: "Transparent Table Test",
      theme: "synthwave",
      transparentBackground: true,
      aspectRatio: "1:1",
      scale: 2,
    });

    expect(pngBuffer).toBeDefined();
    expect(pngBuffer.length).toBeGreaterThan(0);
    expect(pngBuffer[0]).toBe(0x89);
    expect(pngBuffer[1]).toBe(0x50);
    expect(pngBuffer[2]).toBe(0x4e);
    expect(pngBuffer[3]).toBe(0x47);
  });
});
