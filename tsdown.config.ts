import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: { index: 'src/entry-node.ts' },
    format: 'esm',
    dts: true,
    platform: 'node',
    sourcemap: false,
    outDir: 'dist',
    clean: true,
    outExtensions: () => ({ js: '.node.mjs', dts: '.d.ts' }),
  },
  {
    entry: { index: 'src/entry-node.ts' },
    format: 'cjs',
    dts: false,
    platform: 'node',
    sourcemap: false,
    outDir: 'dist',
    clean: false,
    outExtensions: () => ({ js: '.node.cjs' }),
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: 'esm',
    platform: 'node',
    dts: false,
    sourcemap: false,
    outDir: 'dist',
    clean: false,
    outExtensions: () => ({ js: '.mjs' }),
    banner: { js: '#!/usr/bin/env node\n' },
  },
])
