import type { ParsedTable, StatusBadgeVariant } from "./schemas.js";

export type FormattedTokenType = "text" | "bold" | "italic" | "code" | "strikethrough";

export type InlineTokenType = FormattedTokenType | "link";

export type InlineToken =
  | { readonly type: FormattedTokenType; readonly content: string }
  | { readonly type: "link"; readonly content: string; readonly href: string };

export type { StatusBadgeVariant };

export interface StatusBadge {
  readonly type: StatusBadgeVariant;
  readonly label: string;
}

/**
 * Clean cell content by handling unescaping of markdown characters like pipes.
 */
export function cleanCell(val: string): string {
  return val.replace(/\\\|/g, "|").trim();
}

/**
 * Tokenizes a cell string into inline Markdown spans (`**bold**`, `*italic*`, `` `code` ``, `~~strike~~`, `[text](url)`).
 */
export function parseInlineMarkdown(text: string): InlineToken[] {
  if (!text) return [];

  const tokens: InlineToken[] = [];
  // Match inline code, bold (** or __), strikethrough (~~), links ([text](url)), or italic (* or _)
  const pattern =
    /`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|\[([^\]]+)\]\(([^)]+)\)|(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    if (match[1] !== undefined) {
      tokens.push({ type: "code", content: match[1] });
    } else if (match[2] !== undefined || match[3] !== undefined) {
      tokens.push({ type: "bold", content: match[2] ?? match[3] });
    } else if (match[4] !== undefined) {
      tokens.push({ type: "strikethrough", content: match[4] });
    } else if (match[5] !== undefined && match[6] !== undefined) {
      tokens.push({ type: "link", content: match[5], href: match[6] });
    } else if (match[7] !== undefined || match[8] !== undefined) {
      tokens.push({ type: "italic", content: match[7] ?? match[8] });
    }

    lastIndex = pattern.lastIndex;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return tokens;
}

const STATUS_BADGE_MAP: Record<string, StatusBadgeVariant> = {
  active: "success",
  healthy: "success",
  online: "success",
  passed: "success",
  pass: "success",
  success: "success",
  ready: "success",
  enabled: "success",
  completed: "success",
  complete: "success",
  done: "success",
  live: "success",
  "✓": "success",
  "✔": "success",
  pending: "warning",
  warning: "warning",
  warn: "warning",
  degraded: "warning",
  maintenance: "warning",
  queued: "warning",
  beta: "warning",
  experimental: "warning",
  error: "error",
  failed: "error",
  fail: "error",
  offline: "error",
  critical: "error",
  blocked: "error",
  down: "error",
  rejected: "error",
  deprecated: "error",
  "✗": "error",
  info: "info",
  "in progress": "info",
  running: "info",
  syncing: "info",
  deploying: "info",
  inactive: "neutral",
  disabled: "neutral",
  skipped: "neutral",
  draft: "neutral",
  archived: "neutral",
};

/**
 * Checks whether a single cell value represents a semantic status keyword that can be rendered as a pill badge.
 */
export function detectStatusBadge(cell: string): StatusBadge | null {
  const trimmed = cell.trim();
  const normalized = trimmed.toLowerCase();
  const variant = STATUS_BADGE_MAP[normalized];
  if (!variant) return null;
  return {
    type: variant,
    label: trimmed,
  };
}

/**
 * Computes smart CSS Grid column track sizing (`gridTemplateColumns`) based on cell content lengths.
 */
export function computeColumnTracks(table: ParsedTable): string {
  const colCount = table.headers.length;
  if (colCount <= 1) return "1fr";

  const maxLengths = table.headers.map((header, colIdx) => {
    let maxLen = header.length;
    for (const row of table.rows) {
      const cell = row[colIdx] ?? "";
      // Strip basic markdown formatting syntax when estimating visual character width
      const visibleLen = cell.replace(/[*_~`]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").length;
      if (visibleLen > maxLen) {
        maxLen = visibleLen;
      }
    }
    return Math.max(maxLen, 3);
  });

  // Convert character lengths into proportional fr weights with sensible min/max clamping
  // Short columns (<= 14 chars) size compactly; longer narrative columns scale dampened via sqrt/linear blend
  const weights = maxLengths.map((len) => {
    if (len <= 10) return 0.75;
    if (len <= 18) return 1.0;
    return Number(Math.min(3.2, 1.0 + (len - 18) * 0.055).toFixed(2));
  });

  return weights.map((w) => `${w}fr`).join(" ");
}

