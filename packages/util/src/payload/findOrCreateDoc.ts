import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  JsonObject,
  RequiredDataFromCollectionSlug,
  Where,
} from 'payload'
import type { Locale } from '@app/i18n'

export type DraftDataFromCollection<TData extends JsonObject> = Partial<
  Omit<TData, 'collection' | 'createdAt' | 'deletedAt' | 'id' | 'sizes' | 'updatedAt'>
> &
  Partial<Pick<TData, 'collection' | 'createdAt' | 'deletedAt' | 'id' | 'sizes' | 'updatedAt'>>
export type DraftDataFromCollectionSlug<TSlug extends CollectionSlug> = DraftDataFromCollection<
  DataFromCollectionSlug<TSlug>
>

export const findOrCreateDoc = async <T extends CollectionSlug>({
  collection,
  payload,
  where,
  data,
  draft = false,
  locale,
}: {
  collection: T
  payload: BasePayload
  where: Where
  data: DraftDataFromCollectionSlug<T>
  locale?: Locale
} & (
  | {
      draft: false
      data: RequiredDataFromCollectionSlug<T>
    }
  | {
      draft?: true | undefined
      data: DraftDataFromCollectionSlug<T>
    }
)): Promise<{
  wasCreated: boolean
  doc: DataFromCollectionSlug<T>
}> => {
  const found = (
    await payload.find({
      collection,
      where,
      draft,
      locale,
    })
  ).docs[0]

  if (found)
    return {
      wasCreated: false,
      doc: found,
    }

  const created = await payload.create({
    collection,
    data,
    draft: draft as true, // we are not allowed to pass false, but it still works
    locale,
  })

  return {
    wasCreated: true,
    doc: created,
  }
}
