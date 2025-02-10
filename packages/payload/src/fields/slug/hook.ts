import type { FieldHook } from 'payload'
import type { SlugGenerator } from './types'

export const formatSlugHook =
  (fallback: string, generator: SlugGenerator): FieldHook =>
  (args) => {
    const { data, operation, value } = args
    if (typeof value === 'string') {
      return generator(args)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return generator(args)
      }
    }

    return value
  }
