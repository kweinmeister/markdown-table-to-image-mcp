import type { CSSProperties } from "react";
import { getViewportDimensions } from "./dimensions.js";
import type { ParsedTable, RenderOptions } from "./schemas.js";
import { themeStyles } from "./themes.js";

export type RendererOptions = Partial<Omit<RenderOptions, "markdown" | "scale">> & {
  table: ParsedTable;
};

export function TableRenderer({
  table,
  title,
  theme = "glassmorphism",
  aspectRatio = "auto",
  customWidth = 800,
  transparentBackground = false,
}: RendererOptions) {
  const style = themeStyles[theme];
  const dimensions = getViewportDimensions(aspectRatio, customWidth);

  const { headers, rows, alignments } = table;

  // Helper to get alignment styles that Takumi natively understands
  const getAlignStyles = (align: "left" | "center" | "right"): CSSProperties => {
    return {
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      textAlign: align,
    };
  };

  // Renders the table content inside the card
  const CardContent = (
    <div
      style={{
        ...style.card,
        backgroundColor: transparentBackground ? "transparent" : style.card.backgroundColor,
      }}
    >
      {title && <div style={style.title}>{title}</div>}
      <div style={style.table}>
        {/* Header Row */}
        <div style={style.thRow}>
          {headers.map((header, idx) => {
            const align = alignments[idx] || "left";
            const cellWidthStyle: CSSProperties = {
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              ...style.th,
              ...getAlignStyles(align),
            };
            return (
              /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable column index keys */
              <div key={`th-${idx}`} style={cellWidthStyle}>
                {header}
              </div>
            );
          })}
        </div>

        {/* Data Rows */}
        {rows.map((row, rowIdx) => (
          /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable row index keys */
          <div key={`row-${rowIdx}`} style={style.tdRow}>
            {row.map((cell, colIdx) => {
              const align = alignments[colIdx] || "left";
              const cellWidthStyle: CSSProperties = {
                flex: 1,
                minWidth: 0,
                ...style.td,
                ...getAlignStyles(align),
              };
              return (
                /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable column index keys */
                <div key={`td-${rowIdx}-${colIdx}`} style={cellWidthStyle}>
                  <span>{cell}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // Render wrapped in Canvas container if not "auto" or if fixed layout is needed
  if (aspectRatio !== "auto") {
    const canvasStyle: CSSProperties = {
      ...style.canvas,
      width: dimensions.width,
      height: dimensions.height,
    };
    return <div style={canvasStyle}>{CardContent}</div>;
  }

  // Auto sizing: destructure height out so Takumi infers it from content
  const { height: _height, ...canvasWithoutHeight } = style.canvas;
  const autoCanvasStyle: CSSProperties = {
    ...canvasWithoutHeight,
    width: dimensions.width,
    padding: "24px",
  };

  return <div style={autoCanvasStyle}>{CardContent}</div>;
}
