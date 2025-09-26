import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 忽略 TypeScript 错误进行构建
    rollupOptions: {
      onwarn(_warning, _warn) {
        // 忽略所有警告
        return;
      }
    }
  },
  esbuild: {
    // 忽略 TypeScript 错误
    logOverride: { "this-is-undefined-in-esm": "silent" }
  }
});
