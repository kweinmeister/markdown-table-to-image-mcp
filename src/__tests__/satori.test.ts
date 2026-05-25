import { describe, expect, it } from "vitest";
import { parseMarkdownTable } from "../parser.js";
import { renderTableToPng } from "../satori.js";

describe("Satori and Resvg Engine", () => {
  it("should compile a table to a valid, non-empty PNG buffer", async () => {
    const table = parseMarkdownTable(`
| Component | Speed | Size |
| :--- | :---: | ---: |
| FastMCP | Instant | Tiny |
| Satori | Rapid | Small |
| Resvg | Blazing | Micro |
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
