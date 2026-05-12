import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const commonDefine = {
  __VERSION__: JSON.stringify(pkg.version)
}

export default defineConfig([
  {
    entry: {
      index: 'src/entry-node.ts'
    },
    format: 'esm',
    dts: true,
    platform: 'node',
    sourcemap: false,
    outDir: 'dist',
    clean: true,
    outExtensions: () => ({ js: '.node.mjs', dts: '.d.ts' }),
    define: commonDefine,
  },
  {
    entry: {
      index: 'src/entry-node.ts'
    },
    format: ['cjs'],
    platform: 'node',
    dts: false,
    sourcemap: false,
    outExtensions: () => ({ js: '.node.cjs' }),
    define: commonDefine,
  }
])
