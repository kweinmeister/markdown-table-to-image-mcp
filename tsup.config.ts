import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  dts: false,
  shims: true,
  clean: true,
  minify: false,
  sourcemap: true,
  publicDir: "src/assets",
});
