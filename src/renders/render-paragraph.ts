import { type IParagraphOptions, Paragraph } from 'docx'

import { MarkdownDocx } from '../MarkdownDocx'
import { IBlockAttr, IInlineToken } from '../types'
import { getHeadingLevel, getTextAlignment } from '../utils'
import { renderCheckbox } from './render-checkbox'
import { renderText } from './render-text'
import { renderTokens } from './render-tokens'

export function renderParagraph (render: MarkdownDocx, tokens: IInlineToken[] | string, attr: IBlockAttr) {
  const heading = getHeadingLevel(attr.heading)
  const alignment = getTextAlignment(attr.align)

  const hasList = !attr.listNone && attr.list

  const isMdHeading = attr.style?.startsWith('MdHeading') ?? false

  const options: IParagraphOptions = {
    heading: heading && !isMdHeading ? heading : undefined,
    alignment,
    bullet: hasList && attr.list?.type === 'bullet' ? { level: Math.min(attr.list.level, 9) } : undefined,
    numbering: hasList && attr.list?.type === 'number' ? {
      level: Math.min(attr.list.level, 9),
      reference: 'numbering-points',
      instance: attr.list.instance,
    } : undefined,
    style: attr.style,
    ...(attr.indentFirstLine === false ? { indent: { firstLine: 0 } } : {}),
  }

  const children = typeof tokens === 'string' ? renderText(render, tokens, {}) : renderTokens(render, tokens, {})

  if (attr.list?.task) {
    children.unshift(renderCheckbox(render, attr.list.checked))
  }

  return new Paragraph({
    children,
    ...options,
  })
}
