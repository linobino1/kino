import { expect, test } from 'vitest'
import { postSlugHook } from '../collections/Posts/slugHook'

test('post slug is generated from the title on create', async () => {
  const slug = await postSlugHook({
    data: { title: 'Ein deutscher Titel', slugLock: true },
    operation: 'create',
    value: undefined,
    originalDoc: undefined,
  } as never)

  expect(slug).toBe('ein-deutscher-titel')
})

test('post slug remains stable when a localized title changes', async () => {
  const slug = await postSlugHook({
    data: { title: 'An English title', slugLock: true },
    operation: 'update',
    value: undefined,
    originalDoc: { slug: 'ein-deutscher-titel', slugLock: true },
  } as never)

  expect(slug).toBe('ein-deutscher-titel')
})

test('an unlocked post slug can still be edited', async () => {
  const slug = await postSlugHook({
    data: { title: 'An English title', slugLock: false },
    operation: 'update',
    value: 'Custom Post URL',
    originalDoc: { slug: 'ein-deutscher-titel', slugLock: false },
  } as never)

  expect(slug).toBe('custom-post-url')
})
