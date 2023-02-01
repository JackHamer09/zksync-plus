import dsv from "@rollup/plugin-dsv";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    plugins: [dsv()],
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "#imports": resolve(__dirname, "./.nuxt/imports.d.ts"),
    },
  },
  test: {
    include: ["./tests/**/**.spec.ts"],
    setupFiles: ["fake-indexeddb/auto"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
