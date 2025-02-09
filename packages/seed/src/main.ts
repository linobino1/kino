import { getPayloadClient } from '@app/payload/util/getPayloadClient'
import { seed } from './seed'

const run = async (): Promise<void> => {
  const payload = await getPayloadClient()

  await seed(payload)
}

run()
  .catch(console.error)
  .finally(() => process.exit(1))
