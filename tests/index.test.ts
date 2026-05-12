import { Packer } from 'docx'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import markdownToDocx, { MarkdownDocx, styles } from '../src/entry-node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getFile = (filename: string) => path.resolve(__dirname, filename)

const getText = (filename: string) => fs.readFileSync(getFile(filename), 'utf-8')

describe('markdown-docx', () => {
  it('markdownToDocx()', async () => {
    const docx = await markdownToDocx(getText('./markdown.md'))

    const buffer = await Packer.toBuffer(docx)

    expect(buffer.length).greaterThan(0)

    fs.writeFileSync(getFile('./markdown.docx'), buffer)

    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('markdownToDocx() with preset', async () => {
    const docx = await markdownToDocx(getText('./markdown.md'), {
      preset: 'minimal',
    })

    const buffer = await Packer.toBuffer(docx)

    expect(buffer.length).greaterThan(0)

    fs.writeFileSync(getFile('./markdown.docx'), buffer)

    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('markdownToDocx() with style overrides', async () => {
    const docx = await markdownToDocx(getText('./markdown.md'), {
      preset: 'academic',
      style: {
        heading1: { size: 24 },
        defaultSize: 14,
      }
    })

    const buffer = await Packer.toBuffer(docx)

    expect(buffer.length).greaterThan(0)

    fs.writeFileSync(getFile('./markdown.docx'), buffer)

    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('new MarkdownToDocx()', async () => {
    const docx = new MarkdownDocx(getText('./markdown.md'))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(getFile('./markdown.docx'), docxBuffer)
    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('List Numbering', async () => {
    const md = getFile('./list-number-restart.md')
    const file = getFile('./list-number-restart.docx')
    const docx = new MarkdownDocx(getText(md))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(file, docxBuffer)
    expect(fs.existsSync(file)).toBe(true)
  })

  it('List Complex', async () => {
    const md = getFile('./list-complex.md')
    const file = getFile('./list-complex.docx')
    const docx = new MarkdownDocx(getText(md))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(file, docxBuffer)
    expect(fs.existsSync(file)).toBe(true)
  })
})
