#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { Command } from 'commander'
import markdownToDocx, { Packer, presets } from '../dist/index.node.mjs'

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'))
const { name, description, version } = pkg
const presetNames = Object.keys(presets)

const program = new Command()

program
  .name(name)
  .description(description)
  .version(version, '-v, --version', 'output the version number')
  .addHelpText('after', `
Presets: ${presetNames.join(', ')}
See examples/sample-config.json for a full config file reference.
`.trim())
  .option('-i, --input <file>', 'input markdown file')
  .option('-o, --output <file>', 'output docx file (defaults to input filename with .docx extension)')
  .option('-p, --preset <name>', `style preset: ${presetNames.join(', ')} (default: "academic")`)
  .option('-c, --config <file>', 'JSON config file (may include preset, style, ignoreImage, math, etc.)')

program
  .command('mcp')
  .description('Start MCP server (stdio transport)')
  .action(async () => {
    const { start } = await import('./mcp.mjs')
    await start()
  })

program
  .action(doCommand)

program
  .parseAsync(process.argv)
  .catch((err) => {
    console.error(`\x1b[31mError: ${err.message}\x1b[0m`)
    if (err.message === 'Input file is required') {
      program.help()
    } else {
      console.error(err.stack)
    }
    process.exit(1)
  })

async function doCommand(options) {
  if (!options.input) {
    throw new Error('Input file is required')
  }
  if (!options.output) {
    options.output = options.input.replace(/\.mdx?$/, '.docx')
  }

  const ext = path.extname(options.output)

  if (!ext) {
    options.output += '.docx'
  } else if (ext.toLowerCase() !== '.docx') {
    throw new Error(`[${name}] Output file must be a .docx file, but got ${ext}`)
  }

  const markdownDocxOptions = {}

  if (options.config) {
    try {
      const configContent = await fs.readFile(options.config, 'utf-8')
      const baseOptions = JSON.parse(configContent)
      Object.assign(markdownDocxOptions, baseOptions)
    } catch (err) {
      throw new Error(`Failed to load config file "${options.config}": ${err.message}`)
    }
  }

  if (options.preset) {
    markdownDocxOptions.preset = options.preset
  }

  const content = await fs.readFile(options.input, 'utf-8')
  if (!content) {
    throw new Error(`[${name}] File ${options.input} is empty`)
  }

  const docx = await markdownToDocx(content, markdownDocxOptions)
  const buffer = await Packer.toBuffer(docx)

  await fs.writeFile(options.output, buffer)

  console.log(`[${name}] File ${options.output} created successfully`)
}
