import { describe, it, expect } from 'vitest'
import { createDefaultStyle } from '../src/styles/styles'
import { IMarkdownStyleConfig } from '../src/types'

describe('createDefaultStyle', () => {
  const baseConfig: IMarkdownStyleConfig = {
    defaultSize: 14,
    lineSpacing: 1.5,
  }

  it('converts defaultSize (pt) to half-points for docx', () => {
    const style = createDefaultStyle(baseConfig)
    expect(style.document?.run?.size).toBe(28) // 14pt * 2 = 28 half-points
  })

  it('converts 12pt to 24 half-points', () => {
    const config: IMarkdownStyleConfig = { defaultSize: 12 }
    const style = createDefaultStyle(config)
    expect(style.document?.run?.size).toBe(24)
  })

  it('converts lineSpacing to twips (240 per 1.0)', () => {
    const config: IMarkdownStyleConfig = { lineSpacing: 1.5 }
    const style = createDefaultStyle(config)
    expect(style.document?.paragraph?.spacing?.line).toBe(360) // 1.5 * 240 = 360 twips
  })

  it('converts single spacing (1.0) to 240 twips', () => {
    const config: IMarkdownStyleConfig = { lineSpacing: 1.0 }
    const style = createDefaultStyle(config)
    expect(style.document?.paragraph?.spacing?.line).toBe(240)
  })

  it('converts double spacing (2.0) to 480 twips', () => {
    const config: IMarkdownStyleConfig = { lineSpacing: 2.0 }
    const style = createDefaultStyle(config)
    expect(style.document?.paragraph?.spacing?.line).toBe(480)
  })

  it('preserves lineRule as auto', () => {
    const config: IMarkdownStyleConfig = { lineSpacing: 1.0 }
    const style = createDefaultStyle(config)
    expect(style.document?.paragraph?.spacing?.lineRule).toBe('auto')
  })

  it('uses default values when config values are undefined', () => {
    const config: IMarkdownStyleConfig = {}
    const style = createDefaultStyle(config)
    expect(style.document?.run?.size).toBe(24) // 12pt default → 24 half-points

    const config2: IMarkdownStyleConfig = { lineSpacing: undefined }
    const style2 = createDefaultStyle(config2)
    expect(style2.document?.paragraph?.spacing?.line).toBe(276) // 1.15 default * 240 = 276 twips
  })
})
