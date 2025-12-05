import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'

test('create a localized doc', async () => {
  const payload = await getPayloadTestClient()
  const collection = 'jobs'

  const { id } = await payload.create({
    collection,
    data: {
      name: 'Software Engineer',
    },
    locale: 'en',
  })
  await payload.update({
    collection,
    id,
    data: {
      name: 'Softwareingenieur',
    },
    locale: 'de',
  })

  const en = await payload.findByID({
    collection,
    id,
    locale: 'en',
  })
  const de = await payload.findByID({
    collection,
    id,
    locale: 'de',
  })

  expect(en.name).toBe('Software Engineer')
  expect(de.name).toBe('Softwareingenieur')

  await payload.delete({
    collection,
    id,
  })
}, 5000)

test('create a localized draft', async () => {
  const payload = await getPayloadTestClient()
  const collection = 'movies'

  await payload.delete({
    collection: 'movies',
    where: { id: { exists: true } },
  })

  const { id } = await payload.create({
    collection,
    data: {
      title: 'Movie Title',
    },
    draft: true,
    locale: 'en',
  })
  await payload.update({
    collection,
    id,
    data: {
      title: 'Filmtitel',
    },
    draft: true,
    locale: 'de',
  })

  const en = await payload.findByID({
    collection,
    id,
    draft: true,
    locale: 'en',
  })
  const de = await payload.findByID({
    collection,
    id,
    draft: true,
    locale: 'de',
  })

  expect(en.title).toBe('Movie Title')
  expect(de.title).toBe('Filmtitel')

  await payload.delete({
    collection,
    id,
  })
}, 5000)
