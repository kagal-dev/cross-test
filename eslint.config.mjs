// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default [
  ...defineConfig(),
  {
    files: ['src/index.ts'],
    rules: {
      'unicorn/no-process-exit': 'off',
    },
  },
];
