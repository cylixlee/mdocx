import { IMarkdownStyleConfig } from '../types'

export const minimal: IMarkdownStyleConfig = {
  defaultFont: 'Calibri',
  defaultSize: 11,
  lineSpacing: 1.15,

  strong: {
    bold: true,
  },

  em: {
    italics: true,
  },

  heading1: {
    size: 20,
    bold: true,
    spacingBefore: 20,
    spacingAfter: 10,
  },
  heading2: {
    size: 16,
    bold: true,
    spacingBefore: 16,
    spacingAfter: 8,
  },
  heading3: {
    size: 14,
    bold: true,
    spacingBefore: 12,
    spacingAfter: 6,
  },
  heading4: {
    size: 12,
    bold: true,
    spacingBefore: 10,
    spacingAfter: 4,
  },
  heading5: {
    size: 11,
    bold: true,
    italics: true,
    spacingBefore: 8,
    spacingAfter: 4,
  },
  heading6: {
    size: 11,
    italics: true,
    spacingBefore: 8,
    spacingAfter: 4,
  },

  paragraph: {
    spacingBefore: 6,
    spacingAfter: 6,
  },

  code: {
    font: 'Consolas',
    size: 10,
    background: 'F5F5F5',
    borderTop: { style: 'single', size: 1, color: 'D4D4D4', space: 6 },
    borderBottom: { style: 'single', size: 1, color: 'D4D4D4', space: 6 },
    borderLeft: { style: 'single', size: 1, color: 'D4D4D4', space: 6 },
    borderRight: { style: 'single', size: 1, color: 'D4D4D4', space: 6 },
    spacingBefore: 8,
    spacingAfter: 8,
  },

  codespan: {
    font: 'Consolas',
    color: 'D63384',
  },

  blockquote: {
    italics: true,
    color: '6B7280',
    borderLeft: { style: 'single', size: 16, color: 'D1D5DB', space: 10 },
    indentLeft: 360,
    spacingBefore: 8,
    spacingAfter: 8,
  },

  hr: {
    borderBottom: { style: 'single', size: 1, color: 'E5E7EB', space: 1 },
    spacingBefore: 10,
    spacingAfter: 10,
  },

  link: {
    color: '2563EB',
    underline: true,
  },

  del: {
    strike: true,
    color: 'DC2626',
  },

  tableHeader: {
    background: 'F3F4F6',
    bold: true,
  },

  table: {
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
    font: 'Consolas',
    color: '059669',
  },

  html: {
    font: 'Consolas',
    color: '7C3AED',
  },

  footnote: {
    bold: false,
  },

  space: {
    spacingBefore: 0,
    spacingAfter: 0,
  },
}
