import type { CSSProperties, ReactNode } from "react";
import { getViewportDimensions } from "./dimensions.js";
import { computeColumnTracks, detectStatusBadge, parseInlineMarkdown } from "./parser.js";
import type { ParsedTable, RenderOptions } from "./schemas.js";
import { type StatusBadgeType, themeStyles } from "./themes.js";

export type RendererOptions = Partial<Omit<RenderOptions, "markdown" | "scale">> & {
  table: ParsedTable;
};

export function TableRenderer({
  table,
  title,
  subtitle,
  footer,
  theme = "glassmorphism",
  aspectRatio = "auto",
  customWidth = 800,
  transparentBackground = false,
  transparentCanvas = false,
  zebraStriping = true,
  statusBadges = true,
}: RendererOptions) {
  const style = themeStyles[theme];
  const dimensions = getViewportDimensions(aspectRatio, customWidth);
  const { headers, rows, alignments } = table;
  const gridTemplateColumns = computeColumnTracks(table);

  // Helper to get alignment styles
  const getAlignStyles = (align: "left" | "center" | "right"): CSSProperties => {
    return {
      justifySelf: align === "center" ? "center" : align === "right" ? "end" : "start",
      textAlign: align,
      width: "100%",
      display: "flex",
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
    };
  };

  const renderCellContent = (cell: string): ReactNode => {
    if (statusBadges) {
      const badge = detectStatusBadge(cell);
      if (badge) {
        const badgeStyle = style.badges[badge.type as StatusBadgeType] ?? style.badges.neutral;
        return <span style={badgeStyle}>{badge.label}</span>;
      }
    }

    const tokens = parseInlineMarkdown(cell);
    return (
      <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "2px" }}>
        {tokens.map((token, idx) => {
          const key = `token-${idx}`;
          switch (token.type) {
            case "bold":
              return (
                <strong key={key} style={{ fontWeight: 700 }}>
                  {token.content}
                </strong>
              );
            case "italic":
              return (
                <em key={key} style={{ fontStyle: "italic" }}>
                  {token.content}
                </em>
              );
            case "strike":
            case "strikethrough":
              return (
                <span key={key} style={{ textDecoration: "line-through", opacity: 0.7 }}>
                  {token.content}
                </span>
              );
            case "code":
              return (
                <code key={key} style={style.code}>
                  {token.content}
                </code>
              );
            case "link":
              return (
                <span
                  key={key}
                  style={{ textDecoration: "underline", color: "inherit", opacity: 0.9 }}
                >
                  {token.content}
                </span>
              );
            default:
              return <span key={key}>{token.content}</span>;
          }
        })}
      </span>
    );
  };

  // Renders the table content inside the card
  const CardContent = (
    <div
      style={{
        ...style.card,
        backgroundColor: transparentBackground ? "transparent" : style.card.backgroundColor,
        border: transparentBackground ? "none" : style.card.border,
        boxShadow: transparentBackground ? "none" : style.card.boxShadow,
      }}
    >
      {title && <div style={style.title}>{title}</div>}
      {subtitle && <div style={style.subtitle}>{subtitle}</div>}
      <div style={style.table}>
        {/* Header Row */}
        <div style={{ ...style.thRow, gridTemplateColumns }}>
          {headers.map((header, idx) => {
            const align = alignments[idx] || "left";
            const alignStyle = getAlignStyles(align);
            return (
              /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable column index keys */
              <div key={`th-${idx}`} style={{ ...style.th, ...alignStyle }}>
                <span>{header}</span>
              </div>
            );
          })}
        </div>

        {/* Data Rows */}
        {rows.map((row, rowIdx) => {
          const isZebra = zebraStriping && rowIdx % 2 === 1;
          const rowStyle: CSSProperties = {
            ...style.tdRow,
            gridTemplateColumns,
            ...(isZebra ? style.zebraRow : {}),
          };

          return (
            /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable row index keys */
            <div key={`row-${rowIdx}`} style={rowStyle}>
              {row.map((cell, colIdx) => {
                const align = alignments[colIdx] || "left";
                const alignStyle = getAlignStyles(align);
                return (
                  /* biome-ignore lint/suspicious/noArrayIndexKey: static table rendering relies on stable column index keys */
                  <div key={`td-${rowIdx}-${colIdx}`} style={{ ...style.td, ...alignStyle }}>
                    {renderCellContent(cell)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {footer && <div style={style.footer}>{footer}</div>}
    </div>
  );

  // Render wrapped in Canvas container if not "auto" or if fixed layout is needed
  if (aspectRatio !== "auto") {
    const canvasStyle: CSSProperties = {
      ...style.canvas,
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: transparentCanvas ? "transparent" : style.canvas.backgroundColor,
    };
    return <div style={canvasStyle}>{CardContent}</div>;
  }

  // Auto sizing: destructure height out so Takumi infers it from content
  const { height: _height, ...canvasWithoutHeight } = style.canvas;
  const autoCanvasStyle: CSSProperties = {
    ...canvasWithoutHeight,
    width: dimensions.width,
    padding: "24px",
    backgroundColor: transparentCanvas ? "transparent" : style.canvas.backgroundColor,
  };

  return <div style={autoCanvasStyle}>{CardContent}</div>;
}
