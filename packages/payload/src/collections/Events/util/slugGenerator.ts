import type { SlugGenerator } from '#payload/fields/slug/types'
import type { Movie } from '@app/types/payload'
import { formatSlug } from '@app/util/formatSlug'
import { getDocId } from '@app/util/payload/getDocId'

export const slugGenerator: SlugGenerator = async ({ value, data, req: { payload, locale } }) => {
  if (typeof value === 'string') return formatSlug(value)
  const movie = data?.mainProgramFilmPrint
    ? (
        await payload.findByID({
          collection: 'filmPrints',
          id: getDocId(data.mainProgramFilmPrint),
          depth: 2,
          locale,
        })
      )?.movie
    : undefined
  return [
    (movie as Movie)?.internationalTitle || data?.title,
    data?.date ? data.date.substr(0, 10) : false,
  ]
    .filter(Boolean)
    .join('-')
}
