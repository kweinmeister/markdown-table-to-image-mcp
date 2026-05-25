import { z } from "zod";

export const TableThemeSchema = z.enum([
  "glassmorphism",
  "slate-dark",
  "minimalist-light",
  "emerald-glow",
  "synthwave",
]);

export type TableTheme = z.infer<typeof TableThemeSchema>;

export const AspectRatioSchema = z.enum(["auto", "16:9", "1:1", "9:16"]);

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

// ============================================================================
// Internal Engine Data Types
// ============================================================================

export interface ParsedTable {
  headers: string[];
  rows: string[][];
  alignments: ("left" | "center" | "right")[];
}

// ============================================================================
// Runtime MCP Tool Validation Schemas
// ============================================================================

export const RenderOptionsSchema = z.object({
  markdown: z
    .string()
    .max(50000)
    .describe(
      "The raw markdown table string to convert (must include headers and separating borders).",
    ),
  title: z
    .string()
    .max(200)
    .optional()
    .describe("Optional title text displayed above the table card."),
  theme: TableThemeSchema.optional()
    .default("glassmorphism")
    .describe("Visual theme style for the table card background, colors, and text styling."),
  aspectRatio: AspectRatioSchema.optional()
    .default("auto")
    .describe(
      "The aspect ratio proportions of the outer canvas frame ('auto' shrinks to the card dimensions).",
    ),
  scale: z
    .number()
    .min(0.5)
    .max(4)
    .optional()
    .default(2)
    .describe("Scaling density multiplier for high-DPI / Retina-sharp pixels (defaults to 2)."),
  customWidth: z
    .number()
    .int()
    .min(200)
    .max(3840)
    .optional()
    .default(800)
    .describe("The logical width of the canvas in pixels (defaults to 800)."),
  transparentBackground: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "When true, renders the card panel background as transparent. The canvas retains its theme background styling.",
    ),
});

export type RenderOptions = z.infer<typeof RenderOptionsSchema>;
