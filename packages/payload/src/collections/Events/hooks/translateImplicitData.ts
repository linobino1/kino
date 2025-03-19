import type { CollectionAfterChangeHook } from 'payload'
import type { Event } from '@app/types/payload'
import { locales } from '@app/i18n'
import { getImplicitEventData } from './shared/getImplicitEventData'

/**
 * add implicit data to other locales
 */
export const translateImplicitData: CollectionAfterChangeHook<Event> = async ({
  doc,
  req: { payload, locale: reqLocale, context },
}) => {
  if (context.triggerHooks === false) return

  // add title and shortDescription in other locales
  for await (const locale of locales) {
    // request locale is already done in the beforeChange hook
    if (locale === reqLocale) continue
    await payload.update({
      collection: 'events',
      id: doc.id,
      locale,
      data: await getImplicitEventData({
        doc,
        locale,
        payload,
      }),
      context: {
        triggerHooks: false,
      },
    })
  }
}
