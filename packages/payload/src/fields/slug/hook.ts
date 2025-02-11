import { formatSlug } from '@app/util/formatSlug'
import type { FieldHook } from 'payload'

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value, previousValue }) => {
    if (data?.slugLock === false) return formatSlug(value ?? previousValue)

    if (typeof value === 'string') {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
