import { IMarkdownStyleConfig } from '../types'

export const academic: IMarkdownStyleConfig = {
  defaultFont: { ascii: 'Times New Roman', eastAsia: '宋体' },
  defaultSize: 12,
  lineSpacing: 1.5,

  strong: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    bold: false,
  },

  em: {
    italics: true,
  },

  heading1: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 22,
    bold: true,
    spacingBefore: 24,
    spacingAfter: 12,
  },
  heading2: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 16,
    bold: true,
    spacingBefore: 20,
    spacingAfter: 10,
  },
  heading3: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 14,
    bold: true,
    spacingBefore: 16,
    spacingAfter: 8,
  },
  heading4: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 12,
    bold: true,
    spacingBefore: 14,
    spacingAfter: 6,
  },
  heading5: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 12,
    bold: true,
    spacingBefore: 12,
    spacingAfter: 6,
  },
  heading6: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 12,
    bold: true,
    spacingBefore: 12,
    spacingAfter: 6,
  },

  paragraph: {
    spacingBefore: 6,
    spacingAfter: 6,
    indentFirstLine: 480,
  },

  code: {
    font: 'Courier New',
    size: 11,
    background: 'f6f6f7',
    borderTop: { style: 'single', size: 1, color: 'A5A5A5', space: 8 },
    borderBottom: { style: 'single', size: 1, color: 'A5A5A5', space: 8 },
    borderLeft: { style: 'single', size: 1, color: 'A5A5A5', space: 8 },
    borderRight: { style: 'single', size: 1, color: 'A5A5A5', space: 8 },
    spacingBefore: 10,
    spacingAfter: 10,
  },

  codespan: {
    font: 'Courier New',
  },

  blockquote: {
    italics: true,
    color: '666666',
    background: 'F9F9F9',
    borderLeft: { style: 'single', size: 20, color: '666666', space: 12 },
    indentLeft: 360,
    spacingBefore: 10,
    spacingAfter: 10,
  },

  hr: {
    borderBottom: { style: 'single', size: 1, color: 'D9D9D9', space: 1 },
    spacingBefore: 12,
    spacingAfter: 12,
  },

  link: {
    color: '0563C1',
    underline: true,
  },

  del: {
    strike: true,
    color: 'FF0000',
  },

  tableHeader: {
    font: { ascii: 'Times New Roman', eastAsia: '黑体' },
    size: 10.5,
    bold: false,
  },

  tableCell: {
    font: { ascii: 'Times New Roman', eastAsia: '宋体' },
    size: 10.5,
  },

  table: {
    threeLine: true,
    spacingBefore: 3,
    spacingAfter: 3,
  },

  listItem: {
    indentLeft: 720,
    indentHanging: 360,
    spacingBefore: 3,
    spacingAfter: 3,
  },

  tag: {
    font: 'Courier New',
    color: 'ED7D31',
  },

  html: {
    font: 'Courier New',
    color: '4472C4',
  },

  footnote: {
    bold: false,
  },

  space: {
    spacingBefore: 0,
    spacingAfter: 0,
  },
}
