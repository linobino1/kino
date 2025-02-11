import type { Payload } from 'payload'
import { migrateMovie } from '@app/themoviedb/migrateMovie'

const collection = 'movies'

export const createMovie = async ({ payload }: { payload: Payload }) => {
  const { id } = await migrateMovie({
    payload,
    tmdbId: 289,
    warnings: [],
    images: {
      poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
      backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
    },
  })

  return await payload.update({
    collection,
    id,
    data: {
      _status: 'published',
    },
  })
}
