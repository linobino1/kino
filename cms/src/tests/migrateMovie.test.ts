import { expect, test } from 'vitest'
import { migrateMovie } from '@/views/tmdb-migrate/endpoints/migrate/migrateMovie'
import { getPayloadTestClient } from './getPayloadTestClient'
import { Company, Genre, type Person } from '@/payload-types'

test('migrate Casablanca from TMDB', async () => {
  const payload = await getPayloadTestClient()
  const { id } = await migrateMovie({
    payload,
    tmdbId: 289,
    warnings: [],
    images: {
      poster: '/l8pgzdhSP7yb4emKDx4Lh8vXwGX.jpg',
      backdrop: '/rrsG3xYrWifoduZtsIZ4ntoDfBY.jpg',
    },
  })

  const en = await payload.findByID({
    collection: 'movies',
    id,
    draft: true,
    depth: 2,
    locale: 'en',
  })
  const de = await payload.findByID({
    collection: 'movies',
    id,
    draft: true,
    depth: 2,
    locale: 'de',
  })

  expect(en.title).toBe('Casablanca')
  expect(de.title).toBe('Kasablanca')

  expect(en.internationalTitle).toBe('Casablanca')
  expect(de.internationalTitle).toBe('Casablanca')

  expect(en.originalTitle).toBe('Casablanca')
  expect(de.originalTitle).toBe('Casablanca')

  expect(en.productionCompanies?.length).toBe(1)
  expect(de.productionCompanies?.length).toBe(1)
  expect((en.productionCompanies?.[0] as Company).name).toBe('Warner Bros. Pictures')
  expect((de.productionCompanies?.[0] as Company).name).toBe('Warner Bros. Pictures')

  expect(en.genres?.length).toBe(2)
  expect(de.genres?.length).toBe(2)
  expect(en.genres.some((genre) => (genre as Genre).name === 'Drama')).toBe(true)
  expect(de.genres.some((genre) => (genre as Genre).name === 'Drama')).toBe(true)
  expect(en.genres.some((genre) => (genre as Genre).name === 'Romance')).toBe(true)
  expect(de.genres.some((genre) => (genre as Genre).name === 'Liebesfilm')).toBe(true)

  expect(en.year).toBe(1943)
  expect(en.duration).toBe(102)

  expect(en.synopsis).toContain('Morocco')
  expect(de.synopsis).toContain('Weltkrieg')

  expect(en.tags?.length).toBeGreaterThan(5)
  expect(en.tags).toContain('world war ii')

  expect(en.trailer).toBe('https://www.youtube.com/watch?v=MF7JH_54d8c')
  expect(de.trailer).toBe('https://www.youtube.com/watch?v=MF7JH_54d8c')
  // would it be better to have localized trailers?
  // expect(de.trailer).toBe('https://www.youtube.com/watch?v=tYbRc8HIz2A')

  expect(en.directors.length).toBe(1)
  expect(de.directors.length).toBe(1)
  expect(en.directors.some((director) => (director as Person).name === 'Michael Curtiz')).toBe(true)
  expect(de.directors.some((director) => (director as Person).name === 'Michael Curtiz')).toBe(true)

  expect(en.cast?.length).toBeGreaterThan(5)
  expect(de.cast?.length).toBeGreaterThan(5)

  expect(en.crew?.length).toBeGreaterThan(5)
  expect(de.crew?.length).toBeGreaterThan(5)
}, 30000)