/**
 * Helper to detect if a line is an alignment separator row (e.g. `| :--- | :---: | ---: |`)
 */
export function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim();
  // Table separators must contain at least one pipe and one hyphen, and only consist of |, :, -, and spaces
  if (!trimmed.includes("|") || !trimmed.includes("-")) {
    return false;
  }
  return /^[:|\-\s]+$/.test(trimmed);
}

/**
 * Parses a raw Markdown table string into structured, safe ParsedTable data.
 */
export function parseMarkdownTable(markdown: string): ParsedTable {
  if (!markdown || markdown.trim() === "") {
    throw new Error("Markdown input is empty");
  }

  const lines = markdown.split(/\r?\n/);
  let separatorIndex = -1;

  // Find the separator row
  for (let i = 0; i < lines.length; i++) {
    if (isSeparatorRow(lines[i])) {
      separatorIndex = i;
      break;
    }
  }

  if (separatorIndex === -1) {
    throw new Error("No valid markdown table structure found (missing alignment separator row)");
  }

  // The header row is the nearest non-empty line before the separator
  let headerIndex = -1;
  for (let i = separatorIndex - 1; i >= 0; i--) {
    if (lines[i].trim() !== "") {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    throw new Error("No valid header row found before the table separator");
  }

  const rawHeaderLine = lines[headerIndex].trim();
  const rawSeparatorLine = lines[separatorIndex].trim();

  const splitColumns = (line: string): string[] => {
    const protectedLine = line.replace(/\\\\/g, "__ESCAPED_BS__");
    const cols = protectedLine
      .split(/(?<!\\)\|/)
      .map((c) => c.replace(/__ESCAPED_BS__/g, "\\\\").trim());
    if (line.startsWith("|")) cols.shift();
    if (line.endsWith("|")) cols.pop();
    return cols;
  };

  // Parse headers
  const headers = splitColumns(rawHeaderLine).map(cleanCell);
  if (headers.length === 0 || (headers.length === 1 && headers[0] === "")) {
    throw new Error("Header row is empty or invalid");
  }

  if (headers.length > 50) {
    throw new Error("Table exceeds maximum column limit (50)");
  }

  // Parse alignments from separator
  const separatorCols = splitColumns(rawSeparatorLine);
  const alignments = separatorCols.map((col): "left" | "center" | "right" => {
    const hasStart = col.startsWith(":");
    const hasEnd = col.endsWith(":");
    if (hasStart && hasEnd) return "center";
    if (hasEnd) return "right";
    return "left";
  });

  // If alignments array doesn't match headers count, pad or truncate alignments
  while (alignments.length < headers.length) {
    alignments.push("left");
  }
  const finalAlignments = alignments.slice(0, headers.length);

  // Parse data rows
  const rows: string[][] = [];
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "" || !line.includes("|")) {
      break;
    }

    if (rows.length >= 500) {
      throw new Error("Table exceeds maximum row limit (500)");
    }

    const rawCols = splitColumns(line);
    // Map and clean each cell, padding if shorter than headers, truncating if longer
    const cleanedCols = rawCols.map(cleanCell);
    while (cleanedCols.length < headers.length) {
      cleanedCols.push("");
    }
    rows.push(cleanedCols.slice(0, headers.length));
  }

  if (rows.length === 0) {
    throw new Error("No valid data rows found in the table");
  }

  return {
    headers,
    rows,
    alignments: finalAlignments,
  };
}
