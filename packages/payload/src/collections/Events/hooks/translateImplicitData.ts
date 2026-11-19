import type { CollectionAfterChangeHook } from 'payload'
import type { Event } from '@app/types/payload'
import { locales } from '@app/i18n'
import { getImplicitEventData } from './shared/getImplicitEventData'

/**
 * add implicit data to other locales
 */
export const translateImplicitData: CollectionAfterChangeHook<Event> = async ({ doc, req }) => {
  if (req.context.triggerHooks === false) return

  // add title and shortDescription in other locales
  for await (const locale of locales) {
    // request locale is already done in the beforeChange hook
    if (locale === req.locale) continue

    const localizedDoc = await req.payload.findByID({
      collection: 'events',
      id: doc.id,
      locale,
      depth: 0,
      req,
    })
    const implicitData = await getImplicitEventData({
      doc: localizedDoc,
      locale,
      req,
    })

    // Non-screening titles are user-entered rather than generated. On first
    // creation, a locale may not have its translated title yet (e.g. during
    // seeding), but the required localized title must still be present while
    // applying implicit data. Later translation updates can replace this fallback.
    const translatedData = {
      ...implicitData,
      title: implicitData.title ?? localizedDoc.title ?? doc.title,
    }

    await req.payload.update({
      collection: 'events',
      id: doc.id,
      locale,
      data: translatedData,
      context: {
        triggerHooks: false,
      },
      req,
    })
  }
}
