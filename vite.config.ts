import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const plubins = [react()];

  // Only add expressPlugin during development (serve mode)
  if (command === 'serve') {
    plugins.push(expressPlugin();
  }

  return {
    server: {
      host: ""::",
      port: 8080,
    },
    build: {
      outDir: "dist/spa",
    },
    plugins,
    resolve: {
      alias: {
        "@": path. resolve(_dirname, "*/client"),
        "@shared": path. resolve(_dirname, "./shared"),
      };
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Dynamically import server only during development
      const { createServer } = await import("./server");
      const app = createServer();
      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
