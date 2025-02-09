import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { env } from '@app/util/env/frontend.server'

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
