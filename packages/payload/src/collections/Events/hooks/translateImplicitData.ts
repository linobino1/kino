import type { CollectionAfterChangeHook } from 'payload'
import type { Event } from '@app/types/payload'
import { locales } from '@app/i18n'
import { getMovieData } from './shared/getMovieData'

/**
 * translates some auto-generated fields into all locales
 */
export const translateImplicitData: CollectionAfterChangeHook<Event> = async ({
  doc,
  req: { payload, locale, context },
  operation,
}) => {
  if (operation !== 'update') return
  if (context.triggerHooks === false) return
  if (!doc.isScreeningEvent || !doc.mainProgramFilmPrint) return

  const filmPrintID =
    typeof doc.mainProgramFilmPrint === 'string'
      ? doc.mainProgramFilmPrint
      : doc.mainProgramFilmPrint.id

  // update shortDescription, title and header
  const movie = await getMovieData({ filmPrintID, payload, locale: 'all' })

  // add title and shortDescription in other locales
  // request locale will be saved by returning data from the hook
  for await (const otherLocale of locales) {
    if (otherLocale === locale) continue
    const localizedDoc = await payload.findByID({
      collection: 'events',
      id: doc.id,
      locale: otherLocale,
    })

    await payload.update({
      collection: 'events',
      id: doc.id,
      locale: otherLocale,
      data: {
        // @ts-expect-error we passed in locale: 'all'
        title: localizedDoc.title ?? movie.title[otherLocale],
        // @ts-expect-error we passed in locale: 'all'
        shortDescription: movie.synopsis[otherLocale],
      },
      context: {
        triggerHooks: false,
      },
    })
  }
}
