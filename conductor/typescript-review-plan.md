# TypeScript Architecture Review & Refactoring Plan

## Objective
To improve the type safety, maintainability, and developer experience of the `markdown-table-to-image-mcp` project by leveraging advanced TypeScript features and addressing architectural gaps in type definitions.

## Key Findings & Proposed Solutions

### 1. Eliminate Duplicate Sources of Truth (Zod vs. Manual Types)
**Issue:** Currently, `TableTheme` and `AspectRatio` are defined as manual union types in `src/renderer.tsx`, but they are also defined as Zod enums in `src/server.ts`. This creates a maintenance burden and a risk of desynchronization.
**Solution:**
- Centralize these definitions (e.g., in a `schemas.ts` or `types.ts` file).
- Define the `const ThemeEnum = z.enum(["glassmorphism", ...])`.
- Extract the TypeScript type using `export type TableTheme = z.infer<typeof ThemeEnum>;`.

### 2. Strictly Type the Theme Configuration
**Issue:** The `themeStyles` object in `src/renderer.tsx` is an untyped object literal. This forces the use of dozens of inline `as const` assertions inside the object and `as React.CSSProperties` casts in the JSX rendering logic. This circumvents the type system and risks runtime errors if an invalid CSS property is added.
**Solution:**
- Create a strict `ThemeStyle` interface defining the required components (e.g., `canvas`, `card`, `title`, etc.) where each is of type `React.CSSProperties`.
- Apply a `satisfies Record<TableTheme, ThemeStyle>` constraint to `themeStyles`. This ensures that all themes are fully implemented and strictly typed without needing inline casts.

### 3. Enforce Exhaustiveness Checking
**Issue:** The `getViewportDimensions` function in `src/renderer.tsx` uses a `switch` statement for aspect ratios, but uses a `default` block for `"auto"`. If a new aspect ratio is added in the future, the compiler will silently fall back to `"auto"` instead of warning the developer.
**Solution:**
- Handle all `AspectRatio` cases explicitly.
- Introduce an exhaustiveness check (e.g., `const _exhaustiveCheck: never = ratio;`) to guarantee at compile-time that all possible aspect ratios are handled.

### 4. Enhance `ParsedTable` with Generics (Optional/Future)
**Issue:** `ParsedTable` currently assumes all cell data are strings. While sufficient for current needs, it lacks flexibility if the parser were extended to support rich content.
**Solution:** (Low priority) Consider making `ParsedTable<T = string>` generic if future requirements dictate parsing markdown links or bold text into structured AST nodes rather than flat strings.

## Implementation Steps

1. **Extract Schemas:** Create `src/schemas.ts` and migrate the Zod schemas for the tool parameters from `src/server.ts`.
2. **Infer Types:** Derive `TableTheme`, `AspectRatio`, and `ParsedTable` types from the schemas or strict definitions.
3. **Refactor Renderer:** Update `src/renderer.tsx` to import the inferred types, apply the `satisfies` operator to `themeStyles`, and remove all `as const` and `as React.CSSProperties` assertions.
4. **Update Switch Statements:** Implement exhaustiveness checking in `getViewportDimensions`.

## Verification
- Run `npx tsc --noEmit` to ensure zero compilation errors without the need for `as any` or `as React.CSSProperties` casts.
- Run `npm test` to verify no rendering logic was broken.
