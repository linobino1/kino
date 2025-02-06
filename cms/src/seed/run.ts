import { getPayload } from 'payload'
import config from '../payload.config'
import { seed } from './index'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  await seed(payload)
}

run()
  .catch(console.error)
  .finally(() => process.exit())
