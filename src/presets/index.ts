import { IMarkdownStyleConfig } from '../types'
import { academic } from './academic'
import { minimal } from './minimal'

export const presets: Record<string, IMarkdownStyleConfig> = {
  academic,
  minimal,
}

export function getPreset(name: string): IMarkdownStyleConfig {
  const preset = presets[name]
  if (!preset) {
    throw new Error(
      `Unknown preset "${name}". Available presets: ${Object.keys(presets).join(', ')}`
    )
  }
  return preset
}

export function resolveStyleConfig(
  preset: string | IMarkdownStyleConfig,
  overrides?: Partial<IMarkdownStyleConfig>
): IMarkdownStyleConfig {
  const base = typeof preset === 'string' ? getPreset(preset) : preset
  if (!overrides) return base

  return deepMerge(base, overrides)
}

function deepMerge<T extends Record<string, any>>(base: T, overrides: Partial<T>): T {
  const result = { ...base }
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const ov = overrides[key]
    const bv = base[key]
    if (ov && typeof ov === 'object' && !Array.isArray(ov) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      result[key] = { ...bv, ...ov }
    } else {
      result[key] = ov as T[keyof T]
    }
  }
  return result
}

export { academic } from './academic'
export { minimal } from './minimal'
