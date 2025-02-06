import type { DataFromGlobalSlug, GlobalSlug } from 'payload'
import type { GlobalGenerator, SeedContext } from '../types'
import { defaultLocale, locales } from 'shared/config'
import { deepMerge } from '../util/deepMerge'

/**
 * Create a new doc in the database with translated data.
 * If the doc is a page or media, it will be stored in the context by its slug (which can be overridden).
 */
export const seedGlobal = async <T extends GlobalSlug>({
  slug,
  generator,
  context,
}: {
  slug: T
  generator: GlobalGenerator<T>
  filePath?: string
  context: SeedContext
}): Promise<DataFromGlobalSlug<T> | null> => {
  const { payload } = context

  const data = generator({ context, locale: defaultLocale })
  payload.logger.info(`— Seeding global ${slug}`)

  let global: DataFromGlobalSlug<T> | null = null
  try {
    global = await payload.updateGlobal({
      slug,
      // @ts-expect-error PaylodCMS should export a RequiredDataFromGlobalSlug type
      data,
    })
  } catch (e) {
    payload.logger.error(e)
    payload.logger.error(`— ERROR. Failed to seed global ${slug}`)
    return null
  }

  for (const locale of locales) {
    if (locale === defaultLocale) continue
    const localizedData = generator({ context, locale })
    if (localizedData === data) continue
    try {
      await payload.updateGlobal<T, any>({
        slug,
        // @ts-expect-error deepMerge cannot follow the types here
        data: deepMerge(data, localizedData),
        locale,
      })
    } catch (e) {
      payload.logger.error(e)
      payload.logger.error(`— ERROR. Failed to add localized data to global ${slug}`)
    }
  }

  return global
}
