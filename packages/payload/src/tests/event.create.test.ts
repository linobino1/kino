import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import type { FilmPrint, Media, Movie } from '@app/types/payload'

const date = new Date().toISOString().substr(0, 10)

test('create an event', async () => {
  const payload = await getPayloadTestClient()

  await payload.delete({ collection: 'events', where: { id: { exists: true } } })

  const doc = await createScreeningEvent({ payload })

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

  expect(doc.programItems?.length).toBe(2)
  const other = doc.programItems?.[0]
  expect(other?.type).toBe('other')
  expect(other?.poster).toBeDefined()
  expect(other?.filmPrint).toBeUndefined()
  expect(other?.isMainProgram).toBe(false)
  const otherPoster = await payload.findByID({
    collection: 'media',
    id: (other!.poster as Media).id,
  })
  expect(otherPoster?.id).toBeDefined()

  const screening = doc.programItems?.[1]
  expect(screening?.type).toBe('screening')
  expect(screening?.isMainProgram).toBe(true)
  expect(screening?.filmPrint).toBeDefined()
  expect(screening?.poster).toBeDefined()
  const screeningPoster = await payload.findByID({
    collection: 'media',
    id: (screening!.poster as Media).id,
  })
  expect(screeningPoster?.id).toBe((movie.poster as Media).id)
}, 10000)
