import { getPayload as _getPayload } from 'payload'
import { configurePayload } from '../payload.config'

export const getPayloadClient = async () => await _getPayload({ config: await configurePayload() })
