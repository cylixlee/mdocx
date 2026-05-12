import { classes } from './classes'
import { markdown } from './markdown'
import { numbering } from './numbering'
import { createDefaultStyle, createDocumentStyle } from './styles'

export * from './classes'
export * from './numbering'
export * from './markdown'
export * from './styles'

export const styles = {
  classes,
  markdown,
  numbering,
  createDefaultStyle,
  createDocumentStyle,
}
