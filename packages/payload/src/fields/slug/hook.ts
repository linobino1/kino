import { formatSlug } from '@app/util/formatSlug'
import type { FieldHook } from 'payload'

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value, originalDoc }) => {
    const lock = data && 'slugLock' in data ? data.slugLock : originalDoc?.slugLock

    if (typeof value === 'string' && !lock) {
      return formatSlug(value)
    }

    if (operation === 'create' || (!data?.slug && lock)) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
