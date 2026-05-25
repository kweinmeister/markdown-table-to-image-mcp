import fs from "node:fs";
import path from "node:path";
import { parseMarkdownTable } from "../src/parser.js";
import { renderTableToPng } from "../src/satori.js";

async function main() {
  console.log("Starting manual render test...");

  const markdown = `
| Feature | Description | Status |
| :--- | :---: | ---: |
| Themes | 5 Premium layouts supported | Solid |
| Aspect Ratios | auto, 16:9, 1:1, 9:16 supported | Solid |
| High-DPI | 2x and 3x resolution scale | Crisp |
  `;

  const table = parseMarkdownTable(markdown);
  console.log("Successfully parsed test table.");

  const outputDir = path.join(process.cwd(), "test-output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Test 1: Glassmorphism auto aspect ratio
  console.log("Rendering Glassmorphism (auto)...");
  const pngBuffer = await renderTableToPng({
    table,
    title: "Markdown Table to Image MCP Server",
    theme: "glassmorphism",
    aspectRatio: "auto",
    scale: 2,
  });

  const outputPath = path.join(outputDir, "test-glassmorphism-auto.png");
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Saved output image to: ${outputPath}`);

  // Test 2: Slate Dark 16:9
  console.log("Rendering Slate Dark (16:9)...");
  const darkBuffer = await renderTableToPng({
    table,
    title: "Visual Benchmarks",
    theme: "slate-dark",
    aspectRatio: "16:9",
    scale: 2,
  });

  const darkPath = path.join(outputDir, "test-slate-dark-16-9.png");
  fs.writeFileSync(darkPath, darkBuffer);
  console.log(`Saved output image to: ${darkPath}`);

  // Test 3: Transparent Background Card 1:1
  console.log("Rendering Transparent Synthwave Card (1:1)...");
  const transparentBuffer = await renderTableToPng({
    table,
    title: "Transparent Card Test",
    theme: "synthwave",
    transparentBackground: true,
    aspectRatio: "1:1",
    scale: 2,
  });

  const transPath = path.join(outputDir, "test-synthwave-transparent.png");
  fs.writeFileSync(transPath, transparentBuffer);
  console.log(`Saved output image to: ${transPath}`);

  console.log("Manual render test completed successfully!");
}

main().catch((err) => {
  console.error("Render test failed with error:", err);
  process.exit(1);
});
