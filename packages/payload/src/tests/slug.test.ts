import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import type { Person } from '@app/types/payload'

test('Payload slug field generates and stabilizes slugs', async () => {
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
  expect(doc.slugLock).toBe(false)

  // Renaming does not change a generated URL after creation.
  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      name: 'Maxi Musterfrau',
    },
  })

  expect(doc.name).toBe('Maxi Musterfrau')
  expect(doc.slug).toBe('max-mustermann')

  // Re-enable generation to explicitly regenerate the slug.
  doc = await payload.update({
    collection,
    id: doc.id,
    data: {
      name: 'Maxi Musterfrau',
      slugLock: true,
    },
  })

  expect(doc.slug).toBe('maxi-musterfrau')
  expect(doc.slugLock).toBe(false)

  // Unlock the slug and set a custom value.
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
