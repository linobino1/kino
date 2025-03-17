import { afterAll, beforeAll } from 'vitest'
import { setup, teardown } from 'vitest-mongodb'
import { setupServer } from 'msw/node'
import { handlers } from '@app/themoviedb/mocks/mswHandlers'

const server = setupServer()

beforeAll(async () => {
  // setup mock server
  server.listen({ onUnhandledRequest: 'error' })
  server.use(...handlers)

  await setup()
})

afterAll(async () => {
  server.close()

  await teardown()
})
