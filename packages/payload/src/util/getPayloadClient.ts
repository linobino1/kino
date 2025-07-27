import { getPayload as _getPayload } from 'payload'
import configPromise from '../payload.config'

export { configPromise }

export const getPayloadClient = async () => await _getPayload({ config: await configPromise })
