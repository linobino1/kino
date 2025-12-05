import { getPayload as _getPayload } from 'payload'
import { configurePayload } from '../payload.config'

// Cache the config promise to avoid recreating it on every call
let configPromise: ReturnType<typeof configurePayload> | null = null

export const getPayloadClient = async () => {
  if (!configPromise) {
    configPromise = configurePayload()
  }
  return await _getPayload({ config: await configPromise })
}
