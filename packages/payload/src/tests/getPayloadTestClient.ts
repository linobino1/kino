import type { Payload } from 'payload'
import { getPayload } from 'payload'
import configPromise from '#payload/payload.config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export const getPayloadTestClient = async (): Promise<Payload> => {
  const config = await configPromise
  return await getPayload({
    config: {
      ...config,
      // @ts-expect-error why?
      db: mongooseAdapter({
        // @ts-expect-error globalThis.__MONGO_URI__ is created by vitest-mongodb
        url: globalThis.__MONGO_URI__,
      }),
    },
  })
}
