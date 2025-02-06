import type { CollectionSlug, DataFromCollectionSlug, Payload } from 'payload'
import { locales } from 'shared/config'

/**
 * Sets the data of a document in all locales to the same value.
 */
export const updateDocInAllLocales = async <T extends CollectionSlug>({
  id,
  collection,
  data,
  payload,
}: {
  id: string
  collection: T
  data: Partial<DataFromCollectionSlug<T>>
  payload: Payload
}) => {
  for await (const locale of locales) {
    await payload.update({
      collection,
      id,
      // @ts-expect-error we could use DeepPartial instead of Partial, then the type would be correct
      data,
      locale,
    })
  }
}
