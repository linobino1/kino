import type { Payload } from 'payload'
import { migrateMovie } from '@app/themoviedb/migrateMovie'

const collection = 'movies'

export const createMovie = async ({ payload }: { payload: Payload }) => {
  let doc = (
    await payload.find({
      collection,
      where: {
        slug: { equals: 'casablanca' },
      },
    })
  ).docs[0]

  if (!doc) {
    const { id } = await migrateMovie({
      payload,
      tmdbId: 289,
      warnings: [],
      images: {
        poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
        backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
      },
    })

    doc = await payload.findByID({
      collection,
      id,
    })
  }

  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      _status: 'published',
    },
  })

  return doc
}
