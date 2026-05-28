import type { AspectRatio } from "./schemas.js";

export type ViewportDimensions =
  | { width: number; height: number }
  | { width: number; height: undefined };

export function getViewportDimensions(
  ratio: AspectRatio,
  customWidth?: number,
): ViewportDimensions {
  const baseWidth = customWidth ?? 800;
  switch (ratio) {
    case "16:9":
      return { width: baseWidth, height: Math.round((baseWidth * 9) / 16) };
    case "1:1":
      return { width: baseWidth, height: baseWidth };
    case "9:16":
      return { width: baseWidth, height: Math.round((baseWidth * 16) / 9) };
    case "auto":
      return { width: baseWidth, height: undefined };
    default: {
      const _: never = ratio;
      return _;
    }
  }
}
