import { readdirSync, rmSync, existsSync, globSync } from 'fs'
import path from 'path'
import type { PayloadRequest } from 'payload'
import { type Payload } from 'payload'
import { mediaDir } from '@app/util/mediaDir'
import { migrateMovie } from '@app/themoviedb/migrateMovie'
import { seedDoc } from './util/seedDoc'
import { translate } from './util/translate'
import { landing } from './pages/landing'
import { seedGlobal } from './util/seedGlobal'
import { site } from './globals/site'
import { mainNavigations } from './navigations/mainNavigation'
import { events } from './pages/events'
import { seedCountries } from './countries'
import { seedAspectRatios } from './aspectRatios'
import { seedFormats } from './formats'
import { seedColors } from './colors'
import { seedCarriers } from './carriers'
import { seedLanguageVersions } from './languageVersions'
import { seedSoundFormats } from './soundFormats'
import { seedConditions } from './conditions'
import { seedLocations } from './locations'
import { seedSeasons } from './seasons'
import { cinemaOfColors } from './eventSeries/cinemaOfColors'
import { initContext } from './util/initContext'
import { casablancaFilmprint } from './filmprints/casablancaFilmprint'
import { hfgRental } from './rentals/hfgRental'
import { seedCategories } from './categories'
import { casablancaScreening } from './events/casablancaScreening'
import { annieHallScreening } from './events/annieHallScreening'
import { jazzClubEvent } from './events/jazzClub'
import { awardPost } from './posts/awardPost'
import { jazzClubPost } from './posts/jazzClubPost'
import { cinemaOfColorsPost } from './posts/cinemaOfColorsPost'
import { annieHallFilmprint } from './filmprints/annieHallFilmprint'
import { openAirCinemaPage } from './pages/openAirCinema'
import { bookingsPage } from './pages/bookings'
import { news } from './pages/news'
import { anotherRental } from './rentals/anotherRental'

export const seed = async (payload: Payload, req?: PayloadRequest): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    payload.logger.error('Seed script is disabled in production. Aborting seed script.')
    return
  }

  payload.logger.info('Seeding database...')

  const context = initContext(payload)

  // we'll clear all collections and globals except the users collection
  const collections = payload.config.collections
    .map((collection) => collection.slug)
    .filter((slug) => slug !== 'users')

  payload.logger.info(`— Clearing media...`)
  if (existsSync(mediaDir)) {
    readdirSync(mediaDir).forEach((file) => rmSync(path.join(mediaDir, file), { recursive: true }))
  } else {
    payload.logger.error(`— Media directory not found: ${mediaDir}`)
  }

  payload.logger.info(`— Clearing collections...`)
  await Promise.all([
    ...collections.map(async (collection) =>
      payload.delete({
        collection,
        where: {},
        req,
      }),
    ),
  ])

  payload.logger.info(`— Seeding media...`)
  await Promise.all(
    globSync(path.resolve(import.meta.dirname, 'media/*')).map(async (filePath) => {
      const contextID = path.basename(filePath)
      return seedDoc({
        collection: 'media',
        generator: ({ locale }) => ({
          alt: translate(
            {
              'hero.avif': {
                en: 'Our team',
                de: 'Unser Team',
              },
            }[contextID] ?? {
              en: contextID,
              de: contextID,
            },
            locale,
          ),
        }),
        contextID,
        filePath: path.resolve(import.meta.dirname, filePath),
        context,
      })
    }),
  )

  if (process.env.SKIP_MOVIES) {
    payload.logger.warn('Skipping movies collection seeding...')
  } else {
    payload.logger.info(`— migrating movies from TMDB...`)
    const tmdbMovies = [
      {
        contextID: 'Casablanca',
        tmdbId: 289,
        images: {
          poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
          backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
        },
      },
      {
        contextID: 'Annie Hall',
        tmdbId: 703,
        images: {
          poster: '/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg',
          backdrop: '/nErPhnNopHCPhqQaTULWIuj5otF.jpg',
        },
      },
    ]
    const warnings: Error[] = []
    for await (const { contextID, ...data } of tmdbMovies) {
      const draft = await migrateMovie({
        payload,
        warnings,
        ...data,
      })
      if (warnings.length) {
        payload.logger.error(`— warnings: ${warnings.map((warning) => warning.message).join(', ')}`)
      }

      const doc = await payload.update({
        collection: 'movies',
        id: draft.id,
        data: {
          _status: 'published',
        },
      })

      payload.logger.info(`  added ${contextID} (${doc.id})`)
      context.movies.set(contextID, doc)
    }
  }

  payload.logger.info(`— seeding miscanellous collections...`)
  await seedCountries(context)
  await seedAspectRatios(context)
  await seedFormats(context)
  await seedColors(context)
  await seedCarriers(context)
  await seedCategories(context)
  await seedLanguageVersions(context)
  await seedSoundFormats(context)
  await seedConditions(context)
  await seedLocations(context)
  await seedSeasons(context)

  payload.logger.info(`— seeding rentals...`)
  await Promise.all(
    [hfgRental, anotherRental].map((generator) =>
      seedDoc({
        collection: 'rentals',
        generator,
        context,
      }),
    ),
  )

  payload.logger.info(`— seeding screening series...`)
  await seedDoc({
    collection: 'eventSeries',
    generator: cinemaOfColors,
    context,
  })

  payload.logger.info(`— seeding filmprints...`)
  for await (const { generator, contextID } of [
    {
      generator: casablancaFilmprint,
      contextID: 'Casablanca',
    },
    {
      generator: annieHallFilmprint,
      contextID: 'Annie Hall',
    },
  ]) {
    await seedDoc({
      collection: 'filmPrints',
      generator,
      context,
      contextID,
    })
  }

  payload.logger.info(`— seeding events...`)
  for await (const { generator, contextID } of [
    {
      generator: casablancaScreening,
      contextID: 'Casablanca',
    },
    {
      generator: annieHallScreening,
      contextID: 'Annie Hall',
    },
    {
      generator: jazzClubEvent,
      contextID: 'Jazz Club',
    },
  ]) {
    await seedDoc({
      collection: 'events',
      generator,
      context,
      contextID,
    })
  }

  payload.logger.info(`— seeding pages...`)
  for await (const generator of [landing, events, news, openAirCinemaPage, bookingsPage]) {
    await seedDoc({
      collection: 'pages',
      generator,
      context,
    })
  }

  payload.logger.info(`— seeding navigations...`)
  for await (const { generator, contextID } of [
    {
      generator: mainNavigations,
      contextID: 'main',
    },
  ]) {
    await seedDoc({
      collection: 'navigations',
      generator,
      context,
      contextID,
    })
  }

  payload.logger.info(`— seeding posts...`)
  for await (const generator of [awardPost, jazzClubPost, cinemaOfColorsPost]) {
    await seedDoc({
      collection: 'posts',
      generator,
      context,
    })
  }

  payload.logger.info(`— seeding globals...`)
  await seedGlobal({
    slug: 'site',
    generator: site,
    context,
  })

  payload.logger.info('Seeded database successfully!')
}
