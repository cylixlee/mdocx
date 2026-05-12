import { UnderlineType } from 'docx'

import { IElementStyle, IMarkdownStyle, IMarkdownStyleConfig, IMarkdownToken } from '../types'
import { classes } from './classes'

const inlineTokens = new Set<IMarkdownToken>([
  'tag', 'link', 'strong', 'em', 'codespan', 'del', 'br',
])

function headingOutlineLevel(token: IMarkdownToken): number | undefined {
  const map: Record<string, number> = {
    heading1: 0, heading2: 1, heading3: 2,
    heading4: 3, heading5: 4, heading6: 5,
  }
  return map[token]
}

function toHalfPoints(pt?: number): number | undefined {
  if (pt == null) return undefined
  return pt * 2
}

function toTwips(pt?: number): number | undefined {
  if (pt == null) return undefined
  return pt * 20
}

function toLineTwips(value?: number): number | undefined {
  if (value == null) return undefined
  return Math.round(value * 240)
}

function buildRunStyle(el: Partial<IElementStyle> | undefined, defaults: Partial<IElementStyle>) {
  const size = toHalfPoints(el?.size ?? defaults.size)
  const color = el?.color ?? defaults.color
  const font = el?.font ?? defaults.font
  const bold = el?.bold ?? defaults.bold
  const italics = el?.italics ?? defaults.italics
  const underline = el?.underline ?? defaults.underline
  const strike = el?.strike ?? defaults.strike

  const result: any = {}

  if (font != null) result.font = font
  if (size != null) result.size = size
  if (color != null) result.color = color
  if (bold != null) result.bold = bold
  if (italics != null) result.italics = italics
  if (strike != null) result.strike = strike
  if (underline === true) {
    result.underline = { type: UnderlineType.SINGLE }
  } else if (underline !== undefined && underline !== null) {
    result.underline = underline
  }

  return Object.keys(result).length ? result : undefined
}

function buildParagraphStyle(el: Partial<IElementStyle> | undefined, defaults: Partial<IElementStyle>) {
  const spacingBefore = el?.spacingBefore ?? defaults.spacingBefore
  const spacingAfter = el?.spacingAfter ?? defaults.spacingAfter
  const lineSpacing = el?.lineSpacing ?? defaults.lineSpacing
  const alignment = el?.alignment ?? defaults.alignment
  const indentLeft = el?.indentLeft ?? defaults.indentLeft
  const indentHanging = el?.indentHanging ?? defaults.indentHanging
  const indentFirstLine = el?.indentFirstLine ?? defaults.indentFirstLine
  const keepNext = el?.keepNext ?? defaults.keepNext
  const background = el?.background ?? defaults.background

  const spacing: any = {}

  const sb = toTwips(spacingBefore)
  const sa = toTwips(spacingAfter)
  const sl = toLineTwips(lineSpacing)

  if (sb != null) spacing.before = sb
  if (sa != null) spacing.after = sa
  if (sl != null) {
    spacing.line = sl
    spacing.lineRule = 'auto'
  }

  const indent: any = {}
  if (indentLeft != null) indent.left = indentLeft
  if (indentHanging != null) indent.hanging = indentHanging
  if (indentFirstLine != null) indent.firstLine = indentFirstLine

  const border: any = {}
  for (const pos of ['top', 'bottom', 'left', 'right'] as const) {
    const b = (el as any)?.[`border${pos.charAt(0).toUpperCase() + pos.slice(1)}`]
      ?? (defaults as any)?.[`border${pos.charAt(0).toUpperCase() + pos.slice(1)}`]
    if (b) {
      const bs: any = {}
      if (b.style != null) bs.style = b.style
      if (b.size != null) bs.size = b.size
      if (b.color != null) bs.color = b.color
      if (b.space != null) bs.space = b.space
      border[pos] = bs
    }
  }

  const result: any = {}

  if (Object.keys(spacing).length) result.spacing = spacing
  if (Object.keys(indent).length) result.indent = indent
  if (alignment) {
    result.alignment = alignment === 'both' ? 'both'
      : alignment === 'center' ? 'center'
      : alignment === 'left' ? 'left'
      : 'right'
  }
  if (keepNext != null) result.keepNext = keepNext
  if (background) {
    result.shading = { fill: background }
  }
  if (Object.keys(border).length) result.border = border

  return Object.keys(result).length ? result : undefined
}

export function createMarkdownStyle(config: IMarkdownStyleConfig): Record<IMarkdownToken, IMarkdownStyle> {
  const defaults: Partial<IElementStyle> = {
    font: config.defaultFont,
    size: config.defaultSize,
    lineSpacing: config.lineSpacing,
  }

  interface TokenMeta {
    token: IMarkdownToken
    className: string
    element: Partial<IElementStyle> | undefined
  }

  const tokens: TokenMeta[] = [
    { token: 'space',          className: classes.Space,          element: config.space },
    { token: 'code',           className: classes.Code,           element: config.code },
    { token: 'hr',             className: classes.Hr,             element: config.hr },
    { token: 'blockquote',     className: classes.Blockquote,     element: config.blockquote },
    { token: 'html',           className: classes.Html,           element: config.html },
    { token: 'def',            className: classes.Def,            element: undefined },
    { token: 'paragraph',      className: classes.Paragraph,      element: config.paragraph },
    { token: 'text',           className: classes.Text,           element: config.paragraph },
    { token: 'footnote',       className: classes.Footnote,       element: config.footnote },
    { token: 'listItem',       className: classes.ListItem,       element: config.listItem },
    { token: 'table',          className: classes.Table,          element: config.table },
    { token: 'tableHeader',    className: classes.TableHeader,    element: config.tableHeader },
    { token: 'tableCell',      className: classes.TableCell,      element: config.tableCell },
    { token: 'heading1',       className: classes.Heading1,       element: config.heading1 },
    { token: 'heading2',       className: classes.Heading2,       element: config.heading2 },
    { token: 'heading3',       className: classes.Heading3,       element: config.heading3 },
    { token: 'heading4',       className: classes.Heading4,       element: config.heading4 },
    { token: 'heading5',       className: classes.Heading5,       element: config.heading5 },
    { token: 'heading6',       className: classes.Heading6,       element: config.heading6 },
    { token: 'tag',            className: classes.Tag,            element: config.tag },
    { token: 'link',           className: classes.Link,           element: config.link },
    { token: 'strong',         className: classes.Strong,         element: config.strong },
    { token: 'em',             className: classes.Em,             element: config.em },
    { token: 'codespan',       className: classes.Codespan,       element: config.codespan },
    { token: 'del',            className: classes.Del,            element: config.del },
    { token: 'br',             className: classes.Br,             element: config.br },
  ]

  const result: Record<IMarkdownToken, IMarkdownStyle> = {} as any

  for (const { token, className, element } of tokens) {
    const el = element
    const inline = inlineTokens.has(token)
    const outlineLevel = headingOutlineLevel(token)

    const style: IMarkdownStyle = {
      inline: inline || undefined,
      className,
    }

    const run = buildRunStyle(el, defaults)
    if (run) style.run = run

    if (!inline) {
      const para = buildParagraphStyle(el, defaults)
      if (para) {
        if (outlineLevel != null) para.outlineLevel = outlineLevel
        style.paragraph = para
      } else if (outlineLevel != null) {
        style.paragraph = { outlineLevel }
      }
    }

    if (token === 'tableHeader' || token === 'table') {
      style.properties = element
    }

    result[token] = style
  }

  return result
}

export const markdown = createMarkdownStyle({})
