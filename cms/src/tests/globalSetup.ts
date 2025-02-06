import { afterAll, afterEach, beforeAll } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { CollectionSlug } from 'payload'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/mswHandlers'

const server = setupServer()
const collections: CollectionSlug[] = ['movies']

beforeAll(async () => {
  const payload = await getPayloadTestClient()

  await Promise.all(collections.map((collection) => payload.delete({ collection, where: {} })))

  server.listen({ onUnhandledRequest: 'bypass' })
  server.use(...handlers)
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})
