import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import type { Person } from '@app/types/payload'

test('slug', async () => {
  const payload = await getPayloadTestClient()
  const collection = 'persons'

  // create a person
  let doc: Person = await payload.create({
    collection,
    data: {
      name: 'Max Mustermann',
    },
    locale: 'en',
  })
  expect(doc.name).toBe('Max Mustermann')
  expect(doc.slug).toBe('max-mustermann')

  // rename the person
  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      name: 'Maxi Musterfrau',
    },
  })

  expect(doc.name).toBe('Maxi Musterfrau')
  expect(doc.slug).toBe('maxi-musterfrau')

  // unlock the slug
  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      slug: 'my-custom-slug',
      slugLock: false,
    },
  })

  expect(doc.name).toBe('Maxi Musterfrau')
  expect(doc.slug).toBe('my-custom-slug')

  // rename the person with unlocked slug
  doc = await payload.findByID({
    collection,
    id: doc.id,
  })

  expect(doc.name).toBe('Maxi Musterfrau')
  expect(doc.slug).toBe('my-custom-slug')

  // change the name again, slug should not change
  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      name: 'Max Mustermann',
    },
  })

  expect(doc.name).toBe('Max Mustermann')
  expect(doc.slug).toBe('my-custom-slug')
}, 5000)
