import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { env } from '~/env.server'

export const action: ActionFunction = async () => {
  // wake listmonk up, otherwise the first request will fail
  const wakeUpResponse = await fetch(`${env.LISTMONK_URL}`, {
    method: 'get',
  })
  if (!wakeUpResponse.ok) {
    return json({
      success: false,
      message: 'the newsletter server has a problem',
    })
  }
  return json({
    success: true,
    message: 'Listmonk is waking up',
  })
}
