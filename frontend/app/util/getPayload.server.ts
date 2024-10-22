import { singleton } from './singleton.server'
import { getPayload as _getPayload } from 'payload'
import config from '@payload-config'

// returns a singleton of the payload object, which is used to fetch data from the database and is typed to the schema
export const getPayload = async () =>
  await singleton('payload', async () => await _getPayload({ config }))
