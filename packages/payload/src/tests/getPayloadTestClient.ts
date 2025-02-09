import type { Payload } from 'payload';
import { getPayload } from 'payload'
import configPromise from '#payload/payload.config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export const getPayloadTestClient = async (): Promise<Payload> => {
  const config = await configPromise
  return await getPayload({
    config: {
      ...config,
      db: mongooseAdapter({
        url: 'mongodb://localhost:27017/kinoimblauensalon-test',
      }),
    },
  })
}
