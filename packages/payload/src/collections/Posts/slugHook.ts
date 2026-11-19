import { formatSlug } from '@app/util/formatSlug'
import type { FieldHook } from 'payload'

/**
 * Post titles are localized, but their slugs are not. Generate the slug once
 * from the title used to create the post and keep it stable when other locale
 * titles are edited.
 */
export const postSlugHook: FieldHook = ({ data, operation, value, originalDoc }) => {
  const slugLock = data && 'slugLock' in data ? data.slugLock : originalDoc?.slugLock

  if (typeof value === 'string' && !slugLock) {
    return formatSlug(value)
  }

  if (operation === 'create') {
    const title = data?.title
    if (typeof title === 'string') {
      return formatSlug(title)
    }
  }

  // Localized title edits must not replace an already-established post URL.
  if (typeof originalDoc?.slug === 'string') {
    return originalDoc.slug
  }

  return value
}
