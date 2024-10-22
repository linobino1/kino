import { getPayload as _getPayload } from 'payload'
import config from '@payload-config'

export const getPayload = async () => await _getPayload({ config })
