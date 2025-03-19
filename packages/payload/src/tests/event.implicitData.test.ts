import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import { locales } from '@app/i18n'
import { getDocId } from '@app/util/payload/getDocId'
import type { Event, FilmPrint, Movie } from '@app/types/payload'

const date = new Date().toISOString().substr(0, 10)

const checkIfLocalizedDataMatches = async (doc: Event, payload: any) => {
  for await (const locale of locales) {
    const localizedMovie = (
      await payload.findByID({
        collection: 'filmPrints',
        id: getDocId(doc.mainProgramFilmPrint),
        locale,
      })
    ).movie as Movie

    const localizedDoc = await payload.findByID({
      collection: 'events',
      id: doc.id,
      locale,
    })

    expect(localizedDoc.title).toBe(localizedMovie.title)
    expect(localizedDoc.shortDescription).toBe(localizedMovie.synopsis)
  }
}

test('test implicit data generation', async () => {
  const payload = await getPayloadTestClient()

  await payload.delete({ collection: 'events', where: { id: { exists: true } } })

  // create a casablanca screening
  const doc = await createScreeningEvent({ payload })

  expect(doc.title).toBeOneOf(['Casablanca', 'Kasablanca'])
  expect(doc.slug).toBe(`casablanca-${date}`)

  expect(doc.isScreeningEvent).toBe(true)
  expect(doc.mainProgramFilmPrint).toBeDefined()

  // check localized implicit data
  await checkIfLocalizedDataMatches(doc, payload)

  // update the movie
  for await (const locale of locales) {
    await payload.update({
      collection: 'movies',
      id: getDocId((doc.mainProgramFilmPrint as FilmPrint).movie),
      data: {
        synopsis: `synopsis ${locale}`,
      },
      locale,
    })
  }

  // run the hooks on the event
  await payload.update({
    collection: 'events',
    id: doc.id,
    data: {},
  })

  // check localized implicit data
  await checkIfLocalizedDataMatches(doc, payload)
}, 10000)
