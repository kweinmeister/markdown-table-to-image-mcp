import crypto from "node:crypto";
import type { AspectRatio, TableTheme } from "./schemas.js";

export interface CacheKeyPayload {
  markdown: string;
  title?: string;
  theme?: TableTheme;
  aspectRatio?: AspectRatio;
  scale?: number;
  customWidth?: number;
  transparentBackground?: boolean;
}

// Maximum number of items to hold in cache to prevent DoS memory exhaustion
const MAX_CACHE_SIZE = 100;

// The in-memory rendering cache
const cacheStore = new Map<string, Buffer>();

/**
 * Generates a safe SHA-256 hash string of the rendering parameters to serve as the cache key.
 */
export function generateCacheKey(payload: CacheKeyPayload): string {
  const serialized = JSON.stringify({
    markdown: payload.markdown,
    title: payload.title ?? "",
    theme: payload.theme ?? "glassmorphism",
    aspectRatio: payload.aspectRatio ?? "auto",
    scale: payload.scale ?? 2,
    customWidth: payload.customWidth ?? 800,
    transparentBackground: payload.transparentBackground ?? false,
  });

  return crypto.createHash("sha256").update(serialized).digest("hex");
}

/**
 * Retrieves the cached PNG buffer if present.
 */
export function getCachedImage(key: string): Buffer | undefined {
  const item = cacheStore.get(key);
  if (item) {
    // Refresh key position (simulating LRU in Map)
    cacheStore.delete(key);
    cacheStore.set(key, item);
    return item;
  }
  return undefined;
}

/**
 * Caches the PNG buffer, enforcing boundaries by removing the oldest items if the size exceeds MAX_CACHE_SIZE.
 */
export function setCachedImage(key: string, value: Buffer): void {
  // If already present, delete it first to refresh position
  if (cacheStore.has(key)) {
    cacheStore.delete(key);
  } else if (cacheStore.size >= MAX_CACHE_SIZE) {
    // Map keys() returns an iterator in insertion order.
    // The first element is the oldest inserted item.
    const oldestKey = cacheStore.keys().next().value;
    if (oldestKey !== undefined) {
      cacheStore.delete(oldestKey);
    }
  }

  cacheStore.set(key, value);
}

/**
 * Clears the cache (primarily for testing purposes).
 */
export function clearCache(): void {
  cacheStore.clear();
}

/**
 * Returns the current number of items in the cache.
 */
export function getCacheSize(): number {
  return cacheStore.size;
}
