import { describe, expect, it } from "vitest";
import { cleanCell, isSeparatorRow, parseMarkdownTable } from "../parser.js";

describe("Markdown Table Parser", () => {
  describe("cleanCell", () => {
    it("should trim spaces", () => {
      expect(cleanCell("  hello  ")).toBe("hello");
    });

    it("should strip HTML tags to prevent XSS/breakouts", () => {
      expect(cleanCell("<b>hello</b>")).toBe("hello");
      expect(cleanCell("<script>alert(1)</script>hello")).toBe("hello");
      expect(cleanCell("hello <img src='x' onerror='abc'/>")).toBe("hello");
    });

    it("should handle nested script injection edge cases cleanly", () => {
      // The inner script block is stripped, leaving the outer structural characters as text.
      // In a display context, this is safely rendered as plain text without executing.
      expect(cleanCell("<sc<script>ript>alert(1)</sc</script>ript>")).toBe("");
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
});
