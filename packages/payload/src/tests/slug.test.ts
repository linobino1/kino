import { describe, expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import type { Person } from '@app/types/payload'

describe('slug', async () => {
  const payload = await getPayloadTestClient()
  const collection = 'persons'

  await payload.delete({
    collection,
    where: {
      name: { in: ['Max Mustermann', 'Maxi Musterfrau'] },
    },
  })

  let doc: Person = await payload.create({
    collection,
    data: {
      name: 'Max Mustermann',
    },
    locale: 'en',
  })

  test('create a person', async () => {
    expect(doc.name).toBe('Max Mustermann')
    expect(doc.slug).toBe('max-mustermann')
  })

  test('rename the person', async () => {
    doc = await payload.update({
      collection,
      id: doc.id,
      data: {
        name: 'Maxi Musterfrau',
      },
    })

    expect(doc.name).toBe('Maxi Musterfrau')
    expect(doc.slug).toBe('maxi-musterfrau')
  })

  test('unlock the slug', async () => {
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
  })

  test('rename the person with unlocked slug', async () => {
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
})
