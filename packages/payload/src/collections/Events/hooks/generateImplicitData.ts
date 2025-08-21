import type { CollectionBeforeValidateHook } from 'payload'
import type { Event } from '@app/types/payload'
import type { Locale } from '@app/i18n'
import { getImplicitEventData } from './shared/getImplicitEventData'

/**
 * add implicit data (request locale only)
 */
export const generateImplicitData: CollectionBeforeValidateHook<Event> = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.context.triggerHooks === false) return data
  if (typeof data === 'undefined') return data

  const implicitData = await getImplicitEventData({
    data,
    originalDoc,
    locale: req.locale as Locale,
    req,
  })

  return {
    ...data,
    ...implicitData,
  }
}
