import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest configuration for RahatVerse.
 * - Unit + integration tests run in jsdom (React components, lib utilities,
 *   and API route handlers with mocked Supabase).
 * - The `@/` path alias matches the Next.js tsconfig so tests import the same
 *   modules as the application.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/**",
        "src/components/**",
        "src/store/**",
        "src/i18n/**",
        "src/types/**",
        "src/**/*.d.ts",
      ],
    },
  },
});
