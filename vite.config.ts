import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  // For GitHub Pages, use the repository name as base path
  // This will be set via VITE_BASE_PATH environment variable
  // For Netlify, use root path
  const base = process.env.VITE_BASE_PATH || '/';
  const isGhPages = process.env.VITE_BASE_PATH !== undefined;
  // Netlify sets NETLIFY=true and CONTEXT environment variables
  const isNetlify = process.env.NETLIFY === 'true' || 
                    process.env.CONTEXT === 'production' || 
                    process.env.CONTEXT === 'deploy-preview' ||
                    process.env.CONTEXT === 'branch-deploy';
  
  const cartographerPlugin = 
    process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : [];
  
  // Determine output directory
  let outDir = path.resolve(import.meta.dirname, "dist/public");
  if (isGhPages) {
    outDir = path.resolve(import.meta.dirname, "dist");
  } else if (isNetlify) {
    outDir = path.resolve(import.meta.dirname, "dist");
  }
  
  return {
    base,
    plugins: [
      react(),
      runtimeErrorOverlay(),
      themePlugin(),
      ...cartographerPlugin,
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir,
      emptyOutDir: true,
    },
  };
});
