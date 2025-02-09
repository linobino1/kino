import type { CollectionSlug, DataFromCollectionSlug } from 'payload'
import type { DocGenerator, SeedContext } from '../types'
import { deepMerge } from '../util/deepMerge'
import { locales } from '@app/i18n'

/**
 * Create a new doc in the database with translated data.
 * If the doc is a page or media, it will be stored in the context by its slug (which can be overridden).
 */
export const seedDoc = async <T extends CollectionSlug>({
  collection,
  generator,
  contextID,
  filePath,
  context,
}: {
  collection: T
  generator: DocGenerator<T>
  contextID?: string // is used to identify the doc from a context map, default: data.slug
  filePath?: string
  context: SeedContext
}): Promise<DataFromCollectionSlug<T> | null> => {
  const { payload } = context

  const data = generator({ context, locale: 'en' })
  contextID ??=
    'title' in data
      ? (data.title as string)
      : 'name' in data
        ? (data.name as string)
        : 'slug' in data
          ? (data.slug as string)
          : `${data.id}`
  payload.logger.info(`— Seeding ${collection} doc: ${contextID}`)

  let doc: DataFromCollectionSlug<T> | null = null
  try {
    doc = await payload.create<T, any>({
      collection,
      data,
      locale: 'en',
      filePath,
    })
  } catch (e) {
    payload.logger.error(e)
    payload.logger.error(`— ERROR. Failed to seed ${collection} doc: ${contextID}`)
    return null
  }

  for (const locale of locales) {
    if (locale === 'en') continue
    const localizedData = generator({ context, locale })
    if (localizedData === data) continue
    try {
      await payload.update<T, any>({
        collection,
        id: doc.id,
        // @ts-expect-error deepMerge cannot follow the types here
        data: deepMerge(data, localizedData),
        locale,
      })
    } catch (e) {
      payload.logger.error(e)
      payload.logger.error(
        `— ERROR. Failed to add localized data to ${collection} doc: ${contextID}`,
      )
    }
  }

  // add doc to context if a map exists for the collection
  if (collection in context) {
    // @ts-expect-error context[collection] is a Map
    context[collection].set(contextID, doc)
    payload.logger.info(`  added ${contextID}`)
  }

  return doc
}
