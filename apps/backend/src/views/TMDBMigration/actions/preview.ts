'use server'

import type { Locale } from '@app/i18n'
import { getPayloadClient } from '@app/payload/util/getPayloadClient'
import { defaultLanguage } from '@app/themoviedb'
import { fetchData } from '@app/themoviedb/fetchData'
import { isAuthenticatedRequest } from '@/util/isAuthenticatedRequest'

export const getPreviewData = async (
  tmdbId: number,
  locale: Locale,
): Promise<{
  success?: boolean
  message?: string
  data?: {
    movie: any
    images: any
  }
}> => {
  if (!(await isAuthenticatedRequest())) {
    return {
      success: false,
      message: 'Unauthorized',
    }
  }

  const payload = await getPayloadClient()

  // check if movie has already been created
  const doc = (
    await payload.find({
      collection: 'movies',
      where: {
        tmdbId: {
          equals: tmdbId,
        },
      },
      depth: 0,
      locale,
    })
  ).docs[0]

  if (doc) {
    return {
      success: false,
      message: `<a target="_blank" href="/admin/collections/movies/${doc.id}">${doc.internationalTitle}</a> wurde schon angelegt`,
    }
  }

  // fetch movie details from TMDB in their default language
  const movie = await fetchData('movie', tmdbId, defaultLanguage)

  // fetch images
  const images = await fetchData('images', tmdbId)

  return { success: true, data: { movie, images } }
}
