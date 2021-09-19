import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths({
      projects: ["../tsconfig.json"],
      loose: true,
    }),
  ],
  root: "./src",
  build: {
    outDir: "../frontend",
    assetsDir: "static",
    rollupOptions: {
      input: [
        "src/index.html",
        "src/share.html",
      ],
    },
  },
});
