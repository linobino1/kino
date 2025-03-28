import type { CollectionBeforeValidateHook } from 'payload'
import type { Event } from '@app/types/payload'
import type { Locale } from '@app/i18n'
import { getImplicitEventData } from './shared/getImplicitEventData'

/**
 * add implicit data (request locale only)
 */
export const generateImplicitData: CollectionBeforeValidateHook<Event> = async ({
  data,
  req: { payload, locale, context },
  originalDoc,
}) => {
  if (context.triggerHooks === false) return data
  if (typeof data === 'undefined') return data

  const implicitData = await getImplicitEventData({
    data,
    originalDoc,
    locale: locale as Locale,
    payload,
  })

  return {
    ...data,
    ...implicitData,
  }
}
