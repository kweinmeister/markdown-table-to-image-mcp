import { z } from "zod";

export const TableThemeSchema = z.enum([
  "glassmorphism",
  "slate-dark",
  "minimalist-light",
  "emerald-glow",
  "synthwave",
  "editorial",
]);

export type TableTheme = z.infer<typeof TableThemeSchema>;

export const AspectRatioSchema = z.enum(["auto", "16:9", "1:1", "9:16"]);

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const ImageFormatSchema = z.enum(["png", "webp", "jpeg"]);

export type ImageFormat = z.infer<typeof ImageFormatSchema>;

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
  subtitle: z
    .string()
    .max(300)
    .optional()
    .describe("Optional subtitle or description displayed directly beneath the title."),
  footer: z
    .string()
    .max(300)
    .optional()
    .describe("Optional footer or source attribution displayed below the table."),
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
  transparentCanvas: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "When true, renders the outer canvas background as completely transparent so the card can be overlaid onto slides, videos, or custom backgrounds.",
    ),
  zebraStriping: z
    .boolean()
    .optional()
    .default(true)
    .describe("When true, applies subtle alternating background tints to even data rows."),
  statusBadges: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "When true, automatically renders common status keywords (e.g. Active, Pending, Error) as styled semantic badges.",
    ),
  format: ImageFormatSchema.optional()
    .default("png")
    .describe("Output image format: 'png' (default), 'webp', or 'jpeg'."),
  outputPath: z
    .string()
    .max(1024)
    .optional()
    .describe(
      "Optional file path on disk where the rendered image should be saved directly (parent directories are created automatically).",
    ),
});

export type RenderOptions = z.infer<typeof RenderOptionsSchema>;
