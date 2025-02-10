import type { Locale } from '@app/i18n'
import type { Movie } from '@app/types/payload'
import type { Payload } from 'payload'

export const getMovieData = async ({
  filmPrintID,
  payload,
  locale,
}: {
  filmPrintID: string
  payload: Payload
  locale: Locale | 'all'
}) =>
  (
    await payload.findByID({
      collection: 'filmPrints',
      id: filmPrintID,
      locale,
      depth: 1,
      select: {
        movie: true,
      },
      populate: {
        movies: {
          title: true,
          still: true,
          synopsis: true,
        },
      },
    })
  ).movie as Movie
