import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Tests run in Node without the Cloudflare and TanStack Start plugins.
export default defineConfig({
  plugins: [viteReact()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    // The module cache keeps each glob's file list from the last run, so a
    // newly added project or essay would be invisible to the content tests.
    fsModuleCache: false,
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts']
  }
});
