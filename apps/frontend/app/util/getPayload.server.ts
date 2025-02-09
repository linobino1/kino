import { singleton } from './singleton.server'
import { getPayloadClient } from '@app/payload/util/getPayloadClient'

/**
 * get a singleton instance of the payload client
 */
export const getPayload = async () => {
  // we don't want to cache the paylod config in development, because we want it to hot reload
  if (process.env.NODE_ENV === 'development') {
    return await getPayloadClient()
  }

  return singleton('payloadClient', () => getPayloadClient())
}
