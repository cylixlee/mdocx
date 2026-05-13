import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod/v4-mini'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import markdownToDocx, { MarkdownDocx, Packer, presets } from './index'
import { downloadImage } from './adapters/nodejs'

MarkdownDocx.defaultOptions.imageAdapter = downloadImage

function descStr(d: string) {
  return z.string({ description: d } as any)
}

function descEnum(values: string[], d: string) {
  return z.enum(values, { description: d } as any)
}

function resolveOutputPath(inputPath: string, outputPath?: string) {
  if (outputPath) return outputPath
  return inputPath.replace(/\.mdx?$/, '.docx')
}

async function loadConfigFile(configPath: string) {
  const content = await fs.readFile(configPath, 'utf-8')
  return JSON.parse(content)
}

export async function start(): Promise<void> {
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
        inputPath: descStr('Path to the input Markdown file (.md)'),
        outputPath: z.optional(descStr('Path for the output DOCX file (defaults to input filename with .docx extension)')),
        preset: z.optional(descEnum(Object.keys(presets), `Style preset: ${Object.keys(presets).join(', ')} (default: "academic")`)),
        config: z.optional(descStr('Path to a JSON config file (may include preset, style, ignoreImage, math, etc.)')),
      },
    },
    async (args): Promise<CallToolResult> => {
      const { inputPath, outputPath, preset, config: configPath } = args

      const resolvedOutput = resolveOutputPath(inputPath, outputPath)
      const ext = path.extname(resolvedOutput)
      if (ext && ext.toLowerCase() !== '.docx') {
        return {
          content: [{ type: 'text', text: `Output file must be a .docx file, but got ${ext}` }],
          isError: true,
        }
      }

      const options: Record<string, any> = {}

      if (configPath) {
        try {
          const configOptions = await loadConfigFile(configPath)
          Object.assign(options, configOptions)
        } catch (err: any) {
          return {
            content: [{ type: 'text', text: `Failed to load config file "${configPath}": ${err.message}` }],
            isError: true,
          }
        }
      }

      if (preset) {
        options.preset = preset
      }

      let content: string
      try {
        content = await fs.readFile(inputPath, 'utf-8')
      } catch (err: any) {
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

      options.baseDir = path.dirname(path.resolve(inputPath))

      let docx: any
      try {
        docx = await markdownToDocx(content, options)
      } catch (err: any) {
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
