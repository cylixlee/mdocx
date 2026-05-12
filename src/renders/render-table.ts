import { BorderStyle, Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr, IInlineToken } from '../types'
import { renderParagraph } from './render-paragraph'

export function renderTable(render: MarkdownDocx, block: Tokens.Table, attrs: IBlockAttr): Table {
  const toProps = (token?: Tokens.TableCell, isHeader?: boolean): IBlockAttr => {
    return {
      ...attrs,
      align: token?.align,
      style: isHeader ? classes.TableHeader : classes.TableCell,
    }
  }

  const style = render.styles.markdown
  const isThreeLine = !!(render._styleConfig?.table?.threeLine)
  const defaultColumnWidth = 100 / block.header.length * 100

  const tableOptions: any = {
    style: classes.Table,
    width: {
      size: '100%',
      type: WidthType.PERCENTAGE,
    },
    columnWidths: block.header.map(() => defaultColumnWidth),
  }

  if (isThreeLine) {
    tableOptions.borders = {
      top: { style: BorderStyle.SINGLE, size: 12, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    }
  }

  const headerCellOpts = (cell: Tokens.TableCell): any => {
    const opts: any = {
      verticalAlign: VerticalAlign.CENTER,
      ...style.tableHeader.properties,
      children: [
        renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell, true)),
      ],
    }
    if (isThreeLine) {
      opts.borders = {
        bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      }
    }
    return opts
  }

  const dataCellOpts = (cell: Tokens.TableCell): any => ({
    verticalAlign: VerticalAlign.CENTER,
    ...style.tableCell.properties,
    children: [
      renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell)),
    ],
  })

  tableOptions.rows = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: block.header.map(cell => new TableCell(headerCellOpts(cell))),
    }),
    ...block.rows.map(row => {
      return new TableRow({
        cantSplit: true,
        children: row.map(cell => new TableCell(dataCellOpts(cell))),
      })
    })
  ]

  return new Table(tableOptions)
}
