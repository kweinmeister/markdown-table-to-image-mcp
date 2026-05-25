import type { ParsedTable } from "./schemas.js";

/**
 * Clean cell content by stripping HTML tags to prevent XSS or Satori JSX structural breakouts.
 * Also handles unescaping of markdown characters like pipes.
 */
export function cleanCell(val: string): string {
  return val
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\\\|/g, "|")
    .trim();
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

  // Split and helper to strip leading/trailing empty items from boundary pipes
  // Note: Uses a negative lookbehind to avoid splitting on escaped pipes (\|)
  const splitColumns = (line: string): string[] => {
    // split by pipe | that is not preceded by a backslash \
    const cols = line.split(/(?<!\\)\|/).map((c) => c.trim());
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
    // Stop parsing if we reach an empty line or a line that does not look like a table row
    if (line === "" || (!line.includes("|") && line !== "")) {
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
