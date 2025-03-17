import { describe, expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createSeason } from '#payload/util/createSeason'
import { createMedia } from './createDoc/media'
import { createScreeningEvent } from './createDoc/screeningEvent'
import type { Season } from '@app/types/payload'

test('create/update events and check their season', async () => {
  const payload = await getPayloadTestClient()
  const media = await createMedia({ payload })

  const date = new Date('2028-01-01')
  const season = await createSeason({ date, header: media.id })

  let event = await createScreeningEvent({ payload })
  describe('create an event in a season that already exists', async () => {
    event = await payload.update({
      collection: 'events',
      id: event.id,
      data: {
        date: date.toISOString(),
      },
      depth: 0,
    })

    expect(event.season).toBeDefined()
    expect(event.season).toBe(season.id)
  })

  // create an event in a season that does not exist
  let event2 = await payload.create({
    collection: 'events',
    data: {
      ...event,
      date: '2035-01-01T00:00:00.000Z',
    },
    locale: 'de',
  })
  expect((event2.season as Season).from).toBe('2034-10-01T00:00:00.000Z')
  expect((event2.season as Season).until).toBe('2035-03-31T23:59:59.999Z')
  expect((event2.season as Season).name).toBe('Wintersemester 2034')

  // update an event to a different season'
  event2 = await payload.update({
    collection: 'events',
    id: event.id,
    data: {
      date: '2028-07-01T00:00:00.000Z',
    },
    locale: 'de',
  })
  expect((event2.season as Season).from).toBe('2028-04-01T00:00:00.000Z')
  expect((event2.season as Season).until).toBe('2028-09-30T23:59:59.999Z')
  expect((event2.season as Season).name).toBe('Sommersemester 2028')
})
