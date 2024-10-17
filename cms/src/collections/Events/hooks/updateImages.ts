import type { CollectionBeforeChangeHook } from 'payload'
import type { Movie } from '@/payload-types'

/**
 * set header and poster images from filmprint, if event is a screening
 */
export const updateImages: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data?.type !== 'screening') return data

  const filmPrint = await req.payload.findByID({
    collection: 'filmPrints',
    id: data.films[0].filmprint,
    locale: req.locale,
    depth: 1,
  })

  const movie = filmPrint?.movie as Movie

  return { ...data, header: movie.still, poster: movie.poster }
}
