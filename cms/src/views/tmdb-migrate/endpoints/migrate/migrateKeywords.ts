import { tmdbFetch } from '@/third-party/tmdb/tmdbFetch'
import type { MigrationFunction } from './types'

export const migrateKeywords: MigrationFunction = async ({ payload, movie }) => {
  if (!movie.tmdbId) throw new Error('Cannot migrate credits without tmdbId')

  const data = await tmdbFetch('keywords', movie.tmdbId)

  // update movie
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      tags: data.keywords.map((keyword) => keyword.name).join(', '),
    },
    draft: true,
  })
}
