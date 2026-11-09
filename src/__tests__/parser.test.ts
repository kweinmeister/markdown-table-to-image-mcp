import { describe, expect, it } from "vitest";
import {
  cleanCell,
  computeColumnTracks,
  detectStatusBadge,
  isSeparatorRow,
  parseInlineMarkdown,
  parseMarkdownTable,
} from "../parser.js";

describe("Markdown Table Parser", () => {
  describe("cleanCell", () => {
    it("should trim spaces", () => {
      expect(cleanCell("  hello  ")).toBe("hello");
    });

    it("should preserve HTML tags, math expressions, and generic types cleanly (XSS protected by React JSX native auto-escaping)", () => {
      expect(cleanCell("<b>hello</b>")).toBe("<b>hello</b>");
      expect(cleanCell("A < B > C")).toBe("A < B > C");
      expect(cleanCell("List<String>")).toBe("List<String>");
      expect(cleanCell("<script>alert(1)</script>hello")).toBe("<script>alert(1)</script>hello");
    });

    it("should preserve standard markdown syntax in cells without modification", () => {
      expect(cleanCell("**bold text**")).toBe("**bold text**");
      expect(cleanCell("[link description](https://example.com)")).toBe(
        "[link description](https://example.com)",
      );
      expect(cleanCell("`codeblock`")).toBe("`codeblock`");
    });

    it("should unescape escaped pipes", () => {
      expect(cleanCell("ls \\| grep")).toBe("ls | grep");
    });
  });

  describe("isSeparatorRow", () => {
    it("should recognize standard alignment rows", () => {
      expect(isSeparatorRow("| --- | --- |")).toBe(true);
      expect(isSeparatorRow("| :--- | :---: | ---: |")).toBe(true);
      expect(isSeparatorRow("  |:---|---:|  ")).toBe(true);
    });

    it("should reject non-separator lines", () => {
      expect(isSeparatorRow("| header 1 | header 2 |")).toBe(false);
      expect(isSeparatorRow("some random text")).toBe(false);
      expect(isSeparatorRow("")).toBe(false);
    });
  });

  describe("parseMarkdownTable", () => {
    it("should parse standard well-formed table", () => {
      const md = `
| Col A | Col B | Col C |
| :--- | :---: | ---: |
| Value 1 | Value 2 | Value 3 |
| Val 4 | Val 5 | Val 6 |
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.headers).toEqual(["Col A", "Col B", "Col C"]);
      expect(parsed.alignments).toEqual(["left", "center", "right"]);
      expect(parsed.rows).toEqual([
        ["Value 1", "Value 2", "Value 3"],
        ["Val 4", "Val 5", "Val 6"],
      ]);
    });

    it("should parse tables without outer boundary pipes", () => {
      const md = `
Col A | Col B
--- | ---
Val 1 | Val 2
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.headers).toEqual(["Col A", "Col B"]);
      expect(parsed.rows).toEqual([["Val 1", "Val 2"]]);
    });

    it("should handle escaped pipes in cells", () => {
      const md = `
| Command | Result |
| --- | --- |
| ls \\| grep | filtered list |
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.rows[0][0]).toBe("ls | grep");
    });

    it("should handle escaped backslashes preceding separator pipes correctly", () => {
      const md = `
| File Path | Description |
| --- | --- |
| C:\\\\ | Root Windows folder |
| folder\\\\\\|sub | literal backslash and pipe |
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.rows[0][0]).toBe("C:\\\\");
      expect(parsed.rows[1][0]).toBe("folder\\\\|sub");
    });

    it("should preserve math expressions and generic types securely in full table renders", () => {
      const md = `
| Expression | Type |
| --- | --- |
| A < B > C | List<String> |
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.rows[0][0]).toBe("A < B > C");
      expect(parsed.rows[0][1]).toBe("List<String>");
    });

    it("should pad shorter rows and truncate longer rows", () => {
      const md = `
| Col A | Col B |
| --- | --- |
| Row 1 Col 1 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
      `;
      const parsed = parseMarkdownTable(md);
      expect(parsed.headers).toEqual(["Col A", "Col B"]);
      expect(parsed.rows).toEqual([
        ["Row 1 Col 1", ""],
        ["Row 2 Col 1", "Row 2 Col 2"],
      ]);
    });

    it("should throw errors on invalid tables", () => {
      expect(() => parseMarkdownTable("")).toThrow("Markdown input is empty");
      expect(() => parseMarkdownTable("some random text")).toThrow(
        "missing alignment separator row",
      );
      expect(() => parseMarkdownTable("| separator only |\n| --- |")).toThrow(
        "No valid data rows found in the table",
      );
    });
  });

  describe("parseInlineMarkdown", () => {
    it("should parse plain text without formatting", () => {
      expect(parseInlineMarkdown("hello world")).toEqual([
        { type: "text", content: "hello world" },
      ]);
    });

    it("should parse bold, italic, code, strikethrough, and links", () => {
      expect(parseInlineMarkdown("**bold**")).toEqual([{ type: "bold", content: "bold" }]);
      expect(parseInlineMarkdown("*italic*")).toEqual([{ type: "italic", content: "italic" }]);
      expect(parseInlineMarkdown("`code`")).toEqual([{ type: "code", content: "code" }]);
      expect(parseInlineMarkdown("~~deleted~~")).toEqual([
        { type: "strikethrough", content: "deleted" },
      ]);
      expect(parseInlineMarkdown("[Docs](https://example.com)")).toEqual([
        { type: "link", content: "Docs", href: "https://example.com" },
      ]);
    });

    it("should parse mixed inline tokens in a single string", () => {
      const tokens = parseInlineMarkdown("Run `npm test` for **fast** results!");
      expect(tokens).toEqual([
        { type: "text", content: "Run " },
        { type: "code", content: "npm test" },
        { type: "text", content: " for " },
        { type: "bold", content: "fast" },
        { type: "text", content: " results!" },
      ]);
    });
  });

  describe("detectStatusBadge", () => {
    it("should identify success status keywords", () => {
      expect(detectStatusBadge("Active")).toEqual({ type: "success", label: "Active" });
      expect(detectStatusBadge("PASSED")).toEqual({ type: "success", label: "PASSED" });
      expect(detectStatusBadge("done")).toEqual({ type: "success", label: "done" });
      expect(detectStatusBadge("✓")).toEqual({ type: "success", label: "✓" });
    });

    it("should identify warning, error, info, and neutral status keywords", () => {
      expect(detectStatusBadge("Pending")).toEqual({ type: "warning", label: "Pending" });
      expect(detectStatusBadge("FAILED")).toEqual({ type: "error", label: "FAILED" });
      expect(detectStatusBadge("Error")).toEqual({ type: "error", label: "Error" });
      expect(detectStatusBadge("In Progress")).toEqual({ type: "info", label: "In Progress" });
      expect(detectStatusBadge("Draft")).toEqual({ type: "neutral", label: "Draft" });
    });

    it("should return null for non-status strings", () => {
      expect(detectStatusBadge("Random text value")).toBeNull();
      expect(detectStatusBadge("This is active now")).toBeNull();
    });
  });

  describe("computeColumnTracks", () => {
    it("should compute proportional fr tracks based on content length", () => {
      const table = {
        headers: ["ID", "Description"],
        alignments: ["left" as const, "left" as const],
        rows: [
          ["1", "A longer description here"],
          ["2", "Another long text entry"],
        ],
      };
      const tracks = computeColumnTracks(table);
      expect(tracks).toContain("fr");
      const parts = tracks.split(" ");
      expect(parts).toHaveLength(2);
      expect(parseFloat(parts[1])).toBeGreaterThan(parseFloat(parts[0]));
    });
  });
});
