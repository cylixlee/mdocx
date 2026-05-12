import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod/v4-mini'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import markdownToDocx, { Packer, presets } from '../dist/index.node.mjs'

function resolveOutputPath(inputPath, outputPath) {
  if (outputPath) return outputPath
  return inputPath.replace(/\.mdx?$/, '.docx')
}

async function loadConfigFile(configPath) {
  const content = await fs.readFile(configPath, 'utf-8')
  return JSON.parse(content)
}

export async function start() {
  const pkg = JSON.parse(
    await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8')
  )

  const server = new McpServer(
    { name: 'mdocx', version: pkg.version },
    { capabilities: { tools: {} } }
  )

  server.registerTool(
    'convert_markdown_to_docx',
    {
      description: 'Convert a Markdown file to DOCX format.',
      inputSchema: {
        inputPath: z.string({ description: 'Path to the input Markdown file (.md)' }),
        outputPath: z.optional(z.string({ description: 'Path for the output DOCX file (defaults to input filename with .docx extension)' })),
        preset: z.optional(z.enum(Object.keys(presets), { description: `Style preset: ${Object.keys(presets).join(', ')} (default: "academic")` })),
        config: z.optional(z.string({ description: 'Path to a JSON config file (may include preset, style, ignoreImage, math, etc.)' })),
      },
    },
    async (args) => {
      const { inputPath, outputPath, preset, config: configPath } = args

      const resolvedOutput = resolveOutputPath(inputPath, outputPath)
      const ext = path.extname(resolvedOutput)
      if (ext && ext.toLowerCase() !== '.docx') {
        return {
          content: [{ type: 'text', text: `Output file must be a .docx file, but got ${ext}` }],
          isError: true,
        }
      }

      const options = {}

      if (configPath) {
        try {
          const configOptions = await loadConfigFile(configPath)
          Object.assign(options, configOptions)
        } catch (err) {
          return {
            content: [{ type: 'text', text: `Failed to load config file "${configPath}": ${err.message}` }],
            isError: true,
          }
        }
      }

      if (preset) {
        options.preset = preset
      }

      let content
      try {
        content = await fs.readFile(inputPath, 'utf-8')
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Failed to read input file "${inputPath}": ${err.message}` }],
          isError: true,
        }
      }

      if (!content) {
        return {
          content: [{ type: 'text', text: `Input file "${inputPath}" is empty` }],
          isError: true,
        }
      }

      let docx
      try {
        docx = await markdownToDocx(content, options)
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Conversion failed: ${err.message}` }],
          isError: true,
        }
      }

      const buffer = Buffer.from(await Packer.toBuffer(docx))
      await fs.writeFile(resolvedOutput, buffer)

      return {
        content: [{ type: 'text', text: `DOCX file created: ${resolvedOutput}` }],
      }
    }
  )

  const transport = new StdioServerTransport()

  process.on('SIGINT', () => {
    server.close().then(() => process.exit(0))
  })
  process.on('SIGTERM', () => {
    server.close().then(() => process.exit(0))
  })

  await server.connect(transport)
}
