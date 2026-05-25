# Satori & Codebase Review

## Overview
This review focuses on the `satori` rendering integration, parser robustness, and adherence to the previous TypeScript architecture plan.

*(Note: The MCP `@satori-sh/cli` memory fetch failed due to network/auth issues, so this review relies on direct codebase analysis and expertise with the `satori` rendering library).*

## Findings

### 1. [HIGH] Broken Column Alignment (Missing Tailwind Support in Satori)
- **Location:** `src/renderer.tsx` (lines 388-393, 404, 423) and `src/satori.ts` (line 62).
- **Issue:** The `TableRenderer` uses `className={getAlignClass(align)}` to inject Tailwind classes (e.g., `text-center justify-center`) for column alignment. However, the `satori` function call in `src/satori.ts` does not include a Tailwind configuration. Satori natively ignores `className` unless specifically configured with Tailwind.
- **Impact:** Column alignments defined in the markdown (e.g., `:---:`) are likely being completely ignored in the rendered PNG.
- **Recommendation:** Replace the `className` logic with explicit inline style properties.
  - *Example:* Instead of `className={getAlignClass(align)}`, merge `{ justifyContent: align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start') }` into the `style` object.

### 2. [MEDIUM] Escaped Pipes in Markdown Break Parsing
- **Location:** `src/parser.ts` (lines 53-58).
- **Issue:** The `splitColumns` function uses a naive `line.split("|")`. If a user attempts to include a literal pipe character inside a table cell by escaping it (e.g., `| Command \| Flag |`), the parser will incorrectly split the cell into two columns, breaking the table structure.
- **Recommendation:** Implement a lookbehind regex or a placeholder replacement strategy to avoid splitting on `\|`.

### 3. [LOW] Aggressive HTML Stripping
- **Location:** `src/parser.ts` (lines 11-14).
- **Issue:** The `cleanCell` function uses `.replace(/<[^>]*>/g, "")` to strip HTML. While necessary to prevent Satori from breaking on invalid XML/HTML, it might inadvertently strip mathematical expressions (e.g., `A < B > C` might lose ` B ` if spacing is tight).
- **Recommendation:** Consider a more precise HTML stripping mechanism or entity encoding.

### 4. [SUCCESS] TypeScript Architecture Plan Implemented
- The objectives outlined in `conductor/typescript-review-plan.md` have been successfully implemented.
  - `TableTheme` and `AspectRatio` are centralized in `src/schemas.ts`.
  - The `themeStyles` map uses `satisfies Record<TableTheme, ThemeStyle>` avoiding inline assertions.
  - `getViewportDimensions` correctly uses an exhaustiveness check (`_exhaustiveCheck: never`).

## Proposed Next Steps
1. Refactor `renderer.tsx` to use inline styles for alignment instead of Tailwind classes.
2. Update the `parser.ts` regex to support escaped pipes `\|`.

Do you approve this assessment, and would you like me to proceed with implementing these fixes?