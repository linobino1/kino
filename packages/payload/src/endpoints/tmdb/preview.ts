import type { Endpoint } from 'payload'
import { defaultLanguage } from '@app/themoviedb'
import { isAdminOrEditor } from '#payload/access'
import { fetchData } from '@app/themoviedb/fetchData'

export const preview: Endpoint = {
  path: `/tmdb-migrate/preview/:tmdbId`,
  method: 'get',
  handler: async (req) => {
    if (!isAdminOrEditor({ req })) {
      return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { payload, locale } = req
    const tmdbId = parseInt(req.routeParams?.tmdbId as string)
    if (isNaN(tmdbId)) {
      return Response.json({ success: false, message: 'Invalid TMDB ID' }, { status: 400 })
    }

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
      return Response.json(
        {
          success: false,
          message: `<a target="_blank" href="/admin/collections/movies/${doc.id}">${doc.internationalTitle}</a> wurde schon angelegt`,
        },
        { status: 400 },
      )
    }

    // fetch movie details from TMDB in their default language
    const movie = await fetchData('movie', tmdbId, defaultLanguage)

    // fetch images
    const images = await fetchData('images', tmdbId)

    return Response.json({ success: true, data: { movie, images } })
  },
}
