import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createSeason } from '#payload/util/createSeason'
import { createMedia } from './createDoc/media'

test('create season from date', async () => {
  const payload = await getPayloadTestClient()
  const media = await createMedia({ payload })

  // a date within the winter semester 2027/2028
  const date = new Date('2028-01-01')
  let season = await createSeason({ date, header: media.id })
  season = await payload.findByID({
    collection: 'seasons',
    id: season.id,
    locale: 'de',
  })

  expect(season).toBeDefined()
  expect(new Date(season.from).getTime()).toBe(new Date('2027-10-01T00:00:00.000Z').getTime())
  expect(new Date(season.until).getTime()).toBe(new Date('2028-03-31T23:59:59.999Z').getTime())
  expect(season.name).toBe('Wintersemester 2027')
  expect(season.slugLock).toBe(false)
  expect(season.slug).toBe('ws-27')

  season = await payload.findByID({
    collection: 'seasons',
    id: season.id,
    locale: 'en',
  })
  expect(season.name).toBe('Winter term 2027')
  expect(season.slugLock).toBe(false)
  expect(season.slug).toBe('ws-27')
}, 10000)
