import { fetchData } from '../fetchData'
import type { MigrationFunction } from '../types'

export const migrateVideos: MigrationFunction = async ({ payload, movie }) => {
  if (!movie.tmdbId) throw new Error('Cannot migrate credits without tmdbId')

  const data = await fetchData('videos', movie.tmdbId)

  // get trailer URL (we only migrate YouTube trailers)
  const tmdbTrailer = data.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube',
  )?.key
  const trailer = tmdbTrailer ? `https://www.youtube.com/watch?v=${tmdbTrailer}` : undefined

  // update movie
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      trailer,
    },
    draft: true,
  })
}
