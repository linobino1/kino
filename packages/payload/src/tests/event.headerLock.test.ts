import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import type { FilmPrint, Media, Movie } from '@app/types/payload'
import { createMedia } from './createDoc/media'

const date = new Date().toISOString().substr(0, 10)

test('test event.header lock', async () => {
  const payload = await getPayloadTestClient()

  await payload.delete({ collection: 'events', where: { id: { exists: true } } })

  let doc = await createScreeningEvent({ payload })

  expect(doc.title).toBeOneOf(['Casablanca', 'Kasablanca'])
  expect(doc.slug).toBe(`casablanca-${date}`)

  expect(doc.isScreeningEvent).toBe(true)
  expect(doc.mainProgramFilmPrint).toBeDefined()

  const mainProgramFilmPrint = await payload.findByID({
    collection: 'filmPrints',
    id: (doc.mainProgramFilmPrint as FilmPrint).id as string,
  })

  const movie = mainProgramFilmPrint?.movie as Movie

  expect(mainProgramFilmPrint?.id).toBeDefined()
  expect((doc.header as Media).id).toBe((movie.still as Media).id)

  // change the movie still
  let newStill = await createMedia({ payload })
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      still: newStill.id,
    },
  })

  doc = await payload.findByID({ collection: 'events', id: doc.id, depth: 2 })
  expect(doc.headerLock).toBe(true)
  expect((doc.header as Media).id).toBe(newStill.id)

  // open the lock (set a custom header)
  newStill = await createMedia({ payload })
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      headerLock: false,
      header: newStill.id,
    },
  })
  expect(doc.headerLock).toBe(false)
  expect((doc.header as Media).id).toBe(newStill.id)

  // change the movie still again
  const newStill2 = await createMedia({ payload })
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      still: newStill2.id,
    },
  })

  // the header should not change
  expect(doc.headerLock).toBe(false)
  expect((doc.header as Media).id).toBe(newStill.id)
}, 10000)
