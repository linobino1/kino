import { readdirSync, rmSync, existsSync } from 'fs'
import path from 'path'
import { PayloadRequest, type CollectionSlug, type Payload } from 'payload'
import 'dotenv/config.js'
import { staticDir as mediaDir } from '@/collections/Media'
import { migrateMovie } from '@/views/tmdb-migrate/endpoints/migrate/migrateMovie'

export const seed = async (payload: Payload, req?: PayloadRequest): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    payload.logger.error('Seed script is disabled in production. Aborting seed script.')
    return
  }

  payload.logger.info('Seeding database...')

  // we'll clear all collections and globals except the users collection
  const collections = payload.config.collections
    .map((collection) => collection.slug)
    .filter((slug) => slug !== 'users') as CollectionSlug[]

  payload.logger.info(`— Clearing media...`)
  if (existsSync(mediaDir)) {
    readdirSync(mediaDir).forEach((file) => rmSync(path.join(mediaDir, file), { recursive: true }))
  } else {
    payload.logger.error(`— Media directory not found: ${mediaDir}`)
  }

  payload.logger.info(`— Clearing collections and globals...`)
  await Promise.all([
    ...collections.map(async (collection) =>
      payload.delete({
        collection,
        where: {},
        req,
      }),
    ),
  ])

  payload.logger.info(`— seeding casablanca from TMDB...`)
  payload.logger.info(`— TMDB key: ${process.env.THEMOVIEDB_API_KEY}`)
  const warnings: Error[] = []
  const doc = await migrateMovie({
    payload,
    tmdbId: 289,
    warnings,
    images: {
      poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
      backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
    },
  })

  // debug: remove movie and migrate again
  await payload.delete({
    collection: 'movies',
    id: doc.id,
  })

  await migrateMovie({
    payload,
    tmdbId: 289,
    warnings,
    images: {
      poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
      backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
    },
  })
  if (warnings.length) {
    payload.logger.error(`— warnings: ${warnings.map((warning) => warning.message).join(', ')}`)
  }

  payload.logger.info('Seeded database successfully!')
}
