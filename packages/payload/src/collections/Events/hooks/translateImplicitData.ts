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

    await req.payload.update({
      collection: 'events',
      id: doc.id,
      locale,
      data: implicitData,
      context: {
        triggerHooks: false,
      },
      req,
    })
  }
}
