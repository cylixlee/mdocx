import {
  ICharacterStyleOptions, IParagraphStyleOptions, IStylesOptions
} from 'docx'

import { IMarkdownStyleConfig, IMarkdownToken } from '../types'
import { createMarkdownStyle } from './markdown'

export function createDefaultStyle(config: IMarkdownStyleConfig): IStylesOptions['default'] {
  const size = config.defaultSize ?? 12
  const lineSpacing = config.lineSpacing ?? 1.15

  return {
    document: {
      run: {
        size: size * 2,
        font: config.defaultFont,
      },
      paragraph: {
        spacing: {
          line: Math.round(lineSpacing * 240),
          lineRule: 'auto',
        },
      },
    },
    hyperlink: {},
    heading1: {},
    heading2: {},
    heading3: {},
    heading4: {},
    heading5: {},
    heading6: {},
    strong: {},
    listParagraph: {},
    footnoteReference: {},
    footnoteText: {},
    footnoteTextChar: {},
    title: {},
  }
}

export function createDocumentStyle(config: IMarkdownStyleConfig): IStylesOptions {
  const paragraphStyles: IParagraphStyleOptions[] = []
  const characterStyles: ICharacterStyleOptions[] = []
  const markdownTheme = createMarkdownStyle(config)
  const keys = Object.keys(markdownTheme) as IMarkdownToken[]
  const styles = { ...createDefaultStyle(config) }

  for (const key of keys) {
    const style = markdownTheme[key]
    if (!style) continue
    const { className, run, inline, paragraph, basedOn = 'Normal', next = 'Normal', quickFormat = true } = style
    if (inline) {
      characterStyles.push({ id: className, name: className, basedOn, next, quickFormat, run })
    } else {
      paragraphStyles.push({ id: className, name: className, basedOn, next, quickFormat, run, paragraph })
    }
    if (key in styles) {
      ;(styles as any)[key] = { ...(styles as any)[key], ...style }
    }
  }

  return {
    default: styles,
    paragraphStyles,
    characterStyles,
  }
}
