import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  minify: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  outExtension() {
    return { js: '.mjs' };
  },
  banner: {
    js: '#!/usr/bin/env node',
  },
});
