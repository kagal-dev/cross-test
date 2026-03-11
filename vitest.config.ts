import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      // Thresholds: Ensuring you don't accidentally drop coverage later
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
});
