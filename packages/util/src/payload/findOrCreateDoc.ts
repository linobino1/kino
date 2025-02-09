import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  RequiredDataFromCollectionSlug,
  Where,
} from 'payload'
import type { Locale } from '@app/i18n'

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
  data: Partial<RequiredDataFromCollectionSlug<T>>
  locale?: Locale
} & (
  | {
      draft: false
      data: RequiredDataFromCollectionSlug<T>
    }
  | {
      draft?: true | undefined
      data: Partial<DataFromCollectionSlug<T>>
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
    // @ts-expect-error data may be partial if draft is true
    data,
    draft,
    locale,
  })

  return {
    wasCreated: true,
    doc: created,
  }
}
