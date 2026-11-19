import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import { lexicalContent } from './util/lexicalContent'
import { createMedia } from './createDoc/media'
import { timezone } from '@app/util/config'
import { createSeason } from './createDoc/season'

const date = new Date().toISOString().substr(0, 10)

test('event slugs', async () => {
  const payload = await getPayloadTestClient()

  await payload.delete({ collection: 'events', where: { id: { exists: true } } })
  const media = await createMedia({ payload })

  let doc = await createScreeningEvent({ payload })

  expect(doc).toBeDefined()

  expect(doc.title).toBeOneOf(['Casablanca', 'Kasablanca'])
  expect(doc.slugLock).toBe(true)
  expect(doc.slug).toBe(`casablanca-${date}`)

  // update title, slug not change
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      title: 'Casablanca 2',
      titleLock: false,
    },
  })

  expect(doc.title).toBe('Casablanca 2')
  expect(doc.slugLock).toBe(true)
  expect(doc.slug).toBe(`casablanca-2-${date}`)

  // unlock slug
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      slug: 'my-slug',
      slugLock: false,
    },
  })

  expect(doc.title).toBe('Casablanca 2')
  expect(doc.slug).toBe(`my-slug`)

  // change to a non-screening event
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      title: 'My Event',
      slugLock: true,
      programItems: [
        {
          type: 'other',
          isMainProgram: true,
          info: lexicalContent(),
          poster: media.id,
        },
      ],
      header: media.id,
    },
  })

  expect(doc.title).toBe('My Event')
  expect(doc.slug).toBe('my-event')

  // unlock the slug again
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      slug: 'my-slug',
      slugLock: false,
    },
  })

  expect(doc.title).toBe('My Event')
  expect(doc.slug).toBe('my-slug')

  // update the title, slug should not change
  doc = await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      title: 'My Event 2',
    },
  })

  expect(doc.title).toBe('My Event 2')
  expect(doc.slug).toBe('my-slug')
}, 10000)

test('new non-screening events copy their title to locales without a translation', async () => {
  const payload = await getPayloadTestClient()
  await payload.delete({ collection: 'events', where: { id: { exists: true } } })

  const media = await createMedia({ payload })
  const season = await createSeason({ payload })
  const title = 'Jazz in Blue Salon'
  const doc = await payload.create({
    collection: 'events',
    locale: 'en',
    draft: false,
    data: {
      _status: 'published',
      date: '2025-12-01T19:00:00.000Z',
      date_tz: timezone,
      title,
      header: media.id,
      season: season.id,
      programItems: [
        {
          type: 'other',
          isMainProgram: true,
          poster: media.id,
        },
      ],
    },
  })

  const germanDoc = await payload.findByID({
    collection: 'events',
    id: doc.id,
    locale: 'de',
  })

  expect(germanDoc.title).toBe(title)
})
