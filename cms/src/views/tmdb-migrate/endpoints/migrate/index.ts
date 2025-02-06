import type { MigratedMovie } from './types'
import { Endpoint } from 'payload'
import { isAdminOrEditor } from '@/access'
import { migrateMovie } from './migrateMovie'

/**
 * Migrate a movie from TMDB to the CMS
 * expects a TMDB ID and an array of images in the request body
 * {
 *  tmdbId: number,
 *  images: {
 *    backdrops: string,
 *    posters: string
 *  }
 * }
 */
export const migrate: Endpoint = {
  path: `/tmdb-migrate/migrate`,
  method: 'post',
  handler: async (req) => {
    if (!isAdminOrEditor({ req })) {
      return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = req
    const { tmdbId, images } = req.json ? await req.json() : {}

    if (isNaN(tmdbId)) {
      return Response.json({ success: false, message: 'Invalid TMDB ID' }, { status: 400 })
    }

    // migrate base data
    const warnings: Error[] = []
    let movie: MigratedMovie | undefined
    try {
      movie = await migrateMovie({ payload, tmdbId, images, warnings: [] })
    } catch (err) {
      return Response.json(
        { success: false, message: `Unable to create movie (${err})` },
        { status: 400 },
      )
    }

    return Response.json({
      success: true,
      data: {
        movie,
        warnings: warnings.map((warning) => warning.message),
      },
    })
  },
}
