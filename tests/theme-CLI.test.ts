import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const tmpDir = path.join(os.tmpdir(), 'markdown-docx-test')
const inputFile = path.join(tmpDir, 'test.md')
const outputFile = path.join(tmpDir, 'test.docx')

beforeEach(() => {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }
  fs.writeFileSync(inputFile, '# Test Heading\n\nBody text here.')
})

afterEach(() => {
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }
})

describe('CLI --preset flag', () => {
  it('creates docx with --preset academic', () => {
    execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --preset academic`)
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('creates docx with --preset minimal', () => {
    execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --preset minimal`)
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('throws error for unknown preset', () => {
    expect(() => {
      execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --preset nonexistent`)
    }).toThrow()
  })
})

describe('CLI --config flag', () => {
  it('loads preset and style from config file', () => {
    const configFile = path.join(tmpDir, 'config.json')
    fs.writeFileSync(configFile, JSON.stringify({
      preset: 'academic',
      style: {
        defaultSize: 14,
        lineSpacing: 2.0,
      }
    }))

    execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --config ${configFile}`)
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })

  it('throws error for missing config file', () => {
    expect(() => {
      execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --config /nonexistent/config.json`)
    }).toThrow()
  })
})

describe('CLI precedence: --preset overrides --config', () => {
  it('--preset flag overrides --config file preset', () => {
    const configFile = path.join(tmpDir, 'config.json')
    fs.writeFileSync(configFile, JSON.stringify({
      preset: 'academic',
    }))

    execSync(`node bin/cli.mjs --input ${inputFile} --output ${outputFile} --config ${configFile} --preset minimal`)
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })
})
