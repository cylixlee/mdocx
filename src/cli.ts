import fs from 'node:fs/promises'
import path from 'node:path'
import { Command } from 'commander'
import markdownToDocx, { MarkdownDocx, Packer, presets } from './index'
import { downloadImage } from './adapters/nodejs'
import { start } from './mcp'

MarkdownDocx.defaultOptions.imageAdapter = downloadImage

const pkg = JSON.parse(
  await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8')
)

const NAME        = 'mdocx'
const DESCRIPTION = 'Convert Markdown file to DOCX format'
const VERSION     = pkg.version

const presetNames = Object.keys(presets)

const program = new Command()

program
  .name(NAME)
  .description(DESCRIPTION)
  .version(VERSION, '-v, --version', 'output the version number')
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
    await start()
  })

program
  .action(doCommand)

program
  .parseAsync(process.argv)
  .catch((err: Error) => {
    console.error(`\x1b[31mError: ${err.message}\x1b[0m`)
    if (err.message === 'Input file is required') {
      program.help()
    } else {
      console.error(err.stack)
    }
    process.exit(1)
  })

async function doCommand(options: Record<string, any>) {
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
    throw new Error(`[${NAME}] Output file must be a .docx file, but got ${ext}`)
  }

  const markdownDocxOptions: Record<string, any> = {}

  if (options.config) {
    try {
      const configContent = await fs.readFile(options.config, 'utf-8')
      const baseOptions = JSON.parse(configContent)
      Object.assign(markdownDocxOptions, baseOptions)
    } catch (err: any) {
      throw new Error(`Failed to load config file "${options.config}": ${err.message}`)
    }
  }

  if (options.preset) {
    markdownDocxOptions.preset = options.preset
  }

  markdownDocxOptions.baseDir = path.dirname(path.resolve(options.input))

  const content = await fs.readFile(options.input, 'utf-8')
  if (!content) {
    throw new Error(`[${NAME}] File ${options.input} is empty`)
  }

  const docx = await markdownToDocx(content, markdownDocxOptions)
  const buffer = Buffer.from(await Packer.toBuffer(docx))

  await fs.writeFile(options.output, buffer)

  console.log(`[${NAME}] File ${options.output} created successfully`)
}
