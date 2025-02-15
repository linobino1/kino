import { getPayloadClient } from '@app/payload/util/getPayloadClient'
import { headers } from 'next/headers'

export const isAuthenticatedRequest = async (): Promise<boolean> => {
  const payload = getPayloadClient()
  const h = await headers()
  const authRes = await (
    await payload
  ).auth({
    headers: h,
  })

  return !!authRes.user
}
