import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/courses': 'http://localhost:3000',
      '/assistant_courses': 'http://localhost:3000',
      '/available_times': 'http://localhost:3000',
      // add other API routes here as needed
    }
  }
})