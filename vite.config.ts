import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/app/components"),
      "@ui": path.resolve(__dirname, "./src/app/components/ui"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
            "lucide-react",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "vaul",
            "next-themes",
            "input-otp",
            "embla-carousel-react",
            "cmdk",
            "sonner",
            "tw-animate-css",
          ],
          three: ["@react-three/drei", "@react-three/fiber", "three"],
          charts: ["react-mini-chart", "recharts"],
          markdown: ["react-markdown", "remark-gfm"],
          forms: ["@hookform/resolvers"],
          dnd: ["@dnd-kit/core"],
          query: ["@tanstack/react-query"],
          state: ["zustand"],
          utils: [
            "axios",
            "zod",
            "date-fns",
            "nanoid",
            "react-data-table-component",
            "react-day-picker",
            "react-dropzone",
            "react-resizable-panels",
            "styled-components",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
