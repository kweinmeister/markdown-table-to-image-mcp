import { beforeEach, describe, expect, it } from "vitest";
import {
  clearCache,
  generateCacheKey,
  getCachedImage,
  getCacheSize,
  setCachedImage,
} from "../cache.js";
import type { TableTheme } from "../schemas.js";

describe("Memory Rendering Cache", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should cache and retrieve image buffers successfully", () => {
    const payload = {
      markdown: "| A |\n| --- |\n| B |",
      theme: "glassmorphism" as TableTheme,
    };
    const key = generateCacheKey(payload);
    const buffer = Buffer.from("fake-png-bytes");

    setCachedImage(key, buffer);
    const cached = getCachedImage(key);

    expect(cached).toBeDefined();
    expect(cached?.toString()).toBe("fake-png-bytes");
    expect(getCacheSize()).toBe(1);
  });

  it("evicts oldest entry when MAX_CACHE_SIZE is reached", () => {
    // Set cache up to MAX_CACHE_SIZE (100 items)
    const buffers = Array.from({ length: 101 }, (_, i) => Buffer.from(`png-bytes-${i}`));
    const keys = Array.from({ length: 101 }, (_, i) =>
      generateCacheKey({
        markdown: `table-${i}`,
        theme: "glassmorphism" as TableTheme,
      }),
    );

    // Insert 100 items
    for (let i = 0; i < 100; i++) {
      setCachedImage(keys[i], buffers[i]);
    }
    expect(getCacheSize()).toBe(100);

    // The very first inserted item (index 0) should be in cache
    expect(getCachedImage(keys[0])).toBeDefined();

    // Insert 101st item. Since cache size limit is 100, this must trigger eviction.
    // The oldest inserted item (which is now index 1, since index 0 was hit and refreshed!) should remain,
    // but index 1 is now the oldest since index 0 was refreshed!
    // Let's clear cache first and insert without hit to keep the math simple:
    clearCache();

    for (let i = 0; i < 100; i++) {
      setCachedImage(keys[i], buffers[i]);
    }
    // key[0] is the oldest.
    // Now insert key[100] to trigger eviction
    setCachedImage(keys[100], buffers[100]);

    expect(getCacheSize()).toBe(100);
    // The oldest (key[0]) should be evicted!
    expect(getCachedImage(keys[0])).toBeUndefined();
    // The others should remain
    expect(getCachedImage(keys[1])).toBeDefined();
    expect(getCachedImage(keys[100])).toBeDefined();
  });

  it("refreshes key position on cache hit", () => {
    const keyA = generateCacheKey({ markdown: "A" });
    const keyB = generateCacheKey({ markdown: "B" });
    const bufferA = Buffer.from("A");
    const bufferB = Buffer.from("B");

    setCachedImage(keyA, bufferA);
    setCachedImage(keyB, bufferB);

    // Hit A to refresh its position to "newest"
    const hitA = getCachedImage(keyA);
    expect(hitA).toBeDefined();

    // Now trigger eviction by filling cache. To simulate eviction, we can make cache store MAX_CACHE_SIZE items.
    // Since we want to verify that B is evicted before A because A was refreshed, let's write a simple sequence:
    // We have 100 maximum size.
    clearCache();

    const keys = Array.from({ length: 101 }, (_, i) => generateCacheKey({ markdown: `t-${i}` }));
    const bufs = Array.from({ length: 101 }, (_, i) => Buffer.from(`b-${i}`));

    // Load 100 items (keys 0 to 99)
    for (let i = 0; i < 100; i++) {
      setCachedImage(keys[i], bufs[i]);
    }

    // key[0] is the oldest. Let's hit key[0] to refresh it.
    getCachedImage(keys[0]);

    // Now key[1] is the oldest!
    // Insert the 101st item (keys[100]) which triggers eviction.
    setCachedImage(keys[100], bufs[100]);

    // Expect key[1] to be evicted, but key[0] to still exist in cache!
    expect(getCachedImage(keys[1])).toBeUndefined();
    expect(getCachedImage(keys[0])).toBeDefined();
  });

  it("setCachedImage on existing key updates without growing size", () => {
    const key = generateCacheKey({ markdown: "A" });
    const buffer1 = Buffer.from("first");
    const buffer2 = Buffer.from("second");

    setCachedImage(key, buffer1);
    expect(getCacheSize()).toBe(1);
    expect(getCachedImage(key)?.toString()).toBe("first");

    setCachedImage(key, buffer2);
    expect(getCacheSize()).toBe(1); // size should still be 1
    expect(getCachedImage(key)?.toString()).toBe("second"); // value is updated
  });
});
